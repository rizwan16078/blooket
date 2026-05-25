import { describe, expect, it } from "vitest";

import { LLM_JUDGE_CASES, type LLMJudgeCase, type ScoreResult } from "./golden-data";

/* ─── LLM-as-Judge evaluation pipeline ─── */

/**
 * Scores an LLM response against a golden answer.
 *
 * This is a deterministic scoring function that can be used with any LLM backend.
 * The actual LLM call is left to the caller — this module only handles scoring.
 */
export interface LLMJudgeResult {
  question: string;
  goldenAnswer: string | number;
  llmResponse: string;
  numericalAccuracy: ScoreResult;
  factualCorrectness: boolean;
  hallucination: boolean;
  score: number; // 0-1
}

/**
 * Extract the first number from a string (handles "25 packs", "~10.57%", etc.)
 */
function extractNumber(text: string): number | null {
  const match = text.match(/[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ""));
}

/**
 * Score a numerical answer.
 */
function scoreNumerical(golden: number, response: string): ScoreResult {
  const extracted = extractNumber(response);
  if (extracted === null) return "fail";

  const diff = Math.abs(extracted - golden);
  const relDiff = golden !== 0 ? diff / Math.abs(golden) : diff;

  if (relDiff < 0.01) return "pass";   // within 1%
  if (relDiff < 0.05) return "warn";   // within 5%
  return "fail";
}

/**
 * Score a factual yes/no answer.
 */
function scoreFactual(golden: string, response: string): boolean {
  const lower = response.toLowerCase();
  if (golden.toLowerCase() === "no") {
    return lower.includes("no") || lower.includes("does not") || lower.includes("doesn't");
  }
  if (golden.toLowerCase() === "yes") {
    return lower.includes("yes") || lower.includes("has") || lower.includes("contains");
  }
  return lower.includes(golden.toLowerCase());
}

/**
 * Detect potential hallucinations — check if the response mentions
 * blooks or rates that don't exist in our data.
 */
function detectHallucination(response: string): boolean {
  const lower = response.toLowerCase();
  // Common hallucination patterns for Blooket
  const hallucinationPatterns = [
    "mythical",      // No Mythical rarity in Blooket
    "ultra rare",    // No Ultra Rare rarity
    "0.001%",        // Common made-up rate
    "guaranteed",    // Nothing is guaranteed
    "100% chance",   // Nothing is 100%
  ];
  return hallucinationPatterns.some((p) => lower.includes(p));
}

/**
 * Judge an LLM response against a golden test case.
 */
export function judgeLLMResponse(testCase: LLMJudgeCase, llmResponse: string): LLMJudgeResult {
  let numericalAccuracy: ScoreResult = "pass";
  let factualCorrectness = true;

  if (testCase.category === "numerical") {
    const goldenNum = typeof testCase.goldenAnswer === "number"
      ? testCase.goldenAnswer
      : parseFloat(testCase.goldenAnswer);
    numericalAccuracy = scoreNumerical(goldenNum, llmResponse);
  } else if (testCase.category === "factual") {
    factualCorrectness = scoreFactual(String(testCase.goldenAnswer), llmResponse);
  } else {
    // Comparative — check if the golden answer key is mentioned
    factualCorrectness = llmResponse
      .toLowerCase()
      .includes(String(testCase.goldenAnswer).toLowerCase().split(" ")[0]);
  }

  const hallucination = detectHallucination(llmResponse);

  // Compute aggregate score 0-1
  let score = 1;
  if (numericalAccuracy === "fail") score -= 0.5;
  else if (numericalAccuracy === "warn") score -= 0.2;
  if (!factualCorrectness) score -= 0.3;
  if (hallucination) score -= 0.3;
  score = Math.max(0, score);

  return {
    question: testCase.question,
    goldenAnswer: testCase.goldenAnswer,
    llmResponse,
    numericalAccuracy,
    factualCorrectness,
    hallucination,
    score,
  };
}

/* ─── Test the judge itself ─── */

describe("LLM Judge — scoring functions", () => {
  describe("scoreNumerical", () => {
    it("passes exact matches", () => {
      expect(scoreNumerical(25, "25")).toBe("pass");
      expect(scoreNumerical(25, "25 packs")).toBe("pass");
    });

    it("passes close matches within 1%", () => {
      expect(scoreNumerical(10.57, "10.57%")).toBe("pass");
      expect(scoreNumerical(10.57, "about 10.6%")).toBe("pass");
    });

    it("warns for 1-5% deviation", () => {
      expect(scoreNumerical(25, "26")).toBe("warn");
    });

    it("fails for >5% deviation", () => {
      expect(scoreNumerical(25, "30")).toBe("fail");
    });

    it("fails when no number found", () => {
      expect(scoreNumerical(25, "I'm not sure")).toBe("fail");
    });
  });

  describe("scoreFactual", () => {
    it("scores 'No' correctly", () => {
      expect(scoreFactual("No", "No, the Medieval pack does not have any Chroma blooks")).toBe(true);
    });

    it("fails wrong factual answers", () => {
      expect(scoreFactual("No", "Yes, it has several Chromas")).toBe(false);
    });
  });

  describe("detectHallucination", () => {
    it("detects Mythical rarity hallucination", () => {
      expect(detectHallucination("The Mythical rarity is the rarest")).toBe(true);
    });

    it("passes clean responses", () => {
      expect(detectHallucination("The Space pack costs 20 tokens per open")).toBe(false);
    });
  });

  describe("judgeLLMResponse", () => {
    it("scores a perfect numerical response", () => {
      const result = judgeLLMResponse(LLM_JUDGE_CASES[0], "You can open 25 Space packs with 500 tokens");
      expect(result.numericalAccuracy).toBe("pass");
      expect(result.factualCorrectness).toBe(true);
      expect(result.hallucination).toBe(false);
      expect(result.score).toBe(1);
    });

    it("penalizes hallucinations", () => {
      const result = judgeLLMResponse(
        LLM_JUDGE_CASES[0],
        "You can open 25 packs. The Mythical rarity is also available.",
      );
      expect(result.hallucination).toBe(true);
      expect(result.score).toBeLessThan(1);
    });

    it("scores a wrong numerical answer", () => {
      const result = judgeLLMResponse(LLM_JUDGE_CASES[0], "You can open 50 packs");
      expect(result.numericalAccuracy).toBe("fail");
      expect(result.score).toBeLessThanOrEqual(0.5);
    });

    it("scores a factual question correctly", () => {
      const medievalChroma = LLM_JUDGE_CASES.find(
        (c) => c.question.includes("Medieval pack") && c.question.includes("Chroma"),
      )!;
      const result = judgeLLMResponse(medievalChroma, "No, the Medieval pack has no Chroma blooks");
      expect(result.factualCorrectness).toBe(true);
    });
  });
});

describe("LLM Judge — test case coverage", () => {
  it("all test cases have valid golden answers", () => {
    for (const tc of LLM_JUDGE_CASES) {
      expect(tc.question).toBeTruthy();
      expect(tc.goldenAnswer).toBeDefined();
      expect(tc.contextPages.length).toBeGreaterThan(0);
      expect(["numerical", "factual", "comparative"]).toContain(tc.category);
    }
  });

  it("covers all three categories", () => {
    const categories = new Set(LLM_JUDGE_CASES.map((c) => c.category));
    expect(categories.has("numerical")).toBe(true);
    expect(categories.has("factual")).toBe(true);
    expect(categories.has("comparative")).toBe(true);
  });
});

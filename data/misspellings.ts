export type MisspellingEntry = {
  term: string;
  volume: number;
  correction: string;
};

export const MISSPELLINGS: MisspellingEntry[] = [
  { term: "booket", volume: 135000, correction: "Blooket" },
  { term: "blookey", volume: 90500, correction: "Blooket" },
  { term: "blooker", volume: 74000, correction: "Blooket" },
  { term: "bloocket", volume: 49500, correction: "Blooket" },
  { term: "blooke", volume: 49500, correction: "Blooket" },
  { term: "blooet", volume: 40500, correction: "Blooket" },
  { term: "blokket", volume: 33100, correction: "Blooket" },
  { term: "bllooket", volume: 18100, correction: "Blooket" },
  { term: "bloomet", volume: 18100, correction: "Blooket" },
  { term: "blooketr", volume: 14800, correction: "Blooket" },
  { term: "blookeet", volume: 14800, correction: "Blooket" },
  { term: "iblooket", volume: 12100, correction: "Blooket" },
  { term: "biooket", volume: 9900, correction: "Blooket" },
  { term: "nlooket", volume: 8100, correction: "Blooket" },
  { term: "vlooket", volume: 8100, correction: "Blooket" },
  { term: "blokeet", volume: 8100, correction: "Blooket" },
  { term: "bloket", volume: 6600, correction: "Blooket" },
  { term: "blooket", volume: 5400, correction: "Blooket" },
  { term: "blookrt", volume: 5400, correction: "Blooket" },
  { term: "blooekt", volume: 4400, correction: "Blooket" },
  { term: "blooker", volume: 3600, correction: "Blooket" },
  { term: "bloklet", volume: 3600, correction: "Blooket" },
  { term: "blloket", volume: 2900, correction: "Blooket" },
  { term: "blookef", volume: 2900, correction: "Blooket" },
  { term: "blookwt", volume: 2400, correction: "Blooket" },
  { term: "bloolet", volume: 2400, correction: "Blooket" },
  { term: "blookst", volume: 1900, correction: "Blooket" },
  { term: "bloojet", volume: 1900, correction: "Blooket" },
  { term: "blookte", volume: 1600, correction: "Blooket" },
  { term: "blpoket", volume: 1600, correction: "Blooket" },
  { term: "blopket", volume: 1300, correction: "Blooket" },
  { term: "bloolket", volume: 1300, correction: "Blooket" },
  { term: "blookert", volume: 1000, correction: "Blooket" },
  { term: "bloooket", volume: 1000, correction: "Blooket" },
  { term: "blooklet", volume: 880, correction: "Blooket" },
  { term: "bloket", volume: 720, correction: "Blooket" },
  { term: "bllokke", volume: 720, correction: "Blooket" },
  { term: "blooked", volume: 590, correction: "Blooket" },
  { term: "blookeg", volume: 590, correction: "Blooket" },
  { term: "blooker", volume: 480, correction: "Blooket" },
  { term: "blook3t", volume: 480, correction: "Blooket" },
  { term: "blooke5", volume: 390, correction: "Blooket" },
  { term: "blook4t", volume: 390, correction: "Blooket" },
  { term: "bl00ket", volume: 320, correction: "Blooket" },
  { term: "b!ooket", volume: 260, correction: "Blooket" },
  { term: "bl0oket", volume: 260, correction: "Blooket" },
  { term: "blooker", volume: 210, correction: "Blooket" },
  { term: "bloolet", volume: 210, correction: "Blooket" },
  { term: "blook3", volume: 170, correction: "Blooket" },
  { term: "blooker", volume: 140, correction: "Blooket" },
];

export function getMisspellingByTerm(term: string): MisspellingEntry | undefined {
  return MISSPELLINGS.find((m) => m.term === term);
}

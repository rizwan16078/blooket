import {
  DATASET_COLUMNS,
  DATASET_LICENSE_NAME,
  DATASET_LICENSE_URL,
  DATASET_VERSION,
  buildDatasetRows,
} from "@/lib/dataset";
import { siteUrl } from "@/lib/site";

export const revalidate = 86400;

export async function GET() {
  const rows = buildDatasetRows();

  const payload = {
    name: "Blooket Pack Drop Rates",
    description:
      "Verified drop rates, sell values and confidence thresholds for every blook in every Blooket pack.",
    version: DATASET_VERSION,
    license: DATASET_LICENSE_URL,
    licenseName: DATASET_LICENSE_NAME,
    attribution: `Blooket Calculator (${siteUrl})`,
    documentation: `${siteUrl}/dataset`,
    methodology: `${siteUrl}/methodology`,
    // Shipping the schema alongside the rows means a consumer never has to
    // guess what a column means or scrape the docs page to find out.
    fields: DATASET_COLUMNS.map((c) => ({ name: c.key, description: c.description })),
    rowCount: rows.length,
    rows,
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

import {
  DATASET_LICENSE_NAME,
  DATASET_VERSION,
  buildDatasetCsv,
  buildDatasetRows,
} from "@/lib/dataset";

export const revalidate = 86400;

export async function GET() {
  const csv = buildDatasetCsv(buildDatasetRows());

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      // inline rather than attachment so the file previews in a browser tab —
      // a download prompt discourages the casual look that precedes a citation.
      "Content-Disposition": `inline; filename="blooket-drop-rates-${DATASET_VERSION}.csv"`,
      "X-License": DATASET_LICENSE_NAME,
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

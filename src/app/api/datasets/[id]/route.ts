import { NextRequest, NextResponse } from "next/server";
import { getDb, serializeDataset, type DatasetRow, type PaperRow, serializePaper } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const row = db
      .prepare("SELECT * FROM datasets WHERE id = ?")
      .get(id) as DatasetRow | undefined;

    if (!row) {
      return NextResponse.json(
        { error: "Dataset not found" },
        { status: 404 }
      );
    }

    const dataset = serializeDataset(row);

    // Get research papers for this dataset
    const papers = db
      .prepare("SELECT * FROM research_papers WHERE dataset_id = ?")
      .all(id) as PaperRow[];

    // Get uploader info
    let uploader = null;
    if (row.user_id) {
      const user = db
        .prepare("SELECT username FROM users WHERE id = ?")
        .get(row.user_id) as { username: string } | undefined;
      uploader = user?.username || null;
    }

    // Get preview data (first 10 rows of CSV)
    let preview: string[][] = [];
    let columns: string[] = [];
    if (row.file_path) {
      const fs = await import("fs");
      const path = await import("path");
      const { SAMPLES_DIR, UPLOADS_DIR } = await import("@/lib/db");

      // Check samples dir first, then uploads
      let csvPath = path.join(SAMPLES_DIR, `${row.file_path}.csv`);
      if (!fs.existsSync(csvPath)) {
        csvPath = path.join(UPLOADS_DIR, `${row.file_path}.csv`);
      }

      if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim());
        if (lines.length > 0) {
          columns = lines[0].split(",").map((c) => c.trim());
          preview = lines
            .slice(1, 11)
            .map((line) => line.split(",").map((c) => c.trim()));
        }
      }
    }

    return NextResponse.json({
      dataset,
      papers: papers.map(serializePaper),
      uploader,
      preview: { columns, rows: preview },
    });
  } catch (error) {
    console.error("GET dataset error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset" },
      { status: 500 }
    );
  }
}

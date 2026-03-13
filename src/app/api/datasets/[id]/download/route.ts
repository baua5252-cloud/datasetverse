import { NextRequest, NextResponse } from "next/server";
import { getDb, SAMPLES_DIR, UPLOADS_DIR, type DatasetRow } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const format = (url.searchParams.get("format") || "csv").toLowerCase();

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

    if (!row.file_path) {
      return NextResponse.json(
        { error: "No file available for this dataset" },
        { status: 404 }
      );
    }

    const ext = format === "json" ? ".json" : ".csv";
    const contentType =
      format === "json" ? "application/json" : "text/csv";

    // Check samples dir first, then uploads
    let filePath = path.join(SAMPLES_DIR, `${row.file_path}${ext}`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(UPLOADS_DIR, `${row.file_path}${ext}`);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found in ${format} format` },
        { status: 404 }
      );
    }

    // Increment download counter
    db.prepare(
      "UPDATE datasets SET downloads = downloads + 1 WHERE id = ?"
    ).run(id);

    const fileBuffer = fs.readFileSync(filePath);
    const safeTitle = row.title
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeTitle}${ext}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}

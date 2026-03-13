import { NextRequest, NextResponse } from "next/server";
import { getDb, serializeDataset, type DatasetRow } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);

    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const source = url.searchParams.get("source") || "";
    const trending = url.searchParams.get("trending");
    const featured = url.searchParams.get("featured");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = "SELECT * FROM datasets WHERE 1=1";
    const params: (string | number)[] = [];

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (source) {
      query += " AND source = ?";
      params.push(source);
    }

    if (trending === "true") {
      query += " AND trending = 1";
    }

    if (featured === "true") {
      query += " AND featured = 1";
    }

    query += " ORDER BY downloads DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const rows = db.prepare(query).all(...params) as DatasetRow[];
    const datasets = rows.map(serializeDataset);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM datasets WHERE 1=1";
    const countParams: (string | number)[] = [];

    if (search) {
      countQuery +=
        " AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)";
      const term = `%${search}%`;
      countParams.push(term, term, term);
    }
    if (category) {
      countQuery += " AND category = ?";
      countParams.push(category);
    }
    if (source) {
      countQuery += " AND source = ?";
      countParams.push(source);
    }
    if (trending === "true") countQuery += " AND trending = 1";
    if (featured === "true") countQuery += " AND featured = 1";

    const { total } = db.prepare(countQuery).get(...countParams) as {
      total: number;
    };

    return NextResponse.json({ datasets, total, limit, offset });
  } catch (error) {
    console.error("GET datasets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch datasets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const license = (formData.get("license") as string) || "CC BY 4.0";
    const tags = formData.get("tags") as string;
    const file = formData.get("file") as File | null;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    const id = `ds-${crypto.randomUUID().slice(0, 8)}`;
    let filePath: string | null = null;
    let size = "0 B";
    let rowsCount = 0;
    let columnsCount = 0;
    const formats: string[] = [];

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name).toLowerCase();
      const safeFilename = `${id}${ext}`;
      filePath = path.join(UPLOADS_DIR, safeFilename);
      fs.writeFileSync(filePath, buffer);

      const fileSize = buffer.length;
      size =
        fileSize > 1024 * 1024
          ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
          : `${(fileSize / 1024).toFixed(0)} KB`;

      if (ext === ".csv") {
        formats.push("CSV");
        const content = buffer.toString("utf-8");
        const lines = content.split("\n").filter((l) => l.trim());
        rowsCount = lines.length - 1;
        columnsCount = lines[0]?.split(",").length || 0;
      } else if (ext === ".json") {
        formats.push("JSON");
        try {
          const data = JSON.parse(buffer.toString("utf-8"));
          if (Array.isArray(data)) {
            rowsCount = data.length;
            columnsCount = data[0] ? Object.keys(data[0]).length : 0;
          }
        } catch {
          // Not a JSON array
        }
      }
    }

    const db = getDb();
    db.prepare(
      `INSERT INTO datasets (id, title, description, source, category, tags, size, formats, last_updated, license, rows_count, columns_count, file_path, user_id)
       VALUES (?, ?, ?, 'Upload', ?, ?, ?, ?, date('now'), ?, ?, ?, ?, ?)`
    ).run(
      id,
      title,
      description,
      category,
      JSON.stringify(tags ? tags.split(",").map((t) => t.trim()) : []),
      size,
      JSON.stringify(formats),
      license,
      rowsCount,
      columnsCount,
      filePath ? path.basename(filePath).replace(path.extname(filePath), "") : null,
      payload.userId
    );

    const row = db
      .prepare("SELECT * FROM datasets WHERE id = ?")
      .get(id) as DatasetRow;

    return NextResponse.json({ dataset: serializeDataset(row) }, { status: 201 });
  } catch (error) {
    console.error("POST datasets error:", error);
    return NextResponse.json(
      { error: "Failed to create dataset" },
      { status: 500 }
    );
  }
}

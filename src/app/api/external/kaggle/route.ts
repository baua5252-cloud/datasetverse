import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");

    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;

    if (!username || !key) {
      return NextResponse.json(
        {
          error: "Kaggle API credentials not configured",
          hint: "Set KAGGLE_USERNAME and KAGGLE_KEY in .env.local",
        },
        { status: 503 }
      );
    }

    const authHeader = "Basic " + Buffer.from(`${username}:${key}`).toString("base64");

    const kaggleUrl = new URL("https://www.kaggle.com/api/v1/datasets/list");
    if (search) kaggleUrl.searchParams.set("search", search);
    kaggleUrl.searchParams.set("page", String(page));
    kaggleUrl.searchParams.set("filetype", "csv");

    const response = await fetch(kaggleUrl.toString(), {
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Kaggle API error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform Kaggle results to our format
    const datasets = data.map(
      (item: {
        ref: string;
        title: string;
        subtitle?: string;
        totalBytes?: number;
        downloadCount?: number;
        lastUpdated?: string;
        licenseName?: string;
        tags?: { name: string }[];
      }) => ({
        id: `kaggle-${item.ref.replace("/", "-")}`,
        title: item.title,
        description: item.subtitle || "",
        source: "Kaggle",
        category: "External",
        tags: item.tags?.map((t: { name: string }) => t.name) || [],
        size: item.totalBytes
          ? `${(item.totalBytes / (1024 * 1024)).toFixed(1)} MB`
          : "Unknown",
        formats: ["CSV"],
        downloads: item.downloadCount || 0,
        lastUpdated: item.lastUpdated || "",
        license: item.licenseName || "Unknown",
        kaggleRef: item.ref,
      })
    );

    return NextResponse.json({ datasets, source: "Kaggle" });
  } catch (error) {
    console.error("Kaggle API error:", error);
    return NextResponse.json(
      { error: "Failed to search Kaggle datasets" },
      { status: 500 }
    );
  }
}

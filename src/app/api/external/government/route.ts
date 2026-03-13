import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "data";
    const source = url.searchParams.get("source") || "datagov";
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (source === "worldbank") {
      return await searchWorldBank(search, limit);
    }

    return await searchDataGov(search, limit);
  } catch (error) {
    console.error("Government API error:", error);
    return NextResponse.json(
      { error: "Failed to search government datasets" },
      { status: 500 }
    );
  }
}

async function searchDataGov(query: string, limit: number) {
  const apiUrl = `https://catalog.data.gov/api/3/action/package_search?q=${encodeURIComponent(
    query
  )}&rows=${limit}`;

  const response = await fetch(apiUrl, {
    headers: { "User-Agent": "DatasetVerse/1.0" },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "data.gov API error" },
      { status: response.status }
    );
  }

  const data = await response.json();

  const datasets = data.result.results.map(
    (item: {
      id: string;
      title: string;
      notes?: string;
      tags?: { name: string }[];
      resources?: { format: string; size?: number; url?: string }[];
      metadata_modified?: string;
      license_title?: string;
      organization?: { title: string };
    }) => ({
      id: `gov-${item.id.slice(0, 12)}`,
      title: item.title,
      description: item.notes || "",
      source: "Government",
      category: "Government",
      tags: item.tags?.map((t: { name: string }) => t.name).slice(0, 5) || [],
      size: "Varies",
      formats:
        item.resources
          ?.map((r: { format: string }) => r.format?.toUpperCase())
          .filter(Boolean)
          .filter(
            (v: string, i: number, a: string[]) => a.indexOf(v) === i
          )
          .slice(0, 3) || [],
      downloads: 0,
      lastUpdated: item.metadata_modified?.split("T")[0] || "",
      license: item.license_title || "Open Data",
      externalUrl:
        item.resources?.[0]?.url || `https://catalog.data.gov/dataset/${item.id}`,
      organization: item.organization?.title || "US Government",
    })
  );

  return NextResponse.json({
    datasets,
    source: "data.gov",
    total: data.result.count,
  });
}

async function searchWorldBank(query: string, limit: number) {
  // Map common search terms to World Bank indicators
  const indicatorMap: Record<string, { code: string; name: string }[]> = {
    gdp: [
      { code: "NY.GDP.MKTP.CD", name: "GDP (current US$)" },
      { code: "NY.GDP.PCAP.CD", name: "GDP per capita (current US$)" },
    ],
    population: [
      { code: "SP.POP.TOTL", name: "Total Population" },
      { code: "SP.POP.GROW", name: "Population Growth (%)" },
    ],
    education: [
      { code: "SE.XPD.TOTL.GD.ZS", name: "Education Expenditure (% of GDP)" },
    ],
    health: [
      { code: "SH.XPD.CHEX.GD.ZS", name: "Health Expenditure (% of GDP)" },
      { code: "SP.DYN.LE00.IN", name: "Life Expectancy at Birth" },
    ],
    poverty: [
      { code: "SI.POV.DDAY", name: "Poverty headcount ratio ($2.15/day)" },
    ],
    climate: [
      { code: "EN.ATM.CO2E.PC", name: "CO2 Emissions (metric tons per capita)" },
    ],
    trade: [
      { code: "NE.TRD.GNFS.ZS", name: "Trade (% of GDP)" },
    ],
    employment: [
      { code: "SL.UEM.TOTL.ZS", name: "Unemployment, total (% labor force)" },
    ],
    data: [
      { code: "NY.GDP.MKTP.CD", name: "GDP (current US$)" },
      { code: "SP.POP.TOTL", name: "Total Population" },
      { code: "SP.DYN.LE00.IN", name: "Life Expectancy at Birth" },
    ],
  };

  const lowerQuery = query.toLowerCase();
  const indicators =
    Object.entries(indicatorMap).find(([key]) =>
      lowerQuery.includes(key)
    )?.[1] || indicatorMap["data"];

  const datasets = [];
  const fetchCount = Math.min(indicators.length, limit);

  for (let i = 0; i < fetchCount; i++) {
    const indicator = indicators[i];
    const wbUrl = `https://api.worldbank.org/v2/country/all/indicator/${indicator.code}?format=json&per_page=5&date=2020:2023`;

    try {
      const response = await fetch(wbUrl);
      if (response.ok) {
        const data = await response.json();
        const total = data[0]?.total || 0;

        datasets.push({
          id: `wb-${indicator.code.replace(/\./g, "-").toLowerCase()}`,
          title: `World Bank: ${indicator.name}`,
          description: `World Bank Development Indicator - ${indicator.name}. Covers ${total}+ country-year observations.`,
          source: "Government",
          category: "Economics",
          tags: ["world-bank", "development", lowerQuery],
          size: "Varies",
          formats: ["JSON", "CSV"],
          downloads: 0,
          lastUpdated: new Date().toISOString().split("T")[0],
          license: "CC BY 4.0",
          externalUrl: `https://data.worldbank.org/indicator/${indicator.code}`,
          organization: "World Bank",
        });
      }
    } catch {
      // Skip failed indicators
    }
  }

  return NextResponse.json({
    datasets,
    source: "World Bank",
    total: datasets.length,
  });
}

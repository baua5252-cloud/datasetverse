import { NextResponse } from "next/server";
import { getDb, SAMPLES_DIR } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { writeSampleFiles } from "@/lib/generate-samples";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const db = getDb();

    // Check if already seeded
    const count = db.prepare("SELECT COUNT(*) as c FROM datasets").get() as {
      c: number;
    };
    if (count.c > 0) {
      return NextResponse.json(
        { message: "Database already seeded", count: count.c },
        { status: 200 }
      );
    }

    // 1. Generate sample CSV/JSON files
    const files = writeSampleFiles();

    // 2. Create demo user
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword("demo123");
    db.prepare(
      "INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)"
    ).run(userId, "admin", "admin@datasetverse.io", passwordHash);

    // 3. Seed datasets
    const insertDs = db.prepare(`
      INSERT INTO datasets (
        id, title, description, source, category, tags, size,
        formats, downloads, last_updated, license, rows_count,
        columns_count, trending, featured, file_path, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedDatasets = [
      {
        id: "ds-001",
        title: "Global Stock Market Historical Data (2024–2025)",
        description:
          "Comprehensive daily stock prices, volumes, and market indicators for NYSE, NASDAQ, LSE, TSE, and HKEX exchanges. Includes open/high/low/close prices, volume, P/E ratios, dividend yields, and market cap for top companies. Perfect for time-series analysis, algorithmic trading research, and financial modeling.",
        source: "Kaggle",
        category: "Finance",
        tags: ["stocks", "time-series", "market-data", "trading", "S&P500"],
        formats: ["CSV", "JSON"],
        downloads: 128450,
        lastUpdated: "2025-12-15",
        license: "CC BY 4.0",
        trending: true,
        featured: true,
        fileKey: "stock_market",
      },
      {
        id: "ds-002",
        title: "Bitcoin & Ethereum Blockchain Price Data",
        description:
          "Daily cryptocurrency price data for Bitcoin, Ethereum, BNB, Solana, Cardano, Polkadot, Avalanche, and Polygon. Includes OHLCV data, market cap, circulating supply, total supply, and 24h percentage changes. Ideal for cryptocurrency research, DeFi analysis, and quantitative trading strategies.",
        source: "Research",
        category: "Cryptocurrency",
        tags: ["blockchain", "bitcoin", "ethereum", "defi", "crypto"],
        formats: ["CSV", "JSON"],
        downloads: 89230,
        lastUpdated: "2026-01-20",
        license: "MIT",
        trending: true,
        featured: true,
        fileKey: "crypto",
      },
      {
        id: "ds-003",
        title: "WHO Global Disease Surveillance Dataset",
        description:
          "World Health Organization disease surveillance data covering 20 countries across 6 WHO regions from 2015 to 2025. Tracks infectious diseases including Influenza, Tuberculosis, Malaria, COVID-19, Dengue, and more. Includes cases, deaths, incidence rates, vaccination rates, and healthcare indices.",
        source: "Government",
        category: "Healthcare",
        tags: ["WHO", "disease", "health", "epidemiology", "mortality"],
        formats: ["CSV", "JSON"],
        downloads: 67890,
        lastUpdated: "2025-11-30",
        license: "Open Government",
        trending: false,
        featured: true,
        fileKey: "health",
      },
      {
        id: "ds-004",
        title: "IMF World Economic Outlook Database",
        description:
          "International Monetary Fund comprehensive economic indicators for 20 major economies from 2010-2025. GDP, inflation, unemployment, trade balance, government debt, interest rates, and more. Essential for macroeconomic analysis, policy research, and economic forecasting.",
        source: "Government",
        category: "Economics",
        tags: ["GDP", "inflation", "IMF", "macroeconomics", "trade"],
        formats: ["CSV", "JSON"],
        downloads: 156780,
        lastUpdated: "2026-02-01",
        license: "Open Data",
        trending: true,
        featured: false,
        fileKey: "economic",
      },
      {
        id: "ds-005",
        title: "Multilingual NLP Benchmark (20 Languages)",
        description:
          "Comprehensive multilingual natural language processing benchmark dataset covering 20 languages, 7 NLP tasks, and 7 model architectures. Includes accuracy, F1 scores, BLEU scores, inference times, and model sizes. Foundation for cross-lingual NLP research and model comparison.",
        source: "Research",
        category: "AI / ML",
        tags: ["NLP", "multilingual", "BERT", "transformers", "benchmark"],
        formats: ["CSV", "JSON"],
        downloads: 234560,
        lastUpdated: "2025-09-15",
        license: "Apache 2.0",
        trending: true,
        featured: true,
        fileKey: "nlp",
      },
      {
        id: "ds-006",
        title: "NASA Climate Change Evidence Dataset",
        description:
          "NASA Earth observation data from 2000-2025 with monthly granularity. Includes global temperature anomaly, CO2 concentrations, sea level measurements, Arctic ice extent, ocean heat content, methane levels, NOx levels, and solar irradiance. Critical resource for climate research.",
        source: "Government",
        category: "Climate",
        tags: ["climate-change", "NASA", "temperature", "CO2", "sea-level"],
        formats: ["CSV", "JSON"],
        downloads: 95420,
        lastUpdated: "2026-01-10",
        license: "Public Domain",
        trending: false,
        featured: true,
        fileKey: "climate",
      },
      {
        id: "ds-007",
        title: "Social Media Sentiment Analysis Corpus",
        description:
          "Large-scale social media sentiment dataset covering Twitter/X, Reddit, Facebook, and TikTok across 10 topics. Includes daily aggregated sentiment scores, positive/negative/neutral percentages, engagement rates, and trending hashtags. Perfect for NLP, opinion mining, and social network analysis.",
        source: "Kaggle",
        category: "Social Science",
        tags: ["NLP", "sentiment", "social-media", "twitter", "text-mining"],
        formats: ["CSV", "JSON"],
        downloads: 112340,
        lastUpdated: "2025-10-22",
        license: "CC BY-NC 4.0",
        trending: true,
        featured: false,
        fileKey: "sentiment",
      },
      {
        id: "ds-008",
        title: "US Census American Community Survey (2018-2024)",
        description:
          "Detailed demographic, economic, housing, and social data for 30 US states at the county level. Includes population, median household income, poverty rates, education levels, unemployment, median home values, health insurance coverage, and housing units. Spans 2018-2024.",
        source: "Government",
        category: "Government",
        tags: ["census", "demographics", "population", "US", "housing"],
        formats: ["CSV", "JSON"],
        downloads: 78650,
        lastUpdated: "2025-08-15",
        license: "Public Domain",
        trending: false,
        featured: false,
        fileKey: "census",
      },
      {
        id: "ds-009",
        title: "World Bank Development Indicators (2000-2025)",
        description:
          "World Bank development data covering 30 economies with 14 indicators. GDP, GNI per capita, life expectancy, literacy rate, CO2 emissions, internet usage, mobile subscriptions, renewable energy, R&D expenditure, education spending, and FDI flows. Essential for development economics research.",
        source: "Government",
        category: "Economics",
        tags: [
          "world-bank",
          "development",
          "poverty",
          "education",
          "sustainability",
        ],
        formats: ["CSV", "JSON"],
        downloads: 189340,
        lastUpdated: "2026-01-05",
        license: "CC BY 4.0",
        trending: false,
        featured: true,
        fileKey: "worldbank",
      },
      {
        id: "ds-010",
        title: "DeFi Protocol Analytics & Yield Data",
        description:
          "Decentralized finance protocol data covering 15 major DeFi platforms across Ethereum, BSC, Polygon, Arbitrum, and Optimism. Daily TVL, 24h volume, fees, users, average APY, token prices, market cap, and weekly revenue. Critical dataset for DeFi research and yield farming analysis.",
        source: "Kaggle",
        category: "Cryptocurrency",
        tags: ["DeFi", "yield-farming", "liquidity", "TVL", "governance"],
        formats: ["CSV", "JSON"],
        downloads: 45670,
        lastUpdated: "2026-02-28",
        license: "MIT",
        trending: true,
        featured: false,
        fileKey: "defi",
      },
      {
        id: "ds-011",
        title: "Global Real Estate & Property Prices",
        description:
          "Property prices, rental yields, and real estate market indicators across 20 major world cities. Quarterly data from 2018-2025 covering residential, commercial, and industrial properties. Includes average price per sqm, rental yields, YoY price changes, transaction volumes, vacancy rates, construction permits, and mortgage rates.",
        source: "Kaggle",
        category: "Finance",
        tags: [
          "real-estate",
          "property",
          "housing-market",
          "prices",
          "rental",
        ],
        formats: ["CSV", "JSON"],
        downloads: 54320,
        lastUpdated: "2025-11-15",
        license: "CC BY 4.0",
        trending: false,
        featured: false,
        fileKey: "realestate",
      },
    ];

    const insertMany = db.transaction(() => {
      for (const ds of seedDatasets) {
        const csvPath = files[ds.fileKey]?.csv;
        const csvSize = csvPath ? fs.statSync(csvPath).size : 0;
        const sizeStr =
          csvSize > 1024 * 1024
            ? `${(csvSize / (1024 * 1024)).toFixed(1)} MB`
            : `${(csvSize / 1024).toFixed(0)} KB`;

        // Count rows & columns
        let rowCount = 0;
        let colCount = 0;
        if (csvPath && fs.existsSync(csvPath)) {
          const content = fs.readFileSync(csvPath, "utf-8");
          const lines = content.split("\n").filter((l) => l.trim());
          rowCount = lines.length - 1;
          colCount = lines[0].split(",").length;
        }

        insertDs.run(
          ds.id,
          ds.title,
          ds.description,
          ds.source,
          ds.category,
          JSON.stringify(ds.tags),
          sizeStr,
          JSON.stringify(ds.formats),
          ds.downloads,
          ds.lastUpdated,
          ds.license,
          rowCount,
          colCount,
          ds.trending ? 1 : 0,
          ds.featured ? 1 : 0,
          csvPath ? path.basename(csvPath).replace(".csv", "") : null,
          userId
        );
      }
    });
    insertMany();

    // 4. Seed research papers
    const insertPaper = db.prepare(`
      INSERT INTO research_papers (id, title, authors, abstract, dataset_id, published_date, journal, url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const papers = [
      {
        id: "rp-001",
        title:
          "Deep Learning for Financial Time-Series Forecasting: A Transformer Approach",
        authors: ["Chen, W.", "Rodriguez, M.", "Kim, S."],
        abstract:
          "We present a novel transformer-based architecture for predicting stock market movements using high-frequency trading data. Our model achieves 94.2% directional accuracy on the S&P 500 index.",
        datasetId: "ds-001",
        publishedDate: "2025-06-15",
        journal: "Journal of Financial Data Science",
      },
      {
        id: "rp-002",
        title:
          "Blockchain Transaction Graph Analysis for Anomaly Detection",
        authors: ["Patel, R.", "Zhang, L.", "Weber, K."],
        abstract:
          "A graph neural network approach to detecting fraudulent transactions on the Bitcoin and Ethereum networks with 97.8% precision and 95.1% recall.",
        datasetId: "ds-002",
        publishedDate: "2025-08-22",
        journal: "IEEE Transactions on Blockchain",
      },
      {
        id: "rp-003",
        title:
          "Pandemic Preparedness: Lessons from WHO Surveillance Data 2015–2025",
        authors: ["Thompson, A.", "Gupta, S.", "Okonkwo, N."],
        abstract:
          "Analysis of 10 years of global disease surveillance data reveals critical patterns in pandemic emergence and spread, informing next-generation early warning systems.",
        datasetId: "ds-003",
        publishedDate: "2025-04-10",
        journal: "The Lancet Digital Health",
      },
      {
        id: "rp-004",
        title:
          "Cross-Lingual Transfer Learning: A Comprehensive Benchmark Study",
        authors: ["Li, X.", "Johnson, M.", "Tanaka, Y."],
        abstract:
          "We conduct an exhaustive comparison of 7 model architectures across 20 languages and 7 NLP tasks, revealing trade-offs in accuracy, computational cost, and cross-lingual robustness.",
        datasetId: "ds-005",
        publishedDate: "2025-11-03",
        journal: "NeurIPS 2025 Proceedings",
      },
      {
        id: "rp-005",
        title:
          "Climate Tipping Points: Evidence from NASA Earth Observation Data",
        authors: ["Martinez, E.", "Park, J.", "Williams, R."],
        abstract:
          "Using 25 years of NASA climate data, we identify three potential tipping points in the Earth system related to Arctic ice loss, ocean heat content, and CO2 concentration thresholds.",
        datasetId: "ds-006",
        publishedDate: "2025-09-18",
        journal: "Nature Climate Change",
      },
    ];

    const insertPapers = db.transaction(() => {
      for (const p of papers) {
        insertPaper.run(
          p.id,
          p.title,
          JSON.stringify(p.authors),
          p.abstract,
          p.datasetId,
          p.publishedDate,
          p.journal,
          null
        );
      }
    });
    insertPapers();

    return NextResponse.json({
      message: "Database seeded successfully",
      datasets: seedDatasets.length,
      papers: papers.length,
      sampleFiles: Object.keys(files).length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}

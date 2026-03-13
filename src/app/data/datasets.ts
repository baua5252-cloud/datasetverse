export interface Dataset {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  tags: string[];
  size: string;
  formats: string[];
  downloads: number;
  lastUpdated: string;
  license: string;
  rows?: number;
  columns?: number;
  trending?: boolean;
  featured?: boolean;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  datasetId: string;
  publishedDate: string;
  journal: string;
  url: string;
}

export const categories = [
  { name: "Finance", icon: "TrendingUp", count: 1247, color: "#00d4ff" },
  { name: "Cryptocurrency", icon: "Bitcoin", count: 832, color: "#f59e0b" },
  { name: "Healthcare", icon: "Heart", count: 1589, color: "#ef4444" },
  { name: "Economics", icon: "BarChart3", count: 943, color: "#10b981" },
  { name: "AI / ML", icon: "Brain", count: 2341, color: "#a855f7" },
  { name: "Climate", icon: "Cloud", count: 678, color: "#06b6d4" },
  { name: "Social Science", icon: "Users", count: 1124, color: "#f472b6" },
  { name: "Government", icon: "Landmark", count: 2089, color: "#6366f1" },
];

export const datasets: Dataset[] = [
  {
    id: "ds-001",
    title: "Global Stock Market Historical Data (2000–2025)",
    description:
      "Comprehensive daily stock prices, volumes, and market indicators for 50+ exchanges worldwide. Includes NYSE, NASDAQ, LSE, TSE, and emerging markets. Perfect for time-series analysis, algorithmic trading research, and financial modeling.",
    source: "Kaggle",
    category: "Finance",
    tags: ["stocks", "time-series", "market-data", "trading", "S&P500"],
    size: "4.2 GB",
    formats: ["CSV", "Parquet"],
    downloads: 128450,
    lastUpdated: "2025-12-15",
    license: "CC BY 4.0",
    rows: 45000000,
    columns: 12,
    trending: true,
    featured: true,
  },
  {
    id: "ds-002",
    title: "Bitcoin & Ethereum Blockchain Transactions",
    description:
      "Complete blockchain transaction records for Bitcoin and Ethereum networks. Includes sender, receiver, value, gas fees, block timestamps, and smart contract interactions. Ideal for cryptocurrency research and DeFi analysis.",
    source: "Research",
    category: "Cryptocurrency",
    tags: ["blockchain", "bitcoin", "ethereum", "defi", "crypto"],
    size: "18.7 GB",
    formats: ["JSON", "Parquet"],
    downloads: 89230,
    lastUpdated: "2026-01-20",
    license: "MIT",
    rows: 120000000,
    columns: 18,
    trending: true,
    featured: true,
  },
  {
    id: "ds-003",
    title: "WHO Global Disease Surveillance Dataset",
    description:
      "World Health Organization disease surveillance data covering 194 member states. Tracks infectious diseases, vaccination rates, mortality statistics, and healthcare infrastructure metrics from 2010 to 2025.",
    source: "Government",
    category: "Healthcare",
    tags: ["WHO", "disease", "health", "epidemiology", "mortality"],
    size: "2.1 GB",
    formats: ["CSV", "Excel"],
    downloads: 67890,
    lastUpdated: "2025-11-30",
    license: "Open Government",
    rows: 8500000,
    columns: 24,
    trending: false,
    featured: true,
  },
  {
    id: "ds-004",
    title: "IMF World Economic Outlook Database",
    description:
      "International Monetary Fund comprehensive economic indicators for 190+ countries. GDP, inflation, unemployment, trade balance, government debt, and fiscal policy data spanning 1980–2026 with forecasts.",
    source: "Government",
    category: "Economics",
    tags: ["GDP", "inflation", "IMF", "macroeconomics", "trade"],
    size: "890 MB",
    formats: ["CSV", "Excel", "JSON"],
    downloads: 156780,
    lastUpdated: "2026-02-01",
    license: "Open Data",
    rows: 3200000,
    columns: 42,
    trending: true,
    featured: false,
  },
  {
    id: "ds-005",
    title: "ImageNet Large-Scale Visual Recognition 2025",
    description:
      "Updated ImageNet dataset with 15M+ labeled images across 22,000 categories. Enhanced with adversarial samples, edge cases, and cross-domain images. The foundation for computer vision research and benchmarking.",
    source: "Research",
    category: "AI / ML",
    tags: ["computer-vision", "deep-learning", "image-classification", "CNN"],
    size: "156 GB",
    formats: ["Parquet", "JSON"],
    downloads: 234560,
    lastUpdated: "2025-09-15",
    license: "Research Only",
    rows: 15000000,
    columns: 8,
    trending: true,
    featured: true,
  },
  {
    id: "ds-006",
    title: "NASA Climate Change Evidence Dataset",
    description:
      "NASA Earth observation data combining satellite imagery analysis, temperature records, sea level measurements, CO2 concentrations, and ice sheet monitoring. Covers 1880–2025 with monthly granularity.",
    source: "Government",
    category: "Climate",
    tags: ["climate-change", "NASA", "temperature", "CO2", "sea-level"],
    size: "5.6 GB",
    formats: ["CSV", "Parquet", "JSON"],
    downloads: 95420,
    lastUpdated: "2026-01-10",
    license: "Public Domain",
    rows: 12000000,
    columns: 32,
    trending: false,
    featured: true,
  },
  {
    id: "ds-007",
    title: "Twitter/X Social Sentiment Analysis Corpus",
    description:
      "Large-scale social media dataset containing 50M+ tweets with sentiment labels, user demographics, engagement metrics, and topic classifications. Useful for NLP, opinion mining, and social network analysis.",
    source: "Kaggle",
    category: "Social Science",
    tags: ["NLP", "sentiment", "social-media", "twitter", "text-mining"],
    size: "8.3 GB",
    formats: ["JSON", "CSV"],
    downloads: 112340,
    lastUpdated: "2025-10-22",
    license: "CC BY-NC 4.0",
    rows: 50000000,
    columns: 15,
    trending: true,
    featured: false,
  },
  {
    id: "ds-008",
    title: "US Census American Community Survey 2024",
    description:
      "Detailed demographic, economic, housing, and social data for every county and census tract in the United States. Includes income distributions, education levels, occupation data, and migration patterns.",
    source: "Government",
    category: "Government",
    tags: ["census", "demographics", "population", "US", "housing"],
    size: "3.4 GB",
    formats: ["CSV", "Excel"],
    downloads: 78650,
    lastUpdated: "2025-08-15",
    license: "Public Domain",
    rows: 22000000,
    columns: 56,
    trending: false,
    featured: false,
  },
  {
    id: "ds-009",
    title: "Multilingual NLP Benchmark (100+ Languages)",
    description:
      "Comprehensive multilingual natural language processing dataset covering 100+ languages with parallel translations, named entity recognition, POS tagging, and dependency parsing annotations.",
    source: "Research",
    category: "AI / ML",
    tags: ["NLP", "multilingual", "translation", "BERT", "transformers"],
    size: "12.8 GB",
    formats: ["JSON", "Parquet"],
    downloads: 67890,
    lastUpdated: "2025-12-01",
    license: "Apache 2.0",
    rows: 28000000,
    columns: 20,
    trending: false,
    featured: true,
  },
  {
    id: "ds-010",
    title: "DeFi Protocol Analytics & Yield Data",
    description:
      "Decentralized finance protocol data covering 200+ DeFi platforms. Includes total value locked, yield farming APYs, liquidity pool compositions, governance token metrics, and protocol revenue data.",
    source: "Kaggle",
    category: "Cryptocurrency",
    tags: ["DeFi", "yield-farming", "liquidity", "TVL", "governance"],
    size: "1.5 GB",
    formats: ["CSV", "JSON"],
    downloads: 45670,
    lastUpdated: "2026-02-28",
    license: "MIT",
    rows: 5600000,
    columns: 28,
    trending: true,
    featured: false,
  },
  {
    id: "ds-011",
    title: "Global Real Estate & Property Prices",
    description:
      "Property prices, rental yields, and real estate market indicators across 100+ cities worldwide. Includes residential, commercial, and industrial property data with economic context variables.",
    source: "Kaggle",
    category: "Finance",
    tags: ["real-estate", "property", "housing-market", "prices", "rental"],
    size: "2.8 GB",
    formats: ["CSV", "Excel"],
    downloads: 54320,
    lastUpdated: "2025-11-15",
    license: "CC BY 4.0",
    rows: 9800000,
    columns: 34,
    trending: false,
    featured: false,
  },
  {
    id: "ds-012",
    title: "World Bank Development Indicators",
    description:
      "Comprehensive development data from the World Bank covering 217 economies. Over 1,400 indicators including poverty rates, education metrics, infrastructure development, and environmental sustainability.",
    source: "Government",
    category: "Economics",
    tags: ["world-bank", "development", "poverty", "education", "sustainability"],
    size: "1.9 GB",
    formats: ["CSV", "JSON", "Excel"],
    downloads: 189340,
    lastUpdated: "2026-01-05",
    license: "CC BY 4.0",
    rows: 6700000,
    columns: 1400,
    trending: false,
    featured: true,
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: "rp-001",
    title: "Deep Learning for Financial Time-Series Forecasting: A Transformer Approach",
    authors: ["Chen, W.", "Rodriguez, M.", "Kim, S."],
    abstract:
      "We present a novel transformer-based architecture for predicting stock market movements using high-frequency trading data. Our model achieves 94.2% directional accuracy on the S&P 500 index.",
    datasetId: "ds-001",
    publishedDate: "2025-06-15",
    journal: "Journal of Financial Data Science",
    url: "#",
  },
  {
    id: "rp-002",
    title: "Blockchain Transaction Graph Analysis for Anomaly Detection",
    authors: ["Patel, R.", "Zhang, L.", "Weber, K."],
    abstract:
      "A graph neural network approach to detecting fraudulent transactions on the Bitcoin and Ethereum networks with 97.8% precision and 95.1% recall.",
    datasetId: "ds-002",
    publishedDate: "2025-08-22",
    journal: "IEEE Transactions on Blockchain",
    url: "#",
  },
  {
    id: "rp-003",
    title: "Pandemic Preparedness: Lessons from WHO Surveillance Data 2010–2025",
    authors: ["Thompson, A.", "Gupta, S.", "Okonkwo, N."],
    abstract:
      "Analysis of 15 years of global disease surveillance data reveals critical patterns in pandemic emergence and spread, informing next-generation early warning systems.",
    datasetId: "ds-003",
    publishedDate: "2025-04-10",
    journal: "The Lancet Digital Health",
    url: "#",
  },
  {
    id: "rp-004",
    title: "Vision Transformers vs CNNs: A Comprehensive Benchmark on ImageNet 2025",
    authors: ["Li, X.", "Johnson, M.", "Tanaka, Y."],
    abstract:
      "We conduct an exhaustive comparison of 45 vision transformer and CNN architectures on the updated ImageNet dataset, revealing trade-offs in accuracy, computational cost, and robustness.",
    datasetId: "ds-005",
    publishedDate: "2025-11-03",
    journal: "NeurIPS 2025 Proceedings",
    url: "#",
  },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function getSourceColor(source: string): string {
  switch (source) {
    case "Kaggle": return "#20BEFF";
    case "Government": return "#10b981";
    case "Research": return "#a855f7";
    default: return "#00d4ff";
  }
}

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    "Finance": "TrendingUp",
    "Cryptocurrency": "Bitcoin",
    "Healthcare": "Heart",
    "Economics": "BarChart3",
    "AI / ML": "Brain",
    "Climate": "Cloud",
    "Social Science": "Users",
    "Government": "Landmark",
  };
  return map[category] || "Database";
}

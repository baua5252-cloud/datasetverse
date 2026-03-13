import fs from "fs";
import path from "path";
import { SAMPLES_DIR } from "./db";

// Seeded pseudo-random number generator for reproducibility
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toCSV(headers: string[], rows: string[][]): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      row
        .map((v) => (v.includes(",") || v.includes('"') ? `"${v}"` : v))
        .join(",")
    );
  }
  return lines.join("\n");
}

// ── Stock Market Data ──
export function generateStockData(): string {
  const rand = mulberry32(42);
  const exchanges = ["NYSE", "NASDAQ", "LSE", "TSE", "HKEX"];
  const tickers: Record<string, string[]> = {
    NYSE: ["AAPL", "JPM", "JNJ", "WMT", "PG", "XOM", "BAC", "KO"],
    NASDAQ: ["MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "NFLX", "AMD"],
    LSE: ["HSBA", "SHEL", "AZN", "ULVR", "BP", "GSK", "RIO", "BARC"],
    TSE: ["7203", "6758", "9984", "6861", "8306", "9432", "4502", "6501"],
    HKEX: ["0700", "9988", "0005", "0939", "1299", "0001", "2318", "0941"],
  };
  const headers = [
    "Date", "Exchange", "Ticker", "Open", "High", "Low", "Close",
    "Volume", "Change_Pct", "Market_Cap_B", "PE_Ratio", "Dividend_Yield",
  ];
  const rows: string[][] = [];
  const startDate = new Date("2024-01-02");

  for (let day = 0; day < 250; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split("T")[0];

    for (const exchange of exchanges) {
      for (const ticker of tickers[exchange].slice(0, 3)) {
        const basePrice = 50 + rand() * 400;
        const open = basePrice + rand() * 10 - 5;
        const close = open + rand() * 8 - 4;
        const high = Math.max(open, close) + rand() * 5;
        const low = Math.min(open, close) - rand() * 5;
        const volume = Math.floor(1000000 + rand() * 50000000);
        const changePct = (((close - open) / open) * 100).toFixed(2);
        const marketCap = (basePrice * (500 + rand() * 2000)).toFixed(1);
        const pe = (10 + rand() * 40).toFixed(1);
        const divYield = (rand() * 5).toFixed(2);

        rows.push([
          dateStr, exchange, ticker,
          open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2),
          volume.toString(), changePct, marketCap, pe, divYield,
        ]);
      }
    }
  }

  return toCSV(headers, rows);
}

// ── Crypto Data ──
export function generateCryptoData(): string {
  const rand = mulberry32(101);
  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", basePrice: 42000 },
    { symbol: "ETH", name: "Ethereum", basePrice: 2200 },
    { symbol: "BNB", name: "Binance Coin", basePrice: 310 },
    { symbol: "SOL", name: "Solana", basePrice: 100 },
    { symbol: "ADA", name: "Cardano", basePrice: 0.55 },
    { symbol: "DOT", name: "Polkadot", basePrice: 7.5 },
    { symbol: "AVAX", name: "Avalanche", basePrice: 35 },
    { symbol: "MATIC", name: "Polygon", basePrice: 0.85 },
  ];
  const headers = [
    "Date", "Symbol", "Name", "Open", "High", "Low", "Close",
    "Volume_USD", "Market_Cap_USD", "Circulating_Supply",
    "Total_Supply", "Change_24h_Pct",
  ];
  const rows: string[][] = [];
  const startDate = new Date("2024-01-01");

  for (let day = 0; day < 365; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];
    const trend = 1 + Math.sin(day / 60) * 0.3;

    for (const crypto of cryptos) {
      const price = crypto.basePrice * trend * (0.9 + rand() * 0.2);
      const open = price;
      const close = price * (0.95 + rand() * 0.1);
      const high = Math.max(open, close) * (1 + rand() * 0.05);
      const low = Math.min(open, close) * (1 - rand() * 0.05);
      const volume = Math.floor(
        price * (1000000 + rand() * 50000000)
      );
      const supply = Math.floor(10000000 + rand() * 900000000);
      const totalSupply = Math.floor(supply * (1 + rand() * 0.5));
      const marketCap = Math.floor(close * supply);
      const change = (((close - open) / open) * 100).toFixed(2);

      rows.push([
        dateStr, crypto.symbol, crypto.name,
        open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2),
        volume.toString(), marketCap.toString(),
        supply.toString(), totalSupply.toString(), change,
      ]);
    }
  }
  return toCSV(headers, rows);
}

// ── WHO Disease Data ──
export function generateHealthData(): string {
  const rand = mulberry32(202);
  const countries = [
    "United States", "United Kingdom", "Germany", "France", "Japan",
    "Brazil", "India", "China", "South Africa", "Australia",
    "Canada", "Mexico", "Nigeria", "Indonesia", "Russia",
    "South Korea", "Italy", "Spain", "Kenya", "Egypt",
  ];
  const diseases = [
    "Influenza", "Tuberculosis", "Malaria", "COVID-19",
    "Dengue", "Hepatitis B", "Measles", "Cholera",
  ];
  const headers = [
    "Country", "Region", "Year", "Disease", "Cases_Reported",
    "Deaths", "Population", "Incidence_Per_100K",
    "Vaccination_Rate_Pct", "Healthcare_Index",
  ];
  const regions: Record<string, string> = {
    "United States": "Americas", "United Kingdom": "Europe",
    Germany: "Europe", France: "Europe", Japan: "Western Pacific",
    Brazil: "Americas", India: "South-East Asia", China: "Western Pacific",
    "South Africa": "Africa", Australia: "Western Pacific",
    Canada: "Americas", Mexico: "Americas", Nigeria: "Africa",
    Indonesia: "South-East Asia", Russia: "Europe",
    "South Korea": "Western Pacific", Italy: "Europe",
    Spain: "Europe", Kenya: "Africa", Egypt: "Eastern Mediterranean",
  };
  const populations: Record<string, number> = {
    "United States": 331000000, "United Kingdom": 67000000,
    Germany: 83000000, France: 67400000, Japan: 125000000,
    Brazil: 213000000, India: 1400000000, China: 1410000000,
    "South Africa": 60000000, Australia: 26000000,
    Canada: 38000000, Mexico: 129000000, Nigeria: 220000000,
    Indonesia: 274000000, Russia: 146000000,
    "South Korea": 52000000, Italy: 60000000,
    Spain: 47000000, Kenya: 54000000, Egypt: 104000000,
  };
  const rows: string[][] = [];

  for (let year = 2015; year <= 2025; year++) {
    for (const country of countries) {
      for (const disease of diseases.slice(
        0, 3 + Math.floor(rand() * 5)
      )) {
        const pop = populations[country];
        const cases = Math.floor(rand() * (pop / 1000));
        const deaths = Math.floor(cases * rand() * 0.05);
        const incidence = ((cases / pop) * 100000).toFixed(2);
        const vaccination = (40 + rand() * 55).toFixed(1);
        const healthIndex = (30 + rand() * 70).toFixed(1);

        rows.push([
          country, regions[country], year.toString(), disease,
          cases.toString(), deaths.toString(), pop.toString(),
          incidence, vaccination, healthIndex,
        ]);
      }
    }
  }
  return toCSV(headers, rows);
}

// ── Economic / IMF Data ──
export function generateEconomicData(): string {
  const rand = mulberry32(303);
  const countries = [
    "United States", "China", "Japan", "Germany", "India",
    "United Kingdom", "France", "Italy", "Brazil", "Canada",
    "South Korea", "Australia", "Spain", "Mexico", "Indonesia",
    "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", "Poland",
  ];
  const baseGDP: Record<string, number> = {
    "United States": 25000, China: 18000, Japan: 5000,
    Germany: 4200, India: 3500, "United Kingdom": 3100,
    France: 2800, Italy: 2100, Brazil: 1900, Canada: 2100,
    "South Korea": 1800, Australia: 1700, Spain: 1400,
    Mexico: 1300, Indonesia: 1200, Netherlands: 1000,
    "Saudi Arabia": 1100, Turkey: 900, Switzerland: 800, Poland: 700,
  };
  const headers = [
    "Country", "Year", "GDP_Billion_USD", "GDP_Growth_Pct",
    "Inflation_Pct", "Unemployment_Pct", "Trade_Balance_B_USD",
    "Govt_Debt_Pct_GDP", "Interest_Rate_Pct", "Population_Millions",
    "GDP_Per_Capita_USD", "Current_Account_Pct_GDP",
  ];
  const rows: string[][] = [];

  for (let year = 2010; year <= 2025; year++) {
    for (const country of countries) {
      const base = baseGDP[country];
      const growth = -2 + rand() * 10;
      const gdp = base * (1 + (year - 2020) * 0.03) * (0.9 + rand() * 0.2);
      const inflation = 0.5 + rand() * 8;
      const unemployment = 2 + rand() * 12;
      const trade = -200 + rand() * 400;
      const debt = 30 + rand() * 100;
      const rate = rand() * 8;
      const pop = 5 + rand() * 300;
      const gdpPC = ((gdp * 1e9) / (pop * 1e6)).toFixed(0);
      const currentAccount = -5 + rand() * 15;

      rows.push([
        country, year.toString(), gdp.toFixed(1), growth.toFixed(2),
        inflation.toFixed(2), unemployment.toFixed(1), trade.toFixed(1),
        debt.toFixed(1), rate.toFixed(2), pop.toFixed(1),
        gdpPC, currentAccount.toFixed(2),
      ]);
    }
  }
  return toCSV(headers, rows);
}

// ── Climate Data ──
export function generateClimateData(): string {
  const rand = mulberry32(404);
  const headers = [
    "Year", "Month", "Global_Temp_Anomaly_C", "CO2_PPM",
    "Sea_Level_mm", "Arctic_Ice_Extent_M_km2",
    "Ocean_Heat_Content_ZJ", "Methane_PPB",
    "NOx_PPB", "Solar_Irradiance_W_m2",
  ];
  const rows: string[][] = [];

  for (let year = 2000; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const yearFrac = year - 2000 + month / 12;
      const temp = (0.5 + yearFrac * 0.02 + Math.sin(month * 0.52) * 0.15 + rand() * 0.1).toFixed(3);
      const co2 = (370 + yearFrac * 2.5 + Math.sin(month * 0.52) * 3 + rand() * 1).toFixed(1);
      const sea = (yearFrac * 3.3 + rand() * 2).toFixed(1);
      const ice = (12 - yearFrac * 0.06 - Math.cos(month * 0.52) * 4 + rand() * 0.5).toFixed(2);
      const ohc = (yearFrac * 8 + rand() * 5).toFixed(1);
      const methane = (1750 + yearFrac * 5 + rand() * 10).toFixed(0);
      const nox = (315 + yearFrac * 1 + rand() * 3).toFixed(1);
      const solar = (1360 + rand() * 2 - 1).toFixed(2);

      rows.push([
        year.toString(),
        month.toString().padStart(2, "0"),
        temp, co2, sea, ice, ohc, methane, nox, solar,
      ]);
    }
  }
  return toCSV(headers, rows);
}

// ── Social Sentiment Data ──
export function generateSentimentData(): string {
  const rand = mulberry32(505);
  const topics = [
    "Economy", "Technology", "Climate", "Healthcare",
    "Education", "Politics", "Entertainment", "Sports",
    "Cryptocurrency", "AI",
  ];
  const platforms = ["Twitter/X", "Reddit", "Facebook", "TikTok"];
  const headers = [
    "Date", "Platform", "Topic", "Total_Posts",
    "Positive_Pct", "Negative_Pct", "Neutral_Pct",
    "Avg_Sentiment_Score", "Engagement_Rate",
    "Top_Hashtag", "Sample_Size",
  ];
  const rows: string[][] = [];
  const startDate = new Date("2024-06-01");

  for (let day = 0; day < 365; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    for (const platform of platforms) {
      for (const topic of topics.slice(0, 3 + Math.floor(rand() * 7))) {
        const total = Math.floor(10000 + rand() * 500000);
        const positive = 20 + rand() * 50;
        const negative = 10 + rand() * 30;
        const neutral = 100 - positive - negative;
        const sentiment = ((positive - negative) / 50).toFixed(3);
        const engagement = (rand() * 15).toFixed(2);
        const hashtag = `#${topic.replace(/\//g, "")}${Math.floor(rand() * 100)}`;
        const sample = Math.floor(total * (0.01 + rand() * 0.05));

        rows.push([
          dateStr, platform, topic, total.toString(),
          positive.toFixed(1), negative.toFixed(1), neutral.toFixed(1),
          sentiment, engagement, hashtag, sample.toString(),
        ]);
      }
    }
  }
  return toCSV(headers, rows);
}

// ── Census / Government Data ──
export function generateCensusData(): string {
  const rand = mulberry32(606);
  const states = [
    "California", "Texas", "Florida", "New York", "Pennsylvania",
    "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
    "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts",
    "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin",
    "Colorado", "Minnesota", "South Carolina", "Alabama", "Louisiana",
    "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah",
  ];
  const headers = [
    "State", "County", "Year", "Population", "Median_Household_Income",
    "Poverty_Rate_Pct", "Bachelors_Degree_Pct", "Unemployment_Rate_Pct",
    "Median_Home_Value", "Health_Insurance_Pct",
    "Median_Age", "Housing_Units",
  ];
  const rows: string[][] = [];
  const counties = [
    "Central", "North", "South", "East", "West",
    "Metro", "Valley", "Lake", "River", "Mountain",
  ];

  for (const state of states) {
    for (let c = 0; c < 5; c++) {
      for (let year = 2018; year <= 2024; year++) {
        const pop = Math.floor(50000 + rand() * 2000000);
        const income = Math.floor(35000 + rand() * 80000);
        const poverty = (5 + rand() * 25).toFixed(1);
        const education = (15 + rand() * 50).toFixed(1);
        const unemp = (2 + rand() * 10).toFixed(1);
        const homeVal = Math.floor(100000 + rand() * 800000);
        const insurance = (80 + rand() * 18).toFixed(1);
        const medAge = (25 + rand() * 25).toFixed(1);
        const housing = Math.floor(pop * (0.35 + rand() * 0.1));

        rows.push([
          state,
          `${counties[c]} County`,
          year.toString(),
          pop.toString(),
          income.toString(),
          poverty,
          education,
          unemp,
          homeVal.toString(),
          insurance,
          medAge,
          housing.toString(),
        ]);
      }
    }
  }
  return toCSV(headers, rows);
}

// ── DeFi Protocol Data ──
export function generateDefiData(): string {
  const rand = mulberry32(707);
  const protocols = [
    "Uniswap", "Aave", "Compound", "MakerDAO", "Curve",
    "SushiSwap", "PancakeSwap", "Lido", "Convex", "dYdX",
    "Balancer", "Yearn", "Synthetix", "Bancor", "1inch",
  ];
  const chains = ["Ethereum", "BSC", "Polygon", "Arbitrum", "Optimism"];
  const headers = [
    "Date", "Protocol", "Chain", "TVL_USD", "Volume_24h_USD",
    "Fees_24h_USD", "Users_24h", "APY_Avg_Pct",
    "Token_Price_USD", "Market_Cap_USD", "Revenue_7d_USD",
  ];
  const rows: string[][] = [];
  const startDate = new Date("2024-01-01");

  for (let day = 0; day < 365; day += 1) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    for (const protocol of protocols) {
      const chain = chains[Math.floor(rand() * chains.length)];
      const tvl = Math.floor(100000000 + rand() * 5000000000);
      const vol = Math.floor(tvl * (0.01 + rand() * 0.1));
      const fees = Math.floor(vol * rand() * 0.003);
      const users = Math.floor(100 + rand() * 50000);
      const apy = (0.5 + rand() * 30).toFixed(2);
      const tokenPrice = (0.1 + rand() * 50).toFixed(4);
      const marketCap = Math.floor(parseFloat(tokenPrice) * (10000000 + rand() * 1000000000));
      const revenue = Math.floor(fees * 7 * (0.5 + rand() * 0.5));

      rows.push([
        dateStr, protocol, chain, tvl.toString(),
        vol.toString(), fees.toString(), users.toString(),
        apy, tokenPrice, marketCap.toString(), revenue.toString(),
      ]);
    }
  }
  return toCSV(headers, rows);
}

// ── World Bank Development Data ──
export function generateWorldBankData(): string {
  const rand = mulberry32(808);
  const countries = [
    "United States", "China", "India", "Germany", "Japan",
    "Brazil", "United Kingdom", "France", "Italy", "Canada",
    "South Korea", "Australia", "Spain", "Mexico", "Indonesia",
    "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", "Poland",
    "Argentina", "Thailand", "Nigeria", "Egypt", "South Africa",
    "Vietnam", "Bangladesh", "Philippines", "Pakistan", "Colombia",
  ];
  const headers = [
    "Country", "Country_Code", "Year",
    "GDP_Current_USD", "GNI_Per_Capita_USD",
    "Life_Expectancy", "Literacy_Rate_Pct",
    "CO2_Emissions_MT", "Internet_Users_Pct",
    "Mobile_Subscriptions_Per_100", "Renewable_Energy_Pct",
    "Research_Expenditure_Pct_GDP", "Education_Expenditure_Pct_GDP",
    "Foreign_Direct_Investment_USD",
  ];
  const codes: Record<string, string> = {
    "United States": "USA", China: "CHN", India: "IND",
    Germany: "DEU", Japan: "JPN", Brazil: "BRA",
    "United Kingdom": "GBR", France: "FRA", Italy: "ITA",
    Canada: "CAN", "South Korea": "KOR", Australia: "AUS",
    Spain: "ESP", Mexico: "MEX", Indonesia: "IDN",
    Netherlands: "NLD", "Saudi Arabia": "SAU", Turkey: "TUR",
    Switzerland: "CHE", Poland: "POL", Argentina: "ARG",
    Thailand: "THA", Nigeria: "NGA", Egypt: "EGY",
    "South Africa": "ZAF", Vietnam: "VNM", Bangladesh: "BGD",
    Philippines: "PHL", Pakistan: "PAK", Colombia: "COL",
  };
  const rows: string[][] = [];

  for (let year = 2000; year <= 2025; year++) {
    for (const country of countries) {
      const yf = year - 2000;
      const gdp = (100 + rand() * 25000 + yf * (50 + rand() * 200)) * 1e9;
      const gni = Math.floor(1000 + rand() * 60000 + yf * 200);
      const life = (55 + rand() * 30 + yf * 0.1).toFixed(1);
      const literacy = Math.min(99.9, 50 + rand() * 49 + yf * 0.3).toFixed(1);
      const co2 = (10 + rand() * 5000 + yf * 10).toFixed(1);
      const internet = Math.min(98, 5 + rand() * 40 + yf * 3).toFixed(1);
      const mobile = (20 + rand() * 130 + yf * 2).toFixed(1);
      const renewable = (5 + rand() * 45).toFixed(1);
      const research = (0.2 + rand() * 3.5).toFixed(2);
      const education = (2 + rand() * 6).toFixed(2);
      const fdi = (rand() * 50e9).toFixed(0);

      rows.push([
        country,
        codes[country] || "UNK",
        year.toString(),
        gdp.toFixed(0),
        gni.toString(),
        life,
        literacy,
        co2,
        internet,
        mobile,
        renewable,
        research,
        education,
        fdi,
      ]);
    }
  }
  return toCSV(headers, rows);
}

// ── NLP Benchmark Data ──
export function generateNLPData(): string {
  const rand = mulberry32(909);
  const languages = [
    "English", "Spanish", "French", "German", "Chinese",
    "Japanese", "Korean", "Arabic", "Hindi", "Portuguese",
    "Russian", "Italian", "Dutch", "Turkish", "Polish",
    "Swedish", "Thai", "Vietnamese", "Indonesian", "Greek",
  ];
  const tasks = [
    "Sentiment Analysis", "NER", "POS Tagging",
    "Text Classification", "Machine Translation",
    "Question Answering", "Summarization",
  ];
  const models = [
    "BERT-Base", "mBERT", "XLM-R-Base", "XLM-R-Large",
    "GPT-3.5", "LLaMA-2-7B", "Mistral-7B",
  ];
  const headers = [
    "Language", "Task", "Model", "Accuracy_Pct",
    "F1_Score", "Training_Samples", "Eval_Samples",
    "Inference_Time_ms", "Model_Size_MB", "BLEU_Score",
  ];
  const rows: string[][] = [];

  for (const lang of languages) {
    for (const task of tasks) {
      for (const model of models) {
        const acc = (60 + rand() * 38).toFixed(2);
        const f1 = (55 + rand() * 42).toFixed(3);
        const trainSamples = Math.floor(10000 + rand() * 500000);
        const evalSamples = Math.floor(1000 + rand() * 50000);
        const inference = (5 + rand() * 200).toFixed(1);
        const modelSize = Math.floor(100 + rand() * 2000);
        const bleu = (20 + rand() * 60).toFixed(2);

        rows.push([
          lang, task, model, acc, f1,
          trainSamples.toString(), evalSamples.toString(),
          inference, modelSize.toString(), bleu,
        ]);
      }
    }
  }
  return toCSV(headers, rows);
}

// ── Real Estate Data ──
export function generateRealEstateData(): string {
  const rand = mulberry32(1010);
  const cities = [
    "New York", "London", "Tokyo", "Sydney", "Singapore",
    "Hong Kong", "Dubai", "Paris", "Toronto", "San Francisco",
    "Los Angeles", "Berlin", "Shanghai", "Mumbai", "São Paulo",
    "Amsterdam", "Seoul", "Melbourne", "Zurich", "Stockholm",
  ];
  const propertyTypes = ["Residential", "Commercial", "Industrial"];
  const headers = [
    "City", "Country", "Property_Type", "Year", "Quarter",
    "Avg_Price_Per_SqM_USD", "Rental_Yield_Pct",
    "Price_Change_YoY_Pct", "Transaction_Volume",
    "Vacancy_Rate_Pct", "Construction_Permits",
    "Mortgage_Rate_Pct",
  ];
  const cityCountry: Record<string, string> = {
    "New York": "USA", London: "UK", Tokyo: "Japan",
    Sydney: "Australia", Singapore: "Singapore",
    "Hong Kong": "China", Dubai: "UAE", Paris: "France",
    Toronto: "Canada", "San Francisco": "USA",
    "Los Angeles": "USA", Berlin: "Germany",
    Shanghai: "China", Mumbai: "India", "São Paulo": "Brazil",
    Amsterdam: "Netherlands", Seoul: "South Korea",
    Melbourne: "Australia", Zurich: "Switzerland",
    Stockholm: "Sweden",
  };
  const rows: string[][] = [];

  for (let year = 2018; year <= 2025; year++) {
    for (let q = 1; q <= 4; q++) {
      for (const city of cities) {
        for (const pt of propertyTypes) {
          const basePrice =
            pt === "Commercial" ? 5000 + rand() * 30000
              : pt === "Industrial" ? 500 + rand() * 5000
                : 2000 + rand() * 20000;
          const price = basePrice * (1 + (year - 2018) * 0.04 + rand() * 0.1);
          const rental = (2 + rand() * 8).toFixed(2);
          const priceChange = (-5 + rand() * 15).toFixed(1);
          const volume = Math.floor(100 + rand() * 10000);
          const vacancy = (2 + rand() * 15).toFixed(1);
          const permits = Math.floor(50 + rand() * 5000);
          const mortgage = (1 + rand() * 7).toFixed(2);

          rows.push([
            city, cityCountry[city], pt,
            year.toString(), `Q${q}`,
            price.toFixed(0), rental, priceChange,
            volume.toString(), vacancy,
            permits.toString(), mortgage,
          ]);
        }
      }
    }
  }
  return toCSV(headers, rows);
}

// ── Write all samples to disk ──
export function writeSampleFiles(): Record<string, { csv: string; json: string }> {
  const generators: Record<
    string,
    { fn: () => string; name: string }
  > = {
    stock_market: { fn: generateStockData, name: "global_stock_market" },
    crypto: { fn: generateCryptoData, name: "bitcoin_ethereum_prices" },
    health: { fn: generateHealthData, name: "who_disease_surveillance" },
    economic: { fn: generateEconomicData, name: "imf_economic_indicators" },
    climate: { fn: generateClimateData, name: "nasa_climate_data" },
    sentiment: { fn: generateSentimentData, name: "social_sentiment_analysis" },
    census: { fn: generateCensusData, name: "us_census_data" },
    defi: { fn: generateDefiData, name: "defi_protocol_analytics" },
    worldbank: { fn: generateWorldBankData, name: "world_bank_development" },
    nlp: { fn: generateNLPData, name: "multilingual_nlp_benchmark" },
    realestate: { fn: generateRealEstateData, name: "global_real_estate" },
  };

  const result: Record<string, { csv: string; json: string }> = {};

  for (const [key, { fn, name }] of Object.entries(generators)) {
    const csvData = fn();
    const csvPath = path.join(SAMPLES_DIR, `${name}.csv`);
    fs.writeFileSync(csvPath, csvData, "utf-8");

    // Also write JSON version
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const jsonRows = lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) =>
        v.startsWith('"') ? v.slice(1, -1) : v
      );
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = vals[i] || ""));
      return obj;
    });
    const jsonPath = path.join(SAMPLES_DIR, `${name}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonRows, null, 2), "utf-8");

    result[key] = { csv: csvPath, json: jsonPath };
  }

  return result;
}

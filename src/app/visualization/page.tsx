"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const chartTypes = [
  { id: "line", name: "Line Chart", icon: "M3 20L7 12L11 16L15 8L21 4" },
  { id: "bar", name: "Bar Chart", icon: "M12 20V10M18 20V4M6 20v-4" },
  { id: "heatmap", name: "Heatmap", icon: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" },
  { id: "scatter", name: "Scatter Plot", icon: "M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M5 5m-1 0a1 1 0 102 0 1 1 0 10-2 0M19 7m-1 0a1 1 0 102 0 1 1 0 10-2 0M8 17m-1 0a1 1 0 102 0 1 1 0 10-2 0M17 15m-1 0a1 1 0 102 0 1 1 0 10-2 0" },
];

// SVG-based chart previews for a futuristic look
function LineChartPreview() {
  return (
    <svg viewBox="0 0 500 250" className="w-full h-full">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[50, 100, 150, 200].map((y) => (
        <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.05)" />
      ))}
      {/* Area fill */}
      <path d="M40 200 L100 160 L160 180 L220 120 L280 140 L340 80 L400 100 L460 50 L460 200 Z" fill="url(#lineGrad)" />
      <path d="M40 200 L100 190 L160 170 L220 150 L280 160 L340 120 L400 130 L460 90 L460 200 Z" fill="url(#lineGrad2)" />
      {/* Lines */}
      <polyline
        points="40,200 100,160 160,180 220,120 280,140 340,80 400,100 460,50"
        fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeLinejoin="round"
      />
      <polyline
        points="40,200 100,190 160,170 220,150 280,160 340,120 400,130 460,90"
        fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Dots */}
      {[{x:40,y:200},{x:100,y:160},{x:160,y:180},{x:220,y:120},{x:280,y:140},{x:340,y:80},{x:400,y:100},{x:460,y:50}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00d4ff" stroke="#050510" strokeWidth="2" />
      ))}
      {/* Labels */}
      <text x="40" y="230" fill="#666" fontSize="10" fontFamily="monospace">Jan</text>
      <text x="160" y="230" fill="#666" fontSize="10" fontFamily="monospace">Mar</text>
      <text x="280" y="230" fill="#666" fontSize="10" fontFamily="monospace">May</text>
      <text x="400" y="230" fill="#666" fontSize="10" fontFamily="monospace">Jul</text>
    </svg>
  );
}

function BarChartPreview() {
  const bars = [
    { h: 140, color: "#00d4ff" }, { h: 180, color: "#a855f7" },
    { h: 100, color: "#06ffc7" }, { h: 200, color: "#00d4ff" },
    { h: 160, color: "#a855f7" }, { h: 120, color: "#06ffc7" },
    { h: 190, color: "#00d4ff" }, { h: 80, color: "#a855f7" },
  ];
  return (
    <svg viewBox="0 0 500 250" className="w-full h-full">
      {bars.map((b, i) => (
        <g key={i}>
          <rect
            x={45 + i * 57}
            y={220 - b.h}
            width="40"
            height={b.h}
            fill={b.color}
            opacity="0.7"
            rx="4"
          />
          <rect
            x={45 + i * 57}
            y={220 - b.h}
            width="40"
            height={b.h}
            fill={`url(#barGrad${i % 2})`}
            rx="4"
          />
        </g>
      ))}
      <defs>
        <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <line x1="40" y1="220" x2="500" y2="220" stroke="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function HeatmapPreview() {
  const colors = ["#0a0a2e", "#1a1a5e", "#00407a", "#006090", "#0090b0", "#00c4dd", "#00d4ff", "#a855f7"];
  return (
    <svg viewBox="0 0 500 250" className="w-full h-full">
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={25 + col * 38}
            y={10 + row * 28}
            width="34"
            height="24"
            fill={colors[Math.floor(Math.random() * colors.length)]}
            rx="3"
            opacity="0.8"
          />
        ))
      )}
    </svg>
  );
}

function ScatterPreview() {
  const points = Array.from({ length: 40 }, () => ({
    x: 30 + Math.random() * 440,
    y: 20 + Math.random() * 200,
    r: 3 + Math.random() * 5,
    color: Math.random() > 0.5 ? "#00d4ff" : "#a855f7",
  }));
  return (
    <svg viewBox="0 0 500 250" className="w-full h-full">
      {[50, 100, 150, 200].map((y) => (
        <line key={y} x1="30" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.03)" />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity="0.6" />
      ))}
    </svg>
  );
}

const chartComponents: Record<string, () => React.JSX.Element> = {
  line: LineChartPreview,
  bar: BarChartPreview,
  heatmap: HeatmapPreview,
  scatter: ScatterPreview,
};

export default function VisualizationPage() {
  const [activeChart, setActiveChart] = useState("line");
  const ChartComponent = chartComponents[activeChart];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Data <span className="gradient-text">Visualization</span>
          </h1>
          <p className="text-gray-400">
            Preview and explore interactive visualizations of popular datasets
          </p>
        </motion.div>

        {/* Chart type selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveChart(type.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeChart === type.id
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 neon-glow"
                  : "glass text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={type.icon} />
              </svg>
              {type.name}
            </button>
          ))}
        </motion.div>

        {/* Chart display */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Global Stock Market Trends (2024–2025)
              </h3>
              <p className="text-sm text-gray-400">
                Source: Global Stock Market Historical Data
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-gray-400 hover:text-white transition-colors">
                Export PNG
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-gray-400 hover:text-white transition-colors">
                Export SVG
              </button>
            </div>
          </div>

          <div className="aspect-[2/1] rounded-xl bg-surface/50 p-4">
            <ChartComponent />
          </div>
        </motion.div>

        {/* Available visualizations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Cryptocurrency Market Cap Over Time",
              desc: "Track the rise and fall of major cryptocurrencies",
              type: "Line Chart",
            },
            {
              title: "Disease Prevalence by Region",
              desc: "WHO disease surveillance heatmap",
              type: "Heatmap",
            },
            {
              title: "GDP Growth Comparison (Top 20 Economies)",
              desc: "IMF economic indicators visualization",
              type: "Bar Chart",
            },
            {
              title: "Social Media Sentiment Distribution",
              desc: "NLP sentiment analysis scatter plot",
              type: "Scatter Plot",
            },
          ].map((viz, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 card-hover cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-neon-blue transition-colors">
                    {viz.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{viz.desc}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                  {viz.type}
                </span>
              </div>
              <div className="h-32 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 20L7 12L11 16L15 8L21 4" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

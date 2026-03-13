"use client";

import { motion } from "framer-motion";
import { datasets, formatNumber } from "../data/datasets";

export default function LeaderboardSection() {
  const sorted = [...datasets].sort((a, b) => b.downloads - a.downloads);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Dataset <span className="gradient-text">Leaderboard</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Top datasets ranked by community downloads and engagement
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-sm font-medium text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Dataset</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-right">Downloads</div>
            <div className="col-span-2 text-right">Size</div>
          </div>

          {/* Rows */}
          {sorted.slice(0, 8).map((ds, i) => {
            const medals = ["text-yellow-400", "text-gray-300", "text-amber-600"];
            return (
              <div
                key={ds.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="col-span-1">
                  <span className={`font-bold text-lg ${medals[i] || "text-gray-500"}`}>
                    #{i + 1}
                  </span>
                </div>
                <div className="col-span-5">
                  <p className="text-white font-medium text-sm truncate">{ds.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ds.source}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                    {ds.category}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-mono text-neon-blue">
                    {formatNumber(ds.downloads)}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm text-gray-400">{ds.size}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

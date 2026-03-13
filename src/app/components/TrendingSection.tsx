"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatasetCard from "./DatasetCard";
import { type Dataset } from "../data/datasets";
import Link from "next/link";

export default function TrendingSection() {
  const [trending, setTrending] = useState<Dataset[]>([]);

  useEffect(() => {
    fetch("/api/datasets?trending=true&limit=6")
      .then((r) => r.json())
      .then((data) => setTrending(data.datasets || []))
      .catch(() => setTrending([]));
  }, []);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Trending <span className="gradient-text">Datasets</span>
            </h2>
            <p className="text-gray-400">
              Most popular datasets this week across all categories
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden sm:flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors text-sm font-medium"
          >
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Dataset grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.slice(0, 6).map((dataset, i) => (
            <DatasetCard key={dataset.id} dataset={dataset} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

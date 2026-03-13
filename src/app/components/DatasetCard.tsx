"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Dataset, formatNumber, getSourceColor } from "../data/datasets";

interface DatasetCardProps {
  dataset: Dataset;
  index: number;
}

export default function DatasetCard({ dataset, index }: DatasetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/dataset/${dataset.id}`} className="block h-full">
        <div className="glass rounded-2xl p-6 h-full card-hover group relative overflow-hidden">
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

          <div className="relative z-10">
            {/* Top row: source + trending */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: getSourceColor(dataset.source),
                  background: `${getSourceColor(dataset.source)}15`,
                  border: `1px solid ${getSourceColor(dataset.source)}30`,
                }}
              >
                {dataset.source}
              </span>
              {dataset.trending && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors line-clamp-2">
              {dataset.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
              {dataset.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {dataset.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5"
                >
                  {tag}
                </span>
              ))}
              {dataset.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-md text-gray-500">
                  +{dataset.tags.length - 3}
                </span>
              )}
            </div>

            {/* Formats */}
            <div className="flex gap-1.5 mb-4">
              {dataset.formats.map((fmt) => (
                <span
                  key={fmt}
                  className="text-xs font-mono px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                >
                  {fmt}
                </span>
              ))}
            </div>

            {/* Bottom stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {formatNumber(dataset.downloads)}
                </span>
                <span>{dataset.size}</span>
              </div>
              <span className="text-xs text-gray-500">{dataset.lastUpdated}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

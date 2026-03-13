"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "../data/datasets";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

const sources = ["All", "Kaggle", "Government", "Research"];
const formats = ["All", "CSV", "JSON", "Parquet", "Excel"];

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSource,
  onSourceChange,
  selectedFormat,
  onFormatChange,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="glass rounded-2xl p-1.5 neon-glow">
          <div className="flex items-center">
            <div className="pl-4 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search datasets by name, category, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-lg"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 mr-1 rounded-xl text-sm font-medium transition-all ${
                showFilters
                  ? "bg-neon-blue/20 text-neon-blue"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                  <circle cx="6" cy="12" r="2" fill="currentColor" />
                  <circle cx="10" cy="18" r="2" fill="currentColor" />
                </svg>
                Filters
              </span>
            </button>
            <button className="btn-gradient px-6 py-2.5 rounded-xl text-white font-medium text-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === "All"
                      ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                      : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => onCategoryChange(cat.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.name
                        ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                        : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Source
              </label>
              <div className="flex flex-wrap gap-2">
                {sources.map((src) => (
                  <button
                    key={src}
                    onClick={() => onSourceChange(src)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSource === src
                        ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
                        : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                File Format
              </label>
              <div className="flex flex-wrap gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => onFormatChange(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedFormat === fmt
                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                        : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

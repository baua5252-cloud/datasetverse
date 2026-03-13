"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SearchFilter from "../components/SearchFilter";
import DatasetCard from "../components/DatasetCard";
import { type Dataset } from "../data/datasets";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [externalResults, setExternalResults] = useState<Dataset[]>([]);
  const [searchingExternal, setSearchingExternal] = useState(false);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedSource !== "All" && selectedSource !== "Kaggle API" && selectedSource !== "Government API")
        params.set("source", selectedSource);

      const res = await fetch(`/api/datasets?${params}`);
      const data = await res.json();

      let filtered = data.datasets || [];
      if (selectedFormat !== "All") {
        filtered = filtered.filter((d: Dataset) =>
          d.formats.some((f) => f === selectedFormat)
        );
      }
      setDatasets(filtered);
      setTotal(data.total || 0);
    } catch {
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSource, selectedFormat]);

  useEffect(() => {
    const timer = setTimeout(fetchDatasets, 300);
    return () => clearTimeout(timer);
  }, [fetchDatasets]);

  // Search external sources
  const searchExternal = async (source: "kaggle" | "government") => {
    if (!searchQuery.trim()) return;
    setSearchingExternal(true);
    try {
      const endpoint =
        source === "kaggle"
          ? `/api/external/kaggle?search=${encodeURIComponent(searchQuery)}`
          : `/api/external/government?search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setExternalResults(data.datasets || []);
    } catch {
      setExternalResults([]);
    } finally {
      setSearchingExternal(false);
    }
  };

  const allDatasets = [...datasets, ...externalResults];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Explore <span className="gradient-text">Datasets</span>
          </h1>
          <p className="text-gray-400">
            Search and filter across {total.toLocaleString()}+ datasets from multiple sources
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
          />
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            Showing <span className="text-white font-medium">{allDatasets.length}</span> datasets
            {loading && <span className="ml-2 text-neon-blue animate-pulse">Loading...</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => searchExternal("kaggle")}
              disabled={searchingExternal || !searchQuery.trim()}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#20BEFF]/10 text-[#20BEFF] border border-[#20BEFF]/20 hover:bg-[#20BEFF]/20 disabled:opacity-40 transition-colors"
            >
              {searchingExternal ? "Searching..." : "Search Kaggle"}
            </button>
            <button
              onClick={() => searchExternal("government")}
              disabled={searchingExternal || !searchQuery.trim()}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
            >
              {searchingExternal ? "Searching..." : "Search Gov Data"}
            </button>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-neon-blue/50">
              <option value="popular">Most Popular</option>
              <option value="recent">Recently Updated</option>
              <option value="downloads">Most Downloads</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results grid */}
        {allDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDatasets.map((dataset, i) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={i} />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full glass mx-auto mb-6 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No datasets found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

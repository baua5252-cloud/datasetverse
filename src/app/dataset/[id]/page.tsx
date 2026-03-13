"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  type Dataset,
  type ResearchPaper,
  formatNumber,
  getSourceColor,
} from "../../data/datasets";

interface DatasetDetail {
  dataset: Dataset;
  papers: ResearchPaper[];
  uploader: string | null;
  preview: { columns: string[]; rows: string[][] };
}

export default function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`/api/datasets/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (format: string) => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/datasets/${id}/download?format=${format}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dataset_${id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Dataset Not Found</h1>
          <p className="text-gray-400 mb-6">The dataset you are looking for does not exist.</p>
          <Link href="/explore" className="btn-gradient px-6 py-3 rounded-xl text-white font-medium">
            Browse Datasets
          </Link>
        </div>
      </div>
    );
  }

  const { dataset, papers, preview, uploader } = data;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link href="/" className="hover:text-neon-blue transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-neon-blue transition-colors">Explore</Link>
          <span>/</span>
          <span className="text-gray-300">{dataset.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    color: getSourceColor(dataset.source),
                    background: `${getSourceColor(dataset.source)}15`,
                    border: `1px solid ${getSourceColor(dataset.source)}30`,
                  }}
                >
                  {dataset.source}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                  {dataset.category}
                </span>
                {dataset.trending && (
                  <span className="text-sm px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Trending
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{dataset.title}</h1>
              <p className="text-gray-400 leading-relaxed text-lg">{dataset.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {dataset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Data Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-white mb-4">Data Preview</h2>
              {preview.columns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {preview.columns.map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-gray-400 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-4 text-gray-300 font-mono text-xs">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No preview available</p>
              )}
              <p className="text-xs text-gray-500 mt-4">
                Showing {preview.rows.length} of {dataset.rows?.toLocaleString()} rows &middot; {dataset.columns} columns
                {uploader && <span> &middot; Uploaded by <span className="text-neon-blue">{uploader}</span></span>}
              </p>
            </motion.div>

            {/* Research Papers */}
            {papers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  Related Research Papers
                </h2>
                <div className="space-y-4">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                    >
                      <h3 className="text-white font-semibold mb-2">{paper.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{paper.abstract}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {paper.authors.join(", ")} &middot; {paper.journal} &middot; {paper.publishedDate}
                        </div>
                        <button className="text-xs text-neon-blue hover:text-neon-cyan transition-colors font-medium">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 sticky top-24"
            >
              <button
                onClick={() => handleDownload("csv")}
                disabled={downloading}
                className="btn-gradient w-full py-3.5 rounded-xl text-white font-semibold text-lg mb-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {downloading ? "Downloading..." : "Download CSV"}
              </button>

              <button
                onClick={() => handleDownload("json")}
                disabled={downloading}
                className="btn-outline w-full py-3 rounded-xl font-medium text-sm mb-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {downloading ? "Downloading..." : "Download JSON"}
              </button>

              {/* Stats */}
              <div className="space-y-4">
                {[
                  { label: "Downloads", value: formatNumber(dataset.downloads) },
                  { label: "File Size", value: dataset.size },
                  { label: "Rows", value: dataset.rows?.toLocaleString() || "N/A" },
                  { label: "Columns", value: dataset.columns?.toString() || "N/A" },
                  { label: "Last Updated", value: dataset.lastUpdated },
                  { label: "License", value: dataset.license },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <span className="text-sm text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Formats */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Available Formats</h4>
                <div className="flex gap-2">
                  {dataset.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="text-sm font-mono px-3 py-1.5 rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

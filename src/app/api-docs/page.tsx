"use client";

import { motion } from "framer-motion";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/datasets",
    description: "List all datasets with pagination and filtering",
    params: [
      { name: "page", type: "integer", desc: "Page number (default: 1)" },
      { name: "limit", type: "integer", desc: "Results per page (default: 20, max: 100)" },
      { name: "category", type: "string", desc: "Filter by category" },
      { name: "source", type: "string", desc: "Filter by source" },
      { name: "search", type: "string", desc: "Full-text search query" },
      { name: "sort", type: "string", desc: "Sort by: downloads, updated, name" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/datasets/:id",
    description: "Get detailed information about a specific dataset",
    params: [
      { name: "id", type: "string", desc: "Dataset unique identifier" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/datasets/:id/download",
    description: "Download a dataset file",
    params: [
      { name: "id", type: "string", desc: "Dataset unique identifier" },
      { name: "format", type: "string", desc: "Preferred format: csv, json, parquet" },
    ],
  },
  {
    method: "POST",
    path: "/api/v1/datasets",
    description: "Upload a new dataset (requires authentication)",
    params: [
      { name: "title", type: "string", desc: "Dataset title (required)" },
      { name: "description", type: "string", desc: "Dataset description (required)" },
      { name: "category", type: "string", desc: "Dataset category (required)" },
      { name: "file", type: "file", desc: "Dataset file upload (required)" },
      { name: "tags", type: "string[]", desc: "Array of tags" },
      { name: "license", type: "string", desc: "License type" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    description: "List all available categories with dataset counts",
    params: [],
  },
  {
    method: "GET",
    path: "/api/v1/datasets/:id/papers",
    description: "Get research papers related to a dataset",
    params: [
      { name: "id", type: "string", desc: "Dataset unique identifier" },
    ],
  },
];

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  POST: { bg: "bg-blue-500/10", text: "text-blue-400" },
  PUT: { bg: "bg-amber-500/10", text: "text-amber-400" },
  DELETE: { bg: "bg-red-500/10", text: "text-red-400" },
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            API <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-gray-400 mb-6">
            Access DatasetVerse datasets programmatically via our RESTful API
          </p>

          {/* Base URL */}
          <div className="glass rounded-xl p-4 inline-block">
            <span className="text-sm text-gray-400">Base URL: </span>
            <code className="text-neon-blue font-mono">https://api.datasetverse.io/api/v1</code>
          </div>
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-3">Authentication</h2>
          <p className="text-gray-400 text-sm mb-4">
            Include your API key in the request headers for authenticated endpoints.
          </p>
          <div className="bg-surface rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <span className="text-gray-500">// Header</span>
            <br />
            <span className="text-neon-purple">Authorization</span>
            <span className="text-gray-400">: </span>
            <span className="text-neon-cyan">Bearer YOUR_API_KEY</span>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-6">
          {endpoints.map((ep, i) => {
            const mc = methodColors[ep.method] || methodColors.GET;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`${mc.bg} ${mc.text} text-xs font-bold px-2.5 py-1 rounded-md font-mono`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-white font-mono text-sm">{ep.path}</code>
                </div>
                <p className="text-gray-400 text-sm mb-4">{ep.description}</p>

                {ep.params.length > 0 && (
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {ep.params.map((param) => (
                        <div
                          key={param.name}
                          className="flex items-start gap-4 text-sm py-1.5"
                        >
                          <code className="text-neon-blue font-mono min-w-[100px]">{param.name}</code>
                          <span className="text-neon-purple/70 font-mono text-xs min-w-[60px] mt-0.5">{param.type}</span>
                          <span className="text-gray-400">{param.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Example</h2>
          <div className="bg-surface rounded-xl p-5 font-mono text-sm overflow-x-auto">
            <div className="text-gray-500 mb-2"># Search for climate datasets in Python</div>
            <div>
              <span className="text-neon-purple">import</span>{" "}
              <span className="text-white">requests</span>
            </div>
            <div className="mt-2">
              <span className="text-white">response</span>{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-white">requests.</span>
              <span className="text-neon-cyan">get</span>
              <span className="text-gray-400">(</span>
            </div>
            <div className="pl-4">
              <span className="text-neon-cyan">&quot;https://api.datasetverse.io/api/v1/datasets&quot;</span>
              <span className="text-gray-400">,</span>
            </div>
            <div className="pl-4">
              <span className="text-white">params</span>
              <span className="text-gray-400">=&#123;</span>
              <span className="text-neon-cyan">&quot;category&quot;</span>
              <span className="text-gray-400">: </span>
              <span className="text-neon-cyan">&quot;Climate&quot;</span>
              <span className="text-gray-400">, </span>
              <span className="text-neon-cyan">&quot;limit&quot;</span>
              <span className="text-gray-400">: </span>
              <span className="text-amber-400">10</span>
              <span className="text-gray-400">&#125;</span>
            </div>
            <div>
              <span className="text-gray-400">)</span>
            </div>
            <div className="mt-2">
              <span className="text-white">datasets</span>{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-white">response.</span>
              <span className="text-neon-cyan">json</span>
              <span className="text-gray-400">()</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

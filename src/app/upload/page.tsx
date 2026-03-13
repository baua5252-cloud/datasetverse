"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "../data/datasets";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { user, token, setShowAuth, setAuthTab } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "CC BY 4.0",
  });
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const licenses = [
    "CC BY 4.0",
    "CC BY-NC 4.0",
    "CC0 (Public Domain)",
    "MIT",
    "Apache 2.0",
    "GPL 3.0",
    "Research Only",
    "Open Government",
  ];

  const handleSubmit = async () => {
    if (!user) {
      setAuthTab("login");
      setShowAuth(true);
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("license", formData.license);
      fd.append("tags", formData.tags);
      fd.append("file", file);

      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setSuccess("Dataset uploaded successfully!");
      setTimeout(() => {
        router.push(`/dataset/${data.dataset.id}`);
      }, 1500);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Upload <span className="gradient-text">Dataset</span>
          </h1>
          <p className="text-gray-400">
            Share your dataset with the research community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dataset Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Global Climate Temperature Records 2000-2025"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe your dataset, its contents, methodology, and potential use cases..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors resize-none"
            />
          </div>

          {/* Category & License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
              >
                <option value="" className="bg-surface">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-surface">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
              >
                {licenses.map((lic) => (
                  <option key={lic} value={lic} className="bg-surface">
                    {lic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Comma-separated tags: climate, temperature, nasa, research"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload File <span className="text-red-400">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-neon-blue bg-neon-blue/5"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) setFile(files[0]);
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".csv,.json,.parquet,.xlsx,.xls"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) setFile(files[0]);
                }}
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon-blue">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              {file ? (
                <p className="text-neon-blue font-medium">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
              ) : (
                <>
                  <p className="text-gray-300 font-medium mb-1">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports CSV, JSON, Parquet, Excel (Max 5GB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
              {success}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-gray-500">
              {user ? "By uploading, you agree to our Terms of Service" : "Sign in required to upload"}
            </p>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="btn-gradient px-8 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {uploading ? "Uploading..." : user ? "Upload Dataset" : "Sign In to Upload"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

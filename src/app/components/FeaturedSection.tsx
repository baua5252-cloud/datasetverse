"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatasetCard from "./DatasetCard";
import { type Dataset } from "../data/datasets";

export default function FeaturedSection() {
  const [featured, setFeatured] = useState<Dataset[]>([]);

  useEffect(() => {
    fetch("/api/datasets?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => setFeatured(data.datasets || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <section className="py-20 relative">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Featured <span className="gradient-text-alt">Datasets</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Hand-picked datasets recommended by our AI curation system 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((dataset, i) => (
            <DatasetCard key={dataset.id} dataset={dataset} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

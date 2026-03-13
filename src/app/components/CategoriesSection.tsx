"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { categories } from "../data/datasets";

const iconPaths: Record<string, string> = {
  TrendingUp: "M23 6l-9.5 9.5-5-5L1 18",
  Bitcoin: "M12 2a10 10 0 100 20 10 10 0 000-20zM9 8h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4m0 0h5c1.1 0 2 .9 2 2s-.9 2-2 2H9M12 6v2m0 8v2",
  Heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",
  BarChart3: "M12 20V10M18 20V4M6 20v-4",
  Brain: "M12 2a8 8 0 018 8c0 3-2 5.5-4 7l-4 3-4-3c-2-1.5-4-4-4-7a8 8 0 018-8z",
  Cloud: "M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z",
  Users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  Landmark: "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11",
};

export default function CategoriesSection() {
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
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Explore datasets organized into research domains. Find the data you
            need for your next breakthrough.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="block glass rounded-2xl p-6 card-hover group text-center"
              >
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={iconPaths[cat.icon] || iconPaths.BarChart3} />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-neon-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {cat.count.toLocaleString()} datasets
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

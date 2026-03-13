"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Datasets", href: "/explore" },
  { label: "Categories", href: "/categories" },
  { label: "Upload Dataset", href: "/upload" },
  { label: "Visualization", href: "/visualization" },
  { label: "API", href: "/api-docs" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, setShowAuth, setAuthTab } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5V12C3 13.66 7.03 15 12 15C16.97 15 21 13.66 21 12V5" />
                <path d="M3 12V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V12" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
              DatasetVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  <span className="text-neon-blue font-medium">{user.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setAuthTab("login"); setShowAuth(true); }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { setAuthTab("register"); setShowAuth(true); }}
                  className="btn-gradient px-4 py-2 text-sm font-medium rounded-lg text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm text-gray-300 hover:text-neon-blue rounded-lg hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3 border-t border-white/10">
                {user ? (
                  <>
                    <span className="flex-1 px-4 py-2 text-sm text-neon-blue font-medium text-center">
                      {user.username}
                    </span>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex-1 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthTab("login"); setShowAuth(true); setMobileOpen(false); }}
                      className="flex-1 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 rounded-lg"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { setAuthTab("register"); setShowAuth(true); setMobileOpen(false); }}
                      className="flex-1 btn-gradient px-4 py-2 text-sm font-medium rounded-lg text-white"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

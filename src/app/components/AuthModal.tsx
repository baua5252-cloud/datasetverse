"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

export default function AuthModal() {
  const { showAuth, setShowAuth, authTab, setAuthTab, login, register } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result =
        authTab === "login"
          ? await login(email, password)
          : await register(username, email, password);
      if (result.error) setError(result.error);
      else {
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass rounded-2xl p-8 w-full max-w-md border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-3">
                <svg
                  width="24"
                  height="24"
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
              <h2 className="text-2xl font-bold text-white">
                {authTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {authTab === "login"
                  ? "Sign in to your DatasetVerse account"
                  : "Join the DatasetVerse community"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setAuthTab(tab);
                    setError("");
                  }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    authTab === tab
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authTab === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gradient w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Please wait..."
                  : authTab === "login"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* Demo hint */}
            {authTab === "login" && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Demo account: admin@datasetverse.io / demo123
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

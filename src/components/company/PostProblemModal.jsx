"use client";
import { useState } from "react";
import { X, Layers, ChevronDown, Send, Loader2 } from "lucide-react";

const DOMAINS = [
  "AI", "Web3", "DevOps", "HealthTech", "FinTech",
  "EdTech", "IoT", "Cybersecurity", "Sustainability", "Other",
];

export default function PostProblemModal({ company, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "",
    expectedOutcome: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.domain) {
      setError("Please select a domain.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/company/post-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyId: company._id,
          companyName: company.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post problem.");
        return;
      }
      onSuccess(data.problem);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl glass rounded-2xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Post New Problem</h2>
              <p className="text-white/40 text-xs">Students will submit solutions for this</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Problem Title */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Problem Title *
            </label>
            <input
              id="problem-title"
              name="title"
              type="text"
              placeholder="e.g. Build an AI-powered fraud detection system"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Domain *
            </label>
            <div className="relative">
              <select
                id="problem-domain"
                name="domain"
                value={form.domain}
                onChange={handleChange}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-violet-500/60 transition-all pr-10
                  text-white [&>option]:bg-[#1a1a2e] [&>option]:text-white"
              >
                <option value="" disabled>Select a domain...</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Problem Description *
            </label>
            <textarea
              id="problem-description"
              name="description"
              placeholder="Describe the problem in detail. What is the challenge? What constraints exist?"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/60 transition-all resize-none"
            />
          </div>

          {/* Expected Outcome */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Expected Outcome *
            </label>
            <textarea
              id="problem-expected-outcome"
              name="expectedOutcome"
              placeholder="What does a successful solution look like? What deliverables do you expect?"
              value={form.expectedOutcome}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/60 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              id="submit-problem-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  Post Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

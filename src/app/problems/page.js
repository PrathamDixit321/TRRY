"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Layers, Globe, Clock, Users, ArrowRight, Search,
  Building2, ChevronRight, Zap
} from "lucide-react";

const DOMAIN_COLORS = {
  AI: "from-violet-500 to-purple-600",
  Web3: "from-blue-500 to-cyan-500",
  DevOps: "from-orange-500 to-amber-500",
  HealthTech: "from-rose-500 to-pink-500",
  FinTech: "from-emerald-500 to-teal-500",
  EdTech: "from-yellow-500 to-orange-500",
  IoT: "from-indigo-500 to-blue-500",
  Cybersecurity: "from-red-500 to-rose-600",
  Sustainability: "from-green-500 to-emerald-500",
  Other: "from-gray-500 to-slate-500",
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("All");

  const DOMAINS = ["All", ...Object.keys(DOMAIN_COLORS)];

  useEffect(() => {
    fetch("/api/company/public-problems")
      .then((r) => r.json())
      .then((d) => {
        setProblems(d.problems || []);
        setFiltered(d.problems || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = problems;
    if (activeDomain !== "All") result = result.filter((p) => p.domain === activeDomain);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.companyName.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeDomain, problems]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      {/* Background glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full bg-violet-600/12 blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      <main className="pt-28 pb-20 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Hero header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-sm text-violet-300 mb-6">
              <Zap size={13} className="text-violet-400" />
              Real Problems from Top Companies
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Solve Real-World{" "}
              <span className="gradient-text">Challenges</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Browse open innovation problems posted by companies. Submit your solution and get AI-ranked instantly.
            </p>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="problems-search"
                type="text"
                placeholder="Search problems, companies, keywords…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          {/* Domain filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeDomain === d
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 border-transparent text-white"
                    : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-9 h-9 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg">No problems found.</p>
              <p className="text-white/20 text-sm mt-1">Try a different search or domain filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>
          )}

          {/* Company CTA */}
          <div className="mt-20 glass rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-48 h-48 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full bg-blue-600/12 blur-3xl pointer-events-none" />
            <div className="relative">
              <Building2 size={28} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Are you a company?</h2>
              <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                Post your innovation challenge and let students compete to solve it with AI-ranked solutions.
              </p>
              <Link
                href="/company-login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                Company Portal <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProblemCard({ problem }) {
  const gradClass = DOMAIN_COLORS[problem.domain] || DOMAIN_COLORS.Other;
  const date = new Date(problem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-violet-500/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradClass} flex items-center justify-center flex-shrink-0`}>
          <Layers size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">
            {problem.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Building2 size={10} />
            {problem.companyName}
          </div>
        </div>
      </div>

      <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
        {problem.description}
      </p>

      <div className="flex items-center justify-between text-xs text-white/30 pt-1 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Globe size={10} />
            {problem.domain}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {date}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Users size={10} />
          {problem.solutionCount || 0}
        </span>
      </div>

      <Link
        href={`/problems/${problem._id}`}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 text-white/60 hover:text-violet-300 text-xs font-semibold transition-all"
      >
        View & Submit Solution
        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, Building2, Globe, Clock, Users, Send,
  CheckCircle, Loader2, Star, Layers, Target
} from "lucide-react";

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    solutionText: "",
    repoUrl: "",
    demoUrl: "",
    techStack: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");

  const fetchProblem = useCallback(async () => {
    try {
      const res = await fetch("/api/company/public-problems");
      const data = await res.json();
      if (res.ok) {
        const found = (data.problems || []).find((p) => p._id === problemId);
        setProblem(found || null);
      }
    } catch { /* noop */ } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    const stored = localStorage.getItem("innoverse_user");
    if (stored) setUser(JSON.parse(stored));
    fetchProblem();
  }, [fetchProblem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (form.solutionText.trim().length < 50) {
      setError("Please write at least 50 characters for your solution.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/company/submit-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          studentId: user._id,
          studentName: user.name,
          studentEmail: user.email,
          solutionText: form.solutionText,
          repoUrl: form.repoUrl,
          demoUrl: form.demoUrl,
          techStack: form.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed.");
        return;
      }
      setSubmitted(data.solution);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center">
        <p className="text-white/50 text-lg mb-4">Problem not found.</p>
        <Link href="/problems" className="text-violet-400 hover:text-violet-300 text-sm">
          ← Back to Problems
        </Link>
      </div>
    );
  }

  if (submitted) {
    const score = submitted.aiScore || 0;
    const scoreColor =
      score >= 80 ? "text-emerald-400" : score >= 60 ? "text-blue-400" : score >= 40 ? "text-yellow-400" : "text-rose-400";

    let parsedFeedback = null;
    try {
      parsedFeedback = JSON.parse(submitted.aiFeedback);
    } catch(e) {}

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-5 py-10">
        <div className="max-w-lg w-full glass rounded-3xl p-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Solution Submitted!</h2>
          <p className="text-white/50 text-sm mb-8">Our AI has evaluated your submission instantly.</p>

          <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden border border-white/10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full mix-blend-screen" />
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Your AI Score</p>
            <p className={`text-7xl font-black tracking-tighter ${scoreColor} mb-6 drop-shadow-lg`}>{score}<span className="text-3xl font-bold text-white/20">/100</span></p>

            {parsedFeedback ? (
              <div className="text-left space-y-4 w-full relative z-10 mt-6 pt-6 border-t border-white/10">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">AI Summary</p>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">{parsedFeedback.summary}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1"><Layers size={10} />Innovation</p>
                    <p className="text-emerald-400 font-black text-xl">{parsedFeedback.innovation}<span className="text-white/30 text-xs font-medium ml-1">/ 25</span></p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1"><CheckCircle size={10} />Feasibility</p>
                    <p className="text-blue-400 font-black text-xl">{parsedFeedback.feasibility}<span className="text-white/30 text-xs font-medium ml-1">/ 25</span></p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1"><Target size={10} />Clarity</p>
                    <p className="text-violet-400 font-black text-xl">{parsedFeedback.clarity}<span className="text-white/30 text-xs font-medium ml-1">/ 20</span></p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1"><Globe size={10} />Market</p>
                    <p className="text-rose-400 font-black text-xl">{parsedFeedback.marketPotential}<span className="text-white/30 text-xs font-medium ml-1">/ 30</span></p>
                  </div>
                </div>
                
                <div className="p-4 pt-5 mt-2 rounded-2xl bg-gradient-to-b from-transparent to-white/5 border border-white/5">
                  <p className="text-white/30 text-xs leading-relaxed italic text-center font-medium">"{parsedFeedback.reasoning}"</p>
                </div>
              </div>
            ) : (
              <p className="text-white/50 text-sm mt-4">{submitted.aiFeedback}</p>
            )}
          </div>


          <div className="flex gap-3">
            <Link
              href="/problems"
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-semibold transition-all text-center"
            >
              Browse More
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold transition-all text-center hover:opacity-90"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <main className="pt-28 pb-20 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Link
            href="/problems"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Problems
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Problem details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="glass rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold">
                    Open
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                    {problem.domain}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                <div className="flex flex-wrap gap-4 text-xs text-white/30 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={11} />
                    {problem.companyName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={11} />
                    {problem.solutionCount || 0} submissions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} />
                    {new Date(problem.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers size={11} /> Problem Description
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Target size={11} /> Expected Outcome
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                      {problem.expectedOutcome}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit solution form */}
              <div className="glass rounded-2xl p-7">
                <h2 className="font-bold text-white text-lg mb-1">Submit Your Solution</h2>
                <p className="text-white/40 text-sm mb-6">
                  Your solution will be AI-scored automatically after submission.
                </p>

                {!user && (
                  <div className="px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-5 flex items-center gap-2">
                    <Star size={13} />
                    <Link href="/login" className="underline hover:text-violet-200">
                      Log in as a student
                    </Link>{" "}
                    to submit a solution.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Your Solution *
                    </label>
                    <textarea
                      id="solution-text"
                      name="solutionText"
                      placeholder="Describe your approach in detail. Include algorithms, architecture, or implementation plan…"
                      value={form.solutionText}
                      onChange={(e) => setForm({ ...form, solutionText: e.target.value })}
                      required
                      rows={6}
                      disabled={!user}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all resize-none disabled:opacity-40"
                    />
                    <p className="text-white/20 text-xs mt-1">{form.solutionText.length} chars (min 50)</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                        GitHub Repo URL
                      </label>
                      <input
                        id="solution-repo"
                        type="url"
                        placeholder="https://github.com/..."
                        value={form.repoUrl}
                        onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                        disabled={!user}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all disabled:opacity-40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                        Demo URL
                      </label>
                      <input
                        id="solution-demo"
                        type="url"
                        placeholder="https://..."
                        value={form.demoUrl}
                        onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                        disabled={!user}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      id="solution-techstack"
                      type="text"
                      placeholder="React, Node.js, Python, TensorFlow…"
                      value={form.techStack}
                      onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                      disabled={!user}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all disabled:opacity-40"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    id="submit-solution-btn"
                    type="submit"
                    disabled={submitting || !user}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        Submit & Get AI Score
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-4">How AI Scoring Works</h3>
                <div className="space-y-3">
                  {[
                    { label: "80-100", desc: "Excellent", color: "bg-emerald-400" },
                    { label: "60-79", desc: "Good", color: "bg-blue-400" },
                    { label: "40-59", desc: "Average", color: "bg-yellow-400" },
                    { label: "0-39", desc: "Needs Work", color: "bg-rose-400" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-white/60 text-xs font-medium">{s.label}</span>
                      <span className="text-white/30 text-xs ml-auto">{s.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/25 text-xs mt-4 leading-relaxed">
                  Score is based on solution depth, technical keywords, and clarity.
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-3">Company</h3>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                    {problem.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{problem.companyName}</p>
                    <p className="text-white/30 text-xs">{problem.domain} Focus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, Plus, Layers, Users, Eye, Code2,
  LogOut, TrendingUp, Clock, CheckCircle, ChevronRight,
  BarChart2, Briefcase, Globe, AlertCircle, X
} from "lucide-react";
import PostProblemModal from "@/components/company/PostProblemModal";

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

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  reviewing: { label: "Reviewing", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  closed: { label: "Closed", color: "text-white/40 bg-white/5 border-white/10" },
};

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProblems = useCallback(async (companyId) => {
    try {
      const res = await fetch(`/api/company/problems?companyId=${companyId}`);
      const data = await res.json();
      if (res.ok) setProblems(data.problems || []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("innoverse_company");
    if (!stored) {
      router.replace("/company-login");
      return;
    }
    const c = JSON.parse(stored);
    setCompany(c);
    fetchProblems(c._id).finally(() => setLoading(false));
  }, [router, fetchProblems]);

  const handleLogout = () => {
    localStorage.removeItem("innoverse_company");
    router.push("/");
  };

  const handleProblemPosted = (problem) => {
    setProblems((prev) => [problem, ...prev]);
    setShowPostModal(false);
    showToast("Problem posted successfully! 🎉");
  };

  const stats = [
    {
      label: "Total Problems",
      value: problems.length,
      icon: Layers,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Open Problems",
      value: problems.filter((p) => p.status === "open").length,
      icon: Globe,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Total Solutions",
      value: problems.reduce((acc, p) => acc + (p.solutionCount || 0), 0),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Reviewing",
      value: problems.filter((p) => p.status === "reviewing").length,
      icon: BarChart2,
      color: "from-orange-500 to-amber-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background glows */}
      <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg animate-fade-in transition-all
          ${toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}>
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/30 hover:text-white/60">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-[#0d0d14] border-r border-white/5 flex flex-col z-40 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-base">
              <span className="gradient-text">Innov</span>
              <span className="text-white">erse</span>
            </span>
          </Link>
          <div className="mt-1 ml-9 text-xs text-white/30 font-medium">Company Portal</div>
        </div>

        {/* Company profile */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">{company.name}</p>
              <p className="text-white/40 text-xs truncate">{company.email}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink icon={BarChart2} label="Dashboard" active />
          <SidebarLink icon={Layers} label="Problems" href="#problems-section" />
          <SidebarLink icon={Briefcase} label="Post Problem" onClick={() => setShowPostModal(true)} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d0d14]/95 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Code2 size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">Innoverse</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus size={13} /> Post
          </button>
          <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 py-10">

          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-white/40 text-sm mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">{company.name}</span>
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Manage your innovation challenges and discover top talent.
              </p>
            </div>
            <button
              id="post-problem-btn"
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25 transition-all self-start sm:self-auto"
            >
              <Plus size={16} />
              Post New Problem
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 hover:border-white/15 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all`}>
                  <s.icon size={18} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-white/40 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Problems list */}
          <div id="problems-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Posted Problems</h2>
              {problems.length > 0 && (
                <span className="text-xs text-white/30">
                  {problems.length} problem{problems.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {problems.length === 0 ? (
              <EmptyState onPost={() => setShowPostModal(true)} />
            ) : (
              <div className="space-y-4">
                {problems.map((problem) => (
                  <ProblemCard key={problem._id} problem={problem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Post problem modal */}
      {showPostModal && (
        <PostProblemModal
          company={company}
          onClose={() => setShowPostModal(false)}
          onSuccess={handleProblemPosted}
        />
      )}
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, href, onClick }) {
  const classes = `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
    active
      ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
      : "text-white/40 hover:text-white hover:bg-white/5"
  }`;

  if (href) return <a href={href} className={classes}><Icon size={16} />{label}</a>;
  if (onClick) return <button onClick={onClick} className={classes}><Icon size={16} />{label}</button>;
  return <div className={classes}><Icon size={16} />{label}</div>;
}

function ProblemCard({ problem }) {
  const gradClass = DOMAIN_COLORS[problem.domain] || DOMAIN_COLORS.Other;
  const statusCfg = STATUS_CONFIG[problem.status] || STATUS_CONFIG.open;
  const date = new Date(problem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="glass rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Domain badge */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradClass} flex items-center justify-center flex-shrink-0`}>
          <Layers size={18} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-white text-base">{problem.title}</h3>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-3">
            {problem.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Globe size={11} />
              {problem.domain}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {problem.solutionCount || 0} solution{(problem.solutionCount || 0) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* View solutions CTA */}
        <Link
          href={`/company-dashboard/solutions/${problem._id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10 text-white/60 hover:text-violet-300 text-sm font-medium transition-all self-start flex-shrink-0"
        >
          <Eye size={14} />
          <span>Solutions</span>
          {problem.solutionCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center">
              {problem.solutionCount}
            </span>
          )}
          <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ onPost }) {
  return (
    <div className="glass rounded-2xl p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
        <AlertCircle size={28} className="text-violet-400" />
      </div>
      <h3 className="font-bold text-white text-lg mb-2">No problems posted yet</h3>
      <p className="text-white/40 text-sm max-w-xs mx-auto mb-6">
        Post your first innovation challenge and start receiving solutions from top student developers.
      </p>
      <button
        onClick={onPost}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all"
      >
        <Plus size={16} />
        Post Your First Problem
      </button>
    </div>
  );
}

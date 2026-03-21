"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, Eye, EyeOff, Code2, ArrowRight, User } from "lucide-react";

export default function CompanyAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint =
      mode === "login"
        ? "/api/company/login"
        : "/api/company/register";

    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Store company session
      localStorage.setItem("innoverse_company", JSON.stringify(data.company));
      router.push("/company-dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Code2 size={16} className="text-white" />
        </div>
        <span className="font-bold text-xl">
          <span className="gradient-text">Innov</span>
          <span className="text-white">erse</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-card relative">
        {/* Mode badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base text-white">Company Portal</p>
            <p className="text-white/40 text-xs">Innovation-driven hiring</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Welcome back" : "Join as a Company"}
        </h1>
        <p className="text-white/50 text-sm mb-7">
          {mode === "login"
            ? "Sign in to manage your problems and review solutions."
            : "Post real-world problems and discover top student talent."}
        </p>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 mb-7">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="company-name"
                name="name"
                type="text"
                placeholder="Company Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="company-email"
              name="email"
              type="email"
              placeholder="company@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="company-password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            id="company-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Are you a student?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Student login →
          </Link>
        </p>
      </div>

      <p className="mt-8 text-white/20 text-xs text-center">
        © {new Date().getFullYear()} Innoverse · Company Partner Portal
      </p>
    </div>
  );
}

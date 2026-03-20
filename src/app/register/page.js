"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock,
  AtSign,
  Phone,
} from "lucide-react";

const ROLES = ["developer", "designer", "fullstack", "other"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    role: "developer",
    bio: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-linear-to-br from-violet-950/60 to-[#0a0a0f] border-r border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-blue-600/15 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl">
            <span className="gradient-text">Innov</span>
            <span className="text-white">aite</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join the developer
            <br />
            <span className="gradient-text">community</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Build your portfolio, showcase your projects, and get noticed by top
            companies and teams.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Free forever — no credit card needed",
              "Public profile with shareable link",
              "Showcase unlimited projects",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-white/60 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/20 text-sm">© 2026 Innovaite</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Innovaite</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-white/50 text-sm">
              Already have one?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {success ? (
            <div className="glass rounded-2xl p-8 text-center border border-emerald-500/30">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Account created!
              </h3>
              <p className="text-white/50 text-sm">Redirecting you to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Username */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                    className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <AtSign
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="username"
                    className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Password (min 8 characters)"
                  minLength={8}
                  className="w-full glass rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Mobile */}
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile number (optional)"
                  className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
              </div>

              {/* Role */}
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white/80 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors bg-transparent capitalize"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-[#1a1a2e] capitalize">
                    {r}
                  </option>
                ))}
              </select>

              {/* Bio */}
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={2}
                placeholder="Short bio (optional)"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors resize-none"
              />

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-violet-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-white/30 text-xs text-center">
                By signing up you agree to our{" "}
                <Link href="/terms" className="text-violet-400 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-violet-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

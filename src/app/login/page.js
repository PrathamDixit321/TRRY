"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        return;
      }

      // Store user in localStorage (replace with session/cookie in production)
      localStorage.setItem("innovaite_user", JSON.stringify(data.user));
      router.push(`/dashboard`);
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
          <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-blue-600/15 blur-3xl" />
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
            Welcome back,
            <br />
            <span className="gradient-text">builder</span>
          </h2>
          <p className="text-white/50 text-lg">
            Your portfolio and projects are waiting for you.
          </p>
        </div>

        <p className="relative text-white/20 text-sm">© 2026 Innovaite</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Innovaite</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
            <p className="text-white/50 text-sm">
              New here?{" "}
              <Link
                href="/register"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Password"
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

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

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
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

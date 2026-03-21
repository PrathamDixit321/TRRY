'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Code2, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request (password reset emails not yet implemented server-side)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl"><span className="gradient-text">Innov</span><span className="text-white">erse</span></span>
        </Link>

        {!submitted ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-white/50 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="Email address"
                  className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Send Reset Link</span><ArrowRight size={16} /></>
                }
              </button>
            </form>
          </>
        ) : (
          <div className="text-center glass rounded-2xl p-8 border border-emerald-500/20">
            <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">Check your inbox</h2>
            <p className="text-white/50 text-sm mb-6">If an account exists for <span className="text-white">{email}</span>, you'll receive a reset link shortly.</p>
            <Link href="/login" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
              ← Back to login
            </Link>
          </div>
        )}

        <p className="text-center mt-6 text-white/30 text-sm">
          Remember it?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

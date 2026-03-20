'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Code2, Zap, Globe, Users, Star, ArrowRight,
  Github, Terminal, Layers, Trophy, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ROLES = ['Developer', 'Designer', 'Builder', 'Hacker', 'Creator'];

const FEATURES = [
  { icon: Layers, title: 'Portfolio Builder', desc: 'Create a stunning portfolio that highlights your projects, skills, and journey.', color: 'from-violet-500 to-purple-500' },
  { icon: Globe, title: 'Public Profile', desc: 'Get your own shareable profile URL and be discovered by recruiters worldwide.', color: 'from-blue-500 to-cyan-500' },
  { icon: Users, title: 'Developer Network', desc: 'Connect with fellow developers, collaborate on projects, and grow together.', color: 'from-emerald-500 to-teal-500' },
  { icon: Trophy, title: 'Hackathon Ready', desc: 'Showcase hackathon wins, open source contributions, and achievements.', color: 'from-orange-500 to-rose-500' },
  { icon: Terminal, title: 'Tech Stack Display', desc: 'Highlight the tools and technologies you work with most effectively.', color: 'from-pink-500 to-rose-500' },
  { icon: Zap, title: 'Instant Setup', desc: 'Get your profile live in under 5 minutes. No design skills needed.', color: 'from-yellow-500 to-orange-500' },
];

const STATS = [
  { label: 'Developers', value: '50K+' },
  { label: 'Projects Showcased', value: '200K+' },
  { label: 'Companies Hiring', value: '1.2K+' },
  { label: 'Countries', value: '80+' },
];

const SAMPLE_PROFILES = [
  { name: 'Alex Chen', role: 'Fullstack Developer', skills: ['React', 'Node.js', 'TypeScript'], avatar: 'AC', color: 'from-violet-500 to-blue-500', projects: 12 },
  { name: 'Priya Sharma', role: 'Frontend Engineer', skills: ['Vue', 'Tailwind', 'Figma'], avatar: 'PS', color: 'from-pink-500 to-rose-500', projects: 8 },
  { name: 'Marcus Lee', role: 'DevOps Engineer', skills: ['K8s', 'AWS', 'Terraform'], avatar: 'ML', color: 'from-emerald-500 to-teal-500', projects: 15 },
];

export default function LandingPage() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRoleIdx((p) => (p + 1) % ROLES.length), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-28 px-6">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-sm text-violet-300 mb-8">
            <Zap size={14} className="text-violet-400" />
            The Devfolio Alternative — Open & Beautiful
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Your Portfolio,{' '}<br />
            <span className="gradient-text">Built for {ROLES[roleIdx]}s</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Innovaite is the platform where developers showcase their best work, connect with opportunities,
            and build in public. Your career starts with a great portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 transition-all hover:shadow-2xl hover:shadow-violet-500/30 flex items-center gap-2 justify-center">
              Create Free Profile <ArrowRight size={18} />
            </Link>
            <Link href="/explore" className="px-8 py-3.5 rounded-xl glass border border-white/10 text-white/80 font-semibold text-base hover:border-violet-500/40 hover:text-white transition-all flex items-center gap-2 justify-center">
              <Github size={18} /> Explore Profiles
            </Link>
          </div>

          <p className="mt-8 text-white/30 text-sm">
            Trusted by <span className="text-violet-400">50,000+</span> developers · No credit card required
          </p>
        </div>

        {/* Preview cards */}
        <div className="relative max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_PROFILES.map((p) => (
            <div key={p.name} className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-sm font-bold text-white`}>
                  {p.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{p.name}</p>
                  <p className="text-white/40 text-xs">{p.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-white/60 text-xs border border-white/5">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{p.projects} projects</span>
                <div className="flex items-center gap-1 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View profile <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-white/50 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to <span className="gradient-text">stand out</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">Built for the modern developer—sleek, fast, and purposeful.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-base mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
            Up and running in <span className="gradient-text">minutes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up free and set up your developer profile in seconds.' },
              { step: '02', title: 'Add your projects', desc: 'Showcase your best work with links, tech stacks, and descriptions.' },
              { step: '03', title: 'Share & get hired', desc: 'Share your profile link and get discovered by top companies.' },
            ].map((item) => (
              <div key={item.step} className="relative text-left glass rounded-2xl p-6">
                <p className="text-6xl font-black text-white/5 absolute top-4 right-5 select-none">{item.step}</p>
                <p className="text-violet-400 text-sm font-bold mb-3">{item.step}</p>
                <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl glass p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <Star size={32} className="text-violet-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to build your <span className="gradient-text">dream portfolio?</span>
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                Join thousands of developers who are already growing their careers with Innovaite.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-all hover:shadow-2xl hover:shadow-violet-500/30">
                Get Started for Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

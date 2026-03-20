'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Search, Filter, Calendar, Users, MapPin, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_COLORS = {
  upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  registration_open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  ongoing: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  judging: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  completed: 'bg-white/10 text-white/40 border-white/10',
  draft: 'bg-white/10 text-white/30 border-white/10',
};

const STATUS_LABELS = {
  upcoming: 'Upcoming',
  registration_open: 'Registration Open',
  ongoing: 'Live Now',
  judging: 'Judging',
  completed: 'Completed',
  draft: 'Draft',
};

function HackathonCard({ h }) {
  const start = new Date(h.hackathonStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const end = new Date(h.hackathonEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link href={`/hackathons/${h._id}`} className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer block">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-base mb-1 group-hover:text-violet-300 transition-colors line-clamp-1">{h.title}</h3>
          {h.tagline && <p className="text-white/40 text-xs line-clamp-1">{h.tagline}</p>}
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs border font-medium ${STATUS_COLORS[h.status] || STATUS_COLORS.draft}`}>
          {STATUS_LABELS[h.status] || h.status}
        </span>
      </div>

      <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{h.description}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/40">
        <span className="flex items-center gap-1.5"><Calendar size={11} />{start} – {end}</span>
        <span className="flex items-center gap-1.5"><Users size={11} />{h.minTeamSize}–{h.maxTeamSize} members</span>
        {h.location && <span className="flex items-center gap-1.5"><MapPin size={11} />{h.location}</span>}
        <span className="capitalize flex items-center gap-1.5"><Clock size={11} />{h.mode}</span>
      </div>

      {h.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {h.tags.slice(0, 4).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs border border-white/5">{t}</span>
          ))}
        </div>
      )}

      {h.totalPrizePool && (
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xs text-white/30">Prize Pool</span>
          <span className="text-sm font-bold gradient-text">{h.totalPrizePool}</span>
        </div>
      )}
    </Link>
  );
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const fetchHackathons = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (mode) params.set('mode', mode);

    const res = await fetch(`/api/hackathons?${params}`);
    const data = await res.json();
    setHackathons(data.hackathons || []);
    setPagination(data.pagination || null);
    setLoading(false);
  };

  useEffect(() => { fetchHackathons(); }, [page, status, mode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHackathons();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">Hackathons</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Find your next <span className="gradient-text">challenge</span>
            </h1>
            <p className="text-white/50 text-lg">Compete, collaborate, and build something amazing.</p>
          </div>

          {/* Filters */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search hackathons..."
                className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
              />
            </div>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="glass rounded-xl px-4 py-3 text-sm text-white/70 border border-white/8 focus:border-violet-500/60 focus:outline-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="registration_open">Registration Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={mode}
              onChange={e => { setMode(e.target.value); setPage(1); }}
              className="glass rounded-xl px-4 py-3 text-sm text-white/70 border border-white/8 focus:border-violet-500/60 focus:outline-none cursor-pointer"
            >
              <option value="">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all">
              Search
            </button>
          </form>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : hackathons.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Trophy size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">No hackathons found</p>
              <p className="text-white/25 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {hackathons.map(h => <HackathonCard key={h._id} h={h} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl glass border border-white/10 text-white/60 text-sm disabled:opacity-30 hover:text-white transition-colors"
              >
                Previous
              </button>
              <span className="text-white/40 text-sm">Page {page} of {pagination.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-xl glass border border-white/10 text-white/60 text-sm disabled:opacity-30 hover:text-white transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

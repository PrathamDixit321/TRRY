'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Users, MapPin, Clock, Trophy, ChevronLeft,
  Globe, Mail, ExternalLink, Plus, X, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_COLORS = {
  upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  registration_open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  ongoing: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  judging: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  completed: 'bg-white/10 text-white/40 border-white/10',
};
const STATUS_LABELS = {
  upcoming: 'Upcoming', registration_open: 'Registration Open',
  ongoing: 'Live Now', judging: 'Judging', completed: 'Completed',
};

function CreateTeamModal({ hackathonId, userId, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', bio: '', projectIdea: '', techStack: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch(`/api/hackathons/${hackathonId}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, leaderId: userId, bio: form.bio,
        projectIdea: form.projectIdea,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return; }
    onCreated(data.team);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Create a Team</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', placeholder: 'Team name *', required: true },
            { name: 'bio', placeholder: 'Short team bio' },
            { name: 'projectIdea', placeholder: 'Your project idea' },
            { name: 'techStack', placeholder: 'Tech stack (React, Python, ...)' },
          ].map(f => (
            <input key={f.name} required={f.required} value={form[f.name]}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
            />
          ))}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JoinTeamModal({ team, userId, onClose, onJoined }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch(`/api/teams/${team._id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, inviteCode }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to join'); setLoading(false); return; }
    onJoined(data.team);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Join "{team.name}"</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} required
            placeholder="Invite Code (e.g. ABC123)"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none tracking-widest font-mono"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HackathonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hackathon, setHackathon] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('about');
  const [user, setUser] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [joinTarget, setJoinTarget] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('innoverse_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/hackathons/${id}`).then(r => r.json()),
      fetch(`/api/hackathons/${id}/teams`).then(r => r.json()),
    ]).then(([hData, tData]) => {
      setHackathon(hData.hackathon || null);
      setTeams(tData.teams || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (!hackathon) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
      <p className="text-xl mb-4">Hackathon not found</p>
      <Link href="/hackathons" className="text-violet-400 hover:text-violet-300 flex items-center gap-2">
        <ChevronLeft size={16} /> Back to hackathons
      </Link>
    </div>
  );

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const canRegister = ['registration_open', 'upcoming', 'ongoing'].includes(hackathon.status);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {showCreateTeam && user && (
        <CreateTeamModal hackathonId={id} userId={user._id} onClose={() => setShowCreateTeam(false)}
          onCreated={(t) => setTeams(prev => [t, ...prev])} />
      )}
      {joinTarget && user && (
        <JoinTeamModal team={joinTarget} userId={user._id} onClose={() => setJoinTarget(null)}
          onJoined={() => setJoinTarget(null)} />
      )}

      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-24 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 to-[#0a0a0f]" />
        {hackathon.bannerImage && (
          <img src={hackathon.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        )}
        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <Link href="/hackathons" className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 mb-6 transition-colors">
            <ChevronLeft size={14} /> All Hackathons
          </Link>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs border font-medium mb-3 ${STATUS_COLORS[hackathon.status] || ''}`}>
                {STATUS_LABELS[hackathon.status] || hackathon.status}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{hackathon.title}</h1>
              {hackathon.tagline && <p className="text-white/50 text-lg">{hackathon.tagline}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5"><Calendar size={13} />{fmtDate(hackathon.hackathonStart)} – {fmtDate(hackathon.hackathonEnd)}</span>
                <span className="flex items-center gap-1.5"><Users size={13} />Teams of {hackathon.minTeamSize}–{hackathon.maxTeamSize}</span>
                {hackathon.location && <span className="flex items-center gap-1.5"><MapPin size={13} />{hackathon.location}</span>}
                <span className="flex items-center gap-1.5 capitalize"><Clock size={13} />{hackathon.mode}</span>
              </div>
            </div>
            {canRegister && (
              <div className="shrink-0">
                {user ? (
                  <button onClick={() => setShowCreateTeam(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
                    <Plus size={16} /> Create Team
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-all">
                    Login to Register
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex gap-6">
          {['about', 'prizes', 'teams'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'text-violet-400 border-violet-500' : 'text-white/40 border-transparent hover:text-white/70'}`}>
              {t} {t === 'teams' && `(${teams.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ABOUT */}
        {tab === 'about' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">About</h2>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.description}</p>
              </div>
              {hackathon.guidelines && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-white font-semibold mb-4">Guidelines</h2>
                  <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{hackathon.guidelines}</p>
                </div>
              )}
              {hackathon.judgingCriteria?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-white font-semibold mb-4">Judging Criteria</h2>
                  <ul className="space-y-2">
                    {hackathon.judgingCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                        <span className="text-violet-400 mt-0.5">→</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 space-y-3">
                <h3 className="text-white font-semibold text-sm">Key Dates</h3>
                {[
                  { label: 'Reg. Deadline', val: hackathon.registrationEnd },
                  { label: 'Start', val: hackathon.hackathonStart },
                  { label: 'End', val: hackathon.hackathonEnd },
                  { label: 'Submission', val: hackathon.submissionDeadline },
                ].map(({ label, val }) => val && (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white/70">{fmtDate(val)}</span>
                  </div>
                ))}
              </div>
              {hackathon.eligibility && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-2">Eligibility</h3>
                  <p className="text-white/50 text-xs">{hackathon.eligibility}</p>
                </div>
              )}
              {(hackathon.website || hackathon.contactEmail) && (
                <div className="glass rounded-2xl p-5 space-y-2">
                  <h3 className="text-white font-semibold text-sm mb-2">Contact</h3>
                  {hackathon.website && (
                    <a href={hackathon.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs transition-colors">
                      <Globe size={12} /> Website <ExternalLink size={10} />
                    </a>
                  )}
                  {hackathon.contactEmail && (
                    <a href={`mailto:${hackathon.contactEmail}`}
                      className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs transition-colors">
                      <Mail size={12} /> {hackathon.contactEmail}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRIZES */}
        {tab === 'prizes' && (
          <div className="max-w-2xl space-y-4">
            {hackathon.totalPrizePool && (
              <div className="glass rounded-2xl p-6 text-center mb-8">
                <p className="text-white/40 text-sm mb-1">Total Prize Pool</p>
                <p className="text-4xl font-black gradient-text">{hackathon.totalPrizePool}</p>
              </div>
            )}
            {hackathon.prizes?.length > 0 ? hackathon.prizes.map((p, i) => (
              <div key={i} className="glass rounded-2xl p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-xl">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{p.title || `${p.place} Place`}</p>
                  {p.description && <p className="text-white/40 text-sm">{p.description}</p>}
                </div>
                {p.amount && <p className="text-violet-400 font-bold text-lg">{p.amount}</p>}
              </div>
            )) : (
              <div className="glass rounded-2xl p-12 text-center">
                <Trophy size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Prize details coming soon</p>
              </div>
            )}
          </div>
        )}

        {/* TEAMS */}
        {tab === 'teams' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-sm">{teams.length} team{teams.length !== 1 ? 's' : ''} registered</p>
              {canRegister && user && (
                <button onClick={() => setShowCreateTeam(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90">
                  <Plus size={14} /> Create Team
                </button>
              )}
            </div>
            {teams.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <Users size={36} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/40">No teams yet. Be the first to register!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {teams.map(t => (
                  <div key={t._id} className="glass rounded-2xl p-5 hover:border-violet-500/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{t.name}</h3>
                        {t.bio && <p className="text-white/40 text-xs mt-0.5">{t.bio}</p>}
                      </div>
                      {t.lookingForMembers && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Hiring
                        </span>
                      )}
                    </div>
                    {t.projectIdea && <p className="text-white/50 text-sm mb-3 line-clamp-2">{t.projectIdea}</p>}
                    <div className="flex items-center gap-2 mb-3">
                      {t.members?.slice(0, 5).map(m => (
                        <div key={m._id} title={m.user?.name}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {m.user?.name?.slice(0, 1) || '?'}
                        </div>
                      ))}
                      <span className="text-white/30 text-xs ml-1">{t.members?.length} member{t.members?.length !== 1 ? 's' : ''}</span>
                    </div>
                    {t.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {t.techStack.slice(0, 4).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-white/40 text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                    {t.lookingForMembers && user && (
                      <button onClick={() => setJoinTarget(t)}
                        className="mt-4 w-full py-2 rounded-xl border border-violet-500/30 text-violet-400 text-sm hover:bg-violet-500/10 transition-colors">
                        Request to Join
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

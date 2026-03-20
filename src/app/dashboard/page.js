"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  User,
  Layers,
  Settings,
  LogOut,
  Plus,
  Github,
  Globe,
  Twitter,
  Linkedin,
  ExternalLink,
  Trash2,
  Edit3,
  Trophy,
  Copy,
  Check,
} from "lucide-react";

function AddProjectModal({ userId, onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/users/${userId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add project");
        return;
      }
      onAdded(data.user);
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg glass rounded-2xl p-8 border border-white/10">
        <h3 className="text-white font-semibold text-lg mb-6">Add Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project title *"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none resize-none"
          />
          <input
            name="techStack"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            placeholder="Tech stack (comma separated: React, Node.js, MongoDB)"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="liveUrl"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="Live URL"
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
            />
            <input
              name="githubUrl"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="GitHub URL"
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/70 text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Adding…" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showAddProject, setShowAddProject] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("innovaite_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    // Re-fetch fresh data
    fetch(`/api/users/${parsed._id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        else setUser(parsed);
      })
      .catch(() => setUser(parsed));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("innovaite_user");
    router.push("/");
  };

  const handleDeleteProject = async (projectId) => {
    setDeleting(projectId);
    const res = await fetch(
      `/api/users/${user._id}/projects?projectId=${projectId}`,
      { method: "DELETE" },
    );
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("innovaite_user", JSON.stringify(data.user));
    }
    setDeleting(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "hackathons", label: "Hackathons", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {showAddProject && (
        <AddProjectModal
          userId={user._id}
          onClose={() => setShowAddProject(false)}
          onAdded={(updated) => {
            setUser(updated);
            localStorage.setItem("innovaite_user", JSON.stringify(updated));
          }}
        />
      )}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 flex-col p-6 z-40 hidden lg:flex">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Code2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-base gradient-text">Innovaite</span>
        </Link>

        {/* Avatar */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl glass border border-white/8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user.name}
            </p>
            <p className="text-white/40 text-xs truncate">@{user.username}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === t.id ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all mt-4 w-full"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <h1 className="text-white font-semibold text-lg capitalize">{tab}</h1>
          <Link
            href={`/profile/${user.username}`}
            target="_blank"
            className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ExternalLink size={14} /> View Public Profile
          </Link>
        </div>

        <div className="p-8">
          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Projects", value: user.projects?.length || 0 },
                  { label: "Skills", value: user.skills?.length || 0 },
                  { label: "Role", value: user.role || "—" },
                  {
                    label: "Status",
                    value: user.isVerified ? "Verified" : "Active",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="glass rounded-2xl p-5 border border-white/5"
                  >
                    <p className="text-2xl font-bold gradient-text capitalize">
                      {s.value}
                    </p>
                    <p className="text-white/40 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Profile card */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="text-white font-semibold mb-4">Your Profile</h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl">
                      {user.name}
                    </h3>
                    <p className="text-violet-400 text-sm">@{user.username}</p>
                    {user.bio && (
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.skills?.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-white/60 text-xs border border-white/8"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent projects */}
              {user.projects?.length > 0 && (
                <div className="glass rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">
                      Recent Projects
                    </h2>
                    <button
                      onClick={() => setTab("projects")}
                      className="text-violet-400 text-xs hover:text-violet-300"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {user.projects.slice(0, 2).map((p) => (
                      <div
                        key={p._id}
                        className="rounded-xl bg-white/3 border border-white/5 p-4"
                      >
                        <p className="text-white font-medium text-sm mb-1">
                          {p.title}
                        </p>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.techStack?.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 text-xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROJECTS TAB */}
          {tab === "projects" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">
                  {user.projects?.length || 0} projects
                </p>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-all"
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>

              {!user.projects?.length ? (
                <div className="glass rounded-2xl p-12 text-center border border-white/5">
                  <Layers size={32} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">
                    No projects yet. Add your first one!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {user.projects.map((p) => (
                    <div
                      key={p._id}
                      className="glass rounded-2xl p-5 border border-white/5 group hover:border-violet-500/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-white font-semibold">{p.title}</h3>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          disabled={deleting === p._id}
                          className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          {deleting === p._id ? (
                            <span className="w-4 h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                      {p.description && (
                        <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {p.techStack?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-xs">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-white/40 hover:text-white transition-colors"
                          >
                            <Globe size={12} /> Live
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-white/40 hover:text-white transition-colors"
                          >
                            <Github size={12} /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HACKATHONS TAB */}
          {tab === "hackathons" && <HackathonsTab user={user} />}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <SettingsTab
              user={user}
              onUpdate={(updated) => {
                setUser(updated);
                localStorage.setItem("innovaite_user", JSON.stringify(updated));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HackathonsTab({ user }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    // Fetch all teams where this user is a member
    fetch(`/api/users/${user._id}/teams`)
      .then(r => r.json())
      .then(d => { setTeams(d.teams || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user._id]);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-sm">{teams.length} team{teams.length !== 1 ? 's' : ''} joined</p>
        <Link href="/hackathons" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-all">
          <Trophy size={14} /> Browse Hackathons
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <Trophy size={32} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-2">You haven't joined any hackathon teams yet.</p>
          <Link href="/hackathons" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            Find a hackathon →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {teams.map(t => (
            <div key={t._id} className="glass rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold">{t.name}</h3>
                  <Link href={`/hackathons/${t.hackathon?._id}`} className="text-violet-400 text-xs hover:text-violet-300 transition-colors">
                    {t.hackathon?.title || 'Hackathon'}
                  </Link>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  t.status === 'submitted' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                  : t.status === 'forming' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                  : 'bg-white/10 text-white/40 border-white/10'
                }`}>{t.status}</span>
              </div>

              {t.projectIdea && <p className="text-white/40 text-sm mb-3 line-clamp-2">{t.projectIdea}</p>}

              <div className="flex items-center gap-1.5 mb-3">
                {t.members?.slice(0, 6).map((m, i) => (
                  <div key={i} title={m.user?.name}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {m.user?.name?.slice(0, 1) || '?'}
                  </div>
                ))}
                <span className="text-white/30 text-xs ml-1">{t.members?.length} member{t.members?.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Invite code — only show to leader */}
              {t.leader?._id === user._id && t.inviteCode && (
                <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-white/3 border border-white/5">
                  <span className="text-white/40 text-xs">Invite Code:</span>
                  <span className="font-mono text-violet-400 text-sm tracking-widest">{t.inviteCode}</span>
                  <button onClick={() => copyCode(t.inviteCode, t._id)}
                    className="ml-auto text-white/30 hover:text-white transition-colors">
                    {copied === t._id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    mobile: user.mobile || "",
    skills: user.skills?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Update failed");
        return;
      }
      onUpdate(data.user);
      setMsg("Profile updated!");
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="text-white font-semibold mb-2">Edit Profile</h2>

        {[
          { label: "Full Name", name: "name", placeholder: "Your full name" },
          { label: "Location", name: "location", placeholder: "City, Country" },
          {
            label: "Website",
            name: "website",
            placeholder: "https://yoursite.com",
          },
          { label: "Mobile", name: "mobile", placeholder: "+91 9999999999" },
          {
            label: "Skills (comma-separated)",
            name: "skills",
            placeholder: "React, TypeScript, Node.js",
          },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-white/50 text-xs mb-1.5 block">
              {f.label}
            </label>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Short bio"
            rows={3}
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${msg.includes("updated") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}
        >
          {msg}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Edit3 size={15} /> Save Changes
          </>
        )}
      </button>
    </form>
  );
}

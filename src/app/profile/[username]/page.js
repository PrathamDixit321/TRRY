import {
  Globe,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  ExternalLink,
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `${username} — Innovaite`,
    description: `${username}'s developer portfolio on Innovaite`,
  };
}

async function getUser(username) {
  await connectDB();
  return User.findOne({ username, isActive: true }).select("-password").lean();
}

const ROLE_COLORS = {
  developer: "from-violet-500 to-blue-500",
  designer: "from-pink-500 to-rose-500",
  fullstack: "from-emerald-500 to-teal-500",
  other: "from-orange-500 to-yellow-500",
};

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-6">
        <p className="text-6xl mb-4">👤</p>
        <h1 className="text-3xl font-bold text-white mb-2">
          Profile not found
        </h1>
        <p className="text-white/50 mb-8">
          @{username} doesn't exist on Innovaite.
        </p>
        <Link
          href="/explore"
          className="px-6 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-all"
        >
          Explore Profiles
        </Link>
      </div>
    );
  }

  const initials = user.name?.slice(0, 2).toUpperCase();
  const gradColor = ROLE_COLORS[user.role] || ROLE_COLORS.other;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header bar */}
      <div className="sticky top-0 z-30 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">IN</span>
          </div>
          <span className="font-bold text-sm gradient-text hidden sm:block">
            Innovaite
          </span>
        </Link>
        <Link
          href="/register"
          className="px-4 py-1.5 rounded-lg bg-linear-to-r from-violet-600 to-blue-600 text-white text-xs font-medium hover:opacity-90 transition-all"
        >
          Create your profile
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="relative glass rounded-3xl p-8 md:p-10 mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative">
            <div
              className={`w-24 h-24 rounded-2xl bg-linear-to-br ${gradColor} flex items-center justify-center text-3xl font-black text-white shrink-0`}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${gradColor} text-white capitalize`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-white/50 text-sm mb-3">@{user.username}</p>
              {user.bio && (
                <p className="text-white/70 leading-relaxed max-w-lg">
                  {user.bio}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-4 mt-4 text-white/40 text-sm">
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
                  >
                    <Globe size={14} />
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>

              {/* Social links */}
              {user.socialLinks?.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {user.socialLinks.map((l) => (
                    <a
                      key={l.platform}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/40 transition-all text-xs font-medium capitalize"
                    >
                      {l.platform?.slice(0, 2)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-white/50 font-semibold text-sm mb-4 uppercase tracking-widest">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-sm border border-white/8 hover:border-violet-500/30 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-white/50 font-semibold text-sm mb-4 uppercase tracking-widest">
              Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Projects</span>
                <span className="text-white font-semibold">
                  {user.projects?.length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Skills</span>
                <span className="text-white font-semibold">
                  {user.skills?.length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Member since</span>
                <span className="text-white font-semibold">
                  {new Date(user.createdAt).toLocaleDateString("en", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="glass rounded-2xl p-6 border border-violet-500/10 bg-violet-950/10">
            <p className="text-white/50 text-sm mb-4">
              Build your own portfolio
            </p>
            <Link
              href="/register"
              className="block text-center px-4 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-all"
            >
              Join Innovaite
            </Link>
          </div>
        </div>

        {/* Projects */}
        {user.projects?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-white font-bold text-xl mb-5">
              Projects{" "}
              <span className="text-white/30 text-base font-normal">
                ({user.projects.length})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {user.projects.map((p) => (
                <div
                  key={p._id?.toString()}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-all group"
                >
                  <h3 className="text-white font-semibold text-base mb-2">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.techStack?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs border border-violet-500/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <Github size={12} /> Source
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Users, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROLES = ["", "developer", "designer", "fullstack", "other"];
const ROLE_COLORS = {
  developer: "from-violet-500 to-blue-500",
  designer: "from-pink-500 to-rose-500",
  fullstack: "from-emerald-500 to-teal-500",
  other: "from-orange-500 to-yellow-500",
};

function UserCard({ user }) {
  const color = ROLE_COLORS[user.role] || ROLE_COLORS.other;
  return (
    <Link
      href={`/profile/${user.username}`}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/25 transition-all duration-300 hover:-translate-y-1 group block"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center text-sm font-bold text-white shrink-0`}
        >
          {user.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate">
            {user.name}
          </p>
          <p className="text-white/40 text-xs">@{user.username}</p>
        </div>
        <ExternalLink
          size={14}
          className="text-white/20 group-hover:text-violet-400 transition-colors ml-auto shrink-0"
        />
      </div>

      {user.bio && (
        <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">
          {user.bio}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {user.skills?.slice(0, 4).map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-md bg-white/5 text-white/60 text-xs border border-white/5"
          >
            {s}
          </span>
        ))}
        {user.skills?.length > 4 && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/30 text-xs">
            +{user.skills.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-white/30">
        <span
          className={`capitalize px-2 py-0.5 rounded-full bg-linear-to-r ${color} text-white/80 text-[10px] font-medium`}
        >
          {user.role}
        </span>
        <span>{user.projects?.length || 0} projects</span>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 12, search, role });
        const res = await fetch(`/api/users?${params}`);
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    },
    [search, role],
  );

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 350);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Community
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore <span className="gradient-text">Developers</span>
          </h1>
          <p className="text-white/50 text-lg">
            Discover talented developers, their projects, and skills.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, username, or skill…"
              className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass rounded-xl pl-8 pr-8 py-3 text-sm text-white/80 border border-white/8 focus:border-violet-500/60 focus:outline-none transition-colors bg-transparent appearance-none capitalize min-w-35"
            >
              <option value="" className="bg-[#1a1a2e]">
                All Roles
              </option>
              {ROLES.filter(Boolean).map((r) => (
                <option key={r} value={r} className="bg-[#1a1a2e] capitalize">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-white/30 text-sm mb-6 flex items-center gap-2">
            <Users size={14} />
            {pagination.total} developer{pagination.total !== 1 ? "s" : ""}{" "}
            found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 border border-white/5 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/5 rounded" />
                  <div className="h-2 bg-white/5 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24">
            <Users size={40} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/30 text-lg">No developers found</p>
            <p className="text-white/20 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((u) => (
              <UserCard key={u._id} user={u} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => fetchUsers(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    p === pagination.page
                      ? "bg-linear-to-r from-violet-600 to-blue-600 text-white"
                      : "glass text-white/50 hover:text-white border border-white/8"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Code2, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("innoverse_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Auto-migrate the mock to prevent /profile/undefined
      if (!parsed.username && parsed.email) {
        parsed.username = parsed.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        localStorage.setItem("innoverse_user", JSON.stringify(parsed));
      }
      setUser(parsed);
    }
    const companyStored = localStorage.getItem("innoverse_company");
    if (companyStored) setCompany(JSON.parse(companyStored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("innoverse_user");
    setUser(null);
    router.push("/");
  };

  const NAV = [
    { href: "/hackathons", label: "Hackathons" },
    { href: "/explore", label: "Explore" },
    { href: "/problems", label: "Problems" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">Innov</span>
              <span className="text-white">erse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="text-white/60 hover:text-white font-medium text-sm transition-colors">
                {n.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {company ? (
              <>
                <Link href="/company-dashboard" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                  <Building2 size={14} />
                  {company.name}
                </Link>
                <button
                  onClick={() => { localStorage.removeItem("innoverse_company"); setCompany(null); router.push("/"); }}
                  className="px-4 py-2 rounded-lg glass border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : user ? (
              <>
                <Link href={`/profile/${user.username}`} className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                  @{user.username}
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg glass border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/company-login" className="flex items-center gap-1.5 text-emerald-400/80 hover:text-emerald-400 font-medium text-sm transition-colors">
                  <Building2 size={14} />
                  For Companies
                </Link>
                <Link href="/login" className="text-white/60 hover:text-white font-medium text-sm transition-colors">Log in</Link>
                <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg text-sm hover:opacity-90 transition-all">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="text-white/70 hover:text-white font-medium py-1 text-sm" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <hr className="border-white/5" />
            <Link href="/company-login" className="text-emerald-400/70 font-medium py-1 text-sm" onClick={() => setOpen(false)}>
              🏢 Company Portal
            </Link>
            <hr className="border-white/5" />
            {user ? (
              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-left text-red-400 font-medium py-1 text-sm">Sign Out</button>
            ) : (
              <>
                <Link href="/login" className="text-white/70 font-medium py-1 text-sm" onClick={() => setOpen(false)}>Log in</Link>
                <Link href="/register" className="w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-lg text-sm" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

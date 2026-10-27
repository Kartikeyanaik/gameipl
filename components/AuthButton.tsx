"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface AuthButtonProps {
  onOpenHistory?: () => void;
}

export default function AuthButton({ onOpenHistory }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 animate-pulse text-xs font-display text-slate-400">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
        <span>AUTHENTICATING...</span>
      </div>
    );
  }

  if (status === "authenticated" && session?.user) {
    const user = session.user;
    const displayName = user.name || user.email?.split("@")[0] || "Player";

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="cursor-pointer flex items-center gap-2.5 p-1 pl-3 pr-2 rounded-full bg-slate-900/90 border border-yellow-500/30 hover:border-yellow-400 shadow-md transition-all group"
        >
          <span className="font-display font-black text-xs text-white group-hover:text-yellow-400 tracking-wider uppercase truncate max-w-[120px]">
            {displayName}
          </span>

          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={26}
              height={26}
              className="rounded-full ring-2 ring-yellow-400/50"
              unoptimized
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-display font-black text-slate-950 text-xs shadow-sm">
              {displayName[0].toUpperCase()}
            </div>
          )}

          <span className="text-slate-400 text-xs">▼</span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#090e1c] border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User Profile Header */}
            <div className="px-3 py-2.5 border-b border-white/10 mb-1">
              <div className="font-display font-black text-sm text-white truncate">
                {user.name || "Authenticated User"}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {user.email}
              </div>
              <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-display font-black text-emerald-400 uppercase tracking-widest">
                <span>●</span> GOOGLE VERIFIED
              </div>
            </div>

            {/* Menu Actions */}
            {onOpenHistory && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHistory();
                }}
                className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-display font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>📜</span>
                <span>MY SAVED DRAFTS</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-display font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1"
            >
              <span>🚪</span>
              <span>SIGN OUT</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated: Google Sign In Button
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error("Sign in failed:", err);
      setIsSigningIn(false);
    }
  };

  if (isSigningIn) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-yellow-400/50 text-yellow-300 text-xs font-display font-black tracking-wider uppercase shadow-md animate-pulse">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
        <span>CONNECTING TO GOOGLE...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/15 hover:border-yellow-400/60 text-white hover:text-yellow-300 text-xs font-display font-black tracking-wider uppercase transition-all shadow-md hover:shadow-yellow-500/20 active:scale-95 group"
    >
      {/* Official Google 'G' Icon */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>SIGN IN WITH GOOGLE</span>
    </button>
  );
}

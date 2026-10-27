"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [troubleshootingTip, setTroubleshootingTip] = useState("");

  useEffect(() => {
    if (errorParam) {
      setVisible(true);

      switch (errorParam) {
        case "Callback":
        case "OAuthCallback":
          setErrorMessage("Sign-in callback encountered an issue.");
          setTroubleshootingTip(
            "If you entered a MongoDB connection string in .env.local, check that the password does not have angle brackets < > and that your IP address is whitelisted in MongoDB Atlas (Network Access -> 0.0.0.0/0)."
          );
          break;
        case "OAuthSignin":
          setErrorMessage("Could not connect to Google OAuth.");
          setTroubleshootingTip(
            "Verify that http://localhost:3000/api/auth/callback/google is listed in 'Authorized redirect URIs' in your Google Cloud Console."
          );
          break;
        case "Configuration":
          setErrorMessage("Authentication configuration error.");
          setTroubleshootingTip(
            "Check that AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and AUTH_SECRET are configured in .env.local."
          );
          break;
        case "AccessDenied":
          setErrorMessage("Access was denied.");
          setTroubleshootingTip(
            "The sign-in request was canceled or denied by Google."
          );
          break;
        default:
          setErrorMessage(`Authentication error: ${errorParam}`);
          setTroubleshootingTip("Please try signing in again.");
          break;
      }
    }
  }, [errorParam]);

  const handleDismiss = () => {
    setVisible(false);
    // Remove ?error= query parameter from URL without full reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Authentication alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl animate-in slide-in-from-top duration-200"
    >
      <div className="bg-[#120808]/95 backdrop-blur-md border border-red-500/40 rounded-2xl p-4 shadow-2xl shadow-red-950/50 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 font-bold text-sm">
          ⚠️
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-black text-xs text-red-400 uppercase tracking-wider">
              {errorMessage}
            </span>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss alert"
              className="cursor-pointer text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
            >
              ✕ DISMISS
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {troubleshootingTip}
          </p>
        </div>
      </div>
    </aside>
  );
}

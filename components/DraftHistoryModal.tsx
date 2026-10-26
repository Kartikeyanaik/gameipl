"use client";

import { useEffect, useState } from "react";
import type { IDraft } from "@/models/Draft";
import { TEAM_COLORS } from "@/data/types";

interface DraftHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeDraft: (draftId: string) => void;
}

export default function DraftHistoryModal({
  isOpen,
  onClose,
  onResumeDraft,
}: DraftHistoryModalProps) {
  const [drafts, setDrafts] = useState<IDraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch("/api/drafts/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          setDrafts(data.history);
        }
      })
      .catch((err) => console.error("Failed to load draft history:", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#080d1c] border border-white/15 p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display font-black text-2xl text-white tracking-wider uppercase flex items-center gap-2">
              <span>📜</span>
              <span>MY SAVED DRAFTS</span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Review your historical playing XIs and final verdicts
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar pr-1">
          {loading ? (
            <div className="text-center py-12 space-y-3 font-display">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                FETCHING SAVED DRAFTS...
              </p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12 space-y-2 font-display">
              <span className="text-4xl">🏏</span>
              <p className="text-base font-black text-slate-300 uppercase tracking-wider">
                NO COMPLETED DRAFTS FOUND
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Finish your first 11-round draft to save your Playing XI to your permanent collection!
              </p>
            </div>
          ) : (
            drafts.map((d) => {
              const formattedDate = new Date(d.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={d.draftId}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 hover:border-yellow-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-display font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md border border-yellow-400/20">
                        SCORE: {d.score?.overall ? d.score.overall.toFixed(1) : "N/A"}/100
                      </span>
                      {d.verdict && (
                        <span className="text-xs font-display font-black text-slate-300 flex items-center gap-1">
                          <span>{d.verdict.emoji}</span>
                          <span>{d.verdict.label}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-semibold pt-1">
                      Drafted on {formattedDate} • {d.picks?.length ?? 11} Players Selected
                    </div>

                    {/* Team pips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {d.picks?.slice(0, 6).map((p, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded text-white"
                          style={{
                            background: `${TEAM_COLORS[p.team]?.primary ?? "#888"}33`,
                            border: `1px solid ${TEAM_COLORS[p.team]?.primary ?? "#888"}66`,
                          }}
                        >
                          {p.player.name.split(" ").pop()} ({p.team})
                        </span>
                      ))}
                      {(d.picks?.length ?? 0) > 6 && (
                        <span className="text-[10px] text-slate-500 font-bold self-center">
                          +{d.picks.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onResumeDraft(d.draftId);
                      }}
                      className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-display font-black text-xs tracking-wider uppercase shadow-md transition-all"
                    >
                      VIEW XI ➔
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-display font-bold text-xs uppercase transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

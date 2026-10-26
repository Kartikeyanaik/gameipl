"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { HistoricalTeam } from "@/data/types";
import { TEAM_COLORS } from "@/data/types";
import HISTORICAL_TEAMS from "@/data/historicalTeams";
import { soundManager } from "@/utils/sound";

interface SpinWheelProps {
  onSpinComplete: (team: HistoricalTeam) => void;
  selectedTeam: HistoricalTeam | null;
  isSpinning: boolean;
  onSpinStart: () => HistoricalTeam | null | Promise<HistoricalTeam | null>;
}

// Display 10 large, readable, high-impact segments on the visual wheel
const VISUAL_SEGMENT_COUNT = 10;
const SEGMENT_ANGLE = (2 * Math.PI) / VISUAL_SEGMENT_COUNT;

// Diverse palette of iconic teams for the visual segments
const DEFAULT_PREVIEW_TEAMS: HistoricalTeam[] = [
  HISTORICAL_TEAMS.find((t) => t.id === "csk-2011")!,
  HISTORICAL_TEAMS.find((t) => t.id === "rcb-2016")!,
  HISTORICAL_TEAMS.find((t) => t.id === "mi-2019")!,
  HISTORICAL_TEAMS.find((t) => t.id === "kkr-2012")!,
  HISTORICAL_TEAMS.find((t) => t.id === "srh-2016")!,
  HISTORICAL_TEAMS.find((t) => t.id === "rr-2008")!,
  HISTORICAL_TEAMS.find((t) => t.id === "gt-2022")!,
  HISTORICAL_TEAMS.find((t) => t.id === "csk-2023")!,
  HISTORICAL_TEAMS.find((t) => t.id === "mi-2020")!,
  HISTORICAL_TEAMS.find((t) => t.id === "kkr-2024")!,
].filter(Boolean);

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 245, g: 158, b: 11 };
}

export default function SpinWheel({ onSpinComplete, isSpinning, onSpinStart }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const lastTickSegmentRef = useRef<number>(-1);
  const [canSpin, setCanSpin] = useState(true);
  const [hudStatus, setHudStatus] = useState<"READY" | "SPINNING" | "LOCKED">("READY");
  const [pointerActive, setPointerActive] = useState(false);

  // Active visual segments on the wheel
  const wheelSegmentsRef = useRef<HistoricalTeam[]>(DEFAULT_PREVIEW_TEAMS);

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(cx, cy) - 22;

    ctx.clearRect(0, 0, W, H);

    // 1. Outer Stadium Floodlight Rim (Gold & Metallic Carbon)
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = "#0c1322";
    ctx.fill();
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Secondary inner chrome ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Stadium LED Bulbs around the perimeter
    const totalLEDs = 30;
    const isSpin = spinningRef.current;
    for (let l = 0; l < totalLEDs; l++) {
      const lAngle = (l * 2 * Math.PI) / totalLEDs;
      const lx = cx + (radius + 10) * Math.cos(lAngle);
      const ly = cy + (radius + 10) * Math.sin(lAngle);
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);

      const isGold = (l + Math.floor(angle * 3)) % 2 === 0;
      ctx.fillStyle = isSpin
        ? isGold ? "#fef08a" : "#f59e0b"
        : isGold ? "#fbbf24" : "rgba(255,255,255,0.4)";
      ctx.fill();
    }

    // 3. Draw the 10 Wide, High-Contrast Team Segments
    const segments = wheelSegmentsRef.current;
    for (let i = 0; i < VISUAL_SEGMENT_COUNT; i++) {
      const startAngle = angle + i * SEGMENT_ANGLE;
      const endAngle = startAngle + SEGMENT_ANGLE;
      const team = segments[i % segments.length];
      const colors = TEAM_COLORS[team.team] ?? { primary: "#f59e0b", secondary: "#1e293b" };
      const { r, g, b } = hexToRgb(colors.primary);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      // Rich 3D gradient across wedge
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, radius);
      grad.addColorStop(0, `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.98)`);
      grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 1)`);
      grad.addColorStop(1, `rgba(${Math.max(0, r - 55)}, ${Math.max(0, g - 55)}, ${Math.max(0, b - 55)}, 1)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment separator line with golden glow
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer segment arc stroke
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // High-Impact Athletic Typography
      const midAngle = startAngle + SEGMENT_ANGLE / 2;
      const textR = radius * 0.65;
      const tx = cx + textR * Math.cos(midAngle);
      const ty = cy + textR * Math.sin(midAngle);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(midAngle + Math.PI / 2);

      // Shadow for text readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      // Big Bold Team Code
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 17px 'Rajdhani', -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(team.team, 0, -8);

      // Season Year in Gold
      ctx.fillStyle = "#fef08a";
      ctx.font = "800 13px 'Rajdhani', sans-serif";
      ctx.fillText(String(team.season), 0, 10);

      ctx.restore();
    }

    // 4. Center 3D Luxury Gold Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
    centerGrad.addColorStop(0, "#fbbf24");
    centerGrad.addColorStop(0.5, "#d97706");
    centerGrad.addColorStop(0.85, "#92400e");
    centerGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = centerGrad;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner Hub Dark Core
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#090d16";
    ctx.fill();
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Emblem in Hub
    ctx.fillStyle = "#facc15";
    ctx.font = "900 11px 'Rajdhani', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IPL", cx, cy - 6);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 9px 'Rajdhani', sans-serif";
    ctx.fillText("DRAFT", cx, cy + 7);

    // 5. Heavy 3D Golden Flapper Pointer at TOP (12 o'clock, pointing DOWN into wheel)
    const pWidth = 26;
    const pHeight = 32;
    const pTipY = cy - radius + 6;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, pTipY);
    ctx.lineTo(cx - pWidth / 2, pTipY - pHeight);
    ctx.lineTo(cx + pWidth / 2, pTipY - pHeight);
    ctx.closePath();

    const ptrGrad = ctx.createLinearGradient(cx - pWidth / 2, pTipY - pHeight, cx + pWidth / 2, pTipY);
    ptrGrad.addColorStop(0, "#fde047");
    ptrGrad.addColorStop(0.5, "#f59e0b");
    ptrGrad.addColorStop(1, "#b45309");
    ctx.fillStyle = ptrGrad;
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Diamond Jewel Rivet on pointer
    ctx.beginPath();
    ctx.arc(cx, pTipY - pHeight + 10, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }, []);

  // Initial draw
  useEffect(() => {
    drawWheel(angleRef.current);
  }, [drawWheel]);

  const handleSpin = useCallback(async () => {
    if (spinningRef.current || !canSpin) return;

    setCanSpin(false);
    setHudStatus("SPINNING");

    const chosenTeam = await onSpinStart();
    if (!chosenTeam) {
      setCanSpin(true);
      setHudStatus("READY");
      return;
    }

    spinningRef.current = true;

    // Place the target team at index 0 of current wheel segments,
    // and populate the remaining 9 segments with diverse exciting squads
    const otherSquads = HISTORICAL_TEAMS.filter((t) => t.id !== chosenTeam.id);
    const shuffledOthers = [...otherSquads].sort(() => Math.random() - 0.5).slice(0, VISUAL_SEGMENT_COUNT - 1);
    const activeSegments = [chosenTeam, ...shuffledOthers];
    wheelSegmentsRef.current = activeSegments;

    // Desired landing: We want segment 0 (chosenTeam) to align with top pointer (3*PI/2)
    // When angle = A, center of segment 0 is at A + 0.5 * SEGMENT_ANGLE.
    // We want A + 0.5 * SEGMENT_ANGLE = 1.5 * Math.PI => A = 1.5 * Math.PI - 0.5 * SEGMENT_ANGLE
    const desiredAngle = 1.5 * Math.PI - 0.5 * SEGMENT_ANGLE;

    const currentNormalized = ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const targetNormalized = ((desiredAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    let delta = targetNormalized - currentNormalized;
    if (delta < 0) delta += 2 * Math.PI;

    // 6 full spins + delta for cinematic broadcast spin
    const fullSpins = 6;
    const totalRotation = fullSpins * 2 * Math.PI + delta;
    const duration = 3000 + Math.random() * 400; // 3.0s - 3.4s
    const startAngle = angleRef.current;
    const startTime = performance.now();

    // Smooth cubic deceleration
    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const currentAng = startAngle + totalRotation * eased;
      angleRef.current = currentAng;
      drawWheel(currentAng);

      // Sound and visual pointer bounce as each peg passes
      const currentPeg = Math.floor(
        (((1.5 * Math.PI - currentAng) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)) /
          SEGMENT_ANGLE
      );
      if (currentPeg !== lastTickSegmentRef.current) {
        lastTickSegmentRef.current = currentPeg;
        soundManager.playTick();
        setPointerActive(true);
        setTimeout(() => setPointerActive(false), 45);
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        spinningRef.current = false;
        setHudStatus("LOCKED");
        soundManager.playReveal();
        if (chosenTeam) {
          onSpinComplete(chosenTeam);
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [canSpin, onSpinStart, onSpinComplete, drawWheel]);

  // Re-enable when ready
  useEffect(() => {
    if (isSpinning) {
      setCanSpin(true);
      setHudStatus("READY");
    }
  }, [isSpinning]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 select-none relative">
      {/* Stadium Floodlight Aura Glow Behind Wheel */}
      <div className="relative">
        <div
          className={`absolute -inset-6 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none ${
            hudStatus === "SPINNING"
              ? "bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 scale-105 opacity-60"
              : hudStatus === "LOCKED"
              ? "bg-emerald-500 opacity-50"
              : "bg-amber-500/30"
          }`}
        />

        {/* Pointer indicator glow */}
        <div
          className={`relative rounded-full transition-transform duration-75 ${
            pointerActive ? "scale-[1.012]" : "scale-100"
          }`}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer max-w-[340px] sm:max-w-[400px] max-h-[340px] sm:max-h-[400px]"
            onClick={isSpinning && canSpin ? handleSpin : undefined}
          />
        </div>
      </div>

      {/* Broadcast HUD Status Indicator */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/10 shadow-inner font-display text-xs tracking-widest uppercase">
        <span
          className={`w-2 h-2 rounded-full ${
            hudStatus === "SPINNING"
              ? "bg-amber-400 animate-ping"
              : hudStatus === "LOCKED"
              ? "bg-emerald-400"
              : "bg-yellow-400 animate-pulse"
          }`}
        />
        <span className="text-slate-400 font-bold">STATUS:</span>
        <span
          className={`font-black ${
            hudStatus === "SPINNING"
              ? "text-amber-400"
              : hudStatus === "LOCKED"
              ? "text-emerald-400"
              : "text-white"
          }`}
        >
          {hudStatus === "SPINNING"
            ? "SPINNING WHEEL..."
            : hudStatus === "LOCKED"
            ? "TARGET LOCKED!"
            : "READY TO SPIN"}
        </span>
      </div>

      {/* High-Impact Gold 3D Spin Button */}
      {isSpinning && (
        <button
          onClick={handleSpin}
          disabled={!canSpin}
          className={`
            group relative px-14 py-4 rounded-2xl font-display font-black text-2xl tracking-widest uppercase
            transition-all duration-200 shadow-2xl active:scale-95
            ${
              canSpin
                ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-950 shadow-amber-500/50 hover:scale-105 hover:shadow-amber-500/70 border border-yellow-200/50"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
            }
          `}
        >
          {canSpin ? (
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:rotate-45 transition-transform duration-300">
                🎡
              </span>
              <span>SPIN THE WHEEL</span>
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <span className="text-2xl animate-spin">⚡</span>
              <span>CALCULATING...</span>
            </span>
          )}
        </button>
      )}
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from "react";
import { sound } from "./SoundSystem";
import { musicEngine } from "@/lib/MusicEngine";
import {
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  Maximize2,
  Camera,
  Film,
  Zap,
  Activity,
  Play,
} from "lucide-react";

export type RenderMode = "solid" | "wireframe" | "hologram";
export type ColorTheme = "crimson" | "cyan" | "violet" | "lime";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  indices: number[];
  color?: string;
  fill?: string;
  stroke?: string;
  normal?: Point3D;
}

const COLOR_MAP: Record<ColorTheme, { primary: string; secondary: string; glow: string }> = {
  cyan: { primary: "#00f6ff", secondary: "rgba(0, 246, 255, 0.15)", glow: "rgba(0, 246, 255, 0.8)" },
  crimson: { primary: "#ff003c", secondary: "rgba(255, 0, 60, 0.15)", glow: "rgba(255, 0, 60, 0.8)" },
  violet: { primary: "#bf00ff", secondary: "rgba(191, 0, 255, 0.15)", glow: "rgba(191, 0, 255, 0.8)" },
  lime: { primary: "#00ff66", secondary: "rgba(0, 255, 102, 0.15)", glow: "rgba(0, 255, 102, 0.8)" },
};

export function Interactive3DStage() {
  const [activeObject, setActiveObject] = useState<"clapper" | "lens" | "keyframe" | "torus">("clapper");
  const [renderMode, setRenderMode] = useState<RenderMode>("solid");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("cyan");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotX, setRotX] = useState<number>(18);
  const [rotY, setRotY] = useState<number>(-28);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const anglesRef = useRef<{ x: number; y: number }>({ x: 18, y: -28 });
  const clickWave = useRef<{ active: boolean; radius: number; maxRadius: number }>({ active: false, radius: 0, maxRadius: 180 });
  const clapAngle = useRef<number>(0);
  const isClapping = useRef<boolean>(false);

  // Sync ref with state
  anglesRef.current = { x: rotX, y: rotY };

  // Trigger clap animation for director slate
  const triggerClap = useCallback(() => {
    if (isClapping.current) return;
    isClapping.current = true;
    sound.playClick(1200, "square");
    clapAngle.current = 32;

    const clapAnim = () => {
      clapAngle.current -= 4;
      if (clapAngle.current <= 0) {
        clapAngle.current = 0;
        isClapping.current = false;
        sound.playClick(500, "triangle");
      } else {
        requestAnimationFrame(clapAnim);
      }
    };
    requestAnimationFrame(clapAnim);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Shockwave pulse trigger
    clickWave.current = { active: true, radius: 5, maxRadius: 160 };

    if (activeObject === "clapper") {
      triggerClap();
    } else {
      sound.playClick(750);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    velocity.current = { x: dy * 0.45, y: dx * 0.45 };
    setRotX((prev) => prev + dy * 0.45);
    setRotY((prev) => prev + dx * 0.45);

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const resetView = () => {
    sound.playClick(600);
    setRotX(18);
    setRotY(-28);
    velocity.current = { x: 0, y: 0 };
  };

  // Main 3D Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.016;

      // Handle inertia and auto-rotate
      if (!isDragging.current) {
        if (autoRotate) {
          anglesRef.current.y += 0.45;
        }
        // Damping
        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;
        anglesRef.current.x += velocity.current.x;
        anglesRef.current.y += velocity.current.y;
      }

      const w = (canvas.width = canvas.parentElement?.clientWidth || 700);
      const h = (canvas.height = 420);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background radial glow
      const themeColors = COLOR_MAP[colorTheme];
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(cx, cy));
      bgGrad.addColorStop(0, "rgba(20, 20, 30, 0.8)");
      bgGrad.addColorStop(0.5, "rgba(10, 10, 16, 0.95)");
      bgGrad.addColorStop(1, "rgba(5, 5, 8, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Perspective 3D Grid Floor
      const gridY = 120;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const fov = 400;
      for (let gz = -300; gz <= 400; gz += 50) {
        const pz = fov / (fov + gz);
        const y = cy + gridY * pz;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // Audio Energy calculation
      const audioEnergy = musicEngine.getAudioEnergy();
      const pulseScale = 1 + audioEnergy * 0.15;

      // Camera rotation matrix
      const radX = (anglesRef.current.x * Math.PI) / 180;
      const radY = (anglesRef.current.y * Math.PI) / 180;
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      const project = (p: Point3D): { x: number; y: number; z: number } => {
        // Rotate around Y
        let x1 = p.x * cosY - p.z * sinY;
        let y1 = p.y;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate around X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Apply audio pulse
        x2 *= pulseScale;
        y2 *= pulseScale;
        z2 *= pulseScale;

        // Perspective scale
        const scale = fov / (fov + z2 + 250);
        return {
          x: cx + x2 * scale,
          y: cy + y2 * scale,
          z: z2,
        };
      };

      // Shockwave particle effect
      if (clickWave.current.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, clickWave.current.radius, 0, Math.PI * 2);
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 2;
        ctx.shadowColor = themeColors.primary;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 1 - clickWave.current.radius / clickWave.current.maxRadius;
        ctx.stroke();
        ctx.restore();

        clickWave.current.radius += 6;
        if (clickWave.current.radius >= clickWave.current.maxRadius) {
          clickWave.current.active = false;
        }
      }

      // -------------------------------------------------------------
      // 3D GEOMETRY GENERATOR PER OBJECT
      // -------------------------------------------------------------
      if (activeObject === "clapper") {
        // 🎬 DIRECTOR'S CLAPPERBOARD
        const bw = 130;
        const bh = 90;
        const bd = 14;

        // Base slate box
        const baseBox: Point3D[] = [
          { x: -bw, y: -bh * 0.2, z: -bd },
          { x: bw, y: -bh * 0.2, z: -bd },
          { x: bw, y: bh, z: -bd },
          { x: -bw, y: bh, z: -bd },
          { x: -bw, y: -bh * 0.2, z: bd },
          { x: bw, y: -bh * 0.2, z: bd },
          { x: bw, y: bh, z: bd },
          { x: -bw, y: bh, z: bd },
        ];

        const baseFaces = [
          { indices: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, isFront: false },
          { indices: [4, 5, 6, 7], normal: { x: 0, y: 0, z: 1 }, isFront: true }, // Front Face
          { indices: [0, 4, 7, 3], normal: { x: -1, y: 0, z: 0 } },
          { indices: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 } },
          { indices: [3, 2, 6, 7], normal: { x: 0, y: 1, z: 0 } },
        ];

        // Project base points
        const projBase = baseBox.map(project);

        // Sort faces by depth
        const sortedBaseFaces = baseFaces.map((face) => {
          const zSum = face.indices.reduce((sum, i) => sum + projBase[i].z, 0);
          return { ...face, avgZ: zSum / face.indices.length };
        }).sort((a, b) => b.avgZ - a.avgZ);

        sortedBaseFaces.forEach((face) => {
          ctx.beginPath();
          ctx.moveTo(projBase[face.indices[0]].x, projBase[face.indices[0]].y);
          for (let i = 1; i < face.indices.length; i++) {
            ctx.lineTo(projBase[face.indices[i]].x, projBase[face.indices[i]].y);
          }
          ctx.closePath();

          if (renderMode === "solid") {
            ctx.fillStyle = face.isFront ? "#0f0f15" : "#1a1a24";
            ctx.fill();
            ctx.strokeStyle = themeColors.primary;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Slate Text on Front
            if (face.isFront && projBase[face.indices[0]].z > 0) {
              const p0 = projBase[4];
              const p1 = projBase[5];
              const p3 = projBase[7];
              const midX = (p0.x + p1.x + p3.x) / 3;
              const midY = (p0.y + p1.y + p3.y) / 3;

              ctx.save();
              ctx.fillStyle = themeColors.primary;
              ctx.font = "bold 10px JetBrains Mono, monospace";
              ctx.textAlign = "center";
              ctx.fillText("PROD: BAYCON MOTION", midX, midY - 14);
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 9px JetBrains Mono, monospace";
              ctx.fillText("SCENE: 01   TAKE: 01   4K60", midX, midY + 4);
              ctx.fillStyle = "rgba(255,255,255,0.6)";
              ctx.fillText("DIRECTOR: BAYO   FPS: 60", midX, midY + 22);
              ctx.restore();
            }
          } else {
            ctx.strokeStyle = themeColors.primary;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = themeColors.primary;
            ctx.shadowBlur = 6;
            ctx.stroke();
          }
        });

        // Top Clapper Arm (Articulated around hinge)
        const armH = 26;
        const clapRad = (clapAngle.current * Math.PI) / 180;
        const armBox: Point3D[] = [
          { x: -bw, y: -bh * 0.2, z: 0 },
          { x: bw, y: -bh * 0.2, z: 0 },
          { x: bw, y: -bh * 0.2 - armH, z: 0 },
          { x: -bw, y: -bh * 0.2 - armH, z: 0 },
        ].map((pt) => {
          // Rotate around top-left hinge
          const rx = pt.x;
          const ry = -bh * 0.2 + (pt.y + bh * 0.2) * Math.cos(clapRad);
          const rz = (pt.y + bh * 0.2) * Math.sin(clapRad);
          return { x: rx, y: ry, z: rz };
        });

        const projArm = armBox.map(project);
        ctx.beginPath();
        ctx.moveTo(projArm[0].x, projArm[0].y);
        for (let i = 1; i < projArm.length; i++) {
          ctx.lineTo(projArm[i].x, projArm[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = "#1e1e2d";
        ctx.fill();
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Diagonal Chevron Stripes on Clapper Arm
        const steps = 7;
        for (let s = 0; s < steps; s++) {
          const t0 = s / steps;
          const t1 = (s + 0.5) / steps;
          const sx0 = projArm[0].x + (projArm[1].x - projArm[0].x) * t0;
          const sy0 = projArm[0].y + (projArm[1].y - projArm[0].y) * t0;
          const sx1 = projArm[3].x + (projArm[2].x - projArm[3].x) * t1;
          const sy1 = projArm[3].y + (projArm[2].y - projArm[3].y) * t1;

          ctx.beginPath();
          ctx.moveTo(sx0, sy0);
          ctx.lineTo(sx1, sy1);
          ctx.strokeStyle = s % 2 === 0 ? themeColors.primary : "#ffffff";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      } else if (activeObject === "lens") {
        // 🎥 ANAMORPHIC CINEMA LENS
        const rings = [
          { r: 90, z: -80, color: "#14141e" },
          { r: 84, z: -50, color: "#1e1e2c" },
          { r: 84, z: 0, color: "#252538" },
          { r: 92, z: 30, color: "#1a1a24" }, // Focus ring
          { r: 76, z: 70, color: "#0f0f18" },
          { r: 70, z: 90, color: "#00f6ff" }, // Front Glass
        ];

        const segments = 28;

        for (let i = 0; i < rings.length - 1; i++) {
          const r1 = rings[i];
          const r2 = rings[i + 1];

          for (let s = 0; s < segments; s++) {
            const a1 = (s * Math.PI * 2) / segments;
            const a2 = ((s + 1) * Math.PI * 2) / segments;

            const p1 = project({ x: Math.cos(a1) * r1.r, y: Math.sin(a1) * r1.r, z: r1.z });
            const p2 = project({ x: Math.cos(a2) * r1.r, y: Math.sin(a2) * r1.r, z: r1.z });
            const p3 = project({ x: Math.cos(a2) * r2.r, y: Math.sin(a2) * r2.r, z: r2.z });
            const p4 = project({ x: Math.cos(a1) * r2.r, y: Math.sin(a1) * r2.r, z: r2.z });

            // Surface normal shading
            const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
            if (avgZ < 300) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.lineTo(p4.x, p4.y);
              ctx.closePath();

              if (renderMode === "solid") {
                const shade = Math.floor(18 + Math.cos(a1 + time) * 15);
                ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 12})`;
                ctx.fill();
                ctx.strokeStyle = themeColors.primary;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              } else {
                ctx.strokeStyle = themeColors.primary;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }
        }

        // Front glass reflection sheen (Anamorphic flare)
        const frontCenter = project({ x: 0, y: 0, z: 90 });
        const flareGrad = ctx.createLinearGradient(
          frontCenter.x - 70,
          frontCenter.y - 70,
          frontCenter.x + 70,
          frontCenter.y + 70
        );
        flareGrad.addColorStop(0, "rgba(0, 246, 255, 0.45)");
        flareGrad.addColorStop(0.5, "rgba(255, 0, 60, 0.25)");
        flareGrad.addColorStop(1, "rgba(191, 0, 255, 0.4)");

        ctx.save();
        ctx.beginPath();
        ctx.arc(frontCenter.x, frontCenter.y, 45 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = flareGrad;
        ctx.fill();
        ctx.strokeStyle = "#00f6ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00f6ff";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      } else if (activeObject === "keyframe") {
        // 💎 TIMELINE KEYFRAME CRYSTAL DIAMOND
        const size = 110;
        const vertices: Point3D[] = [
          { x: 0, y: -size, z: 0 }, // Top
          { x: size, y: 0, z: 0 },  // Right
          { x: 0, y: 0, z: size },  // Front
          { x: -size, y: 0, z: 0 }, // Left
          { x: 0, y: 0, z: -size }, // Back
          { x: 0, y: size, z: 0 },  // Bottom
        ];

        const faces = [
          // Top pyramid
          [0, 1, 2],
          [0, 2, 3],
          [0, 3, 4],
          [0, 4, 1],
          // Bottom pyramid
          [5, 2, 1],
          [5, 3, 2],
          [5, 4, 3],
          [5, 1, 4],
        ];

        const proj = vertices.map(project);

        // Depth sort faces
        const sortedFaces = faces.map((indices) => {
          const avgZ = (proj[indices[0]].z + proj[indices[1]].z + proj[indices[2]].z) / 3;
          return { indices, avgZ };
        }).sort((a, b) => b.avgZ - a.avgZ);

        sortedFaces.forEach(({ indices }) => {
          const p1 = proj[indices[0]];
          const p2 = proj[indices[1]];
          const p3 = proj[indices[2]];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();

          if (renderMode === "solid") {
            const faceGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            faceGrad.addColorStop(0, themeColors.secondary);
            faceGrad.addColorStop(1, "rgba(255, 255, 255, 0.15)");
            ctx.fillStyle = faceGrad;
            ctx.fill();

            ctx.strokeStyle = themeColors.primary;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = themeColors.primary;
            ctx.lineWidth = 1.8;
            ctx.shadowColor = themeColors.primary;
            ctx.shadowBlur = 10;
            ctx.stroke();
          }
        });

        // Orbiting Bezier anchor handles
        const orbitAngle = time * 2;
        const h1 = project({
          x: Math.cos(orbitAngle) * (size * 1.3),
          y: 0,
          z: Math.sin(orbitAngle) * (size * 1.3),
        });
        const h2 = project({
          x: -Math.cos(orbitAngle) * (size * 1.3),
          y: 0,
          z: -Math.sin(orbitAngle) * (size * 1.3),
        });

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(h1.x, h1.y);
        ctx.lineTo(h2.x, h2.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        [h1, h2].forEach((h) => {
          ctx.beginPath();
          ctx.arc(h.x, h.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = themeColors.primary;
          ctx.shadowColor = themeColors.primary;
          ctx.shadowBlur = 12;
          ctx.fill();
        });
        ctx.restore();
      } else {
        // ⚡ AUDIO REACTOR TORUS
        const majorR = 100;
        const minorR = 35 + audioEnergy * 25;
        const segU = 24;
        const segV = 16;

        for (let u = 0; u < segU; u++) {
          const a1 = (u * Math.PI * 2) / segU;
          const a2 = ((u + 1) * Math.PI * 2) / segU;

          for (let v = 0; v < segV; v++) {
            const b1 = (v * Math.PI * 2) / segV;
            const b2 = ((v + 1) * Math.PI * 2) / segV;

            const calcPt = (a: number, b: number): Point3D => {
              const r = majorR + minorR * Math.cos(b);
              return {
                x: r * Math.cos(a),
                y: minorR * Math.sin(b),
                z: r * Math.sin(a),
              };
            };

            const p1 = project(calcPt(a1, b1));
            const p2 = project(calcPt(a2, b1));
            const p3 = project(calcPt(a2, b2));
            const p4 = project(calcPt(a1, b2));

            const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
            if (avgZ < 250) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.lineTo(p4.x, p4.y);
              ctx.closePath();

              if (renderMode === "solid") {
                ctx.fillStyle = u % 2 === 0 ? themeColors.secondary : "rgba(255, 255, 255, 0.05)";
                ctx.fill();
                ctx.strokeStyle = themeColors.primary;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              } else {
                ctx.strokeStyle = themeColors.primary;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeObject, renderMode, colorTheme, autoRotate]);

  return (
    <div className="relative rounded-3xl border border-cyan-400/40 bg-card/80 p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,246,255,0.15)] overflow-hidden">
      {/* Decorative Corner Laser Marks */}
      <div className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Control Bar & Object Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,246,255,0.4)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
              <span>● INTERACTIVE 3D VIEWPORT</span>
              <span className="text-border">|</span>
              <span className="text-slate-400">REALTIME 60 FPS</span>
            </div>
            <h3 className="font-aesthetic text-xl font-black text-white tracking-wide">
              VIDEO STUDIO <span className="font-editorial italic font-normal text-cyan-300">Artifacts</span>
            </h3>
          </div>
        </div>

        {/* 3D Object Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            onClick={() => {
              sound.playClick(700);
              setActiveObject("clapper");
            }}
            data-cursor="CLAPPER"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
              activeObject === "clapper"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,246,255,0.4)]"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🎬 Clapperboard</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(750);
              setActiveObject("lens");
            }}
            data-cursor="CINEMA LENS"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
              activeObject === "lens"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,246,255,0.4)]"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🎥 Cinema Lens</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(800);
              setActiveObject("keyframe");
            }}
            data-cursor="KEYFRAME"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
              activeObject === "keyframe"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,246,255,0.4)]"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span>💎 Keyframe Crystal</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(850);
              setActiveObject("torus");
            }}
            data-cursor="AUDIO REACTOR"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
              activeObject === "torus"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,246,255,0.4)]"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span>⚡ Audio Reactor</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative my-4 w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner group">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Viewport Top HUD Overlays */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider">
              ROT X: {Math.round(anglesRef.current.x)}° | ROT Y: {Math.round(anglesRef.current.y)}°
            </span>
          </div>
          <span className="text-slate-500">
            AUDIO PULSE: {(musicEngine.getAudioEnergy() * 100).toFixed(0)}%
          </span>
        </div>

        {/* Viewport Bottom Instruction Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none rounded-full bg-black/70 px-4 py-1.5 border border-white/15 backdrop-blur-md font-mono text-[11px] font-bold text-slate-200 tracking-wider shadow-lg flex items-center gap-2">
          <span>🖐️ DRAG TO ROTATE 360°</span>
          <span className="text-cyan-400">●</span>
          <span>CLICK TO TRIGGER IMPACT</span>
        </div>

        {/* Reset View Button */}
        <button
          onClick={resetView}
          title="Reset Camera Angle"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors shadow-lg"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Parameter Adjusters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 font-mono text-xs">
        {/* Render Mode */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">MODE:</span>
          {(["solid", "wireframe", "hologram"] as RenderMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sound.playClick(650);
                setRenderMode(mode);
              }}
              className={`rounded-md px-2.5 py-1 uppercase text-[10px] font-bold border transition-all ${
                renderMode === mode
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                  : "border-border text-muted-foreground hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">ACCENT:</span>
          {(["cyan", "crimson", "violet", "lime"] as ColorTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => {
                sound.playClick(700);
                setColorTheme(theme);
              }}
              style={{ borderColor: COLOR_MAP[theme].primary }}
              className={`h-5 w-5 rounded-full border-2 transition-transform ${
                colorTheme === theme ? "scale-125 shadow-[0_0_10px_currentColor]" : "opacity-40 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        {/* Auto Rotate Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick(600);
              setAutoRotate(!autoRotate);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 border text-[10px] font-bold transition-all ${
              autoRotate
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>AUTO SPIN: {autoRotate ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

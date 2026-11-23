import { useEffect, useRef } from "react";
import { sound } from "./SoundSystem";
import { musicEngine } from "@/lib/MusicEngine";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

type ObjectKind = "keyframe" | "clapper" | "lens" | "prism" | "torus" | "reel";

interface Floating3DItem {
  id: number;
  kind: ObjectKind;
  x: number;
  y: number;
  z: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  scale: number;
  targetScale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  targetRotSpeedMultiplier: number;
  currentRotSpeedMultiplier: number;
  color: string;
  glowColor: string;
  label: string;
  isHovered: boolean;
  hoverProgress: number;
  pulseOffset: number;
  clapperAngle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function Floating3DObjects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isMobile = width < 768;

    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseActive = false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      isMouseActive = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMouseActive = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMouseActive = true;
      }
    };

    const handleTouchEnd = () => {
      mouseX = -9999;
      mouseY = -9999;
      isMouseActive = false;
    };

    // 6 objects on desktop, 3 on mobile for maximum 60FPS fluid mobile scrolling
    const kinds: { kind: ObjectKind; label: string; color: string; glow: string; size: number }[] = [
      { kind: "keyframe", label: "KEYFRAME // BEZIER", color: "#00f6ff", glow: "rgba(0, 246, 255, 0.8)", size: isMobile ? 30 : 36 },
      { kind: "clapper", label: "SLATE // 4K60 DCI", color: "#ff003c", glow: "rgba(255, 0, 60, 0.85)", size: isMobile ? 32 : 40 },
      { kind: "lens", label: "ANAMORPHIC LENS", color: "#00f6ff", glow: "rgba(0, 246, 255, 0.75)", size: isMobile ? 30 : 38 },
      { kind: "prism", label: "RETENTION PRISM", color: "#bf00ff", glow: "rgba(191, 0, 255, 0.8)", size: 34 },
      { kind: "torus", label: "AUDIO REACTOR 3D", color: "#00ff66", glow: "rgba(0, 255, 102, 0.8)", size: 36 },
      { kind: "keyframe", label: "ACES COLOR MATRIX", color: "#ffbe0b", glow: "rgba(255, 190, 11, 0.8)", size: 32 },
    ];

    const activeKinds = isMobile ? kinds.slice(0, 3) : kinds;

    const items: Floating3DItem[] = activeKinds.map((spec, i) => {
      const startX = (width / (activeKinds.length + 1)) * (i + 1) + (Math.random() - 0.5) * 60;
      const startY = height * 0.2 + (Math.random() * (height * 0.6));
      return {
        id: i,
        kind: spec.kind,
        x: startX,
        y: startY,
        z: Math.random() * 80 - 40,
        baseZ: Math.random() * 80 - 40,
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.3),
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.1,
        baseSize: spec.size,
        scale: 1,
        targetScale: 1,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: 0.01 + Math.random() * 0.012,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        targetRotSpeedMultiplier: 1,
        currentRotSpeedMultiplier: 1,
        color: spec.color,
        glowColor: spec.glow,
        label: spec.label,
        isHovered: false,
        hoverProgress: 0,
        pulseOffset: Math.random() * Math.PI * 2,
        clapperAngle: 0,
      };
    });

    const particles: Particle[] = [];

    const spawnSparks = (x: number, y: number, color: string, count = 6) => {
      // Reduce spark count on mobile
      const actualCount = isMobile ? Math.min(3, count) : count;
      for (let i = 0; i < actualCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: isMobile ? 18 : 25 + Math.random() * 15,
          color,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      items.forEach((item) => {
        const dist = Math.hypot(item.x - e.clientX, item.y - e.clientY);
        if (dist < item.baseSize * 2.0) {
          sound.playClick(1100, "square");
          item.targetRotSpeedMultiplier = 5.0;
          item.targetScale = 1.35;
          spawnSparks(item.x, item.y, item.color, isMobile ? 5 : 12);
          if (item.kind === "clapper") {
            item.clapperAngle = 30;
          }
        }
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);

    let time = 0;

    // 3D Projection Helper
    const projectPoint = (
      p: Point3D,
      rotX: number,
      rotY: number,
      rotZ: number,
      scale: number,
      originX: number,
      originY: number,
      fov = 340
    ) => {
      // Rotation around X
      let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
      let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);
      let x1 = p.x;

      // Rotation around Y
      let x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);
      let y2 = y1;

      // Rotation around Z
      let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
      let z3 = z2;

      // Perspective divide
      const pScale = fov / (fov + z3 + 120);
      return {
        x: originX + x3 * scale * pScale,
        y: originY + y3 * scale * pScale,
        z: z3,
      };
    };

    let lastRenderTime = performance.now();

    const render = (currentTime: number) => {
      // Pause completely if tab is hidden
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      // 30 FPS cap on mobile to save GPU cycles and battery
      const targetFps = isMobile ? 30 : 60;
      const interval = 1000 / targetFps;
      const elapsed = currentTime - lastRenderTime;

      if (elapsed < interval) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = currentTime - (elapsed % interval);

      time += isMobile ? 0.032 : 0.016;
      ctx.clearRect(0, 0, width, height);

      const audioPulse = musicEngine.getAudioEnergy();

      // Update & Render floating items
      items.forEach((item) => {
        // Natural drifting movement
        item.x += item.vx;
        item.y += item.vy + Math.sin(time + item.pulseOffset) * 0.35;
        item.z += item.vz;

        // Wrap around screen edges smoothly
        const padding = 100;
        if (item.x < -padding) item.x = width + padding;
        if (item.x > width + padding) item.x = -padding;
        if (item.y < -padding) item.y = height + padding;
        if (item.y > height + padding) item.y = -padding;

        // Hit Detection with Mouse Cursor
        const distToMouse = Math.hypot(item.x - mouseX, item.y - mouseY);
        const hitRadius = item.baseSize * 2.2;
        const isHovered = isMouseActive && distToMouse < hitRadius;

        if (isHovered && !item.isHovered) {
          // Trigger hover enter sound & spark burst
          sound.playClick(850);
          spawnSparks(item.x, item.y, item.color, 8);
          if (item.kind === "clapper") {
            item.clapperAngle = 28;
          }
        }

        item.isHovered = isHovered;

        // Animate hover progress & spin acceleration
        if (isHovered) {
          item.targetScale = 1.35;
          item.targetRotSpeedMultiplier = 3.8;
          item.hoverProgress = Math.min(1, item.hoverProgress + 0.12);

          // Subtle magnetic drift toward mouse
          const dx = mouseX - item.x;
          const dy = mouseY - item.y;
          item.x += dx * 0.02;
          item.y += dy * 0.02;

          // Occasional spark while hovering
          if (Math.random() < 0.18) {
            spawnSparks(item.x + (Math.random() - 0.5) * 30, item.y + (Math.random() - 0.5) * 30, item.color, 1);
          }
        } else {
          item.targetScale = 1.0;
          item.targetRotSpeedMultiplier = 1.0;
          item.hoverProgress = Math.max(0, item.hoverProgress - 0.05);
        }

        // Spring interpolation for scale and rotation speed
        item.scale += (item.targetScale - item.scale) * 0.12;
        item.currentRotSpeedMultiplier += (item.targetRotSpeedMultiplier - item.currentRotSpeedMultiplier) * 0.08;

        // Rotation integration
        item.rotX += item.rotSpeedX * item.currentRotSpeedMultiplier;
        item.rotY += item.rotSpeedY * item.currentRotSpeedMultiplier;
        item.rotZ += item.rotSpeedZ * item.currentRotSpeedMultiplier;

        if (item.clapperAngle > 0) {
          item.clapperAngle = Math.max(0, item.clapperAngle - 1.8);
        }

        const renderScale = item.scale * (1 + audioPulse * 0.12);
        const s = item.baseSize;

        ctx.save();

        // Hover Ambient Glow Halo
        if (item.hoverProgress > 0.01) {
          const haloGrad = ctx.createRadialGradient(item.x, item.y, 5, item.x, item.y, s * 2.2);
          haloGrad.addColorStop(0, item.glowColor);
          haloGrad.addColorStop(0.5, "rgba(0, 246, 255, 0.15)");
          haloGrad.addColorStop(1, "transparent");

          ctx.fillStyle = haloGrad;
          ctx.globalAlpha = item.hoverProgress * 0.85;
          ctx.beginPath();
          ctx.arc(item.x, item.y, s * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = item.color;
        ctx.fillStyle = "rgba(10, 12, 18, 0.75)";
        if (!isMobile) {
          ctx.shadowColor = item.color;
          ctx.shadowBlur = item.isHovered ? 16 : 4;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.lineWidth = item.isHovered ? 2.2 : 1.4;

        // -----------------------------------------------------------
        // DRAW 3D MODEL GEOMETRY
        // -----------------------------------------------------------
        if (item.kind === "keyframe") {
          // 💎 3D OCTAHEDRON KEYFRAME
          const verts: Point3D[] = [
            { x: 0, y: -s, z: 0 },
            { x: s, y: 0, z: 0 },
            { x: 0, y: 0, z: s },
            { x: -s, y: 0, z: 0 },
            { x: 0, y: 0, z: -s },
            { x: 0, y: s, z: 0 },
          ];

          const faces = [
            [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
            [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4],
          ];

          const proj = verts.map((v) =>
            projectPoint(v, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y)
          );

          faces.forEach((f, idx) => {
            ctx.beginPath();
            ctx.moveTo(proj[f[0]].x, proj[f[0]].y);
            ctx.lineTo(proj[f[1]].x, proj[f[1]].y);
            ctx.lineTo(proj[f[2]].x, proj[f[2]].y);
            ctx.closePath();

            // Facet fill
            ctx.fillStyle = idx % 2 === 0 ? "rgba(0, 246, 255, 0.12)" : "rgba(255, 0, 60, 0.08)";
            ctx.fill();
            ctx.stroke();
          });
        } else if (item.kind === "clapper") {
          // 🎬 3D CLAPPERBOARD SLATE
          const bw = s * 1.1;
          const bh = s * 0.75;
          const bd = s * 0.18;

          const baseVerts: Point3D[] = [
            { x: -bw, y: -bh * 0.2, z: -bd },
            { x: bw, y: -bh * 0.2, z: -bd },
            { x: bw, y: bh, z: -bd },
            { x: -bw, y: bh, z: -bd },
            { x: -bw, y: -bh * 0.2, z: bd },
            { x: bw, y: -bh * 0.2, z: bd },
            { x: bw, y: bh, z: bd },
            { x: -bw, y: bh, z: bd },
          ];

          const proj = baseVerts.map((v) =>
            projectPoint(v, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y)
          );

          // Front face
          ctx.beginPath();
          ctx.moveTo(proj[4].x, proj[4].y);
          ctx.lineTo(proj[5].x, proj[5].y);
          ctx.lineTo(proj[6].x, proj[6].y);
          ctx.lineTo(proj[7].x, proj[7].y);
          ctx.closePath();
          ctx.fillStyle = "rgba(15, 15, 22, 0.9)";
          ctx.fill();
          ctx.stroke();

          // Articulated Clapper Arm
          const armRad = (item.clapperAngle * Math.PI) / 180;
          const armH = s * 0.28;
          const armVerts: Point3D[] = [
            { x: -bw, y: -bh * 0.2, z: 0 },
            { x: bw, y: -bh * 0.2, z: 0 },
            { x: bw, y: -bh * 0.2 - armH, z: 0 },
            { x: -bw, y: -bh * 0.2 - armH, z: 0 },
          ].map((pt) => ({
            x: pt.x,
            y: -bh * 0.2 + (pt.y + bh * 0.2) * Math.cos(armRad),
            z: (pt.y + bh * 0.2) * Math.sin(armRad),
          }));

          const projArm = armVerts.map((v) =>
            projectPoint(v, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y)
          );

          ctx.beginPath();
          ctx.moveTo(projArm[0].x, projArm[0].y);
          ctx.lineTo(projArm[1].x, projArm[1].y);
          ctx.lineTo(projArm[2].x, projArm[2].y);
          ctx.lineTo(projArm[3].x, projArm[3].y);
          ctx.closePath();
          ctx.fillStyle = "rgba(25, 25, 35, 0.95)";
          ctx.fill();
          ctx.strokeStyle = "#ff003c";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Chevron stripes on clapper arm
          ctx.strokeStyle = "#00f6ff";
          ctx.lineWidth = 2;
          for (let st = 1; st < 4; st++) {
            const t = st / 4;
            const pA = {
              x: projArm[0].x + (projArm[1].x - projArm[0].x) * t,
              y: projArm[0].y + (projArm[1].y - projArm[0].y) * t,
            };
            const pB = {
              x: projArm[3].x + (projArm[2].x - projArm[3].x) * (t + 0.1),
              y: projArm[3].y + (projArm[2].y - projArm[3].y) * (t + 0.1),
            };
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        } else if (item.kind === "lens") {
          // 🎥 3D CINEMA LENS (Cylindrical rings)
          const segments = 12;
          const r1 = s * 0.9;
          const r2 = s * 0.75;
          const len = s * 0.8;

          for (let i = 0; i < segments; i++) {
            const a1 = (i * Math.PI * 2) / segments;
            const a2 = ((i + 1) * Math.PI * 2) / segments;

            const p1 = projectPoint({ x: Math.cos(a1) * r1, y: Math.sin(a1) * r1, z: -len / 2 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
            const p2 = projectPoint({ x: Math.cos(a2) * r1, y: Math.sin(a2) * r1, z: -len / 2 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
            const p3 = projectPoint({ x: Math.cos(a2) * r2, y: Math.sin(a2) * r2, z: len / 2 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
            const p4 = projectPoint({ x: Math.cos(a1) * r2, y: Math.sin(a1) * r2, z: len / 2 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.closePath();
            ctx.fillStyle = i % 2 === 0 ? "rgba(0, 246, 255, 0.08)" : "rgba(20, 20, 30, 0.6)";
            ctx.fill();
            ctx.stroke();
          }

          // Optical glass glint
          const frontCenter = projectPoint({ x: 0, y: 0, z: len / 2 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
          ctx.beginPath();
          ctx.arc(frontCenter.x, frontCenter.y, r2 * 0.5 * renderScale, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 246, 255, 0.35)";
          ctx.fill();
          ctx.strokeStyle = "#00f6ff";
          ctx.stroke();
        } else if (item.kind === "prism") {
          // ⚡ 3D RETENTION PRISM (Triangular Play Prism)
          const pVerts: Point3D[] = [
            { x: -s * 0.8, y: -s * 0.8, z: -s * 0.4 },
            { x: s * 0.9, y: 0, z: -s * 0.4 },
            { x: -s * 0.8, y: s * 0.8, z: -s * 0.4 },
            { x: 0, y: 0, z: s * 0.7 },
          ];

          const proj = pVerts.map((v) =>
            projectPoint(v, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y)
          );

          const faces = [[0, 1, 2], [0, 1, 3], [1, 2, 3], [2, 0, 3]];
          faces.forEach((f) => {
            ctx.beginPath();
            ctx.moveTo(proj[f[0]].x, proj[f[0]].y);
            ctx.lineTo(proj[f[1]].x, proj[f[1]].y);
            ctx.lineTo(proj[f[2]].x, proj[f[2]].y);
            ctx.closePath();
            ctx.fillStyle = "rgba(191, 0, 255, 0.14)";
            ctx.fill();
            ctx.stroke();
          });
        } else {
          // ⚡ 3D TORUS RING
          const major = s * 0.85;
          const minor = s * 0.35;
          const segs = 10;

          for (let u = 0; u < segs; u++) {
            const a1 = (u * Math.PI * 2) / segs;
            const a2 = ((u + 1) * Math.PI * 2) / segs;

            const p1 = projectPoint({ x: Math.cos(a1) * major, y: Math.sin(a1) * major, z: 0 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
            const p2 = projectPoint({ x: Math.cos(a2) * major, y: Math.sin(a2) * major, z: 0 }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Inner cross ring
            const q = projectPoint({ x: Math.cos(a1) * (major + minor * Math.sin(time * 3)), y: Math.sin(a1) * (major + minor * Math.sin(time * 3)), z: minor * Math.cos(time * 3) }, item.rotX, item.rotY, item.rotZ, renderScale, item.x, item.y);
            ctx.beginPath();
            ctx.arc(q.x, q.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();
          }
        }

        // Hover HUD Label Tooltip
        if (item.hoverProgress > 0.05) {
          ctx.save();
          ctx.globalAlpha = item.hoverProgress;
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";

          const badgeY = item.y - s * 1.55;
          const text = item.label;
          const textMetrics = ctx.measureText(text);
          const badgeW = textMetrics.width + 16;
          const badgeH = 18;

          // Background pill
          ctx.fillStyle = "rgba(5, 7, 12, 0.9)";
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.roundRect(item.x - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 6);
          ctx.fill();
          ctx.stroke();

          // Label text
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 0;
          ctx.fillText(text, item.x, badgeY + 3);

          ctx.restore();
        }

        ctx.restore();
      });

      // Update & Render interactive spark particles
      for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
        const p = particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(pIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full select-none"
    />
  );
}

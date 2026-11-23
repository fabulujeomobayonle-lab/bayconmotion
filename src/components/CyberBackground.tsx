import { useEffect, useRef } from "react";

export function CyberBackground() {
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

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Particle nodes (fewer on mobile to prevent CPU/battery drain)
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    const colors = ["#ff003c", "#00f6ff", "#bf00ff", "#00ff66", "#ffbe0b"];
    const nodeCount = isMobile ? 12 : 36;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8),
      vy: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8),
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Floating 3D motion keyframe frames (skip or reduce on mobile)
    interface FloatingFrame {
      x: number;
      y: number;
      z: number;
      size: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      label: string;
    }

    const labels = ["REC ● 4K60 DCI", "ACES_COLOR_GRADE", "KEYFRAME 01", "AUDIO_SPECTRA_3D", "CUT_PACING_0.6S", "DA VINCI 19"];
    const frameCount = isMobile ? 2 : 6;
    const frames: FloatingFrame[] = Array.from({ length: frameCount }, (_, i) => ({
      x: (Math.random() - 0.5) * width * 0.85 + width / 2,
      y: (Math.random() - 0.5) * height * 0.85 + height / 2,
      z: Math.random() * 300 + 100,
      size: isMobile ? 60 : 75 + Math.random() * 45,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      rotSpeedX: (Math.random() - 0.5) * 0.008,
      rotSpeedY: (Math.random() - 0.5) * 0.008,
      label: labels[i % labels.length],
    }));

    let time = 0;
    let lastRenderTime = performance.now();

    const render = (currentTime: number) => {
      // Pause if tab is hidden
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
      ctx.fillStyle = "rgba(7, 8, 11, 0.45)";
      ctx.fillRect(0, 0, width, height);

      // Studio Ambient Glow Blobs (Drifting light sources)
      const blob1X = width * 0.2 + Math.sin(time * 0.5) * (width * 0.15);
      const blob1Y = height * 0.3 + Math.cos(time * 0.4) * (height * 0.15);
      const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 10, blob1X, blob1Y, 400);
      grad1.addColorStop(0, "rgba(255, 0, 60, 0.12)");
      grad1.addColorStop(0.5, "rgba(191, 0, 255, 0.05)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const blob2X = width * 0.8 + Math.cos(time * 0.4) * (width * 0.15);
      const blob2Y = height * 0.6 + Math.sin(time * 0.6) * (height * 0.15);
      const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 10, blob2X, blob2Y, 450);
      grad2.addColorStop(0, "rgba(0, 246, 255, 0.12)");
      grad2.addColorStop(0.5, "rgba(0, 255, 102, 0.04)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle perspective laser grid with brighter lines
      ctx.save();
      ctx.strokeStyle = "rgba(255, 0, 60, 0.06)";
      ctx.lineWidth = 1;

      const gridSize = 64;
      const offsetX = (time * 16) % gridSize;
      const offsetY = (time * 16) % gridSize;

      for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Audio Waveform simulation at top & bottom edge with brighter neon
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 246, 255, 0.22)";
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x += 12) {
        const waveY = height - 42 + Math.sin(x * 0.012 + time * 3.5) * 14 + Math.cos(x * 0.024 - time * 2.2) * 9;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
      ctx.restore();

      // Render Floating Wireframe Keyframes
      frames.forEach((f) => {
        f.rotX += f.rotSpeedX;
        f.rotY += f.rotSpeedY;

        // Mouse parallax shift
        const targetX = f.x + (mouseX - width / 2) * 0.03;
        const targetY = f.y + (mouseY - height / 2) * 0.03;

        ctx.save();
        ctx.translate(targetX, targetY);

        // Draw HUD wireframe box
        ctx.strokeStyle = "rgba(255, 0, 60, 0.25)";
        ctx.fillStyle = "rgba(255, 0, 60, 0.03)";
        ctx.lineWidth = 1.2;

        const w = f.size;
        const h = f.size * 0.6;
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w, h);
        ctx.fill();
        ctx.stroke();

        // Corner ticks
        const cLen = 8;
        ctx.strokeStyle = "rgba(0, 246, 255, 0.7)";
        ctx.lineWidth = 1.5;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(-w / 2, -h / 2 + cLen);
        ctx.lineTo(-w / 2, -h / 2);
        ctx.lineTo(-w / 2 + cLen, -h / 2);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(w / 2 - cLen, h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(w / 2, h / 2 - cLen);
        ctx.stroke();

        // Label
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(0, 246, 255, 0.6)";
        ctx.fillText(f.label, -w / 2 + 4, -h / 2 - 5);

        ctx.restore();
      });

      // Update & Draw Nodes with Laser Connectors
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += n.pulseSpeed;
        const r = n.radius + Math.sin(n.pulse) * 1.3;

        // Draw particle node (no expensive shadow blur on mobile)
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        if (!isMobile) {
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.restore();

        // Connect nearby nodes only on desktop to save mobile CPU
        if (!isMobile) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `rgba(255, 0, 60, ${(1 - dist / 150) * 0.22})`;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.restore();
            }
          }

          // Mouse laser connection
          const mdx = n.x - mouseX;
          const mdy = n.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 190) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(0, 246, 255, ${(1 - mdist / 190) * 0.45})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-85"
    />
  );
}

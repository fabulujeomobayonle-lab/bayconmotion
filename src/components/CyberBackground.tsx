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

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Particle nodes
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

    const colors = ["#ff1a1a", "#00fff9", "#ff007f", "#7928ca", "#ffb703"];
    const nodes: Node[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Floating 3D motion keyframe frames
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

    const labels = ["REC ● 4K60", "LUT: CYBER_RED", "KEYFRAME 01", "AUDIO_SPECTRA", "TIMELINE_CUT", "DA VINCI 18"];
    const frames: FloatingFrame[] = Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * width * 0.8 + width / 2,
      y: (Math.random() - 0.5) * height * 0.8 + height / 2,
      z: Math.random() * 300 + 100,
      size: 70 + Math.random() * 50,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      rotSpeedX: (Math.random() - 0.5) * 0.008,
      rotSpeedY: (Math.random() - 0.5) * 0.008,
      label: labels[i % labels.length],
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle perspective laser grid
      ctx.save();
      ctx.strokeStyle = "rgba(255, 26, 26, 0.04)";
      ctx.lineWidth = 1;

      const gridSize = 60;
      const offsetX = (time * 15) % gridSize;
      const offsetY = (time * 15) % gridSize;

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

      // Draw Audio Waveform simulation at top & bottom edge
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 255, 249, 0.12)";
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x += 15) {
        const waveY = height - 40 + Math.sin(x * 0.01 + time * 3) * 12 + Math.cos(x * 0.02 - time * 2) * 8;
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
        const targetX = f.x + (mouseX - width / 2) * 0.02;
        const targetY = f.y + (mouseY - height / 2) * 0.02;

        ctx.save();
        ctx.translate(targetX, targetY);

        // Draw HUD wireframe box
        ctx.strokeStyle = "rgba(255, 26, 26, 0.18)";
        ctx.fillStyle = "rgba(255, 26, 26, 0.02)";
        ctx.lineWidth = 1;

        const w = f.size;
        const h = f.size * 0.6;
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w, h);
        ctx.fill();
        ctx.stroke();

        // Corner ticks
        const cLen = 6;
        ctx.strokeStyle = "rgba(0, 255, 249, 0.4)";
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
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fillText(f.label, -w / 2 + 4, -h / 2 - 4);

        ctx.restore();
      });

      // Update & Draw Nodes with Laser Connectors
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += n.pulseSpeed;
        const r = n.radius + Math.sin(n.pulse) * 1.2;

        // Draw particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(255, 26, 26, ${(1 - dist / 140) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Mouse laser connection
        const mdx = n.x - mouseX;
        const mdy = n.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 180) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(0, 255, 249, ${(1 - mdist / 180) * 0.3})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}

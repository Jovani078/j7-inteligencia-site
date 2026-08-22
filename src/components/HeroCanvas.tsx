"use client";

/**
 * Placeholder cinematic visual for the hero circle-wipe reveal.
 *
 * This draws an animated "operação tecnológica" node network (dark graphite bg,
 * electric-blue nodes/connections) so the hero has real motion before a real
 * video is available.
 *
 * TO SWAP IN A REAL VIDEO LATER (per the video-to-website skill pattern):
 * 1. Extract frames: ffmpeg -i video.mp4 -vf "fps=12,scale=1920:-1" -c:v libwebp -quality 80 public/frames/frame_%04d.webp
 * 2. Preload the frame images into an array.
 * 3. Replace the drawNetwork() call inside the render loop with
 *    drawFrame(currentFrameIndex) using the padded-cover-mode formula from the skill.
 * 4. Bind currentFrameIndex to the same `progress` value already wired up below.
 */

import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export default function HeroCanvas({ progress }: { progress: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nodes: Node[] = [];
    const NODE_COUNT = 46;

    function resize() {
      if (!canvas) return;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 1,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      const bgShift = 0.5 + 0.5 * Math.sin((progress.current ?? 0) * Math.PI);
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      g.addColorStop(0, `rgba(17, 21, 27, ${0.55 + bgShift * 0.15})`);
      g.addColorStop(0.55, "rgba(17, 21, 27, 1)");
      g.addColorStop(1, "rgba(7, 9, 12, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const max = 140;
          if (d < max) {
            ctx.strokeStyle = `rgba(47, 128, 237, ${(1 - d / max) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(47, 128, 237, 0.85)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    init();

    if (prefersReducedMotion()) {
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

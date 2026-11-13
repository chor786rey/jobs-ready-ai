import React, { useEffect, useRef } from 'react';

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  swayAmp: number;
  swayFreq: number;
  color: string;
  hasHalo: boolean;
}

const GOLD_PALETTE = [
  '252, 230, 166', // #FCE6A6 champagne highlight
  '247, 208, 122', // #F7D07A warm champagne
  '255, 179, 25',  // #FFB319 logo burnished gold
  '245, 158, 11',  // #F59E0B deep logo gold
];

export const GoldenDust: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: DustParticle[] = [];
    let animationFrameId: number | null = null;

    const createParticle = (initial = false): DustParticle => {
      const sizeRoll = Math.random();
      const radius = sizeRoll < 0.65
        ? 0.65 + Math.random() * 0.65
        : 1.2 + Math.random() * 0.8;

      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 12 + Math.random() * 30,
        radius,
        vx: (Math.random() - 0.45) * 0.08,
        vy: -(0.14 + Math.random() * 0.28),
        baseAlpha: 0.28 + Math.random() * 0.48,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.0012 + Math.random() * 0.0022,
        swayAmp: 0.12 + Math.random() * 0.25,
        swayFreq: 0.0005 + Math.random() * 0.0009,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        hasHalo: sizeRoll >= 0.68,
      };
    };

    const seedParticles = () => {
      const targetCount = Math.max(36, Math.min(82, Math.round((width * height) / 22000)));
      particles = Array.from({ length: targetCount }, () => createParticle(true));
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seedParticles();
    };

    const drawFrame = (now: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (animate) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(now * p.swayFreq + p.phase) * p.swayAmp;

          if (p.y < -16) {
            particles[i] = createParticle(false);
            continue;
          }
          if (p.x < -12) p.x = width + 10;
          if (p.x > width + 12) p.x = -10;
        }

        const shimmer = 0.55 + 0.45 * Math.sin(now * p.twinkleSpeed + p.phase);
        const alpha = p.baseAlpha * shimmer;

        if (p.hasHalo) {
          const haloRadius = p.radius * 3.4;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
          grad.addColorStop(0, `rgba(${p.color}, ${Math.min(1, alpha * 1.05).toFixed(3)})`);
          grad.addColorStop(0.45, `rgba(${p.color}, ${(alpha * 0.32).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const renderLoop = (now: number) => {
      if (prefersReducedMotion || document.hidden) {
        animationFrameId = null;
        return;
      }
      drawFrame(now, true);
      animationFrameId = window.requestAnimationFrame(renderLoop);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(performance.now(), false);
        return;
      }
      if (animationFrameId === null && !document.hidden) {
        animationFrameId = window.requestAnimationFrame(renderLoop);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      stopLoop();
      startLoop();
    };

    resizeCanvas();
    startLoop();

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      stopLoop();
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-html2canvas-ignore="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};

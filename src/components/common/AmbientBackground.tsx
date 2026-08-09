import React, { useEffect, useRef } from 'react';
import { usePerformanceTier } from '../../lib/performance';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const { tier, particleCount: baseParticleCount, enableComplexGlows } = usePerformanceTier();

  // Mouse interpolation for ultra smooth movement
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle system configuration
    const colors = [
      'rgba(59, 130, 246, ',   // Blue 500
      'rgba(99, 102, 241, ',   // Indigo 500
      'rgba(14, 165, 233, ',   // Sky 500
      'rgba(168, 85, 247, '    // Purple 500
    ];

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      // Adjust particle count dynamically based on tier and screen size
      const maxAllowed = tier === 'low' ? 14 : tier === 'medium' ? 26 : tier === 'high' ? 45 : 65;
      const count = Math.min(Math.floor(width / 32), maxAllowed);

      for (let i = 0; i < count; i++) {
        const baseAlpha = Math.random() * 0.4 + 0.15;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (tier === 'low' ? 0.25 : 0.4),
          vy: (Math.random() - 0.5) * (tier === 'low' ? 0.25 : 0.4),
          radius: Math.random() * 1.8 + 0.8,
          alpha: baseAlpha,
          maxAlpha: baseAlpha,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    initParticles();

    // Mouse move event
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const deltaFactor = delta * 60; // Normalize to 60fps unit

      // Frame-rate independent lerp for smooth trailing spotlight at 144Hz
      const m = mouseRef.current;
      const lerpFactor = 1 - Math.exp(-8 * delta);
      m.x += (m.targetX - m.x) * lerpFactor;
      m.y += (m.targetY - m.y) * lerpFactor;

      // Update spotlight div position efficiently via transform
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * deltaFactor;
        p.y += p.vy * deltaFactor;

        // Bounce on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse proximity interaction
        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = 180;
        const maxDistSq = maxDist * maxDist;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - dist / maxDist;
          p.alpha = p.maxAlpha + factor * 0.5;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Draw particle (High-performance GPU 2D fill without expensive shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pDistSq = pdx * pdx + pdy * pdy;
          const linkDist = 120;
          const linkDistSq = linkDist * linkDist;

          if (pDistSq < linkDistSq) {
            const pDist = Math.sqrt(pDistSq);
            const lineAlpha = (1 - pDist / linkDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha.toFixed(2)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw delicate line to mouse if close
        if (distSq < 19600) { // 140^2
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / 140) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha.toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Base Ambient Mesh Gradients */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* 2. Floating Aurora Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse duration-[12000ms] delay-1000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-sky-500/10 rounded-full blur-[150px] animate-pulse duration-[14000ms] delay-2000" />
      <div className="absolute top-[65%] left-[60%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-purple-600/10 rounded-full blur-[130px] animate-pulse duration-[11000ms] delay-1500" />

      {/* 3. Tech Grid Overlay with Edge Vignette */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#09090b_95%)]" />

      {/* 4. Mouse Follow Spotlight Layer */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 70%)',
          willChange: 'transform'
        }}
      />

      {/* 5. Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

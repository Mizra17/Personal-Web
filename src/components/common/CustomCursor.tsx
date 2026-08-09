import React, { useEffect, useState, useRef } from 'react';
import { usePerformanceTier } from '../../lib/performance';

export const CustomCursor: React.FC = () => {
  const { enableCustomCursor } = usePerformanceTier();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Detect touch / coarse pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      mousePos.current.targetX = clientX;
      mousePos.current.targetY = clientY;

      // If cursor was invisible or first frame, snap positions instantly to avoid jumps
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        mousePos.current.x = clientX;
        mousePos.current.y = clientY;
        setIsVisible(true);
      }

      // Check if target or parent is an interactive element (including images and galleries)
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, select, textarea, img, picture, canvas, svg, [role="button"], [data-cursor="pointer"], [data-tilt], .interactive, .group'
        );

        if (isHoveredRef.current !== isInteractive) {
          isHoveredRef.current = isInteractive;
          setIsHovered(isInteractive);
        }
      }
    };

    const onMouseDown = () => {
      isClickingRef.current = true;
      setIsClicking(true);
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      setIsClicking(false);
    };

    const onMouseLeave = (e: MouseEvent) => {
      // Only hide if cursor actually leaves the window document
      if (!e.relatedTarget) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    };

    // Use capture phase (true) so mousemove is NEVER swallowed by children stopping propagation
    window.addEventListener('mousemove', onMouseMove, { capture: true, passive: true });
    window.addEventListener('mousedown', onMouseDown, { capture: true, passive: true });
    window.addEventListener('mouseup', onMouseUp, { capture: true, passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { capture: true });

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const pos = mousePos.current;
      // Frame-rate independent exponential lerp for ultra-smooth trailing ring at 144Hz
      const lerpFactor = 1 - Math.exp(-18 * delta);
      pos.x += (pos.targetX - pos.x) * lerpFactor;
      pos.y += (pos.targetY - pos.y) * lerpFactor;

      const scaleDot = isClickingRef.current ? 0.75 : isHoveredRef.current ? 1.4 : 1;
      const scaleRing = isClickingRef.current ? 0.75 : isHoveredRef.current ? 1.35 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.targetX}px, ${pos.targetY}px, 0) translate(-50%, -50%) scale(${scaleDot})`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scaleRing})`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove, { capture: true });
      window.removeEventListener('mousedown', onMouseDown, { capture: true });
      window.removeEventListener('mouseup', onMouseUp, { capture: true });
      document.removeEventListener('mouseleave', onMouseLeave, { capture: true });
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice || !enableCustomCursor) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[999999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 rounded-full shadow-[0_0_12px_#60a5fa] transition-colors duration-150 ${
          isClicking ? 'bg-cyan-300' : isHovered ? 'bg-cyan-400' : 'bg-blue-400'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Trailing Outer Ring with Dynamic Glow */}
      <div
        ref={ringRef}
        className={`pointer-events-none absolute top-0 left-0 rounded-full border transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-12 h-12 border-blue-400/80 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.35)] backdrop-blur-[1px]'
            : isClicking
            ? 'w-6 h-6 border-cyan-400/90 bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            : 'w-8 h-8 border-white/30 bg-transparent shadow-[0_0_10px_rgba(255,255,255,0.05)]'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

// Adaptive Performance & Refresh Rate Detection System

export type PerformanceTier = 'low' | 'medium' | 'high' | 'ultra';

export interface PerformanceProfile {
  tier: PerformanceTier;
  fps: number; // Measured refresh rate (e.g., 60, 120, 144, 240)
  particleCount: number;
  maxPixelRatio: number;
  enableComplexGlows: boolean;
  enable3DShadows: boolean;
  enableTilt: boolean;
  enableCustomCursor: boolean;
  isTouch: boolean;
  cores: number;
  memoryGb: number;
}

class PerformanceManager {
  private profile: PerformanceProfile;
  private listeners: Set<(profile: PerformanceProfile) => void> = new Set();
  private measuredFps: number = 60;
  private isMeasuring: boolean = false;

  constructor() {
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );

    const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    const memoryGb = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 4;

    // Initial conservative baseline estimate before benchmark finishes
    let initialTier: PerformanceTier = 'medium';
    if (cores <= 2 || memoryGb <= 2) {
      initialTier = 'low';
    } else if (cores >= 12 && memoryGb >= 16 && !isTouch) {
      initialTier = 'ultra';
    } else if (cores >= 8 && memoryGb >= 8 && !isTouch) {
      initialTier = 'high';
    }

    this.profile = {
      tier: initialTier,
      fps: 60,
      particleCount: initialTier === 'low' ? 14 : initialTier === 'medium' ? 25 : 45,
      maxPixelRatio: initialTier === 'low' ? 1 : initialTier === 'medium' ? 1.25 : 1.5,
      enableComplexGlows: initialTier !== 'low',
      enable3DShadows: initialTier === 'high' || initialTier === 'ultra',
      enableTilt: !isTouch && initialTier !== 'low',
      enableCustomCursor: !isTouch,
      isTouch,
      cores,
      memoryGb
    };

    if (typeof window !== 'undefined') {
      this.detectRefreshRateAndCapabilities();
    }
  }

  public getProfile(): PerformanceProfile {
    return this.profile;
  }

  public subscribe(listener: (profile: PerformanceProfile) => void): () => void {
    this.listeners.add(listener);
    listener(this.profile);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.profile));
  }

  private detectRefreshRateAndCapabilities() {
    if (this.isMeasuring) return;
    this.isMeasuring = true;

    let frameCount = 0;
    let startTime = performance.now();

    const measure = (now: number) => {
      frameCount++;
      const elapsed = now - startTime;

      if (elapsed < 500) {
        requestAnimationFrame(measure);
      } else {
        const calculatedFps = Math.round((frameCount * 1000) / elapsed);
        
        // Normalize FPS to standard monitor refresh rates
        let estimatedHz = 60;
        if (calculatedFps >= 210) estimatedHz = 240;
        else if (calculatedFps >= 150) estimatedHz = 165;
        else if (calculatedFps >= 130) estimatedHz = 144;
        else if (calculatedFps >= 105) estimatedHz = 120;
        else if (calculatedFps >= 80) estimatedHz = 90;
        else if (calculatedFps >= 50) estimatedHz = 60;
        else estimatedHz = Math.max(30, calculatedFps);

        this.measuredFps = estimatedHz;
        this.updateProfileBasedOnBenchmark(estimatedHz);
      }
    };

    requestAnimationFrame((now) => {
      startTime = now;
      requestAnimationFrame(measure);
    });
  }

  private updateProfileBasedOnBenchmark(fps: number) {
    const { cores, memoryGb, isTouch } = this.profile;

    let tier: PerformanceTier = 'medium';

    if (fps < 45 || cores <= 2 || memoryGb <= 2) {
      tier = 'low';
    } else if (fps >= 115 && cores >= 6 && !isTouch) {
      tier = 'ultra';
    } else if (fps >= 75 || (cores >= 8 && memoryGb >= 8)) {
      tier = 'high';
    } else {
      tier = 'medium';
    }

    // Dynamic config mapping per tier
    const particleMap: Record<PerformanceTier, number> = {
      low: 12,
      medium: 24,
      high: 42,
      ultra: 60
    };

    const pixelRatioMap: Record<PerformanceTier, number> = {
      low: 1,
      medium: 1.25,
      high: 1.5,
      ultra: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)
    };

    this.profile = {
      tier,
      fps,
      particleCount: isTouch ? Math.min(particleMap[tier], 20) : particleMap[tier],
      maxPixelRatio: pixelRatioMap[tier],
      enableComplexGlows: tier !== 'low',
      enable3DShadows: tier === 'high' || tier === 'ultra',
      enableTilt: !isTouch && tier !== 'low',
      enableCustomCursor: !isTouch,
      isTouch,
      cores,
      memoryGb
    };

    this.notify();
  }
}

export const performanceManager = new PerformanceManager();

// React Hook for Adaptive Performance
import { useState, useEffect } from 'react';

export function usePerformanceTier(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>(performanceManager.getProfile());

  useEffect(() => {
    return performanceManager.subscribe(setProfile);
  }, []);

  return profile;
}

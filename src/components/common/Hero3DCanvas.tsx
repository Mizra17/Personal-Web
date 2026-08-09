import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePerformanceTier } from '../../lib/performance';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { tier, maxPixelRatio, particleCount: baseParticles, enableComplexGlows } = usePerformanceTier();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect mobile / low power
    const isMobile = window.innerWidth < 768;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer Setup (Adaptive Pixel Ratio & Anti-Aliasing per Tier)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: tier !== 'low',
      powerPreference: tier === 'low' ? 'low-power' : 'high-performance'
    });
    renderer.setPixelRatio(maxPixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // 4. Group for smooth cursor rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 5. Central 3D Tech Structure (Holographic Tech Laptop / Core Node)
    // Core Outer Wireframe Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3b82f6'),
      emissive: new THREE.Color('#1e40af'),
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner Glowing Solid Diamond/Octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#06b6d4'),
      emissive: new THREE.Color('#0891b2'),
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      flatShading: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // Laptop Base / Tech Deck
    const baseGeo = new THREE.BoxGeometry(3.2, 0.12, 2.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#18181b'),
      roughness: 0.3,
      metalness: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -1.8, 0);
    mainGroup.add(baseMesh);

    // Glowing Keyboard / Circuit Line on Base
    const kbGeo = new THREE.PlaneGeometry(2.8, 1.8);
    const kbMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#3b82f6'),
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const kbMesh = new THREE.Mesh(kbGeo, kbMat);
    kbMesh.rotation.x = -Math.PI / 2;
    kbMesh.position.set(0, -1.73, 0);
    mainGroup.add(kbMesh);

    // Orbiting Rings
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.02, 16, tier === 'low' ? 40 : 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.015, 16, tier === 'low' ? 40 : 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#06b6d4'),
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 3;
    mainGroup.add(ring2);

    // Floating Particles Cloud around the 3D Core
    const particleCount = isMobile ? Math.min(baseParticles, 25) : baseParticles * 2;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: new THREE.Color('#60a5fa'),
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: tier === 'low' ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 6. Dynamic Colored Lights (Optimized per tier)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, 3, 12);
    bluePointLight.position.set(3, 3, 3);
    scene.add(bluePointLight);

    if (enableComplexGlows) {
      const cyanPointLight = new THREE.PointLight(0x06b6d4, 2.5, 12);
      cyanPointLight.position.set(-3, -2, 2);
      scene.add(cyanPointLight);

      const purplePointLight = new THREE.PointLight(0xa855f7, 2, 10);
      purplePointLight.position.set(0, 4, -2);
      scene.add(purplePointLight);
    }

    // 7. Mouse Interaction & Smooth Lerp
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2;
      mouse.targetY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Resize Observer for dynamic dimensions
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 9. Animation Render Loop (Frame-Rate Independent for 60Hz - 144Hz+)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver to pause rendering when out of viewport (0% GPU load when scrolled away)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Frame-rate independent lerp (smooth on 60Hz, 120Hz, 144Hz, 240Hz)
      const lerpFactor = 1 - Math.exp(-10 * delta);
      mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
      mouse.y += (mouse.targetY - mouse.y) * lerpFactor;

      mainGroup.rotation.y = elapsedTime * 0.25 + mouse.x * 0.6;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15 + mouse.y * 0.4;

      // Inner Core Pulsing & Counter Rotation
      innerMesh.rotation.y = -elapsedTime * 0.5;
      innerMesh.rotation.x = elapsedTime * 0.3;
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.06;
      innerMesh.scale.set(scale, scale, scale);

      // Ring Orbit Rotation
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.3;

      // Particles Drifting
      particleSystem.rotation.y = elapsedTime * 0.05;

      // Dynamic Light Sway
      bluePointLight.position.x = Math.sin(elapsedTime) * 3;
      bluePointLight.position.z = Math.cos(elapsedTime) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Up on Unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Dispose Three geometries & materials
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      kbGeo.dispose();
      kbMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center">
      {/* Glow Backing Halo */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-600/20 via-indigo-600/10 to-transparent blur-2xl pointer-events-none" />
      {/* Three.js Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      vel[i * 3]     = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001 - 0.0003;
    }
    return [pos, vel];
  }, [count]);

  // Attach positions imperatively to avoid R3F v8 bufferAttribute arg issues
  useEffect(() => {
    if (!geoRef.current) return;
    const attr = new THREE.BufferAttribute(positions, 3);
    geoRef.current.setAttribute('position', attr);
  }, [positions]);

  useFrame(() => {
    if (!geoRef.current) return;
    const attr = geoRef.current.getAttribute('position') as THREE.BufferAttribute;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3]     += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      if (arr[i * 3 + 1] < -6)  arr[i * 3 + 1] = 6;
      if (arr[i * 3]     >  10) arr[i * 3]     = -10;
      if (arr[i * 3]     < -10) arr[i * 3]     =  10;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        size={0.06}
        color="#315C45"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Floating Ring ────────────────────────────────────────────────────────────
function FloatingRing({
  position, radius, speed, phase,
}: {
  position: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.4;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.z = t * 0.07;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, radius * 0.08, 16, 60]} />
      <meshBasicMaterial color="#315C45" transparent opacity={0.12} />
    </mesh>
  );
}

// ─── Floating Orb (smooth sphere, no visible polygons) ────────────────────────
function FloatingOrb({
  position, radius, speed, phase,
}: {
  position: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.4;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshBasicMaterial color="#DCE7DD" transparent opacity={0.13} />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  const orbs: Array<{ position: [number, number, number]; radius: number; speed: number; phase: number }> = [
    { position: [-4,  1, -2], radius: 1.4, speed: 0.4, phase: 0 },
    { position: [ 4, -1, -3], radius: 1.0, speed: 0.6, phase: 2 },
    { position: [ 1,  2, -1], radius: 0.6, speed: 0.8, phase: 4 },
    { position: [-2, -2, -2], radius: 1.1, speed: 0.3, phase: 1 },
  ];

  const rings: Array<{ position: [number, number, number]; radius: number; speed: number; phase: number }> = [
    { position: [ 3,  1.5, -4], radius: 2.0, speed: 0.25, phase: 1 },
    { position: [-3, -1.0, -5], radius: 1.4, speed: 0.35, phase: 3 },
  ];

  return (
    <>
      <ParticleField count={80} />
      {orbs.map((s, i) => (
        <FloatingOrb key={i} {...s} />
      ))}
      {rings.map((r, i) => (
        <FloatingRing key={i} {...r} />
      ))}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ThreeBackground({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className={className} aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

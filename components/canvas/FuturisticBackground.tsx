"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Particles({ count = 4000 }) {
  const points = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.05;
    points.current.rotation.y = time;
    points.current.rotation.x = time * 0.2;

    // Mouse Parallax
    const mouseX = state.mouse.x * 0.2;
    const mouseY = state.mouse.y * 0.2;
    points.current.position.x = THREE.MathUtils.lerp(points.current.position.x, mouseX, 0.1);
    points.current.position.y = THREE.MathUtils.lerp(points.current.position.y, mouseY, 0.1);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function FuturisticBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
    </div>
  );
}

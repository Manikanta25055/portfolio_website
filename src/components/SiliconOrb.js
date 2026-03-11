import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Orb() {
  const outerRef = useRef();
  const innerRef = useRef();
  const edgesRef = useRef();

  // Icosahedron wireframe — looks like a silicon crystal lattice
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 1), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(icoGeo), [icoGeo]);

  const wireMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#C8553A',
    transparent: true,
    opacity: 0.55,
  }), []);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    emissive: '#C8553A',
    emissiveIntensity: 0.08,
    transparent: true,
    opacity: 0.6,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8553A',
    emissive: '#C8553A',
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.06,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.18;
      outerRef.current.rotation.x = t * 0.07;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.1;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y = t * 0.18;
      edgesRef.current.rotation.x = t * 0.07;
    }
    // Subtle breathing
    const scale = 1 + Math.sin(t * 0.6) * 0.02;
    if (outerRef.current) outerRef.current.scale.setScalar(scale);
    if (edgesRef.current) edgesRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      {/* Inner dark sphere with faint orange glow */}
      <mesh ref={innerRef} geometry={icoGeo} material={innerMat} />

      {/* Outer diffuse glow shell */}
      <mesh geometry={new THREE.IcosahedronGeometry(1.18, 1)} material={glowMat} />

      {/* Wireframe edges — the star of the show */}
      <lineSegments ref={edgesRef} geometry={edgesGeo} material={wireMat} />

      {/* Central core point */}
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#C8553A" emissive="#C8553A" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

const SiliconOrb = () => (
  <Canvas
    camera={{ position: [0, 0, 3.2], fov: 42 }}
    style={{ background: 'transparent' }}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={0.2} />
    <pointLight position={[3, 3, 2]} intensity={0.8} color="#ffffff" />
    <pointLight position={[-2, -1, 1]} intensity={0.4} color="#C8553A" />
    <Orb />
  </Canvas>
);

export default SiliconOrb;

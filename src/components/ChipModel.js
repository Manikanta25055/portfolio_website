import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Chip() {
  const groupRef = useRef();
  const pinRefs = useRef([]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0004) * 0.15;
    }
  });

  const pinPositions = useMemo(() => {
    const positions = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const x = -0.7 + (i / (count - 1)) * 1.4;
      positions.push([x, -0.62, 0], [x, 0.62, 0]);
    }
    for (let i = 0; i < 5; i++) {
      const z = -0.45 + (i / 4) * 0.9;
      positions.push([-0.62, 0, z], [0.62, 0, z]);
    }
    return positions;
  }, []);

  const orange = new THREE.Color('#C8553A');
  const chipMat = new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.7,
    roughness: 0.25,
  });
  const pinMat = new THREE.MeshStandardMaterial({
    color: '#888',
    metalness: 0.9,
    roughness: 0.1,
  });
  const traceMat = new THREE.MeshStandardMaterial({
    color: orange,
    emissive: orange,
    emissiveIntensity: 0.6,
  });

  return (
    <group ref={groupRef}>
      {/* Main chip body */}
      <mesh material={chipMat} castShadow>
        <boxGeometry args={[1.2, 0.18, 0.9]} />
      </mesh>

      {/* Top surface detail - gold die */}
      <mesh position={[0, 0.095, 0]}>
        <boxGeometry args={[0.55, 0.01, 0.42]} />
        <meshStandardMaterial color="#b8860b" metalness={0.95} roughness={0.1} emissive="#b8860b" emissiveIntensity={0.2} />
      </mesh>

      {/* Traces on top */}
      {[[-0.3, 0, 0], [0.3, 0, 0], [0, 0, -0.2], [0, 0, 0.2]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.095, pos[2]]} material={traceMat}>
          <boxGeometry args={i < 2 ? [0.22, 0.008, 0.04] : [0.04, 0.008, 0.22]} />
        </mesh>
      ))}

      {/* Pins */}
      {pinPositions.map((pos, i) => (
        <mesh key={i} position={pos} material={pinMat}>
          <boxGeometry args={[0.05, 0.18, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

const ChipModel = () => (
  <Canvas
    camera={{ position: [0, 1.8, 2.8], fov: 40 }}
    style={{ background: 'transparent' }}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={0.3} />
    <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffffff" />
    <pointLight position={[-2, 1, -1]} intensity={0.5} color="#C8553A" />
    <pointLight position={[2, -1, 2]} intensity={0.3} color="#4488ff" />
    <Chip />
  </Canvas>
);

export default ChipModel;

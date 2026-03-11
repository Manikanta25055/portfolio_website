import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Nodes() {
  const groupRef = useRef();
  const lineRef = useRef();

  const { nodePositions, linePositions } = useMemo(() => {
    const nodes = [];
    const layers = [1, 4, 5, 4, 1];
    const xStep = 0.8;
    layers.forEach((count, li) => {
      const x = (li - 2) * xStep;
      for (let ni = 0; ni < count; ni++) {
        const y = (ni - (count - 1) / 2) * 0.5;
        const z = (Math.random() - 0.5) * 0.2;
        nodes.push(new THREE.Vector3(x, y, z));
      }
    });

    const lines = [];
    let offset = 0;
    for (let li = 0; li < layers.length - 1; li++) {
      const aCount = layers[li];
      const bCount = layers[li + 1];
      for (let a = 0; a < aCount; a++) {
        for (let b = 0; b < bCount; b++) {
          lines.push(nodes[offset + a], nodes[offset + aCount + b]);
        }
      }
      offset += aCount;
    }

    const lineArr = new Float32Array(lines.length * 3);
    lines.forEach((v, i) => { lineArr[i * 3] = v.x; lineArr[i * 3 + 1] = v.y; lineArr[i * 3 + 2] = v.z; });

    return { nodePositions: nodes, linePositions: lineArr };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const lineMat = new THREE.LineBasicMaterial({ color: '#C8553A', transparent: true, opacity: 0.3 });
  const nodeGeo = new THREE.SphereGeometry(0.055, 8, 8);
  const nodeMat = new THREE.MeshStandardMaterial({ color: '#E27F5A', emissive: '#C8553A', emissiveIntensity: 0.8 });
  const inputMat = new THREE.MeshStandardMaterial({ color: '#4488ff', emissive: '#2255cc', emissiveIntensity: 0.8 });
  const outputMat = new THREE.MeshStandardMaterial({ color: '#50fa7b', emissive: '#22cc55', emissiveIntensity: 0.8 });

  const layerOffsets = [0, 1, 5, 10, 14];

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <primitive object={lineMat} attach="material" />
      </lineSegments>

      {/* Nodes */}
      {nodePositions.map((pos, i) => {
        const isInput = i === 0;
        const isOutput = i === nodePositions.length - 1;
        const mat = isInput ? inputMat : isOutput ? outputMat : nodeMat;
        return (
          <mesh key={i} position={pos} geometry={nodeGeo} material={mat} />
        );
      })}
    </group>
  );
}

const NeuralOrb = () => (
  <Canvas
    camera={{ position: [0, 0, 4], fov: 45 }}
    style={{ background: 'transparent' }}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={0.4} />
    <pointLight position={[2, 2, 2]} intensity={1} color="#ffffff" />
    <pointLight position={[-2, -1, 1]} intensity={0.5} color="#C8553A" />
    <Nodes />
  </Canvas>
);

export default NeuralOrb;

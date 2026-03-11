import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POINTS = 180;
const X_SPAN = 3.6;

function Wave() {
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const phaseRef = useRef(0);

  const buildPositions = (freq, amp, phase) => {
    const arr = new Float32Array(POINTS * 3);
    for (let i = 0; i < POINTS; i++) {
      const x = (i / (POINTS - 1)) * X_SPAN - X_SPAN / 2;
      const y = Math.sin(x * freq + phase) * amp;
      const z = 0;
      arr[i * 3]     = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  };

  const primaryGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buildPositions(2.2, 0.55, 0), 3));
    return g;
  }, []); // eslint-disable-line

  const secondaryGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buildPositions(2.2, 0.28, Math.PI * 0.7), 3));
    return g;
  }, []); // eslint-disable-line

  const primaryMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#C8553A',
    transparent: true,
    opacity: 0.9,
  }), []);

  const secondaryMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#E27F5A',
    transparent: true,
    opacity: 0.3,
  }), []);

  useFrame((_, delta) => {
    phaseRef.current += delta * 1.4;
    const phase = phaseRef.current;

    // Update primary wave
    if (primaryRef.current) {
      const pos = primaryRef.current.geometry.attributes.position;
      for (let i = 0; i < POINTS; i++) {
        const x = (i / (POINTS - 1)) * X_SPAN - X_SPAN / 2;
        pos.array[i * 3 + 1] = Math.sin(x * 2.2 + phase) * 0.55;
      }
      pos.needsUpdate = true;
    }

    // Update secondary (trailing) wave
    if (secondaryRef.current) {
      const pos = secondaryRef.current.geometry.attributes.position;
      for (let i = 0; i < POINTS; i++) {
        const x = (i / (POINTS - 1)) * X_SPAN - X_SPAN / 2;
        pos.array[i * 3 + 1] = Math.sin(x * 2.2 + phase - 0.9) * 0.28;
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Baseline grid lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-X_SPAN / 2, 0, 0, X_SPAN / 2, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </line>
      {/* Ghost trailing wave */}
      <line ref={secondaryRef} geometry={secondaryGeo} material={secondaryMat} />
      {/* Primary wave */}
      <line ref={primaryRef} geometry={primaryGeo} material={primaryMat} />
    </group>
  );
}

const OscilloscopeWave = () => (
  <Canvas
    camera={{ position: [0, 0, 3], fov: 50 }}
    style={{ background: 'transparent' }}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={0.5} />
    <Wave />
  </Canvas>
);

export default OscilloscopeWave;

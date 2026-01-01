
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const Scene3D: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const scrollOffset = scroll.offset;
    
    // Smooth group rotation and position based on scroll
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, scrollOffset * Math.PI, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollOffset * 10, 0.1);
    }

    // Individual item animations
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
      cubeRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }

    if (torusRef.current) {
      torusRef.current.rotation.z += 0.005;
      torusRef.current.position.y = Math.cos(state.clock.elapsedTime) * 0.5 - 5; // Section 2
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#9333ea" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#0891b2" />

      {/* Hero Shape */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={cubeRef} position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <MeshDistortMaterial
            color="#9333ea"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </mesh>
      </Float>

      {/* Services Shape */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <mesh ref={torusRef} position={[3, -6, -2]}>
          <torusGeometry args={[1.5, 0.4, 32, 100]} />
          <MeshWobbleMaterial
            color="#0891b2"
            speed={3}
            factor={0.6}
          />
        </mesh>
      </Float>

      {/* Portfolio Background Grid */}
      <gridHelper args={[50, 50, 0x333333, 0x111111]} position={[0, -20, -5]} rotation={[Math.PI / 4, 0, 0]} />
      
      {/* Experience Shape */}
      <Float speed={3} rotationIntensity={1} floatIntensity={3}>
        <mesh position={[-4, -30, -1]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6366f1" wireframe />
        </mesh>
      </Float>

      {/* Tech Stack Shape */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={4}>
        <mesh position={[5, -45, -3]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
};

export default Scene3D;

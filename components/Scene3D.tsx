
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Fix: Bypassing missing JSX intrinsic element types for Three.js elements
const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const TorusGeometry = 'torusGeometry' as any;
const GridHelper = 'gridHelper' as any;
const IcosahedronGeometry = 'icosahedronGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const OctahedronGeometry = 'octahedronGeometry' as any;

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
    <Group ref={groupRef}>
      <AmbientLight intensity={0.5} />
      <PointLight position={[10, 10, 10]} intensity={2} color="#9333ea" />
      <PointLight position={[-10, -10, -10]} intensity={2} color="#0891b2" />

      {/* Hero Shape */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Mesh ref={cubeRef} position={[0, 0, 0]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshDistortMaterial
            color="#9333ea"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </Mesh>
      </Float>

      {/* Services Shape */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Mesh ref={torusRef} position={[3, -6, -2]}>
          <TorusGeometry args={[1.5, 0.4, 32, 100]} />
          <MeshWobbleMaterial
            color="#0891b2"
            speed={3}
            factor={0.6}
          />
        </Mesh>
      </Float>

      {/* Portfolio Background Grid */}
      <GridHelper args={[50, 50, 0x333333, 0x111111]} position={[0, -20, -5]} rotation={[Math.PI / 4, 0, 0]} />
      
      {/* Experience Shape */}
      <Float speed={3} rotationIntensity={1} floatIntensity={3}>
        <Mesh position={[-4, -30, -1]}>
          <IcosahedronGeometry args={[1, 0]} />
          <MeshStandardMaterial color="#6366f1" wireframe />
        </Mesh>
      </Float>

      {/* Tech Stack Shape */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={4}>
        <Mesh position={[5, -45, -3]}>
          <OctahedronGeometry args={[2, 0]} />
          <MeshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
        </Mesh>
      </Float>
    </Group>
  );
};

export default Scene3D;

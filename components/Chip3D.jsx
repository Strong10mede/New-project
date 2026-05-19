"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

function PinRows({ material }) {
  const sidePins = useMemo(
    () => Array.from({ length: 12 }, (_, index) => -1.05 + index * 0.19),
    []
  );
  const topPins = useMemo(
    () => Array.from({ length: 9 }, (_, index) => -1.18 + index * 0.295),
    []
  );

  return (
    <>
      {sidePins.map((z) => (
        <group key={`left-${z}`}>
          <mesh material={material} position={[-1.78, -0.02, z]}>
            <boxGeometry args={[0.34, 0.07, 0.08]} />
          </mesh>
          <mesh material={material} position={[1.78, -0.02, z]}>
            <boxGeometry args={[0.34, 0.07, 0.08]} />
          </mesh>
        </group>
      ))}

      {topPins.map((x) => (
        <group key={`top-${x}`}>
          <mesh material={material} position={[x, -0.02, -1.31]}>
            <boxGeometry args={[0.08, 0.07, 0.32]} />
          </mesh>
          <mesh material={material} position={[x, -0.02, 1.31]}>
            <boxGeometry args={[0.08, 0.07, 0.32]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function CircuitLines({ material }) {
  const traces = [
    { args: [1.5, 0.012, 0.025], position: [0, 0.135, -0.47] },
    { args: [1.2, 0.012, 0.025], position: [-0.2, 0.136, 0.42] },
    { args: [0.025, 0.012, 0.72], position: [-0.72, 0.137, -0.1] },
    { args: [0.025, 0.012, 0.58], position: [0.68, 0.138, 0.13] },
    { args: [0.46, 0.012, 0.025], position: [0.92, 0.139, -0.18] },
    { args: [0.38, 0.012, 0.025], position: [-0.94, 0.14, 0.12] }
  ];

  return traces.map((trace, index) => (
    <mesh key={index} material={material} position={trace.position}>
      <boxGeometry args={trace.args} />
    </mesh>
  ));
}

function ChipModel() {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const pinMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
      color: "#c7ccd4",
      metalness: 0.9,
      roughness: 0.22
      }),
    []
  );
  const traceMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
      color: "#f59e0b",
      emissive: "#8a4b00",
      emissiveIntensity: 0.55,
      metalness: 0.7,
      roughness: 0.28
      }),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * (hovered ? 0.18 : 0.36);
    groupRef.current.rotation.x = -0.18 + Math.sin(Date.now() * 0.0008) * 0.035;
  });

  return (
    <group
      ref={groupRef}
      rotation={[-0.18, -0.45, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <PinRows material={pinMaterial} />

      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[3.24, 0.28, 2.24]} />
        <meshStandardMaterial
          color={hovered ? "#101722" : "#07090d"}
          emissive={hovered ? "#1f2937" : "#000000"}
          emissiveIntensity={hovered ? 0.25 : 0.05}
          metalness={0.82}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.205, 0]}>
        <boxGeometry args={[1.26, 0.03, 0.78]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#020617"
          metalness={0.66}
          roughness={0.34}
        />
      </mesh>

      <CircuitLines material={traceMaterial} />

      <Html
        center
        distanceFactor={4.4}
        position={[0, 0.72, 0]}
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 160ms ease",
          whiteSpace: "nowrap"
        }}
      >
        <div className="rounded-sm border border-amber-300/70 bg-black/85 px-3 py-2 font-terminal text-[10px] uppercase tracking-[0.14em] text-amber-100 shadow-[0_0_28px_rgba(245,158,11,0.35)] backdrop-blur">
          Airoha SoC / ARM Architecture
        </div>
      </Html>
    </group>
  );
}

export default function Chip3D() {
  return (
    <div className="h-full w-full overflow-visible bg-transparent">
      <Canvas
        camera={{ position: [3.6, 2.5, 4.3], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight intensity={2} position={[10, 10, 10]} />
        <pointLight color="#f59e0b" intensity={1.1} position={[-2.5, 1.8, 2.4]} />
        <ChipModel />
        <OrbitControls
          autoRotate={false}
          enableDamping
          enablePan={false}
          maxDistance={7}
          minDistance={3}
        />
      </Canvas>
    </div>
  );
}

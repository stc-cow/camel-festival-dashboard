import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, Mesh } from "three";
import type { FestivalSite } from "@/data/festivalData";

interface Map3DProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

function MapContent({ sites, onSiteSelect }: Map3DProps) {
  const groupRef = useRef<Group>(null);

  // Festival boundary coordinates (Al Ula area) - normalized
  const mapBounds = {
    north: 25.645,
    south: 25.62,
    east: 46.845,
    west: 46.81,
  };

  // Normalize coordinates to 3D world space
  const getWorldCoordinates = (lat: number, lng: number) => {
    const latRange = mapBounds.north - mapBounds.south;
    const lngRange = mapBounds.east - mapBounds.west;

    const x = ((lng - mapBounds.west) / lngRange) * 20 - 10;
    const z = ((mapBounds.north - lat) / latRange) * 20 - 10;

    return { x, z };
  };

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return 0x10b981;
      case "warning":
        return 0xf59e0b;
      case "critical":
        return 0xef4444;
      default:
        return 0x6b7280;
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 20, 25]} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom
        enablePan
        enableRotate
        maxDistance={60}
        minDistance={15}
      />

      {/* Ground plane (terrain) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Grid ground */}
      <Grid
        args={[25, 25]}
        cellSize={1}
        cellColor="#ccc"
        sectionSize={5}
        sectionColor="#888"
        fadeDistance={30}
        fadeStrength={0.5}
        fadeFrom={25}
        infiniteGrid={false}
      />

      {/* Festival sites as 3D markers */}
      <group ref={groupRef}>
        {sites.map((site) => {
          const coords = getWorldCoordinates(site.latitude, site.longitude);
          const color = getStatusColor(site.status);

          return (
            <group
              key={site.id}
              position={[coords.x, 0, coords.z]}
              onClick={() => onSiteSelect?.(site)}
            >
              {/* Base cylinder */}
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.5}
                />
              </mesh>

              {/* Top sphere */}
              <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.7}
                  wireframe={false}
                />
              </mesh>

              {/* Pulse effect for critical/warning */}
              {(site.status === "critical" || site.status === "warning") && (
                <mesh position={[0, 1.5, 0]}>
                  <sphereGeometry args={[0.8, 16, 16]} />
                  <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              )}

              {/* Connecting line to ground */}
              <line position={[0, 0, 0]}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, 0, 0, 2, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} linewidth={2} />
              </line>
            </group>
          );
        })}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.4} />
    </>
  );
}

export function Map3D({ sites, onSiteSelect }: Map3DProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Canvas shadows>
        <MapContent sites={sites} onSiteSelect={onSiteSelect} />
      </Canvas>
    </div>
  );
}

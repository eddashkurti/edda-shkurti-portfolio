import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Line, Text } from "@react-three/drei";

export type SceneKind = "medallion" | "pipeline" | "orbit" | "particles";

/* ------------------------------------------------------------------ */
/* Palette: matches the site's ink, paper, and lime identity          */
/* ------------------------------------------------------------------ */
const LIME = "#d8ff3e";
const ORANGE = "#ff6b3d";
const PINK = "#ff77c8";
const INK = "#101218";
const PAPER = "#e9e8e0";
const MUTED = "#9da1a9";
const BRONZE = "#9a6a3f";
const SILVER = "#cfd3d9";

const CAMERAS: Record<SceneKind, { position: [number, number, number]; fov: number }> = {
  medallion: { position: [0, 0, 6.4], fov: 45 },
  pipeline: { position: [0, 0, 6.8], fov: 45 },
  orbit: { position: [0, 0, 6.6], fov: 45 },
  particles: { position: [0, 0, 6], fov: 45 },
};

/* Shared scratch objects so animation loops don't allocate every frame */
const dummy = new THREE.Object3D();
const scratchVec = new THREE.Vector3();
const scratchColor = new THREE.Color();

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

/* Scales a scene down on narrow canvases so it never gets cropped */
function Fit({ width, children }: { width: number; children: ReactNode }) {
  const size = useThree((state) => state.size);
  const distance = useThree((state) => state.camera.position.z);
  const fov = useThree((state) => (state.camera as THREE.PerspectiveCamera).fov);
  const aspect = size.width / Math.max(size.height, 1);
  const visibleWidth = 2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * distance * aspect;
  const scale = Math.min(1, (visibleWidth * 0.94) / width);
  return <group scale={scale}>{children}</group>;
}

function StudioEnvironment() {
  return <Environment resolution={256}>
    <Lightformer form="rect" intensity={2.4} position={[0, 4, 5]} scale={[9, 3, 1]} color="#ffffff" />
    <Lightformer form="rect" intensity={1.4} position={[-6, 0, -2]} scale={[2, 6, 1]} color={LIME} />
    <Lightformer form="ring" intensity={0.8} position={[5, -2, 3]} scale={3} color="#ffffff" />
  </Environment>;
}

function StudioLights() {
  return <>
    <ambientLight intensity={0.25} />
    <directionalLight position={[3, 4, 5]} intensity={0.9} />
    <pointLight position={[-3, -2, 3]} intensity={8} color={LIME} distance={20} decay={2} />
  </>;
}

/* Thin edge lines around a box, for a technical drawing finish */
function Outline({ size, color, opacity = 0.45 }: { size: [number, number, number]; color: string; opacity?: number }) {
  const geometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}>
    <lineBasicMaterial color={color} transparent opacity={opacity} />
  </lineSegments>;
}

/* ------------------------------------------------------------------ */
/* NovaCart: Bronze → Silver → Gold medallion layers                   */
/* ------------------------------------------------------------------ */

const LAYER_SIZE: [number, number, number] = [1.5, 2.0, 0.55];
const LAYERS = [
  { name: "BRONZE", sub: "RAW", x: -2.3, color: BRONZE, metalness: 0.85, roughness: 0.38, base: 0.03 },
  { name: "SILVER", sub: "CLEAN", x: 0, color: SILVER, metalness: 1, roughness: 0.18, base: 0.03 },
  { name: "GOLD", sub: "READY", x: 2.3, color: LIME, metalness: 0.6, roughness: 0.3, base: 0.2 },
];
const MED_PARTICLES = 26;
const FLOW_LINE: [number, number, number][] = [[-3.7, 0, 0.6], [3.7, 0, 0.6]];
const RAW_COLOR = new THREE.Color(ORANGE);
const REFINED_COLOR = new THREE.Color(LIME);

function Medallion() {
  const layerMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const particles = useRef<THREE.InstancedMesh>(null);
  const xs = useRef(new Float32Array(MED_PARTICLES)).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mesh = particles.current;
    if (mesh) {
      for (let i = 0; i < MED_PARTICLES; i++) {
        const p = (t * 0.09 + i / MED_PARTICLES) % 1;
        const x = THREE.MathUtils.lerp(-3.6, 3.6, p);
        xs[i] = x;
        dummy.position.set(x, Math.sin(p * Math.PI * 3 + i) * 0.12, 0.6);
        dummy.scale.setScalar(Math.max(0.001, Math.sin(p * Math.PI) ** 0.6 * 0.085));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, scratchColor.copy(RAW_COLOR).lerp(REFINED_COLOR, p));
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    /* A layer lights up when a data particle passes through it */
    LAYERS.forEach((layer, li) => {
      const mat = layerMats.current[li];
      if (!mat) return;
      let glow = 0;
      for (let i = 0; i < MED_PARTICLES; i++) {
        const d = xs[i] - layer.x;
        glow = Math.max(glow, Math.exp(-(d * d) / 0.25));
      }
      mat.emissiveIntensity = layer.base + glow * 0.8;
    });
  });

  return <Fit width={7.4}>
    {LAYERS.map((layer, li) => (
      <group key={layer.name} position={[layer.x, 0, 0]}>
        <mesh>
          <boxGeometry args={LAYER_SIZE} />
          <meshStandardMaterial
            ref={(m: THREE.MeshStandardMaterial | null) => { layerMats.current[li] = m; }}
            color={layer.color}
            metalness={layer.metalness}
            roughness={layer.roughness}
            emissive={layer.color}
            emissiveIntensity={layer.base}
          />
        </mesh>
        <Outline size={LAYER_SIZE} color={PAPER} opacity={0.4} />
        {[-0.55, 0, 0.55].map((y) => (
          <mesh key={y} position={[0, y, LAYER_SIZE[2] / 2 + 0.01]}>
            <boxGeometry args={[1.1, 0.025, 0.02]} />
            <meshBasicMaterial color={PAPER} transparent opacity={0.45} />
          </mesh>
        ))}
        <Text position={[0, -1.4, 0]} fontSize={0.2} color={PAPER} anchorX="center" anchorY="middle" letterSpacing={0.1}>
          {layer.name}
        </Text>
        <Text position={[0, -1.66, 0]} fontSize={0.11} color={layer.color} anchorX="center" anchorY="middle" letterSpacing={0.14}>
          {layer.sub}
        </Text>
      </group>
    ))}

    <Line points={FLOW_LINE} color={MUTED} lineWidth={1} transparent opacity={0.35} />

    <instancedMesh ref={particles} args={[undefined, undefined, MED_PARTICLES]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  </Fit>;
}

/* ------------------------------------------------------------------ */
/* TechPoint: SOURCE → TRUST → TRACE → SHIP, with a quarantine branch  */
/* ------------------------------------------------------------------ */

const PIPE_POINTS = [
  new THREE.Vector3(-3.2, -0.2, 0),
  new THREE.Vector3(-1.6, 0.55, 0.4),
  new THREE.Vector3(0, -0.15, 0),
  new THREE.Vector3(1.6, 0.6, -0.3),
  new THREE.Vector3(3.2, -0.1, 0),
];
const mainCurve = new THREE.CatmullRomCurve3(PIPE_POINTS);

const STATIONS = [
  { u: 0.06, label: "SOURCE", num: "01", shape: "octa", color: SILVER },
  { u: 0.36, label: "TRUST", num: "02", shape: "ring", color: LIME },
  { u: 0.66, label: "TRACE", num: "03", shape: "stack", color: LIME },
  { u: 0.94, label: "SHIP", num: "04", shape: "block", color: ORANGE },
] as const;
const STATION_POS = STATIONS.map((s) => mainCurve.getPointAt(s.u));

/* Rejected data leaves the pipeline at TRUST and drops to quarantine */
const trustPos = STATION_POS[1];
const branchCurve = new THREE.CatmullRomCurve3([
  trustPos.clone(),
  trustPos.clone().add(new THREE.Vector3(0.2, -0.6, 0)),
  trustPos.clone().add(new THREE.Vector3(0.9, -1.5, 0)),
]);
const QUARANTINE_POS = branchCurve.getPointAt(1);
const BRANCH_LINE = branchCurve.getPoints(48);
const BLOCK_SIZE: [number, number, number] = [0.34, 0.34, 0.34];
const PACKETS = 12;
const REJECTS = 3;

function Pipeline() {
  const stationMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const packets = useRef<THREE.InstancedMesh>(null);
  const rejects = useRef<THREE.InstancedMesh>(null);
  const packetU = useRef(new Float32Array(PACKETS)).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (packets.current) {
      for (let i = 0; i < PACKETS; i++) {
        const u = (t * 0.05 + i / PACKETS) % 1;
        packetU[i] = u;
        mainCurve.getPointAt(u, scratchVec);
        dummy.position.copy(scratchVec);
        dummy.scale.setScalar(0.07);
        dummy.updateMatrix();
        packets.current.setMatrixAt(i, dummy.matrix);
      }
      packets.current.instanceMatrix.needsUpdate = true;
    }

    if (rejects.current) {
      for (let j = 0; j < REJECTS; j++) {
        const v = (t * 0.08 + j / REJECTS) % 1;
        branchCurve.getPointAt(v, scratchVec);
        dummy.position.copy(scratchVec);
        dummy.scale.setScalar(Math.max(0.001, Math.sin(v * Math.PI) * 0.07));
        dummy.updateMatrix();
        rejects.current.setMatrixAt(j, dummy.matrix);
      }
      rejects.current.instanceMatrix.needsUpdate = true;
    }

    /* A station lights up as a packet arrives */
    STATIONS.forEach((s, i) => {
      const mat = stationMats.current[i];
      if (!mat) return;
      let glow = 0;
      for (let k = 0; k < PACKETS; k++) {
        const d = packetU[k] - s.u;
        glow = Math.max(glow, Math.exp(-(d * d) / 0.0006));
      }
      mat.emissiveIntensity = 0.2 + glow * 1.3;
    });
  });

  return <Fit width={7.4}>
    <mesh>
      <tubeGeometry args={[mainCurve, 220, 0.028, 10, false]} />
      <meshStandardMaterial color={MUTED} metalness={0.6} roughness={0.35} />
    </mesh>

    <Line points={BRANCH_LINE} color={PINK} lineWidth={1} transparent opacity={0.7} dashed dashSize={0.08} gapSize={0.06} />

    {STATIONS.map((s, i) => {
      const p = STATION_POS[i];
      const setMat = (m: THREE.MeshStandardMaterial | null) => { stationMats.current[i] = m; };
      return <group key={s.label} position={[p.x, p.y, p.z]}>
        {s.shape === "octa" && <mesh>
          <octahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial ref={setMat} color={s.color} metalness={1} roughness={0.22} emissive={s.color} emissiveIntensity={0.2} />
        </mesh>}

        {s.shape === "ring" && <mesh rotation={[0.35, 0.2, 0]}>
          <torusGeometry args={[0.24, 0.05, 16, 56]} />
          <meshStandardMaterial ref={setMat} color={s.color} metalness={0.5} roughness={0.3} emissive={s.color} emissiveIntensity={0.2} />
        </mesh>}

        {s.shape === "stack" && <>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.36, 40]} />
            <meshStandardMaterial ref={setMat} color={s.color} metalness={0.9} roughness={0.25} emissive={s.color} emissiveIntensity={0.2} />
          </mesh>
          {[-0.2, 0.2].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.23, 0.018, 8, 48]} />
              <meshBasicMaterial color={s.color} />
            </mesh>
          ))}
        </>}

        {s.shape === "block" && <>
          <mesh>
            <boxGeometry args={BLOCK_SIZE} />
            <meshStandardMaterial ref={setMat} color={INK} metalness={0.7} roughness={0.3} emissive={s.color} emissiveIntensity={0.2} />
          </mesh>
          <Outline size={BLOCK_SIZE} color={s.color} opacity={0.9} />
        </>}

        <Text position={[0, 0.62, 0]} fontSize={0.2} color={PAPER} anchorX="center" anchorY="middle" letterSpacing={0.08}>
          {s.label}
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.11} color={MUTED} anchorX="center" anchorY="middle" letterSpacing={0.12}>
          {s.num}
        </Text>
      </group>;
    })}

    <group position={[QUARANTINE_POS.x, QUARANTINE_POS.y, QUARANTINE_POS.z]}>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, -0.42, 0]} fontSize={0.13} color={PINK} anchorX="center" anchorY="middle" letterSpacing={0.1}>
        QUARANTINE
      </Text>
    </group>

    <instancedMesh ref={packets} args={[undefined, undefined, PACKETS]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshBasicMaterial color={LIME} />
    </instancedMesh>
    <instancedMesh ref={rejects} args={[undefined, undefined, REJECTS]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={PINK} />
    </instancedMesh>
  </Fit>;
}

/* ------------------------------------------------------------------ */
/* Hero: static engineered ring structure, with motion inside it       */
/* ------------------------------------------------------------------ */

const RING_RADII = [1.0, 1.55, 2.1];
const TICKS = 96;
const LABELS = [
  { text: "DATA", angle: Math.PI / 2, color: LIME },
  { text: "DESIGN", angle: -Math.PI / 6, color: ORANGE },
  { text: "SOFTWARE", angle: (Math.PI * 7) / 6, color: PINK },
];

function Orbit() {
  const innerArm = useRef<THREE.Group>(null);
  const bead = useRef<THREE.Group>(null);
  const outerArm = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const ticks = useRef<THREE.InstancedMesh>(null);

  /* Graduation ticks around the outer ring are static, so set them once */
  useLayoutEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2;
      const major = i % 8 === 0;
      dummy.position.set(Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0);
      dummy.rotation.set(0, 0, a);
      dummy.scale.set(major ? 2.6 : 1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (innerArm.current) innerArm.current.rotation.z = t * 0.55;
    if (bead.current) bead.current.rotation.z = -t * 0.3;
    if (outerArm.current) outerArm.current.rotation.z = t * 0.16;
    if (coreMat.current) coreMat.current.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.3;
  });

  return <Fit width={6.2}>
    {/* The whole structure sits on one tilted plane and does not spin */}
    <group rotation={[0, 0, 0]}>
      {RING_RADII.map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, i === 2 ? 0.014 : 0.008, 8, 180]} />
          <meshBasicMaterial color={i === 2 ? LIME : PAPER} transparent opacity={i === 2 ? 0.9 : 0.28} />
        </mesh>
      ))}

      <instancedMesh ref={ticks} args={[undefined, undefined, TICKS]}>
        <boxGeometry args={[0.1, 0.014, 0.014]} />
        <meshBasicMaterial color={PAPER} transparent opacity={0.5} />
      </instancedMesh>

      <Line points={[[-2.1, 0, 0], [2.1, 0, 0]]} color={PAPER} lineWidth={1} transparent opacity={0.12} />
      <Line points={[[0, -2.1, 0], [0, 2.1, 0]]} color={PAPER} lineWidth={1} transparent opacity={0.12} />

      {LABELS.map((l) => {
        const x = Math.cos(l.angle);
        const y = Math.sin(l.angle);
        return <group key={l.text}>
          <mesh position={[x * 2.1, y * 2.1, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={l.color} />
          </mesh>
          <Text position={[x * 2.62, y * 2.62, 0]} fontSize={0.17} color={PAPER} anchorX="center" anchorY="middle" letterSpacing={0.12}>
            {l.text}
          </Text>
        </group>;
      })}

      {/* Inner arm: a pink marker with a lime trail, moving around the inner ring */}
      <group ref={innerArm}>
        <mesh rotation={[0, 0, -Math.PI * 0.55]}>
          <torusGeometry args={[RING_RADII[0], 0.022, 8, 60, Math.PI * 0.55]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
        <mesh position={[RING_RADII[0], 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={PINK} />
        </mesh>
      </group>

      {/* Middle ring: a polished silver bead moving the other way */}
      <group ref={bead}>
        <mesh position={[RING_RADII[1], 0, 0]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color={SILVER} metalness={1} roughness={0.15} />
        </mesh>
      </group>

      {/* Outer arc: a lime segment sweeping the outer ring */}
      <group ref={outerArm}>
        <mesh rotation={[0, 0, -Math.PI * 0.3]}>
          <torusGeometry args={[RING_RADII[2], 0.024, 8, 90, Math.PI * 0.3]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
      </group>

      {/* Core: a faceted solid with a slow wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial ref={coreMat} color={LIME} metalness={0.4} roughness={0.25} emissive={LIME} emissiveIntensity={0.8} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  </Fit>;
}

/* ------------------------------------------------------------------ */
/* Contact: unchanged from the original scene                          */
/* ------------------------------------------------------------------ */

function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 10;
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.04;
    points.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return <points ref={points}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
    </bufferGeometry>
    <pointsMaterial color={INK} size={0.06} sizeAttenuation transparent opacity={0.7} />
  </points>;
}

/* ------------------------------------------------------------------ */
/* Scene router and default export                                     */
/* ------------------------------------------------------------------ */

function SceneContent({ kind }: { kind: SceneKind }) {
  if (kind === "particles") return <Particles />;
  return <>
    <StudioEnvironment />
    <StudioLights />
    {kind === "medallion" && <Medallion />}
    {kind === "pipeline" && <Pipeline />}
    {kind === "orbit" && <Orbit />}
  </>;
}

export default function Scenes({ kind }: { kind: SceneKind }) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();

  return <div ref={ref} style={{ width: "100%", height: "100%" }}>
    <Canvas
      camera={CAMERAS[kind]}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced || !inView ? "demand" : "always"}
    >
      <Suspense fallback={null}>
        <SceneContent kind={kind} />
      </Suspense>
    </Canvas>
  </div>;
}
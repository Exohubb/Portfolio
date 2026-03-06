'use client'
import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const RADIUS     = 2.2
const STAR_COUNT = 2000

/* ─── Helpers ───────────────────────────────────────────────── */
function ll2v3(lat: number, lng: number, r = RADIUS): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

const CITIES = [
  { lat: 40.7,  lng: -74.0,  name: 'New York'      },
  { lat: 51.5,  lng: -0.1,   name: 'London'        },
  { lat: 35.7,  lng: 139.7,  name: 'Tokyo'         },
  { lat: 23.3,  lng: 77.4,   name: 'Bhopal'        },  // ← home
  { lat: 19.1,  lng: 72.9,   name: 'Mumbai'        },
  { lat: -33.9, lng: 151.2,  name: 'Sydney'        },
  { lat: 1.3,   lng: 103.8,  name: 'Singapore'     },
  { lat: 25.2,  lng: 55.3,   name: 'Dubai'         },
  { lat: -23.5, lng: -46.6,  name: 'São Paulo'     },
  { lat: 48.9,  lng: 2.4,    name: 'Paris'         },
  { lat: 39.9,  lng: 116.4,  name: 'Beijing'       },
  { lat: 55.8,  lng: 37.6,   name: 'Moscow'        },
  { lat: 37.7,  lng: -122.4, name: 'San Francisco' },
  { lat: -26.2, lng: 28.0,   name: 'Johannesburg'  },
]

function makeArc(
  from: { lat: number; lng: number },
  to:   { lat: number; lng: number },
  lift = 0.55,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const a = ll2v3(from.lat, from.lng)
  const b = ll2v3(to.lat,   to.lng)
  for (let i = 0; i <= 64; i++) {
    const t      = i / 64
    const lerped = new THREE.Vector3().lerpVectors(a, b, t)
    lerped.normalize().multiplyScalar(RADIUS + Math.sin(t * Math.PI) * lift)
    pts.push(lerped.clone())
  }
  return pts
}

const CONNECTIONS = [
  [3,0],[3,1],[3,2],[3,7],[3,4],
  [1,0],[1,9],[2,5],[0,12],
  [7,5],[6,5],[11,1],[4,7],[10,2],
].map(([a, b]) => ({ from: CITIES[a], to: CITIES[b] }))

/* ─── Canvas texture ────────────────────────────────────────── */
function createEarthTexture(): THREE.CanvasTexture {
  const W = 2048, H = 1024
  const cvs = document.createElement('canvas')
  cvs.width = W; cvs.height = H
  const ctx = cvs.getContext('2d')!

  /* Ocean */
  const ocean = ctx.createLinearGradient(0, 0, 0, H)
  ocean.addColorStop(0,   '#010810')
  ocean.addColorStop(0.5, '#020c1a')
  ocean.addColorStop(1,   '#030e1e')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, W, H)

  /* Subtle depth noise on ocean */
  ctx.globalAlpha = 0.04
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * W, y = Math.random() * H
    const r = Math.random() * 40 + 10
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0,   'rgba(0,180,255,0.3)')
    g.addColorStop(1,   'transparent')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  const p = (lng: number, lat: number): [number, number] => [
    ((lng + 180) / 360) * W,
    ((90 - lat)  / 180) * H,
  ]

  const drawContinent = (
    pts: [number, number][],
    fillColor: string,
    strokeColor: string,
    lineW = 2,
  ) => {
    ctx.fillStyle   = fillColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth   = lineW
    ctx.beginPath()
    pts.forEach(([lng, lat], i) => {
      const [x, y] = p(lng, lat)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.closePath(); ctx.fill(); ctx.stroke()
  }

  const LAND_FILL   = 'rgba(0,160,220,0.11)'
  const LAND_LINE   = 'rgba(0,212,255,0.55)'
  const INDIA_FILL  = 'rgba(255,179,71,0.10)'
  const INDIA_LINE  = 'rgba(255,179,71,0.75)'

  // North America
  drawContinent([[-168,72],[-130,60],[-127,54],[-124,49],[-118,33],[-88,16],[-85,9],[-77,8],[-75,12],[-68,44],[-52,47],[-56,53],[-64,61],[-83,64],[-104,70],[-141,70],[-168,72]], LAND_FILL, LAND_LINE)
  // Greenland
  drawContinent([[-73,76],[-18,76],[-20,60],[-48,60],[-73,76]], LAND_FILL, LAND_LINE)
  // South America
  drawContinent([[-80,12],[-62,11],[-52,4],[-36,-8],[-50,-28],[-52,-33],[-64,-42],[-68,-54],[-72,-50],[-80,-34],[-80,12]], LAND_FILL, LAND_LINE)
  // Europe
  drawContinent([[-12,36],[28,36],[36,37],[28,41],[40,48],[30,60],[22,65],[15,68],[5,62],[0,58],[-5,48],[-12,36]], LAND_FILL, LAND_LINE)
  // Africa
  drawContinent([[-18,37],[37,37],[52,12],[52,2],[42,-10],[36,-25],[18,-35],[-18,-37],[-18,37]], LAND_FILL, LAND_LINE)
  // Asia (main — excluding India)
  drawContinent([[26,72],[145,72],[145,50],[140,45],[130,35],[130,6],[120,2],[88,28],[78,38],[68,36],[65,12],[26,12],[26,72]], LAND_FILL, LAND_LINE)
  // ✅ India — highlighted in gold
  drawContinent([[68,36],[88,28],[82,8],[72,8],[68,12],[68,36]], INDIA_FILL, INDIA_LINE, 2.5)
  // Southeast Asia
  drawContinent([[95,20],[110,20],[120,2],[95,2],[95,20]], LAND_FILL, LAND_LINE)
  // Australia
  drawContinent([[114,-22],[154,-22],[154,-38],[132,-40],[116,-38],[114,-22]], LAND_FILL, LAND_LINE)

  /* Bhopal glow dot */
  const [bx, by] = p(77.4, 23.3)
  const bg = ctx.createRadialGradient(bx, by, 0, bx, by, 28)
  bg.addColorStop(0,   'rgba(255,179,71,0.6)')
  bg.addColorStop(0.4, 'rgba(255,179,71,0.2)')
  bg.addColorStop(1,   'transparent')
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.arc(bx, by, 28, 0, Math.PI * 2); ctx.fill()

  /* Lat / lng grid */
  ctx.strokeStyle = 'rgba(0,212,255,0.05)'
  ctx.lineWidth   = 0.6
  for (let lat = -80; lat <= 80; lat += 20) {
    const [, y] = p(0, lat)
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  for (let lng = -160; lng <= 180; lng += 20) {
    const [x] = p(lng, 0)
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }

  return new THREE.CanvasTexture(cvs)
}

/* ─── Star field ────────────────────────────────────────────── */
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 16 + Math.random() * 10
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi)
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  const ref = useRef<THREE.Points>(null!)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#b0ccff"
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Dual atmosphere shells ────────────────────────────────── */
function Atmosphere() {
  return (
    <>
      {/* Inner blue glow */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.10, 64, 64]} />
        <meshPhongMaterial
          color="#0077ff"
          transparent opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Outer haze */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.38, 64, 64]} />
        <meshPhongMaterial
          color="#00D4FF"
          transparent opacity={0.03}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

/* ─── Orbit rings ───────────────────────────────────────────── */
function OrbitRings() {
  return (
    <>
      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS + 0.58, 0.004, 8, 128]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.18} />
      </mesh>
      {/* Tilted ring */}
      <mesh rotation={[Math.PI / 3.5, 0.4, 0.2]}>
        <torusGeometry args={[RADIUS + 0.72, 0.003, 8, 128]} />
        <meshBasicMaterial color="#7B5EA7" transparent opacity={0.13} />
      </mesh>
    </>
  )
}

/* ─── Satellite ─────────────────────────────────────────────── */
function Satellite() {
  const dotRef    = useRef<THREE.Mesh>(null!)
  const trail1    = useRef<THREE.Mesh>(null!)
  const trail2    = useRef<THREE.Mesh>(null!)
  const tRef      = useRef(0)
  const orbitR    = RADIUS + 0.58
  const TILT      = Math.PI / 4

  useFrame((_, delta) => {
    tRef.current += delta * 0.38
    const t = tRef.current
    const pos = (angle: number) => new THREE.Vector3(
      orbitR * Math.cos(angle),
      orbitR * Math.sin(angle) * Math.sin(TILT),
      orbitR * Math.sin(angle) * Math.cos(TILT),
    )
    dotRef.current.position.copy(pos(t))
    trail1.current.position.copy(pos(t - 0.15))
    trail2.current.position.copy(pos(t - 0.30))
  })

  return (
    <>
      <mesh ref={trail2}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={trail1}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  )
}

/* ─── City marker with dual pulse rings ─────────────────────── */
function CityMarker({
  pos, isBhopal, offset,
}: { pos: THREE.Vector3; isBhopal: boolean; offset: number }) {
  const r1   = useRef<THREE.Mesh>(null!)
  const r2   = useRef<THREE.Mesh>(null!)
  const tRef = useRef(offset)
  const color    = isBhopal ? '#FFB347' : '#00D4FF'
  const baseSize = isBhopal ? 0.055 : 0.028

  useFrame((_, delta) => {
    tRef.current += delta * (isBhopal ? 1.0 : 1.3)
    const t = tRef.current

    const s1 = 1 + ((Math.sin(t) * 0.5 + 0.5)) * 1.0
    const o1 = Math.max(0, 1 - (s1 - 1)) * 0.6
    r1.current.scale.setScalar(s1)
    ;(r1.current.material as THREE.MeshBasicMaterial).opacity = o1

    const s2 = 1 + ((Math.sin(t + Math.PI) * 0.5 + 0.5)) * 1.0
    const o2 = Math.max(0, 1 - (s2 - 1)) * 0.35
    r2.current.scale.setScalar(s2)
    ;(r2.current.material as THREE.MeshBasicMaterial).opacity = o2
  })

  return (
    <group position={pos}>
      {/* Core dot */}
      <mesh>
        <sphereGeometry args={[baseSize, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Ring 1 */}
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[baseSize * 1.6, baseSize * 2.4, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Ring 2 */}
      <mesh ref={r2} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[baseSize * 2.8, baseSize * 3.8, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.30} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function CityMarkers() {
  const markers = useMemo(() =>
    CITIES.map((c, i) => ({
      pos:      ll2v3(c.lat, c.lng, RADIUS + 0.022),
      isBhopal: c.name === 'Bhopal',
      offset:   i * 0.45,
    })), [])

  return (
    <group>
      {markers.map((m, i) => <CityMarker key={i} {...m} />)}
    </group>
  )
}

/* ─── Arc line (breathing opacity) ─────────────────────────── */
// ✅ REPLACE with this — uses primitive to avoid SVG type conflict
function ArcLine({
  from, to, offset,
}: { from: typeof CITIES[0]; to: typeof CITIES[0]; offset: number }) {
  const lineRef = useRef<THREE.Line>(null!)
  const tRef    = useRef(offset)

  const object = useMemo(() => {
    const pts  = makeArc(from, to, 0.55)
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    const mat  = new THREE.LineBasicMaterial({
      color:       '#00D4FF',
      transparent: true,
      opacity:     0.18,
    })
    const line = new THREE.Line(geom, mat)
    lineRef.current = line
    return line
  }, [from, to])

  useFrame((_, delta) => {
    tRef.current += delta * 0.6
    if (object.material) {
      (object.material as THREE.LineBasicMaterial).opacity =
        0.14 + Math.sin(tRef.current) * 0.10
    }
  })

  return <primitive object={object} />
}


/* ─── Packet with 2-dot trail ───────────────────────────────── */
interface PacketProps {
  from:  typeof CITIES[0]
  to:    typeof CITIES[0]
  speed: number
  delay: number
  color: string
}

function Packet({ from, to, speed, delay, color }: PacketProps) {
  const mainRef  = useRef<THREE.Mesh>(null!)
  const trailA   = useRef<THREE.Mesh>(null!)
  const trailB   = useRef<THREE.Mesh>(null!)
  const tRef     = useRef(delay)
  const arcPts   = useMemo(() => makeArc(from, to, 0.55), [from, to])
  const curve    = useMemo(() => new THREE.CatmullRomCurve3(arcPts), [arcPts])

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * speed) % 1
    const t = tRef.current
    mainRef.current.position.copy(curve.getPoint(t))
    trailA.current.position.copy(curve.getPoint(Math.max(0, t - 0.018)))
    trailB.current.position.copy(curve.getPoint(Math.max(0, t - 0.038)))
  })

  return (
    <>
      <mesh ref={trailB}>
        <sphereGeometry args={[0.011, 4, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh ref={trailA}>
        <sphereGeometry args={[0.016, 4, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh ref={mainRef}>
        <sphereGeometry args={[0.024, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  )
}

/* ─── Earth mesh ────────────────────────────────────────────── */
function EarthMesh({ texture }: { texture: THREE.CanvasTexture | null }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
  })
  if (!texture) return null

  return (
    <mesh ref={ref}>
      {/* Higher poly for smoother silhouette */}
      <sphereGeometry args={[RADIUS, 80, 80]} />
      <meshPhongMaterial
        map={texture}
        color="#99ccee"
        emissive={new THREE.Color('#000d18')}
        emissiveIntensity={0.5}
        shininess={45}
        specular={new THREE.Color('#003355')}
      />
    </mesh>
  )
}

/* ─── Full scene ────────────────────────────────────────────── */
const PACKET_COLORS = ['#00D4FF', '#7B5EA7', '#00E5A0', '#FFB347', '#FF4D6D', '#00D4FF', '#7B5EA7']

function EarthScene() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  useEffect(() => { setTexture(createEarthTexture()) }, [])

  return (
    <>
      {/* 3-point lighting — sun + rim + accent */}
      <ambientLight     intensity={0.22} />
      <directionalLight position={[9, 5, 7]}   intensity={1.9}  color="#cce8ff" />
      <pointLight       position={[-7,-4,-6]}   intensity={0.45} color="#7B5EA7" />
      <pointLight       position={[0, 8, 2]}    intensity={0.3}  color="#00D4FF" />

      <Stars />
      <EarthMesh texture={texture} />
      <Atmosphere />
      <OrbitRings />
      <Satellite />
      <CityMarkers />

      {CONNECTIONS.map(({ from, to }, i) => (
        <ArcLine key={i} from={from} to={to} offset={i * 0.38} />
      ))}
      {CONNECTIONS.map(({ from, to }, i) => (
        <Packet
          key={i}
          from={from}
          to={to}
          speed={0.09 + (i % 6) * 0.025}
          delay={(i * 0.11) % 1}
          color={PACKET_COLORS[i % PACKET_COLORS.length]}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.45}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Stronger bloom — makes city dots and packets glow */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.05}
          luminanceSmoothing={0.85}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

/* ─── Export ────────────────────────────────────────────────── */
export function EarthGlobe() {
  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 55 }}
        gl={{
          antialias:        true,
          alpha:            true,
          powerPreference:  'high-performance',
          logarithmicDepthBuffer: true,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <EarthScene />
        </Suspense>
      </Canvas>
    </div>
  )
}

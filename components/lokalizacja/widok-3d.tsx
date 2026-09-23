"use client"

/**
 * Widok 3D działki z mapą cieplną zacienienia (Moduł 1, Ekran 3) — three.js przez React Three
 * Fiber (rejestr-decyzji.md D22). Ładowany tylko po stronie klienta (`next/dynamic`, `ssr: false`).
 *
 * Układ: lokalny układ Skanera (x — wschód, y — północ, z — w górę) → three.js (x, z, −y), czyli
 * oś Y three.js jest pionowa, północ w stronę −Z. Tylko rysowanie — żadnych obliczeń fizycznych.
 */
import { Canvas, useThree } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import type { Punkt2D, Punkt3D, PrzeszkodaDrzewo } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import { kolorStraty, type ProbkaMapy } from "./mapa-cieplna"

export type Widok3dProps = {
  dzialka: Punkt2D[]
  budynek: Punkt2D[]
  /** Wysokość bryły budynku (do okapu) [m]; null — tylko obrys na gruncie. */
  wysokoscBudynkuM: number | null
  polacie: Punkt3D[][]
  przeszkody: PrzeszkodaDrzewo[]
  probki: ProbkaMapy[]
  /** Górna granica skali kolorów [%]. */
  skalaMaxProcent: number
}

const v3 = (p: { x: number; y: number }, z = 0) => new THREE.Vector3(p.x, z, -p.y)

function Sterowanie({ cel, odleglosc }: { cel: THREE.Vector3; odleglosc: number }) {
  const { camera, gl } = useThree()
  useEffect(() => {
    camera.position.set(cel.x + odleglosc * 0.6, cel.y + odleglosc * 0.7, cel.z + odleglosc * 0.9)
    camera.lookAt(cel)
    const c = new OrbitControls(camera, gl.domElement)
    c.target.copy(cel)
    c.maxPolarAngle = Math.PI / 2 - 0.02
    c.update()
    return () => c.dispose()
  }, [camera, gl, cel, odleglosc])
  return null
}

function Obrys({ punkty, kolor }: { punkty: Punkt2D[]; kolor: string }) {
  const linia = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(punkty.map((p) => v3(p, 0.02)))
    return new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: kolor }))
  }, [punkty, kolor])
  useEffect(() => () => linia.geometry.dispose(), [linia])
  return <primitive object={linia} />
}

function Bryla({ punkty, wysokosc }: { punkty: Punkt2D[]; wysokosc: number }) {
  const geom = useMemo(() => {
    const ksztalt = new THREE.Shape(punkty.map((p) => new THREE.Vector2(p.x, p.y)))
    return new THREE.ExtrudeGeometry(ksztalt, { depth: wysokosc, bevelEnabled: false })
  }, [punkty, wysokosc])
  useEffect(() => () => geom.dispose(), [geom])
  // Kształt w płaszczyźnie (wschód, północ), wyciągnięty wzdłuż +Z → obrót −90° wokół X: (x, y, z) → (x, z, −y).
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#d6d3d1" />
    </mesh>
  )
}

function Polac({ punkty }: { punkty: Punkt3D[] }) {
  const geom = useMemo(() => {
    const trojkaty = THREE.ShapeUtils.triangulateShape(
      punkty.map((p) => new THREE.Vector2(p.x, p.y)),
      [],
    )
    const g = new THREE.BufferGeometry().setFromPoints(punkty.map((p) => v3(p, p.z)))
    g.setIndex(trojkaty.flat())
    g.computeVertexNormals()
    return g
  }, [punkty])
  useEffect(() => () => geom.dispose(), [geom])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#a8a29e" side={THREE.DoubleSide} />
    </mesh>
  )
}

function Drzewo({ d }: { d: PrzeszkodaDrzewo }) {
  return (
    <group position={v3(d.srodek)}>
      <mesh position={[0, d.wysokoscM / 2, 0]}>
        <cylinderGeometry args={[d.promienKoronyM, d.promienKoronyM, d.wysokoscM, 24]} />
        <meshStandardMaterial color="#15803d" transparent opacity={0.75} />
      </mesh>
      {d.wysokoscPrognozowanaM !== undefined && d.wysokoscPrognozowanaM > d.wysokoscM && (
        <mesh position={[0, d.wysokoscPrognozowanaM / 2, 0]}>
          <cylinderGeometry args={[d.promienKoronyM, d.promienKoronyM, d.wysokoscPrognozowanaM, 24]} />
          <meshBasicMaterial color="#15803d" wireframe />
        </mesh>
      )}
    </group>
  )
}

/** Kwadrat mapy cieplnej leżący na płaszczyźnie połaci, lekko nad nią (bez migotania z-fighting). */
function Probka({ p, skalaMax }: { p: ProbkaMapy; skalaMax: number }) {
  const { pozycja, obrot } = useMemo(() => {
    const n = new THREE.Vector3(p.normalna.x, p.normalna.z, -p.normalna.y).normalize()
    if (n.y < 0) n.negate()
    const poz = v3(p.punkt, p.punkt.z).addScaledVector(n, 0.05)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
    return { pozycja: poz, obrot: new THREE.Euler().setFromQuaternion(q) }
  }, [p])
  return (
    <mesh position={pozycja} rotation={obrot}>
      <planeGeometry args={[p.rozmiarM * 0.9, p.rozmiarM * 0.9]} />
      <meshBasicMaterial color={p.strataProcent === null ? "#6b7280" : kolorStraty(p.strataProcent, skalaMax)} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function Widok3d(props: Widok3dProps) {
  const { cel, odleglosc } = useMemo(() => {
    const pk: Punkt2D[] = [...props.budynek, ...props.polacie.flat(), ...props.przeszkody.map((d) => d.srodek)]
    const zrodlo = pk.length > 0 ? pk : props.dzialka
    if (zrodlo.length === 0) return { cel: new THREE.Vector3(), odleglosc: 30 }
    const xs = zrodlo.map((p) => p.x)
    const ys = zrodlo.map((p) => p.y)
    const rozpietosc = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 10)
    const srodek = { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 }
    return { cel: v3(srodek), odleglosc: rozpietosc * 1.6 }
  }, [props.budynek, props.polacie, props.przeszkody, props.dzialka])

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border bg-sky-100 sm:h-96 dark:bg-slate-800" role="img" aria-label="Widok 3D działki z mapą cieplną zacienienia">
      <Canvas camera={{ fov: 45, near: 0.1, far: 5000 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 100, 80]} intensity={1.1} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cel.x, -0.01, cel.z]}>
          <planeGeometry args={[odleglosc * 6, odleglosc * 6]} />
          <meshStandardMaterial color="#bbd3a6" />
        </mesh>
        {props.dzialka.length >= 3 && <Obrys punkty={props.dzialka} kolor="#1d4ed8" />}
        {props.budynek.length >= 3 && <Obrys punkty={props.budynek} kolor="#c2410c" />}
        {props.budynek.length >= 3 && props.wysokoscBudynkuM !== null && props.wysokoscBudynkuM > 0 && (
          <Bryla punkty={props.budynek} wysokosc={props.wysokoscBudynkuM} />
        )}
        {props.polacie.map((pl, i) => (pl.length >= 3 ? <Polac key={i} punkty={pl} /> : null))}
        {props.przeszkody.map((d, i) => (
          <Drzewo key={i} d={d} />
        ))}
        {props.probki.map((p, i) => (
          <Probka key={i} p={p} skalaMax={props.skalaMaxProcent} />
        ))}
        <Sterowanie cel={cel} odleglosc={odleglosc} />
      </Canvas>
    </div>
  )
}

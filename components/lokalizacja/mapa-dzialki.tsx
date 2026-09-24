"use client"

/**
 * Mapa Skanera działki (Moduł 1, Ekran 2) — MapLibre GL (rejestr-decyzji.md D22). Ładowana tylko
 * po stronie klienta (`next/dynamic`, `ssr: false`) — MapLibre wymaga `window` i WebGL.
 *
 * Podkład: ortofotomapa GUGiK (WMS Geoportalu) — tylko w trybie online. Offline mapa pokazuje
 * wyłącznie geometrię zebraną na spacerze, na neutralnym tle — działa bez sieci (05, 5.3).
 * Etykiety tekstowe MapLibre wymagają serwera fontów (glyphs), więc numery punktów to znaczniki
 * HTML — działają offline.
 */
import "maplibre-gl/dist/maplibre-gl.css"
import {
  type AddLayerObject,
  type GeoJSONSource,
  LngLatBounds,
  Map as MapaGl,
  type MapOptions,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl"
import { useEffect, useRef } from "react"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"

/**
 * WMS ortofotomapy (Geoportal, PZGiK). GetCapabilities deklaruje tylko EPSG:2180/4326, ale serwer
 * poprawnie obsługuje EPSG:3857 (kafel dla Warszawy sprawdzony wizualnie 24.09.2026) — jeśli GUGiK
 * to wyłączy, podkład zniknie, a geometria i ULDK działają dalej.
 */
export const ORTOFOTO_WMS =
  "https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/HighResolution?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1" +
  "&LAYERS=Raster&STYLES=&FORMAT=image/jpeg&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256"

// Worker MapLibre z kopii w public/ — po zbundlowaniu domyślna ścieżka (plik obok modułu) nie
// istnieje. Kopię robi scripts/kopiuj-maplibre-worker.mjs przed dev/build.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")

/** Środek Polski — widok startowy, gdy nie ma jeszcze żadnego punktu ani pozycji GPS. */
const START: [number, number] = [19.4, 52.0]
const ZOOM_START = 5
const ZOOM_DZIALKI = 19

/** Walec (drzewo) — okrąg o promieniu, albo obrys wielokąta (sąsiedni budynek). */
export type PrzeszkodaNaMapie = { punkt: PunktGps; promienM: number | null } | { obrys: PunktGps[] }

export type MapaDzialkiProps = {
  online: boolean
  dzialka: PunktGps[]
  budynek: PunktGps[]
  polacie: PunktGps[][]
  przeszkody: PrzeszkodaNaMapie[]
  /** Punkty zbioru, który użytkownik właśnie uzupełnia — dostają numerowane znaczniki. */
  aktywne: PunktGps[]
  pozycja: { punkt: PunktGps; dokladnoscM: number } | null
  wskazany: PunktGps | null
  onKlik?: (p: PunktGps) => void
  /** Zmiana tej wartości przesuwa widok na całą geometrię (np. po pobraniu działki z ULDK). */
  dopasujWidok: number
}

type Pierscien = [number, number][]
// Typy GeoJSON/stylu wyprowadzone z API MapLibre — pakiety typów (`geojson`, style-spec) są
// zależnościami przechodnimi, nie bezpośrednimi.
type Kolekcja = Extract<Exclude<Parameters<GeoJSONSource["setData"]>[0], string>, { type: "FeatureCollection" }>
type Cecha = Kolekcja["features"][number]
type StylMapy = Exclude<MapOptions["style"], string | undefined>
type Filtr = NonNullable<Extract<AddLayerObject, { type: "line" }>["filter"]>

const lonLat = (p: PunktGps): [number, number] => [p.dlugosc, p.szerokosc]

function zamknij(punkty: PunktGps[]): Pierscien {
  const r = punkty.map(lonLat)
  return r.length > 0 ? [...r, r[0]!] : r
}

/** Okrąg o promieniu w metrach jako wielokąt (lokalnie płaska Ziemia — promienie rzędu metrów). */
function okrag(srodek: PunktGps, promienM: number, n = 32): Pierscien {
  const mNaStopienLat = 111_320
  const mNaStopienLon = 111_320 * Math.cos((srodek.szerokosc * Math.PI) / 180)
  const r: Pierscien = []
  for (let i = 0; i <= n; i++) {
    const a = (2 * Math.PI * i) / n
    r.push([srodek.dlugosc + (promienM * Math.sin(a)) / mNaStopienLon, srodek.szerokosc + (promienM * Math.cos(a)) / mNaStopienLat])
  }
  return r
}

function geojson(p: MapaDzialkiProps): Kolekcja {
  const f: Cecha[] = []
  const wielokat = (rodzaj: string, punkty: PunktGps[]) => {
    if (punkty.length >= 3) f.push({ type: "Feature", properties: { rodzaj }, geometry: { type: "Polygon", coordinates: [zamknij(punkty)] } })
    else if (punkty.length === 2) f.push({ type: "Feature", properties: { rodzaj }, geometry: { type: "LineString", coordinates: punkty.map(lonLat) } })
  }
  wielokat("dzialka", p.dzialka)
  wielokat("budynek", p.budynek)
  p.polacie.forEach((pl) => wielokat("polac", pl))
  for (const o of p.przeszkody) {
    if ("obrys" in o) {
      if (o.obrys.length >= 2) wielokat("przeszkoda", o.obrys)
      else if (o.obrys.length === 1) {
        f.push({ type: "Feature", properties: { rodzaj: "przeszkoda-punkt" }, geometry: { type: "Point", coordinates: lonLat(o.obrys[0]!) } })
      }
    } else if (o.promienM && o.promienM > 0) {
      f.push({ type: "Feature", properties: { rodzaj: "przeszkoda" }, geometry: { type: "Polygon", coordinates: [okrag(o.punkt, o.promienM)] } })
    } else {
      f.push({ type: "Feature", properties: { rodzaj: "przeszkoda-punkt" }, geometry: { type: "Point", coordinates: lonLat(o.punkt) } })
    }
  }
  if (p.pozycja) {
    const { punkt, dokladnoscM } = p.pozycja
    if (dokladnoscM > 0) f.push({ type: "Feature", properties: { rodzaj: "dokladnosc" }, geometry: { type: "Polygon", coordinates: [okrag(punkt, dokladnoscM)] } })
    f.push({ type: "Feature", properties: { rodzaj: "pozycja" }, geometry: { type: "Point", coordinates: lonLat(punkt) } })
  }
  if (p.wskazany) f.push({ type: "Feature", properties: { rodzaj: "wskazany" }, geometry: { type: "Point", coordinates: lonLat(p.wskazany) } })
  return { type: "FeatureCollection", features: f }
}

function wszystkiePunkty(p: MapaDzialkiProps): PunktGps[] {
  return [...p.dzialka, ...p.budynek, ...p.polacie.flat(), ...p.przeszkody.flatMap((o) => ("obrys" in o ? o.obrys : [o.punkt]))]
}

const STYL_BAZOWY: StylMapy = {
  version: 8,
  sources: {},
  layers: [{ id: "tlo", type: "background", paint: { "background-color": "#e7ece4" } }],
}

const rodzaj = (r: string): Filtr => ["==", ["get", "rodzaj"], r]

function dodajWarstwyModelu(map: MapaGl) {
  map.addSource("model", { type: "geojson", data: { type: "FeatureCollection", features: [] } })
  map.addLayer({ id: "dzialka-linia", type: "line", source: "model", filter: rodzaj("dzialka"), paint: { "line-color": "#1d4ed8", "line-width": 3 } })
  map.addLayer({ id: "budynek-wyp", type: "fill", source: "model", filter: rodzaj("budynek"), paint: { "fill-color": "#ea580c", "fill-opacity": 0.35 } })
  map.addLayer({ id: "budynek-linia", type: "line", source: "model", filter: rodzaj("budynek"), paint: { "line-color": "#c2410c", "line-width": 2 } })
  map.addLayer({ id: "polac-wyp", type: "fill", source: "model", filter: rodzaj("polac"), paint: { "fill-color": "#dc2626", "fill-opacity": 0.3 } })
  map.addLayer({ id: "polac-linia", type: "line", source: "model", filter: rodzaj("polac"), paint: { "line-color": "#b91c1c", "line-width": 1.5, "line-dasharray": [2, 1] } })
  map.addLayer({ id: "przeszkoda-wyp", type: "fill", source: "model", filter: rodzaj("przeszkoda"), paint: { "fill-color": "#15803d", "fill-opacity": 0.4 } })
  map.addLayer({ id: "przeszkoda-linia", type: "line", source: "model", filter: rodzaj("przeszkoda"), paint: { "line-color": "#15803d", "line-width": 2 } })
  map.addLayer({ id: "przeszkoda-punkt", type: "circle", source: "model", filter: rodzaj("przeszkoda-punkt"), paint: { "circle-color": "#15803d", "circle-radius": 6 } })
  map.addLayer({ id: "dokladnosc", type: "fill", source: "model", filter: rodzaj("dokladnosc"), paint: { "fill-color": "#0ea5e9", "fill-opacity": 0.15 } })
  map.addLayer({ id: "pozycja", type: "circle", source: "model", filter: rodzaj("pozycja"), paint: { "circle-color": "#0284c7", "circle-radius": 7, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } })
  map.addLayer({ id: "wskazany", type: "circle", source: "model", filter: rodzaj("wskazany"), paint: { "circle-color": "#facc15", "circle-radius": 8, "circle-stroke-color": "#000", "circle-stroke-width": 2 } })
}

/**
 * Numerowane znaczniki tylko dla krótkich zbiorów (spacer GPS, ręczne punkty) — obrys z ULDK ma
 * dziesiątki wierzchołków, a ich numery zasłoniłyby mapę (sprawdzone na działce 40-punktowej).
 */
const MAKS_ZNACZNIKOW = 20

/** Dane modelu → źródło GeoJSON + numerowane znaczniki aktywnego zbioru (poprzednie usuwane). */
function odswiez(map: MapaGl, p: MapaDzialkiProps, stare: Marker[]): Marker[] {
  ;(map.getSource("model") as GeoJSONSource | undefined)?.setData(geojson(p))
  for (const z of stare) z.remove()
  if (p.aktywne.length > MAKS_ZNACZNIKOW) return []
  return p.aktywne.map((pt, i) => {
    const el = document.createElement("div")
    el.textContent = String(i + 1)
    el.className = "rounded-full border border-black bg-white px-1.5 text-xs font-semibold text-black shadow"
    return new Marker({ element: el }).setLngLat(lonLat(pt)).addTo(map)
  })
}

export default function MapaDzialki(props: MapaDzialkiProps) {
  const kontenerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapaGl | null>(null)
  const gotowaRef = useRef(false)
  const znacznikiRef = useRef<Marker[]>([])
  // Najświeższe props dla handlerów MapLibre (load/click) rejestrowanych raz — aktualizowane w
  // efekcie (pierwszym w kolejności), nie w trakcie renderu.
  const propsRef = useRef(props)
  useEffect(() => {
    propsRef.current = props
  })

  // Tworzenie mapy — raz.
  useEffect(() => {
    if (!kontenerRef.current) return
    const pkt = wszystkiePunkty(propsRef.current)[0] ?? propsRef.current.pozycja?.punkt
    const map = new MapaGl({
      container: kontenerRef.current,
      style: STYL_BAZOWY,
      center: pkt ? lonLat(pkt) : START,
      zoom: pkt ? ZOOM_DZIALKI : ZOOM_START,
      maxZoom: 21,
      attributionControl: { compact: true },
    })
    map.addControl(new NavigationControl({ visualizePitch: true }), "top-right")
    map.on("load", () => {
      dodajWarstwyModelu(map)
      gotowaRef.current = true
      znacznikiRef.current = odswiez(map, propsRef.current, znacznikiRef.current)
    })
    map.on("click", (e) => propsRef.current.onKlik?.({ szerokosc: e.lngLat.lat, dlugosc: e.lngLat.lng }))
    mapRef.current = map
    return () => {
      gotowaRef.current = false
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Podkład ortofoto — dokładany/zdejmowany z trybem, żeby offline nie było nieudanych żądań kafli.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const zastosuj = () => {
      const jest = Boolean(map.getSource("orto"))
      if (props.online && !jest) {
        map.addSource("orto", { type: "raster", tiles: [ORTOFOTO_WMS], tileSize: 256, attribution: "Ortofotomapa © GUGiK (geoportal.gov.pl)" })
        map.addLayer({ id: "orto", type: "raster", source: "orto" }, map.getLayer("dzialka-linia") ? "dzialka-linia" : undefined)
      } else if (!props.online && jest) {
        map.removeLayer("orto")
        map.removeSource("orto")
      }
    }
    if (gotowaRef.current) zastosuj()
    else map.once("load", zastosuj)
  }, [props.online])

  // Geometria i znaczniki — przy każdej zmianie danych.
  useEffect(() => {
    const map = mapRef.current
    if (map && gotowaRef.current) znacznikiRef.current = odswiez(map, props, znacznikiRef.current)
  })

  // Dopasowanie widoku na żądanie strony (np. po pobraniu z ULDK, "Pokaż całość").
  useEffect(() => {
    const map = mapRef.current
    if (!map || props.dopasujWidok === 0) return
    const punkty = wszystkiePunkty(propsRef.current)
    if (punkty.length === 0) {
      const poz = propsRef.current.pozycja
      if (poz) map.flyTo({ center: lonLat(poz.punkt), zoom: ZOOM_DZIALKI })
      return
    }
    const b = new LngLatBounds()
    for (const pt of punkty) b.extend(lonLat(pt))
    map.fitBounds(b, { padding: 40, maxZoom: ZOOM_DZIALKI, duration: 600 })
  }, [props.dopasujWidok])

  return <div ref={kontenerRef} className="h-80 w-full overflow-hidden rounded-lg border sm:h-96" aria-label="Mapa działki" role="region" />
}

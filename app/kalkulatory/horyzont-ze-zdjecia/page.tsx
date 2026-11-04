"use client"

import { isComputed } from "@/lib/core/calc-result"
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react"
import { WykresHoryzontuZdjecia } from "@/components/lokalizacja/wykres-horyzontu-zdjecia"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { MIESIACE, WykresMiesiecy } from "@/components/lokalizacja/wykresy-zacienienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateAnalizaZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import { calculateHoryzontZeZdjecia } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/calculator"
import { czasUtcZLokalnego } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/czas"
import { odczytajExif, type ExifZdjecia } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/exif"
import { PUSTE_WEJSCIE, type PunktPiksela } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/input"
import { wykryjLinieHoryzontu } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/niebo"
import { pokrycieProc, PUSTY_PROFIL, scalProfil, type ProfilHoryzontu } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/profil"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"
import { profilZDraftu } from "@/lib/lokalizacja/horyzont-zmierzony"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"

type Stan = {
  /** Merged horizon profile of the project; photos themselves are never stored. */
  profil: ProfilHoryzontu
  hfov: string
  nachylenie: string
  azymut: string
}

const STAN_POCZATKOWY: Stan = { profil: PUSTY_PROFIL, hfov: "", nachylenie: "", azymut: "180" }

/** Preview / processing width [px]: enough for a skyline, small enough for a phone's memory. */
const MAKS_SZEROKOSC_PODGLADU_PX = 1600
/** Marker sizes in image pixels (the overlay scales with the picture). */
const PROMIEN_ZNACZNIKA_PX = 14
const PROMIEN_PUNKTU_PX = 6

type Obraz = { szer: number; wys: number; nazwa: string; exif: ExifZdjecia }
type TrybKlikania = "slonce" | "linia" | null
type Kalibracja = "slonce" | "reczna"

const dwie = (n: number) => String(n).padStart(2, "0")
const naTekstCzasu = (c: NonNullable<ExifZdjecia["czasLokalny"]>) =>
  `${c.rok}-${dwie(c.miesiac)}-${dwie(c.dzien)}T${dwie(c.godzina)}:${dwie(c.minuta)}:${dwie(c.sekunda)}`

function zTekstuCzasu(tekst: string) {
  const m = tekst.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!m) return null
  const [rok, miesiac, dzien, godzina, minuta] = m.slice(1, 6).map(Number) as [number, number, number, number, number]
  return { rok, miesiac, dzien, godzina, minuta, sekunda: Number(m[6] ?? 0) }
}

export default function HoryzontZeZdjeciaPage() {
  const t = useTranslate()
  const { f0, f1, f2 } = useFormaty()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<Stan>("horyzont-ze-zdjecia", STAN_POCZATKOWY)
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pikseleRef = useRef<Uint8ClampedArray | null>(null)
  const [obraz, setObraz] = useState<Obraz | null>(null)
  const [wczytuje, setWczytuje] = useState(false)
  const [bladOdczytu, setBladOdczytu] = useState(false)
  const [szer, setSzer] = useState("")
  const [dlug, setDlug] = useState("")
  const [czas, setCzas] = useState("")
  const [kalibracja, setKalibracja] = useState<Kalibracja>("slonce")
  const [slonce, setSlonce] = useState<PunktPiksela | null>(null)
  const [azymutSrodka, setAzymutSrodka] = useState("")
  const [nachylenieKamery, setNachylenieKamery] = useState("0")
  const [linie, setLinie] = useState<PunktPiksela[][]>([])
  const [liniaAuto, setLiniaAuto] = useState<{ przyGorze: number; sameNiebo: number } | null>(null)
  const [tryb, setTryb] = useState<TrybKlikania>(null)
  const [zastosowano, setZastosowano] = useState(false)

  // Photo location defaults to the project's: the user's own value wins once typed.
  const szerDom = szer !== "" ? szer : lokalizacja ? String(Math.round(lokalizacja.szerokosc * 1e5) / 1e5) : ""
  const dlugDom = dlug !== "" ? dlug : lokalizacja ? String(Math.round(lokalizacja.dlugosc * 1e5) / 1e5) : ""

  const wczytajPlik = useCallback(async (plik: File) => {
    setWczytuje(true)
    setBladOdczytu(false)
    try {
      const bufor = await plik.arrayBuffer()
      const exif = odczytajExif(bufor)
      const url = URL.createObjectURL(new Blob([bufor], { type: plik.type || "image/jpeg" }))
      const img = new Image()
      img.src = url
      await img.decode()
      const skala = Math.min(1, MAKS_SZEROKOSC_PODGLADU_PX / img.naturalWidth)
      const s = Math.round(img.naturalWidth * skala)
      const w = Math.round(img.naturalHeight * skala)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d", { willReadFrequently: true })
      if (!canvas || !ctx) throw new Error("canvas")
      canvas.width = s
      canvas.height = w
      ctx.drawImage(img, 0, 0, s, w)
      URL.revokeObjectURL(url)
      pikseleRef.current = ctx.getImageData(0, 0, s, w).data
      setObraz({ szer: s, wys: w, nazwa: plik.name, exif })
      setSzer(exif.szerokoscGeograficzna !== undefined ? String(Math.round(exif.szerokoscGeograficzna * 1e5) / 1e5) : "")
      setDlug(exif.dlugoscGeograficzna !== undefined ? String(Math.round(exif.dlugoscGeograficzna * 1e5) / 1e5) : "")
      setCzas(exif.czasLokalny ? naTekstCzasu(exif.czasLokalny) : "")
      setSlonce(null)
      setLinie([])
      setLiniaAuto(null)
      setTryb(null)
      setZastosowano(false)
    } catch {
      setObraz(null)
      pikseleRef.current = null
      setBladOdczytu(true)
    } finally {
      setWczytuje(false)
    }
  }, [])

  function wykryj() {
    if (!obraz || !pikseleRef.current) return
    const w = wykryjLinieHoryzontu(pikseleRef.current, obraz.szer, obraz.wys)
    setLinie(w.linie)
    setLiniaAuto({ przyGorze: w.kolumnPrzyGorzeKadru, sameNiebo: w.kolumnSameNiebo })
    setTryb(null)
    setZastosowano(false)
  }

  function kliknieto(e: MouseEvent<SVGSVGElement>) {
    if (!obraz || !tryb) return
    const r = e.currentTarget.getBoundingClientRect()
    const p = { x: ((e.clientX - r.left) / r.width) * obraz.szer, y: ((e.clientY - r.top) / r.height) * obraz.wys }
    if (tryb === "slonce") {
      setSlonce(p)
      setTryb(null)
    } else {
      // A hand-drawn line is a single polyline; it replaces the automatic one on the first click.
      setLinie((prev) => (liniaAuto ? [[p]] : [[...(prev[0] ?? []), p]]))
      setLiniaAuto(null)
    }
    setZastosowano(false)
  }

  const czasLokalny = zTekstuCzasu(czas)
  const czasUtc = czasLokalny ? czasUtcZLokalnego(czasLokalny, obraz?.exif.przesuniecieMin ?? null) : null
  const lat = liczba(szerDom)
  const lon = liczba(dlugDom)

  const wynik = useMemo(
    () =>
      calculateHoryzontZeZdjecia(
        {
          ...PUSTE_WEJSCIE,
          szerokoscPx: obraz?.szer ?? null,
          wysokoscPx: obraz?.wys ?? null,
          hfovDeg: liczba(stan.hfov) ?? null,
          ogniskowa35mmMm: obraz?.exif.ogniskowa35mmMm ?? null,
          szerokoscGeograficzna: lat ?? null,
          dlugoscGeograficzna: lon ?? null,
          czasUtcMs: czasUtc?.utcMs ?? null,
          slonce: kalibracja === "slonce" ? slonce : null,
          orientacjaReczna:
            kalibracja === "reczna" && liczba(azymutSrodka) !== undefined && liczba(nachylenieKamery) !== undefined
              ? { azymutSrodkaDeg: liczba(azymutSrodka)!, nachylenieKameryDeg: liczba(nachylenieKamery)! }
              : null,
          liniaHoryzontu: linie,
        },
        liniaAuto?.przyGorze ?? 0,
      ),
    [obraz, stan.hfov, lat, lon, czasUtc?.utcMs, kalibracja, slonce, azymutSrodka, nachylenieKamery, linie, liniaAuto],
  )

  const profilZapisany = useMemo(() => profilZDraftu(stan), [stan])
  const nachyleniePaneli = liczba(stan.nachylenie)
  const azymutPaneli = liczba(stan.azymut)
  // Annual loss caused by the saved horizon, for the panel plane typed below: the same shading engine as Module 1 Screen 3.
  const strata = useMemo(() => {
    if (!profilZapisany || !lokalizacja || nachyleniePaneli === undefined || azymutPaneli === undefined) return null
    return calculateAnalizaZacienienia({
      szerokoscGeograficzna: lokalizacja.szerokosc,
      dlugoscGeograficzna: lokalizacja.dlugosc,
      punkt: { x: 0, y: 0, z: 0 },
      nachyleniePowierzchniDeg: nachyleniePaneli,
      azymutPowierzchniDeg: azymutPaneli,
      przeszkody: [],
      horyzontZmierzonyDeg: profilZapisany,
      ...(dane ? { daneGodzinowe: dane.dane.rekordy } : {}),
    })
  }, [profilZapisany, lokalizacja, nachyleniePaneli, azymutPaneli, dane])

  // Releasing the decoded pixels when the screen closes keeps the phone's memory free.
  useEffect(() => () => void (pikseleRef.current = null), [])

  if (!wczytano) return <StanLadowania linie={6} />

  const v = wynik.value
  const wynikGotowy = isComputed(wynik.status)
  const brakuje = !obraz
    ? "UI-HORZ-UZUPELNIJ-ZDJECIE"
    : liczba(stan.hfov) === undefined && obraz.exif.ogniskowa35mmMm === undefined
      ? "UI-HORZ-UZUPELNIJ-FOV"
      : lat === undefined || lon === undefined || (kalibracja === "slonce" && czasUtc === null)
        ? "UI-HORZ-UZUPELNIJ-MIEJSCE"
        : kalibracja === "slonce" && !slonce
          ? "UI-HORZ-UZUPELNIJ-SLONCE"
          : kalibracja === "reczna" && liczba(azymutSrodka) === undefined
            ? "UI-HORZ-UZUPELNIJ-AZYMUT"
            : !linie.some((l) => l.length >= 2)
              ? "UI-HORZ-UZUPELNIJ-LINIE"
              : null
  const maExif = obraz && (obraz.exif.czasLokalny || obraz.exif.szerokoscGeograficzna !== undefined || obraz.exif.ogniskowa35mmMm !== undefined)
  const wspolrzedneZdjecia = obraz?.exif.szerokoscGeograficzna !== undefined

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/horyzont-ze-zdjecia" />
      <NaglowekEkranu tytul={t("UI-HORZ-TYTUL")} ekran="horyzont-ze-zdjecia" wynik={wynikGotowy ? wynik : null}>
        {t("UI-HORZ-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-ZDJECIE")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-HORZ-WSKAZOWKI")}</p>
        <Pole
          label={t("UI-HORZ-ZDJECIE")}
          type="file"
          accept="image/jpeg,image/*"
          onChange={(e) => {
            const plik = e.target.files?.[0]
            if (plik) void wczytajPlik(plik)
          }}
          pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="zdjecie" />}
        />
        {wczytuje && <StanLadowania linie={2} />}
        {bladOdczytu && (
          <p role="alert" className="rounded-md border border-werdykt-blad-border bg-werdykt-blad-bg p-3 text-small text-werdykt-blad-foreground">
            {t("UI-HORZ-BLAD-ODCZYTU")}
          </p>
        )}
        {obraz && (
          <p role="status" className="text-small text-muted-foreground">
            {maExif
              ? t("UI-HORZ-EXIF-ODCZYTANO", {
                  nazwa: obraz.nazwa,
                  czas: obraz.exif.czasLokalny ? czas.replace("T", " ") : "—",
                  gps: wspolrzedneZdjecia ? t("UI-HORZ-TAK") : t("UI-HORZ-NIE"),
                  ogniskowa: obraz.exif.ogniskowa35mmMm !== undefined ? `${f0(obraz.exif.ogniskowa35mmMm)} mm` : "—",
                })
              : t("UI-HORZ-EXIF-BRAK", { nazwa: obraz.nazwa })}
          </p>
        )}
        <div className={obraz ? "relative w-full overflow-hidden rounded-md border" : "hidden"}>
          <canvas ref={canvasRef} className="block h-auto w-full" role="img" aria-label={t("UI-HORZ-PODGLAD-ARIA")} />
          {obraz && (
            <svg
              viewBox={`0 0 ${obraz.szer} ${obraz.wys}`}
              className={`absolute inset-0 h-full w-full ${tryb ? "cursor-crosshair" : ""}`}
              onClick={kliknieto}
              aria-hidden="true"
            >
              {linie.map((l, i) => (
                <polyline key={i} points={l.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#ff2d95" strokeWidth={Math.max(2, obraz.szer / 500)} />
              ))}
              {liniaAuto === null && linie[0]?.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={PROMIEN_PUNKTU_PX * (obraz.szer / 1000)} fill="#ff2d95" />)}
              {slonce && (
                <g stroke="#ffd400" strokeWidth={Math.max(2, obraz.szer / 400)} fill="none">
                  <circle cx={slonce.x} cy={slonce.y} r={PROMIEN_ZNACZNIKA_PX * (obraz.szer / 1000)} />
                  <line x1={slonce.x - 2.2 * PROMIEN_ZNACZNIKA_PX * (obraz.szer / 1000)} x2={slonce.x + 2.2 * PROMIEN_ZNACZNIKA_PX * (obraz.szer / 1000)} y1={slonce.y} y2={slonce.y} />
                  <line y1={slonce.y - 2.2 * PROMIEN_ZNACZNIKA_PX * (obraz.szer / 1000)} y2={slonce.y + 2.2 * PROMIEN_ZNACZNIKA_PX * (obraz.szer / 1000)} x1={slonce.x} x2={slonce.x} />
                </g>
              )}
            </svg>
          )}
        </div>
        <Pole
          label={t("UI-HORZ-HFOV")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={10}
          max={150}
          step="any"
          value={stan.hfov}
          onChange={(e) => ustaw("hfov", e.target.value)}
          pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="hfov" />}
        />
        <p className="-mt-2 text-caption text-muted-foreground">{t("UI-HORZ-HFOV-PODPIS")}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-KIERUNEK")}</h2>
        <PoleSelect
          label={t("UI-HORZ-KALIBRACJA")}
          value={kalibracja}
          onChange={(e) => {
            setKalibracja(e.target.value as Kalibracja)
            setTryb(null)
          }}
          pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="kalibracja" />}
        >
          <option value="slonce">{t("UI-HORZ-KALIBRACJA-SLONCE")}</option>
          <option value="reczna">{t("UI-HORZ-KALIBRACJA-RECZNA")}</option>
        </PoleSelect>
        {kalibracja === "slonce" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-HORZ-SZEROKOSC")}
                unit="°"
                type="number"
                inputMode="decimal"
                min={-90}
                max={90}
                step="any"
                value={szerDom}
                onChange={(e) => setSzer(e.target.value)}
                pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="szerokosc" />}
              />
              <Pole
                label={t("UI-HORZ-DLUGOSC")}
                unit="°"
                type="number"
                inputMode="decimal"
                min={-180}
                max={180}
                step="any"
                value={dlugDom}
                onChange={(e) => setDlug(e.target.value)}
                pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="dlugosc" />}
              />
            </div>
            <Pole
              label={t("UI-HORZ-CZAS")}
              type="datetime-local"
              step={1}
              value={czas}
              onChange={(e) => setCzas(e.target.value)}
              pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="czas" />}
            />
            {czasUtc && (
              <p className="-mt-2 text-caption text-muted-foreground">
                {czasUtc.zalozonoCzasPolski ? t("UI-HORZ-CZAS-PL-ZALOZENIE") : t("UI-HORZ-CZAS-Z-PLIKU")}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant={tryb === "slonce" ? "default" : "outline"} className="min-h-11" aria-pressed={tryb === "slonce"} disabled={!obraz} onClick={() => setTryb(tryb === "slonce" ? null : "slonce")}>
                {tryb === "slonce" ? t("UI-HORZ-SLONCE-KLIKNIJ") : t("UI-HORZ-SLONCE-ZAZNACZ")}
              </Button>
              {slonce && (
                <Button variant="outline" className="min-h-11" onClick={() => setSlonce(null)}>
                  {t("UI-HORZ-SLONCE-USUN")}
                </Button>
              )}
            </div>
            <p className="text-small text-muted-foreground">{slonce ? t("UI-HORZ-SLONCE-ZAZNACZONE") : t("UI-HORZ-SLONCE-INSTRUKCJA")}</p>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Pole
              label={t("UI-HORZ-AZYMUT-SRODKA")}
              unit="°"
              type="number"
              inputMode="decimal"
              min={0}
              max={360}
              step="any"
              value={azymutSrodka}
              onChange={(e) => setAzymutSrodka(e.target.value)}
              pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="azymutSrodka" />}
            />
            <Pole
              label={t("UI-HORZ-NACHYLENIE-KAMERY")}
              unit="°"
              type="number"
              inputMode="decimal"
              min={-90}
              max={90}
              step="any"
              value={nachylenieKamery}
              onChange={(e) => setNachylenieKamery(e.target.value)}
              pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="nachylenieKamery" />}
            />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-LINIA")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="min-h-11" disabled={!obraz} onClick={wykryj}>
            {t("UI-HORZ-LINIA-AUTO")}
          </Button>
          <Button variant={tryb === "linia" ? "default" : "outline"} className="min-h-11" aria-pressed={tryb === "linia"} disabled={!obraz} onClick={() => setTryb(tryb === "linia" ? null : "linia")}>
            {tryb === "linia" ? t("UI-HORZ-LINIA-RYSUJ-STOP") : t("UI-HORZ-LINIA-RYSUJ")}
          </Button>
          <Button
            variant="outline"
            className="min-h-11"
            disabled={linie.flat().length === 0}
            onClick={() => {
              setLinie((prev) => (prev[0] ? [prev[0].slice(0, -1)] : prev))
              setZastosowano(false)
            }}
          >
            {t("UI-HORZ-LINIA-COFNIJ")}
          </Button>
          <Button
            variant="outline"
            className="min-h-11"
            disabled={linie.flat().length === 0}
            onClick={() => {
              setLinie([])
              setLiniaAuto(null)
              setZastosowano(false)
            }}
          >
            {t("UI-HORZ-LINIA-WYCZYSC")}
          </Button>
        </div>
        <p className="text-small text-muted-foreground">
          {tryb === "linia"
            ? t("UI-HORZ-LINIA-RYSUJ-INSTRUKCJA")
            : tryb === "slonce"
              ? t("UI-HORZ-SLONCE-KLIKNIJ-INSTRUKCJA")
              : liniaAuto
                ? liniaAuto.sameNiebo > 0 && linie.length === 0
                  ? t("UI-HORZ-LINIA-AUTO-NIC")
                  : t("UI-HORZ-LINIA-AUTO-WYNIK", { odcinki: linie.length })
                : t("UI-HORZ-LINIA-INSTRUKCJA")}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-WYNIK")}</h2>
        {wynik.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-HORZ-BLAD")}>
            <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />
          </WerdyktPanel>
        ) : v === null ? (
          <div className="flex flex-col gap-2">
            <p className="text-small text-muted-foreground">{brakuje ? t(brakuje) : t("UI-HORZ-UZUPELNIJ-LINIE")}</p>
            {wynik.warnings.length > 0 && <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />}
          </div>
        ) : (
          <>
            <WerdyktPanel poziom={wynik.status === "VALID" ? "ok" : "uwaga"} etykieta={t("UI-HORZ-WERDYKT")}>
              <WynikGlowny>{t("UI-HORZ-GC-GLOWNY", { maks: f1(v.maksWysokoscDeg) })}</WynikGlowny>
              <p className="mt-1 text-small">{t("UI-HORZ-GC-POKRYCIE", { pokrycie: f0(v.pokrycieAzymutuProc) })}</p>
              <p className="mt-1 text-small">
                {t("UI-HORZ-GC-KAMERA", { az: f0(v.kamera.azymutSrodkaDeg), nach: f1(v.kamera.nachylenieDeg), fov: f0(v.kamera.hfovDeg) })}
                {v.slonce && ` ${t("UI-HORZ-GC-SLONCE", { az: f0(v.slonce.azymutDeg), wys: f1(v.slonce.wysokoscDeg) })}`}
              </p>
              <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />
            </WerdyktPanel>
            <WykresHoryzontuZdjecia profil={v.profilDeg} />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="min-h-11"
                disabled={zastosowano}
                onClick={() => {
                  setStan((prev) => ({ ...prev, profil: scalProfil(prev.profil, v.profilDeg) }))
                  setZastosowano(true)
                }}
              >
                {zastosowano ? t("UI-HORZ-ZASTOSOWANO") : t("UI-HORZ-ZASTOSUJ")}
              </Button>
              <p className="text-small text-muted-foreground">{t("UI-HORZ-ZASTOSUJ-PODPIS")}</p>
            </div>
            <WynikSzczegoly assumptions={wynik.assumptions} warnings={[]} />
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-PROFIL")}</h2>
        {profilZapisany ? (
          <>
            <p className="text-small">
              {t("UI-HORZ-PROFIL-ZAPISANY", {
                pokrycie: f0(pokrycieProc(profilZapisany)),
                maks: f1(Math.max(...profilZapisany.map((x) => x ?? 0))),
              })}
            </p>
            <WykresHoryzontuZdjecia profil={profilZapisany} />
            <Button variant="outline" className="min-h-11 self-start" onClick={() => ustaw("profil", PUSTY_PROFIL)}>
              {t("UI-HORZ-PROFIL-WYCZYSC")}
            </Button>
          </>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-HORZ-PROFIL-BRAK")}</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">{t("UI-HORZ-KROK-STRATA")}</h2>
        <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-HORZ-NACHYLENIE-PANELI")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            step="any"
            value={stan.nachylenie}
            onChange={(e) => ustaw("nachylenie", e.target.value)}
            pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="nachyleniePaneli" />}
          />
          <Pole
            label={t("UI-HORZ-AZYMUT-PANELI")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={360}
            step="any"
            value={stan.azymut}
            onChange={(e) => ustaw("azymut", e.target.value)}
            pomoc={<PomocPola ekran="horyzont-ze-zdjecia" pole="azymutPaneli" />}
          />
        </div>
        {!profilZapisany ? (
          <p className="text-small text-muted-foreground">{t("UI-HORZ-STRATA-BEZ-PROFILU")}</p>
        ) : !lokalizacja ? (
          <p className="text-small text-muted-foreground">{t("UI-HORZ-STRATA-BEZ-LOKALIZACJI")}</p>
        ) : strata === null ? (
          <p className="text-small text-muted-foreground">{t("UI-HORZ-STRATA-BEZ-PANELI")}</p>
        ) : strata.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-HORZ-BLAD")}>
            <WynikSzczegoly assumptions={[]} warnings={strata.warnings} />
          </WerdyktPanel>
        ) : (
          <WerdyktPanel poziom={strata.value.obecnie.strataRocznaProcent < 0.05 ? "ok" : "uwaga"} etykieta={t("UI-HORZ-STRATA-WERDYKT")}>
            <WynikGlowny>{t("UI-HORZ-STRATA-GLOWNY", { procent: f2(strata.value.obecnie.strataRocznaProcent) })}</WynikGlowny>
            <p className="mt-1 text-small">
              {strata.value.zrodloPromieniowania === "pvgis-tmy" ? t("UI-HORZ-STRATA-TMY") : t("UI-HORZ-STRATA-CZYSTE-NIEBO")}
            </p>
            <p className="mt-1 text-small">
              {t("UI-HORZ-STRATA-ZIMA", {
                grudzien: f1(strata.value.obecnie.strataMiesiecznaProcent[11] ?? 0),
                styczen: f1(strata.value.obecnie.strataMiesiecznaProcent[0] ?? 0),
                lipiec: f1(strata.value.obecnie.strataMiesiecznaProcent[6] ?? 0),
              })}
            </p>
            <WykresMiesiecy obecnie={strata.value.obecnie.strataMiesiecznaProcent} prognoza={null} />
            <p className="text-caption text-muted-foreground">{MIESIACE.join(" · ")}</p>
            <WynikSzczegoly assumptions={strata.assumptions} warnings={strata.warnings} />
          </WerdyktPanel>
        )}
      </section>
    </main>
  )
}

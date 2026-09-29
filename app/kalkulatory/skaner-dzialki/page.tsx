"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { ListaPunktow } from "@/components/lokalizacja/lista-punktow"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { budynekWPunkcie, dzialkaPoIdentyfikatorze, dzialkaWPunkcie, type KodBleduUldk } from "@/lib/adapters/uldk/uldk"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"
import { useTranslate } from "@/lib/i18n/language-context"
import {
  elewacje,
  KLUCZ_MODELU_DZIALKI,
  kierunek,
  liczba,
  MODEL_PUSTY,
  przeszkodaNiekompletna,
  wejscieSkanera,
  type ModelDzialki,
} from "@/lib/lokalizacja/model-dzialki"
import { useGps } from "@/lib/lokalizacja/use-gps"
import { useOnline } from "@/lib/lokalizacja/use-online"

const MapaDzialki = dynamic(() => import("@/components/lokalizacja/mapa-dzialki"), {
  ssr: false,
  loading: () => <StanLadowania linie={6} />,
})

/** Zbiór, do którego trafia następny punkt (GPS albo wskazany na mapie). */
type Zbior = "dzialka" | "budynek" | "przeszkoda" | `polac:${number}` | `przeszkoda:${number}`

const KOMUNIKAT_ULDK: Record<KodBleduUldk, string> = {
  "ULDK-PARAMETRY-NIEPOPRAWNE": "Niepoprawny identyfikator działki albo współrzędne.",
  "ULDK-TIMEOUT": "Usługa ULDK (GUGiK) nie odpowiedziała na czas — spróbuj ponownie albo przejdź na spacer GPS.",
  "ULDK-NIEDOSTEPNY": "Usługa ULDK (GUGiK) jest niedostępna albo nie ma połączenia — przejdź na spacer GPS.",
  "ULDK-NIE-ZNALEZIONO": "W tym miejscu baza nie ma obiektu. Obrysy budynków nie są dostępne w całej Polsce — obejdź budynek z GPS.",
  "ULDK-WIELE-WYNIKOW": "Baza zwróciła kilka obiektów naraz — wskaż miejsce dokładniej.",
  "ULDK-GEOMETRIA-NIEOBSLUGIWANA": "Obiekt składa się z kilku oddzielnych części — tej geometrii nie wczytujemy automatycznie, obejdź go z GPS.",
  "ULDK-NIEOCZEKIWANY-FORMAT": "Usługa ULDK zwróciła odpowiedź w nieoczekiwanym formacie.",
}

const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function SkanerDzialkiPage() {
  const t = useTranslate()
  const online = useOnline()
  const gps = useGps()
  const [model, setModel] = usePersistedDraft<ModelDzialki>(KLUCZ_MODELU_DZIALKI, MODEL_PUSTY)
  const [zbior, setZbior] = useState<Zbior>("dzialka")
  const [wskazany, setWskazany] = useState<PunktGps | null>(null)
  const [teryt, setTeryt] = useState("")
  const [uldk, setUldk] = useState<{ czeka: boolean; komunikat: string | null }>({ czeka: false, komunikat: null })
  const [dopasuj, setDopasuj] = useState(0)

  const trybOnline = model.tryb === "online"
  const sieciBrak = trybOnline && !online
  const zmien = (z: Partial<ModelDzialki>) => setModel((m) => ({ ...m, ...z }))
  /** Indeks przeszkody-obrysu, do której trafiają punkty, albo null. */
  const przeszkodaObrysu = zbior.startsWith("przeszkoda:") ? Number(zbior.slice("przeszkoda:".length)) : null
  const ustawObrysPrzeszkody = (i: number, obrys: PunktGps[]) =>
    setModel((m) => ({ ...m, przeszkody: m.przeszkody.map((q, j) => (j === i && q.typ === "obrys" ? { ...q, obrys } : q)) }))

  const wynik = useMemo(() => calculateSkanerDzialki(wejscieSkanera(model)), [model])

  function dodajPunkt(p: PunktGps) {
    setModel((m) => {
      if (zbior === "dzialka") return { ...m, dzialka: [...m.dzialka, p], opisDzialki: null }
      if (zbior === "budynek") return { ...m, budynek: [...m.budynek, p], idBudynku: null }
      if (zbior === "przeszkoda") {
        const nazwa = `Przeszkoda ${m.przeszkody.length + 1}`
        return { ...m, przeszkody: [...m.przeszkody, { typ: "walec", nazwa, punkt: p, wysokoscM: "", promienM: "" }] }
      }
      if (zbior.startsWith("przeszkoda:")) {
        const i = Number(zbior.slice("przeszkoda:".length))
        return { ...m, przeszkody: m.przeszkody.map((q, j) => (j === i && q.typ === "obrys" ? { ...q, obrys: [...q.obrys, p] } : q)) }
      }
      const i = Number(zbior.slice("polac:".length))
      return { ...m, polacie: m.polacie.map((pl, j) => (j === i ? { ...pl, punkty: [...pl.punkty, p] } : pl)) }
    })
  }

  async function zapiszPunktGps() {
    const o = await gps.odczytaj()
    if (o) dodajPunkt(o.punkt)
  }

  async function pobierzDzialke(p: PunktGps | null) {
    setUldk({ czeka: true, komunikat: null })
    const w = p ? await dzialkaWPunkcie(p.szerokosc, p.dlugosc) : await dzialkaPoIdentyfikatorze(teryt)
    if (!w.ok) return setUldk({ czeka: false, komunikat: KOMUNIKAT_ULDK[w.kod] })
    const { punkty, maOtwory, ...opis } = w.dzialka
    zmien({ dzialka: punkty, opisDzialki: opis })
    setUldk({ czeka: false, komunikat: maOtwory ? "Działka ma wewnętrzne wyłączenia — wczytano tylko granicę zewnętrzną." : null })
    setDopasuj((n) => n + 1)
  }

  async function pobierzBudynek(p: PunktGps) {
    setUldk({ czeka: true, komunikat: null })
    const w = await budynekWPunkcie(p.szerokosc, p.dlugosc)
    if (!w.ok) return setUldk({ czeka: false, komunikat: KOMUNIKAT_ULDK[w.kod] })
    if (przeszkodaObrysu !== null) {
      ustawObrysPrzeszkody(przeszkodaObrysu, w.budynek.punkty)
      setUldk({ czeka: false, komunikat: `Obrys przeszkody z bazy (budynek ${w.budynek.id}) — baza nie ma wysokości, wpisz ją w sekcji Przeszkody.` })
      return setDopasuj((n) => n + 1)
    }
    zmien({ budynek: w.budynek.punkty, idBudynku: w.budynek.id })
    setUldk({ czeka: false, komunikat: "Obrys budynku z bazy nie ma wysokości — do połaci i kalenicy obejdź narożniki z GPS albo wpisz wysokości ręcznie." })
    setDopasuj((n) => n + 1)
  }

  const aktywne =
    zbior === "dzialka"
      ? model.dzialka
      : zbior === "budynek"
        ? model.budynek
        : zbior === "przeszkoda"
          ? []
          : przeszkodaObrysu !== null
            ? (() => {
                const q = model.przeszkody[przeszkodaObrysu]
                return q?.typ === "obrys" ? q.obrys : []
              })()
            : (model.polacie[Number(zbior.slice("polac:".length))]?.punkty ?? [])

  const w = wynik.value
  const elew = useMemo(() => elewacje(w), [w])

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/skaner-dzialki" />
      <NaglowekEkranu tytul="Skaner działki" ekran="skaner-dzialki" wzor={wynik.formula}>
        Granice działki, obrys i dach budynku, przeszkody — podstawa analizy zacienienia (Ekran 3) i oceny
        powierzchni pod panele (Ekran 4). Moduł 1, Ekran 2. Tryb online jest szybszy, ale nie wszędzie dane są
        dokładne — spacer GPS zajmuje więcej czasu, ale daje pewność, że model odpowiada rzeczywistej działce, nie
        mapie sprzed kilku lat.
      </NaglowekEkranu>

      <div role="radiogroup" aria-label="Tryb pracy" className="grid grid-cols-2 gap-2">
        {(["online", "offline"] as const).map((tr) => (
          <Button
            key={tr}
            role="radio"
            aria-checked={model.tryb === tr}
            variant={model.tryb === tr ? "default" : "outline"}
            className="h-auto min-h-11 whitespace-normal py-2"
            onClick={() => zmien({ tryb: tr })}
          >
            {tr === "online" ? "Online (Geoportal)" : "Offline (spacer GPS)"}
          </Button>
        ))}
      </div>
      {sieciBrak && (
        <StanPusty tytul="Brak połączenia z internetem">
          Mapa bez podkładu, pobieranie z Geoportalu niedostępne. Spacer GPS działa bez sieci.
        </StanPusty>
      )}

      <section className="flex flex-col gap-3">
        <MapaDzialki
          online={trybOnline && online}
          dzialka={model.dzialka}
          budynek={model.budynek}
          polacie={model.polacie.map((p) => p.punkty)}
          przeszkody={model.przeszkody.map((p) => (p.typ === "obrys" ? { obrys: p.obrys } : { punkt: p.punkt, promienM: liczba(p.promienM) ?? null }))}
          aktywne={aktywne}
          pozycja={gps.odczyt}
          wskazany={trybOnline ? wskazany : null}
          onKlik={trybOnline ? setWskazany : undefined}
          dopasujWidok={dopasuj}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDopasuj((n) => n + 1)}>
            Pokaż całość
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <PoleSelect label="Następny punkt dodaj do" value={zbior} onChange={(e) => setZbior(e.target.value as Zbior)} pomoc={<PomocPola ekran="skaner-dzialki" pole="zbior" />}>
          <option value="dzialka">Granica działki</option>
          <option value="budynek">Obrys budynku (narożniki przy gruncie)</option>
          {model.polacie.map((p, i) => (
            <option key={i} value={`polac:${i}`}>
              Dach: {p.nazwa}
            </option>
          ))}
          <option value="przeszkoda">Nowa przeszkoda-walec (drzewo)</option>
          {model.przeszkody.map((p, i) =>
            p.typ === "obrys" ? (
              <option key={i} value={`przeszkoda:${i}`}>
                Przeszkoda-obrys: {p.nazwa}
              </option>
            ) : null,
          )}
        </PoleSelect>
        <Button onClick={zapiszPunktGps} disabled={gps.czeka} className="min-h-11">
          {gps.czeka ? "Czekam na sygnał GPS…" : "📍 Zapisz punkt (GPS)"}
        </Button>
        {gps.odczyt && (
          <p className="text-small text-muted-foreground">
            Ostatni odczyt: dokładność ±{f1(gps.odczyt.dokladnoscM)} m
            {gps.odczyt.punkt.wysokoscM !== undefined
              ? `, wysokość ${f1(gps.odczyt.punkt.wysokoscM)} m${gps.odczyt.dokladnoscWysokosciM !== null ? ` (±${f1(gps.odczyt.dokladnoscWysokosciM)} m)` : ""}`
              : ", urządzenie nie podało wysokości"}
          </p>
        )}
        {gps.blad && <p className="text-small text-werdykt-blad-foreground">{gps.blad}</p>}

        {trybOnline && (
          <div className="flex flex-col gap-2 border-t pt-3">
            <p className="text-small text-muted-foreground">
              Kliknij mapę, żeby wskazać miejsce{wskazany ? " (wskazane — żółty punkt)" : ""}.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!wskazany} onClick={() => wskazany && dodajPunkt(wskazany)}>
                Dodaj wskazany punkt
              </Button>
              <Button variant="outline" disabled={!wskazany || uldk.czeka || !online} onClick={() => wskazany && pobierzDzialke(wskazany)}>
                Pobierz działkę w tym miejscu
              </Button>
              <Button variant="outline" disabled={!wskazany || uldk.czeka || !online} onClick={() => wskazany && pobierzBudynek(wskazany)}>
                {przeszkodaObrysu !== null ? "Pobierz obrys przeszkody w tym miejscu" : "Pobierz budynek w tym miejscu"}
              </Button>
              <Button
                variant="outline"
                disabled={gps.czeka}
                onClick={async () => {
                  const o = await gps.odczytaj()
                  if (o) {
                    setWskazany(o.punkt)
                    setDopasuj((n) => n + 1)
                  }
                }}
              >
                Wskaż moją pozycję
              </Button>
            </div>
            <div className="flex items-end gap-2">
              <Pole label="Identyfikator działki (TERYT)" value={teryt} onChange={(e) => setTeryt(e.target.value)} placeholder="np. 146510_8.0309.23/3" pomoc={<PomocPola ekran="skaner-dzialki" pole="teryt" />} />
              <Button variant="outline" className="min-h-11" disabled={uldk.czeka || !online || teryt.trim() === ""} onClick={() => pobierzDzialke(null)}>
                Pobierz
              </Button>
            </div>
            {uldk.czeka && <p className="text-small text-muted-foreground">Łączę z ULDK (GUGiK)…</p>}
            {uldk.komunikat && <p className="text-small">{uldk.komunikat}</p>}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Granica działki</h2>
          {model.opisDzialki && (
            <p className="text-small">
              Działka {model.opisDzialki.numer}, obręb {model.opisDzialki.obreb}, {model.opisDzialki.gmina} ({model.opisDzialki.teryt}) — z ULDK
            </p>
          )}
          <ListaPunktow punkty={model.dzialka} pokazWysokosc={false} onZmien={(dzialka) => zmien({ dzialka, opisDzialki: null })} />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Obrys budynku</h2>
          {model.idBudynku && <p className="text-small">Budynek {model.idBudynku} — z ULDK</p>}
          <ListaPunktow punkty={model.budynek} pokazWysokosc onZmien={(budynek) => zmien({ budynek, idBudynku: null })} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Połacie dachu</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const i = model.polacie.length
                zmien({ polacie: [...model.polacie, { nazwa: `Połać ${i + 1}`, punkty: [] }] })
                setZbior(`polac:${i}`)
              }}
            >
              + Dodaj połać
            </Button>
          </div>
          <p className="text-small text-muted-foreground">
            Każdy narożnik połaci potrzebuje wysokości — z GPS (orientacyjnie) albo wpisanej ręcznie, w tym samym
            układzie co wysokości narożników budynku.
          </p>
          {model.polacie.map((pl, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-end gap-2">
                <Pole
                  id={`polac-${i}-nazwa`}
                  label="Nazwa połaci"
                  value={pl.nazwa}
                  onChange={(e) => zmien({ polacie: model.polacie.map((q, j) => (j === i ? { ...q, nazwa: e.target.value } : q)) })}
                  pomoc={<PomocPola ekran="skaner-dzialki" pole="nazwaPolaci" />}
                />
                <Button
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => {
                    zmien({ polacie: model.polacie.filter((_, j) => j !== i) })
                    setZbior("dzialka")
                  }}
                >
                  Usuń
                </Button>
              </div>
              <ListaPunktow
                punkty={pl.punkty}
                pokazWysokosc
                onZmien={(punkty) => zmien({ polacie: model.polacie.map((q, j) => (j === i ? { ...q, punkty } : q)) })}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Przeszkody</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const i = model.przeszkody.length
                zmien({ przeszkody: [...model.przeszkody, { typ: "obrys", nazwa: `Przeszkoda ${i + 1}`, obrys: [], wysokoscM: "" }] })
                setZbior(`przeszkoda:${i}`)
              }}
            >
              + Dodaj przeszkodę-obrys
            </Button>
          </div>
          <p className="text-small text-muted-foreground">
            Drzewo jako walec: środek, wysokość, promień korony. Sąsiedni budynek, ściana albo skarpa jako obrys: narożniki
            przy gruncie (GPS, punkt na mapie albo obrys z bazy budynków) i wysokość. Prognozę wzrostu drzew podajesz na
            Ekranie 3.
          </p>
          {model.przeszkody.length === 0 && <p className="text-small text-muted-foreground">Brak przeszkód.</p>}
          {model.przeszkody.map((p, i) => {
            const ustaw = (z: { nazwa?: string; wysokoscM?: string; promienM?: string }) =>
              zmien({ przeszkody: model.przeszkody.map((q, j) => (j === i ? { ...q, ...z } : q)) })
            const usun = () => {
              zmien({ przeszkody: model.przeszkody.filter((_, j) => j !== i) })
              if (zbior.startsWith("przeszkoda:")) setZbior("dzialka")
            }
            return (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-4">
                <Pole id={`przeszkoda-${i}-nazwa`} label="Nazwa" value={p.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="skaner-dzialki" pole="nazwaPrzeszkody" />} />
                <Pole
                  id={`przeszkoda-${i}-wysokosc`}
                  label="Wysokość"
                  unit="m"
                  inputMode="decimal"
                  value={p.wysokoscM}
                  onChange={(e) => ustaw({ wysokoscM: e.target.value })}
                  pomoc={<PomocPola ekran="skaner-dzialki" pole="wysokoscPrzeszkody" />}
                />
                {p.typ === "obrys" ? (
                  <p className="mt-auto text-small text-muted-foreground">Narożniki obrysu: {p.obrys.length}</p>
                ) : (
                  <Pole id={`przeszkoda-${i}-promien`} label="Promień" unit="m" inputMode="decimal" value={p.promienM} onChange={(e) => ustaw({ promienM: e.target.value })} pomoc={<PomocPola ekran="skaner-dzialki" pole="promien" />} />
                )}
                <Button variant="ghost" className="mt-auto min-h-11" onClick={usun}>
                  Usuń
                </Button>
                {p.typ === "obrys" && (
                  <div className="col-span-full">
                    <ListaPunktow punkty={p.obrys} pokazWysokosc={false} onZmien={(obrys) => ustawObrysPrzeszkody(i, obrys)} />
                  </div>
                )}
                {przeszkodaNiekompletna(p) && (
                  <p className="col-span-full text-small text-muted-foreground">
                    {p.typ === "obrys"
                      ? "Uzupełnij wysokość i co najmniej 3 narożniki obrysu — do tego czasu przeszkoda nie jest liczona."
                      : "Uzupełnij wysokość i promień — do tego czasu przeszkoda nie jest liczona."}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Kalibracja znanym wymiarem (opcjonalnie)</h2>
          <p className="text-small text-muted-foreground">
            Wpisz zmierzoną taśmą długość odcinka między dwoma punktami (np. długość ściany 12 m) — skoryguje błąd GPS
            urządzenia.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <PoleSelect
              label="Zbiór"
              value={model.kalibracja.zbior}
              onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, zbior: e.target.value as "dzialka" | "budynek" } })}
              pomoc={<PomocPola ekran="skaner-dzialki" pole="zbiorKalibracji" />}
            >
              <option value="budynek">Budynek</option>
              <option value="dzialka">Działka</option>
            </PoleSelect>
            <Pole label="Punkt A (nr)" inputMode="numeric" value={model.kalibracja.punktA} onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, punktA: e.target.value } })} pomoc={<PomocPola ekran="skaner-dzialki" pole="punktA" />} />
            <Pole label="Punkt B (nr)" inputMode="numeric" value={model.kalibracja.punktB} onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, punktB: e.target.value } })} pomoc={<PomocPola ekran="skaner-dzialki" pole="punktB" />} />
            <Pole
              label="Długość A–B"
              unit="m"
              inputMode="decimal"
              value={model.kalibracja.znanaDlugoscM}
              onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, znanaDlugoscM: e.target.value } })}
              pomoc={<PomocPola ekran="skaner-dzialki" pole="dlugoscAB" />}
            />
          </div>
        </div>
      </section>

      {wynik.status === "INCOMPLETE" ? (
        <StanPusty tytul="Zbierz punkty granicy działki albo narożników budynku (co najmniej 3)." />
      ) : (
        <WerdyktPanel
          poziom={poziomZStatusu(wynik.status)}
          etykieta={wynik.status === "INVALID_INPUT" ? "Sprawdź dane" : wynik.status === "VALID" ? "Model działki gotowy" : "Model działki gotowy — z uwagami"}
        >
          <div className="mt-2 flex flex-col gap-2 text-small">
            {w.dzialka && (
              <p>
                Działka: {f0(w.dzialka.powierzchniaM2)} m², obwód {f1(w.dzialka.obwodM)} m
              </p>
            )}
            {w.budynek && (
              <p>
                Budynek: {f1(w.budynek.powierzchniaM2)} m² rzutu. Elewacje:{" "}
                {elew.map((e) => `${e.nazwa.replace("Elewacja ", "")} ${e.azymutDeg}° (${f1(e.wymiar)} m)`).join(", ")}
              </p>
            )}
            {w.polacie.map((p) => (
              <p key={p.nazwa}>
                {p.nazwa}: nachylenie {f1(p.nachylenieDeg)}°,{" "}
                {p.azymutDeg === null ? "płaska" : `azymut ${f0(p.azymutDeg)}° (${kierunek(p.azymutDeg)})`}, {f1(p.poleRzeczywisteM2)} m²
                {p.odchylenieOdPlaszczyznyM > 0.05 ? `, punkty odstają od płaszczyzny o ${f1(p.odchylenieOdPlaszczyznyM)} m` : ""}
              </p>
            ))}
            {w.wysokoscKalenicyM !== null && <p>Wysokość kalenicy: {f1(w.wysokoscKalenicyM)} m nad gruntem</p>}
            {w.skalaKalibracji !== null && <p>Skala kalibracji: {w.skalaKalibracji.toFixed(4)}</p>}
            {w.przeszkody.length > 0 && <p>Przeszkody do analizy zacienienia: {w.przeszkody.length}</p>}
            {wynik.warnings.length > 0 && (
              <ul className="flex flex-col gap-1">
                {wynik.warnings.map((x, i) => (
                  <li key={x.code + i}>{x.message ?? t(x.i18nKey ?? x.code, x.params)}</li>
                ))}
              </ul>
            )}
            <ZalozeniaLista assumptions={wynik.assumptions} />
          </div>
        </WerdyktPanel>
      )}

      <nav className="flex flex-wrap gap-2" aria-label="Następne ekrany">
        <Link href="/kalkulatory/analiza-zacienienia" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          → Ekran 3: Analiza zacienienia
        </Link>
        <Link href="/kalkulatory/orientacja-powierzchni" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          → Ekran 4: Orientacja powierzchni
        </Link>
      </nav>
    </main>
  )
}

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
  "ULDK-PARAMETRY-NIEPOPRAWNE": "UI-SKADZI-ULDK-PARAMETRY",
  "ULDK-TIMEOUT": "UI-SKADZI-ULDK-TIMEOUT",
  "ULDK-NIEDOSTEPNY": "UI-SKADZI-ULDK-NIEDOSTEPNY",
  "ULDK-NIE-ZNALEZIONO": "UI-SKADZI-ULDK-NIE-ZNALEZIONO",
  "ULDK-WIELE-WYNIKOW": "UI-SKADZI-ULDK-WIELE-WYNIKOW",
  "ULDK-GEOMETRIA-NIEOBSLUGIWANA": "UI-SKADZI-ULDK-GEOMETRIA",
  "ULDK-NIEOCZEKIWANY-FORMAT": "UI-SKADZI-ULDK-FORMAT",
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
    if (!w.ok) return setUldk({ czeka: false, komunikat: t(KOMUNIKAT_ULDK[w.kod]) })
    const { punkty, maOtwory, ...opis } = w.dzialka
    zmien({ dzialka: punkty, opisDzialki: opis })
    setUldk({ czeka: false, komunikat: maOtwory ? t("UI-SKADZI-DZIALKA-WEWNETRZNE-WYLACZENI") : null })
    setDopasuj((n) => n + 1)
  }

  async function pobierzBudynek(p: PunktGps) {
    setUldk({ czeka: true, komunikat: null })
    const w = await budynekWPunkcie(p.szerokosc, p.dlugosc)
    if (!w.ok) return setUldk({ czeka: false, komunikat: t(KOMUNIKAT_ULDK[w.kod]) })
    if (przeszkodaObrysu !== null) {
      ustawObrysPrzeszkody(przeszkodaObrysu, w.budynek.punkty)
      setUldk({ czeka: false, komunikat: t("UI-SKADZI-OBRYS-PRZESZKODY-BAZY", { id: w.budynek.id }) })
      return setDopasuj((n) => n + 1)
    }
    zmien({ budynek: w.budynek.punkty, idBudynku: w.budynek.id })
    setUldk({ czeka: false, komunikat: t("UI-SKADZI-OBRYS-BUDYNKU-BAZY") })
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
      <NaglowekEkranu tytul={t("UI-SKADZI-SKANER-DZIALKI")} ekran="skaner-dzialki" wynik={wynik}>
        {t("UI-SKADZI-GRANICE-DZIALKI-OBRYS")}
      </NaglowekEkranu>

      <div role="radiogroup" aria-label={t("UI-SKADZI-TRYB-PRACY")} className="grid grid-cols-2 gap-2">
        {(["online", "offline"] as const).map((tr) => (
          <Button
            key={tr}
            role="radio"
            aria-checked={model.tryb === tr}
            variant={model.tryb === tr ? "default" : "outline"}
            className="h-auto min-h-11 whitespace-normal py-2"
            onClick={() => zmien({ tryb: tr })}
          >
            {tr === "online" ? t("UI-SKADZI-ONLINE-GEOPORTAL") : t("UI-SKADZI-OFFLINE-SPACER-GPS")}
          </Button>
        ))}
      </div>
      {sieciBrak && (
        <StanPusty tytul={t("UI-SKADZI-BRAK-POLACZENIA-INTERNETEM")}>
          {t("UI-SKADZI-MAPA-BEZ-PODKLADU")}
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
            {t("UI-SKADZI-POKAZ-CALOSC")}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <PoleSelect label={t("UI-SKADZI-NASTEPNY-PUNKT-DODAJ")} value={zbior} onChange={(e) => setZbior(e.target.value as Zbior)} pomoc={<PomocPola ekran="skaner-dzialki" pole="zbior" />}>
          <option value="dzialka">{t("UI-SKADZI-GRANICA-DZIALKI")}</option>
          <option value="budynek">{t("UI-SKADZI-OBRYS-BUDYNKU-NAROZNIKI")}</option>
          {model.polacie.map((p, i) => (
            <option key={i} value={`polac:${i}`}>
              {t("UI-SKADZI-DACH", { nazwa: p.nazwa })}
            </option>
          ))}
          <option value="przeszkoda">{t("UI-SKADZI-NOWA-PRZESZKODA-WALEC")}</option>
          {model.przeszkody.map((p, i) =>
            p.typ === "obrys" ? (
              <option key={i} value={`przeszkoda:${i}`}>
                {t("UI-SKADZI-PRZESZKODA-OBRYS", { nazwa: p.nazwa })}
              </option>
            ) : null,
          )}
        </PoleSelect>
        <Button onClick={zapiszPunktGps} disabled={gps.czeka} className="min-h-11">
          {gps.czeka ? t("UI-SKADZI-CZEKAM-SYGNAL-GPS") : t("UI-SKADZI-ZAPISZ-PUNKT-GPS")}
        </Button>
        {gps.odczyt && (
          <p className="text-small text-muted-foreground">
            {t("UI-SKADZI-OSTATNI-ODCZYT-DOKLADNOSC", { dokladnoscM: f1(gps.odczyt.dokladnoscM) })}
            {gps.odczyt.punkt.wysokoscM !== undefined
              ? t("UI-SKADZI-WYSOKOSC", { wysokoscM: f1(gps.odczyt.punkt.wysokoscM), p: gps.odczyt.dokladnoscWysokosciM !== null ? ` (±${f1(gps.odczyt.dokladnoscWysokosciM)} m)` : "" })
              : t("UI-SKADZI-URZADZENIE-PODALO-WYSOKOSCI")}
          </p>
        )}
        {gps.blad && <p className="text-small text-werdykt-blad-foreground">{gps.blad}</p>}

        {trybOnline && (
          <div className="flex flex-col gap-2 border-t pt-3">
            <p className="text-small text-muted-foreground">
              {t("UI-SKADZI-KLIKNIJ-MAPE-ZEBY")}{wskazany ? ` ${t("UI-SKADZI-WSKAZANE-ZOLTY-PUNKT")}` : ""}.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!wskazany} onClick={() => wskazany && dodajPunkt(wskazany)}>
                {t("UI-SKADZI-DODAJ-WSKAZANY-PUNKT")}
              </Button>
              <Button variant="outline" disabled={!wskazany || uldk.czeka || !online} onClick={() => wskazany && pobierzDzialke(wskazany)}>
                {t("UI-SKADZI-POBIERZ-DZIALKE-TYM")}
              </Button>
              <Button variant="outline" disabled={!wskazany || uldk.czeka || !online} onClick={() => wskazany && pobierzBudynek(wskazany)}>
                {przeszkodaObrysu !== null ? t("UI-SKADZI-POBIERZ-OBRYS-PRZESZKODY") : t("UI-SKADZI-POBIERZ-BUDYNEK-TYM")}
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
                {t("UI-SKADZI-WSKAZ-MOJA-POZYCJE")}
              </Button>
            </div>
            <div className="flex items-end gap-2">
              <Pole label={t("UI-SKADZI-IDENTYFIKATOR-DZIALKI-TERYT")} value={teryt} onChange={(e) => setTeryt(e.target.value)} placeholder="np. 146510_8.0309.23/3" pomoc={<PomocPola ekran="skaner-dzialki" pole="teryt" />} />
              <Button variant="outline" className="min-h-11" disabled={uldk.czeka || !online || teryt.trim() === ""} onClick={() => pobierzDzialke(null)}>
                {t("UI-SKADZI-POBIERZ")}
              </Button>
            </div>
            {uldk.czeka && <p className="text-small text-muted-foreground">{t("UI-SKADZI-LACZE-ULDK-GUGIK")}</p>}
            {uldk.komunikat && <p className="text-small">{uldk.komunikat}</p>}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("UI-SKADZI-GRANICA-DZIALKI")}</h2>
          {model.opisDzialki && (
            <p className="text-small">
              {t("UI-SKADZI-DZIALKA-OBREB-ULDK", { numer: model.opisDzialki.numer, obreb: model.opisDzialki.obreb, gmina: model.opisDzialki.gmina, teryt: model.opisDzialki.teryt })}
            </p>
          )}
          <ListaPunktow punkty={model.dzialka} pokazWysokosc={false} onZmien={(dzialka) => zmien({ dzialka, opisDzialki: null })} />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("UI-SKADZI-OBRYS-BUDYNKU")}</h2>
          {model.idBudynku && <p className="text-small">{t("UI-SKADZI-BUDYNEK-ULDK", { idBudynku: model.idBudynku })}</p>}
          <ListaPunktow punkty={model.budynek} pokazWysokosc onZmien={(budynek) => zmien({ budynek, idBudynku: null })} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">{t("UI-SKADZI-POLACIE-DACHU")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const i = model.polacie.length
                zmien({ polacie: [...model.polacie, { nazwa: t("UI-SKADZI-POLAC", { p: i + 1 }), punkty: [] }] })
                setZbior(`polac:${i}`)
              }}
            >
              {t("UI-SKADZI-DODAJ-POLAC")}
            </Button>
          </div>
          <p className="text-small text-muted-foreground">
            {t("UI-SKADZI-KAZDY-NAROZNIK-POLACI")}
          </p>
          {model.polacie.map((pl, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-end gap-2">
                <Pole
                  id={`polac-${i}-nazwa`}
                  label={t("UI-SKADZI-NAZWA-POLACI")}
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
                  {t("UI-SKADZI-USUN")}
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
            <h2 className="font-semibold">{t("UI-SKADZI-PRZESZKODY")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const i = model.przeszkody.length
                zmien({ przeszkody: [...model.przeszkody, { typ: "obrys", nazwa: t("UI-SKADZI-PRZESZKODA", { p: i + 1 }), obrys: [], wysokoscM: "" }] })
                setZbior(`przeszkoda:${i}`)
              }}
            >
              {t("UI-SKADZI-DODAJ-PRZESZKODE-OBRYS")}
            </Button>
          </div>
          <p className="text-small text-muted-foreground">
            {t("UI-SKADZI-DRZEWO-JAKO-WALEC")}
          </p>
          {model.przeszkody.length === 0 && <p className="text-small text-muted-foreground">{t("UI-SKADZI-BRAK-PRZESZKOD")}</p>}
          {model.przeszkody.map((p, i) => {
            const ustaw = (z: { nazwa?: string; wysokoscM?: string; promienM?: string }) =>
              zmien({ przeszkody: model.przeszkody.map((q, j) => (j === i ? { ...q, ...z } : q)) })
            const usun = () => {
              zmien({ przeszkody: model.przeszkody.filter((_, j) => j !== i) })
              if (zbior.startsWith("przeszkoda:")) setZbior("dzialka")
            }
            return (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-4">
                <Pole id={`przeszkoda-${i}-nazwa`} label={t("UI-SKADZI-NAZWA")} value={p.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="skaner-dzialki" pole="nazwaPrzeszkody" />} />
                <Pole
                  id={`przeszkoda-${i}-wysokosc`}
                  label={t("UI-SKADZI-WYSOKOSC-2")}
                  unit="m"
                  inputMode="decimal"
                  value={p.wysokoscM}
                  onChange={(e) => ustaw({ wysokoscM: e.target.value })}
                  pomoc={<PomocPola ekran="skaner-dzialki" pole="wysokoscPrzeszkody" />}
                />
                {p.typ === "obrys" ? (
                  <p className="mt-auto text-small text-muted-foreground">{t("UI-SKADZI-NAROZNIKI-OBRYSU", { length: p.obrys.length })}</p>
                ) : (
                  <Pole id={`przeszkoda-${i}-promien`} label={t("UI-SKADZI-PROMIEN")} unit="m" inputMode="decimal" value={p.promienM} onChange={(e) => ustaw({ promienM: e.target.value })} pomoc={<PomocPola ekran="skaner-dzialki" pole="promien" />} />
                )}
                <Button variant="ghost" className="mt-auto min-h-11" onClick={usun}>
                  {t("UI-SKADZI-USUN")}
                </Button>
                {p.typ === "obrys" && (
                  <div className="col-span-full">
                    <ListaPunktow punkty={p.obrys} pokazWysokosc={false} onZmien={(obrys) => ustawObrysPrzeszkody(i, obrys)} />
                  </div>
                )}
                {przeszkodaNiekompletna(p) && (
                  <p className="col-span-full text-small text-muted-foreground">
                    {p.typ === "obrys"
                      ? t("UI-SKADZI-UZUPELNIJ-WYSOKOSC-NAJMNIEJ")
                      : t("UI-SKADZI-UZUPELNIJ-WYSOKOSC-PROMIEN")}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("UI-SKADZI-KALIBRACJA-ZNANYM-WYMIAREM")}</h2>
          <p className="text-small text-muted-foreground">
            {t("UI-SKADZI-WPISZ-ZMIERZONA-TASMA")}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <PoleSelect
              label={t("UI-SKADZI-ZBIOR")}
              value={model.kalibracja.zbior}
              onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, zbior: e.target.value as "dzialka" | "budynek" } })}
              pomoc={<PomocPola ekran="skaner-dzialki" pole="zbiorKalibracji" />}
            >
              <option value="budynek">{t("UI-SKADZI-BUDYNEK")}</option>
              <option value="dzialka">{t("UI-SKADZI-DZIALKA")}</option>
            </PoleSelect>
            <Pole label={t("UI-SKADZI-PUNKT")} inputMode="numeric" value={model.kalibracja.punktA} onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, punktA: e.target.value } })} pomoc={<PomocPola ekran="skaner-dzialki" pole="punktA" />} />
            <Pole label={t("UI-SKADZI-PUNKT-2")} inputMode="numeric" value={model.kalibracja.punktB} onChange={(e) => zmien({ kalibracja: { ...model.kalibracja, punktB: e.target.value } })} pomoc={<PomocPola ekran="skaner-dzialki" pole="punktB" />} />
            <Pole
              label={t("UI-SKADZI-DLUGOSC")}
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
        <StanPusty tytul={t("UI-SKADZI-ZBIERZ-PUNKTY-GRANICY")} />
      ) : (
        <WerdyktPanel
          poziom={poziomZStatusu(wynik.status)}
          etykieta={wynik.status === "INVALID_INPUT" ? t("UI-SKADZI-SPRAWDZ-DANE") : wynik.status === "VALID" ? t("UI-SKADZI-MODEL-DZIALKI-GOTOWY") : t("UI-SKADZI-MODEL-DZIALKI-GOTOWY-2")}
        >
          <div className="mt-2 flex flex-col gap-2 text-small">
            {w.dzialka && (
              <p>
                {t("UI-SKADZI-DZIALKA-OBWOD", { powierzchniaM2: f0(w.dzialka.powierzchniaM2), obwodM: f1(w.dzialka.obwodM) })}
              </p>
            )}
            {w.budynek && (
              <p>
                {t("UI-SKADZI-BUDYNEK-RZUTU-ELEWACJE", { powierzchniaM2: f1(w.budynek.powierzchniaM2) })}{" "}
                {elew.map((e) => `${e.nazwa.replace("Elewacja ", "")} ${e.azymutDeg}° (${f1(e.wymiar)} m)`).join(", ")}
              </p>
            )}
            {w.polacie.map((p) => (
              <p key={p.nazwa}>
                {t("UI-SKADZI-NACHYLENIE", { nazwa: p.nazwa, nachylenieDeg: f1(p.nachylenieDeg) })}{" "}
                {p.azymutDeg === null ? t("UI-SKADZI-PLASKA") : t("UI-SKADZI-AZYMUT", { azymutDeg: f0(p.azymutDeg), azymutDeg2: kierunek(p.azymutDeg) })}, {f1(p.poleRzeczywisteM2)} m²
                {p.odchylenieOdPlaszczyznyM > 0.05 ? t("UI-SKADZI-PUNKTY-ODSTAJA-PLASZCZYZNY", { odchylenieOdPlaszczyznyM: f1(p.odchylenieOdPlaszczyznyM) }) : ""}
              </p>
            ))}
            {w.wysokoscKalenicyM !== null && <p>{t("UI-SKADZI-WYSOKOSC-KALENICY-NAD", { wysokoscKalenicyM: f1(w.wysokoscKalenicyM) })}</p>}
            {w.skalaKalibracji !== null && <p>{t("UI-SKADZI-SKALA-KALIBRACJI", { skalaKalibracji: w.skalaKalibracji.toFixed(4) })}</p>}
            {w.przeszkody.length > 0 && <p>{t("UI-SKADZI-PRZESZKODY-ANALIZY-ZACIENIEN", { length: w.przeszkody.length })}</p>}
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

      <nav className="flex flex-wrap gap-2" aria-label={t("UI-SKADZI-NASTEPNE-EKRANY")}>
        <Link href="/kalkulatory/analiza-zacienienia" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-SKADZI-EKRAN-ANALIZA-ZACIENIENIA")}
        </Link>
        <Link href="/kalkulatory/orientacja-powierzchni" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-SKADZI-EKRAN-ORIENTACJA-POWIERZCHNI")}
        </Link>
      </nav>
    </main>
  )
}

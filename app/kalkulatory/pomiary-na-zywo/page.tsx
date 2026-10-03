"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { IndexedDbMagazynProbek } from "@/lib/adapters/telemetria/magazyn-probek"
import { wczytajRejestr } from "@/lib/adapters/telemetria/rejestr-zrodel"
import { utworzZrodlo } from "@/lib/adapters/telemetria/zrodla"
import { daneNieaktualne, noweAlarmyDoPowiadomienia, ocenAlarmy, ostatnieWartosci, seriaDoWykresu, type MinPriorytetPowiadomien, type PriorytetAlarmu, type ProgAlarmu } from "@/lib/core/telemetria/alarmy"
import { WIELKOSCI, WIELKOSCI_LISTA, type ProbkaTelemetrii, type Wielkosc } from "@/lib/core/telemetria/probka"
import { pustyRejestr, type Rejestr } from "@/lib/core/telemetria/rejestr"
import { generujDemo, type ScenariuszSymulatora } from "@/lib/core/telemetria/symulator"
import type { StatusPolaczenia, TelemetrySource } from "@/lib/core/telemetria/zrodlo"
import { useTranslate } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

interface WierszProgu {
  wielkosc: Wielkosc
  kanal: string
  kierunek: "ponizej" | "powyzej"
  wartosc: string
  priorytet: PriorytetAlarmu
}

interface Szkic {
  zrodloId: string
  oknoH: "1" | "6" | "24"
  maxWiekS: string
  scenariusz: ScenariuszSymulatora
  progi: WierszProgu[]
  powiadomieniaMin: MinPriorytetPowiadomien
}

const SZKIC_POCZATKOWY: Szkic = { zrodloId: "", oknoH: "1", maxWiekS: "", scenariusz: "normalna-praca", progi: [], powiadomieniaMin: "wylaczone" }
const NOWY_PROG: WierszProgu = { wielkosc: "soc", kanal: "", kierunek: "ponizej", wartosc: "", priorytet: "ostrzezenie" }
const SCENARIUSZE: ScenariuszSymulatora[] = ["normalna-praca", "zima-brak-slonca", "alarm-bms", "zwarcie"]
const ODSWIEZANIE_MS = 3000
const KOLORY_WYKRESU = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
const W = 300
const H = 110

const KLASA_PRIORYTETU: Record<PriorytetAlarmu, string> = {
  info: "border-muted-foreground/40",
  ostrzezenie: "border-werdykt-uwaga-border bg-werdykt-uwaga-bg",
  krytyczny: "border-werdykt-blad-border bg-werdykt-blad-bg",
}

const formatuj = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(1))

export default function PomiaryNaZywoPage() {
  const t = useTranslate()
  // autosave: user choices (source, window, stale limit, thresholds); samples live in the sample store.
  const [zapisany, setSzkic] = usePersistedDraft<Szkic>("pomiary-na-zywo", SZKIC_POCZATKOWY)
  const szkic = useMemo<Szkic>(() => ({ ...SZKIC_POCZATKOWY, ...zapisany }), [zapisany])
  const ustaw = <K extends keyof Szkic>(pole: K, wartosc: Szkic[K]) => setSzkic((s) => ({ ...s, [pole]: wartosc }))

  const [rejestr, setRejestr] = useState<Rejestr>(pustyRejestr())
  const [probki, setProbki] = useState<ProbkaTelemetrii[]>([])
  const [teraz, setTeraz] = useState(() => Date.now())
  const [status, setStatus] = useState<StatusPolaczenia>("rozlaczone")
  const [szczegol, setSzczegol] = useState<string | null>(null)
  const zrodloRef = useRef<TelemetrySource | null>(null)
  const magazyn = useMemo(() => new IndexedDbMagazynProbek(), [])

  useEffect(() => {
    let aktywny = true
    wczytajRejestr(indexedDbStorageAdapter).then((w) => aktywny && setRejestr(w.rejestr))
    return () => {
      aktywny = false
    }
  }, [])

  const zrodla = rejestr.zrodla
  const zrodlo = zrodla.find((z) => z.id === szkic.zrodloId) ?? zrodla[0]
  const oknoMs = Number(szkic.oknoH) * 3_600_000

  const odswiez = useCallback(async () => {
    if (!zrodlo) return setProbki([])
    const teraz = Date.now()
    setTeraz(teraz)
    setProbki(await magazyn.zakres(zrodlo.id, teraz - oknoMs, teraz))
  }, [zrodlo, magazyn, oknoMs])

  useEffect(() => {
    const start = setTimeout(odswiez, 0)
    const timer = setInterval(odswiez, ODSWIEZANIE_MS)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [odswiez])

  // Leaving the screen or switching the source always closes the link.
  useEffect(
    () => () => {
      void zrodloRef.current?.rozlacz()
      zrodloRef.current = null
    },
    [zrodlo?.id],
  )

  async function polacz() {
    if (!zrodlo) return
    const z = utworzZrodlo(zrodlo)
    if (!z) return setSzczegol(t("UI-M13-LIVE-TYP-NIEOBSLUGIWANY"))
    await zrodloRef.current?.rozlacz()
    zrodloRef.current = z
    setSzczegol(null)
    await z.polacz({
      naProbki: (p) => void magazyn.dodaj(p),
      naStatus: (s, d) => {
        setStatus(s)
        setSzczegol(d ?? null)
      },
    })
  }

  async function rozlacz() {
    await zrodloRef.current?.rozlacz()
    zrodloRef.current = null
    setStatus("rozlaczone")
  }

  async function generujDane() {
    if (!zrodlo) return
    const krokMs = 60_000
    const liczbaKrokow = Math.round(oknoMs / krokMs)
    await magazyn.dodaj(generujDemo({ zrodloId: zrodlo.id, scenariusz: szkic.scenariusz, start: Date.now() - oknoMs, krokMs, liczbaKrokow }))
    await odswiez()
  }

  const progi = useMemo<ProgAlarmu[]>(
    () =>
      szkic.progi.flatMap((p, i) => {
        const wartosc = Number(p.wartosc.replace(",", "."))
        return p.wartosc.trim() === "" || !Number.isFinite(wartosc)
          ? []
          : [{ id: String(i), wielkosc: p.wielkosc, kanal: p.kanal.trim() || undefined, kierunek: p.kierunek, wartosc, priorytet: p.priorytet }]
      }),
    [szkic.progi],
  )

  const ostatnie = useMemo(() => [...ostatnieWartosci(probki).values()].sort((a, b) => (a.kanal + a.wielkosc).localeCompare(b.kanal + b.wielkosc)), [probki])
  const alarmy = useMemo(() => ocenAlarmy(probki, progi), [probki, progi])
  const najnowsza = probki.length > 0 ? Math.max(...probki.map((p) => p.czas)) : null
  const maxWiekS = Number(szkic.maxWiekS.replace(",", "."))
  const nieaktualne = maxWiekS > 0 && daneNieaktualne(najnowsza, teraz, maxWiekS * 1000)
  const seriePrad = useMemo(
    () => [...new Set(probki.filter((p) => p.wielkosc === "moc").map((p) => p.kanal))].sort(),
    [probki],
  )
  const serie = useMemo(() => seriePrad.map((k) => ({ kanal: k, punkty: seriaDoWykresu(probki, k, "moc", teraz, oknoMs) })), [seriePrad, probki, teraz, oknoMs])
  const wszystkie = serie.flatMap((s) => s.punkty.map((p) => p.wartosc))
  const yMin = Math.min(0, ...wszystkie)
  const yMax = Math.max(1, ...wszystkie)
  const x = (czas: number) => ((czas - (teraz - oknoMs)) / oknoMs) * W
  const y = (w: number) => H - ((w - yMin) / (yMax - yMin)) * H

  const [zgoda, setZgoda] = useState<NotificationPermission | "brak-obslugi">("default")
  const znaneRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const start = setTimeout(() => setZgoda(typeof Notification === "undefined" ? "brak-obslugi" : Notification.permission), 0)
    return () => clearTimeout(start)
  }, [])
  // Browser notification (7.7): once per alarm while it stays active; only with permission and a chosen minimum priority.
  useEffect(() => {
    const { nowe, znane } = noweAlarmyDoPowiadomienia(alarmy, znaneRef.current, szkic.powiadomieniaMin)
    znaneRef.current = znane
    if (zgoda !== "granted" || typeof Notification === "undefined") return
    for (const a of nowe) {
      new Notification(t(`UI-M13-LIVE-PR-${a.priorytet.toUpperCase()}`), {
        body: t("UI-M13-LIVE-POWIADOM-TRESC", { kanal: a.kanal, wielkosc: t(`UI-M13-TEL-W-${a.wielkosc.toUpperCase()}`), wartosc: formatuj(a.wartosc), jednostka: WIELKOSCI[a.wielkosc].jednostka }),
      })
    }
  }, [alarmy, szkic.powiadomieniaMin, zgoda, t])
  const priorytetNaKanale = (p: ProbkaTelemetrii): PriorytetAlarmu | null => {
    const a = alarmy.filter((al) => al.kanal === p.kanal && al.wielkosc === p.wielkosc)
    return a.length === 0 ? null : a[0].priorytet
  }
  const ustawProg = (i: number, zmiana: Partial<WierszProgu>) =>
    setSzkic((s) => ({ ...s, progi: s.progi.map((p, j) => (j === i ? { ...p, ...zmiana } : p)) }))

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pomiary-na-zywo" />
      <NaglowekEkranu tytul={t("UI-M13-LIVE-TYTUL")} ekran="pomiary-na-zywo">
        {t("UI-M13-LIVE-OPIS")}
      </NaglowekEkranu>

      {zrodla.length === 0 ? (
        <StanPusty tytul={t("UI-M13-LIVE-BRAK-ZRODEL")}>
          <p>{t("UI-M13-LIVE-BRAK-ZRODEL-OPIS")}</p>
        </StanPusty>
      ) : (
        <section className="flex flex-col gap-3" aria-labelledby="live-zrodlo">
          <h2 id="live-zrodlo" className="text-base font-semibold">{t("UI-M13-LIVE-ZRODLO-TYTUL")}</h2>
          <PoleSelect label={t("UI-M13-LIVE-ZRODLO")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="zrodloId" />} value={zrodlo?.id ?? ""} onChange={(e) => ustaw("zrodloId", e.target.value)}>
            {zrodla.map((z) => (
              <option key={z.id} value={z.id}>{z.nazwa}</option>
            ))}
          </PoleSelect>
          <PoleSelect label={t("UI-M13-LIVE-OKNO")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="oknoH" />} value={szkic.oknoH} onChange={(e) => ustaw("oknoH", e.target.value as Szkic["oknoH"])}>
            <option value="1">{t("UI-M13-LIVE-OKNO-1")}</option>
            <option value="6">{t("UI-M13-LIVE-OKNO-6")}</option>
            <option value="24">{t("UI-M13-LIVE-OKNO-24")}</option>
          </PoleSelect>
          <Pole label={t("UI-M13-LIVE-MAX-WIEK")} unit="s" pomoc={<PomocPola ekran="pomiary-na-zywo" pole="maxWiekS" />} inputMode="decimal" value={szkic.maxWiekS} onChange={(e) => ustaw("maxWiekS", e.target.value)} />
          {zrodlo && (zrodlo.typ === "http" || zrodlo.typ === "symulator") && (
            <div className="flex items-center gap-2">
              {status === "polaczone" || status === "laczenie" ? (
                <Button type="button" variant="outline" onClick={rozlacz}>{t("UI-M13-LIVE-ROZLACZ")}</Button>
              ) : (
                <Button type="button" onClick={polacz}>{t("UI-M13-LIVE-POLACZ")}</Button>
              )}
              <span role="status" className="text-small text-muted-foreground">
                {t(`UI-M13-LIVE-STATUS-${status.toUpperCase()}`)}
                {szczegol ? ` — ${szczegol}` : ""}
              </span>
            </div>
          )}
          {zrodlo?.typ === "symulator" && (
            <>
              <PoleSelect label={t("UI-M13-LIVE-SCENARIUSZ")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="scenariusz" />} value={szkic.scenariusz} onChange={(e) => ustaw("scenariusz", e.target.value as ScenariuszSymulatora)}>
                {SCENARIUSZE.map((s) => (
                  <option key={s} value={s}>{t(`UI-M13-LIVE-SCEN-${s.toUpperCase()}`)}</option>
                ))}
              </PoleSelect>
              <Button type="button" variant="outline" onClick={generujDane}>{t("UI-M13-LIVE-GENERUJ")}</Button>
              <p className="text-caption text-muted-foreground">{t("UI-M13-LIVE-DEMO-UWAGA")}</p>
            </>
          )}
          {nieaktualne && <p role="alert" className="text-small text-werdykt-uwaga-foreground">{t("UI-M13-LIVE-NIEAKTUALNE")}</p>}
        </section>
      )}

      {zrodlo && (
        <section className="flex flex-col gap-3" aria-labelledby="live-teraz">
          <h2 id="live-teraz" className="text-base font-semibold">{t("UI-M13-LIVE-TERAZ")}</h2>
          {ostatnie.length === 0 ? (
            <StanPusty tytul={t("UI-M13-LIVE-BRAK-PROBEK")}>
              <p>{t("UI-M13-LIVE-BRAK-PROBEK-OPIS")}</p>
            </StanPusty>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {ostatnie.map((p) => {
                const pr = priorytetNaKanale(p)
                return (
                  <li key={`${p.kanal}|${p.wielkosc}`} className={cn("rounded-md border-2 p-3 text-small", pr ? KLASA_PRIORYTETU[pr] : "border-werdykt-ok-border bg-werdykt-ok-bg")}>
                    <p className="text-caption text-muted-foreground">{p.kanal} · {t(`UI-M13-TEL-W-${p.wielkosc.toUpperCase()}`)}</p>
                    <p className="text-base font-semibold">{formatuj(p.wartosc as number)} {WIELKOSCI[p.wielkosc].jednostka}</p>
                    <p className="text-caption text-muted-foreground">{new Date(p.czas).toLocaleTimeString()}</p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {zrodlo && serie.some((s) => s.punkty.length > 1) && (
        <section className="flex flex-col gap-2" aria-labelledby="live-wykres">
          <h2 id="live-wykres" className="text-base font-semibold">{t("UI-M13-LIVE-WYKRES")}</h2>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-md border" role="img" aria-label={t("UI-M13-LIVE-WYKRES-ARIA")}>
            {serie.map((s, i) => (
              <polyline key={s.kanal} fill="none" strokeWidth={1.5} stroke={KOLORY_WYKRESU[i % KOLORY_WYKRESU.length]} points={s.punkty.map((p) => `${x(p.czas).toFixed(1)},${y(p.wartosc).toFixed(1)}`).join(" ")} />
            ))}
          </svg>
          <p className="text-caption text-muted-foreground">{t("UI-M13-LIVE-WYKRES-ZAKRES", { min: formatuj(yMin), max: formatuj(yMax) })}</p>
          <ul className="flex flex-wrap gap-3 text-caption">
            {serie.map((s, i) => (
              <li key={s.kanal} className="flex items-center gap-1">
                <span aria-hidden className="inline-block h-2 w-4" style={{ background: KOLORY_WYKRESU[i % KOLORY_WYKRESU.length] }} />
                {s.kanal}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3" aria-labelledby="live-progi">
        <h2 id="live-progi" className="text-base font-semibold">{t("UI-M13-LIVE-PROGI")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-M13-LIVE-PROGI-OPIS")}</p>
        {szkic.progi.map((p, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
            <PoleSelect label={t("UI-M13-LIVE-PROG-WIELKOSC")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="progWielkosc" />} value={p.wielkosc} onChange={(e) => ustawProg(i, { wielkosc: e.target.value as Wielkosc })}>
              {WIELKOSCI_LISTA.map((w) => (
                <option key={w} value={w}>{t(`UI-M13-TEL-W-${w.toUpperCase()}`)}</option>
              ))}
            </PoleSelect>
            <Pole label={t("UI-M13-LIVE-PROG-KANAL")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="progKanal" />} value={p.kanal} onChange={(e) => ustawProg(i, { kanal: e.target.value })} />
            <PoleSelect label={t("UI-M13-LIVE-PROG-KIERUNEK")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="progKierunek" />} value={p.kierunek} onChange={(e) => ustawProg(i, { kierunek: e.target.value as WierszProgu["kierunek"] })}>
              <option value="ponizej">{t("UI-M13-LIVE-PONIZEJ")}</option>
              <option value="powyzej">{t("UI-M13-LIVE-POWYZEJ")}</option>
            </PoleSelect>
            <Pole label={t("UI-M13-LIVE-PROG-WARTOSC")} unit={WIELKOSCI[p.wielkosc].jednostka} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="progWartosc" />} inputMode="decimal" value={p.wartosc} onChange={(e) => ustawProg(i, { wartosc: e.target.value })} />
            <PoleSelect label={t("UI-M13-LIVE-PROG-PRIORYTET")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="progPriorytet" />} value={p.priorytet} onChange={(e) => ustawProg(i, { priorytet: e.target.value as PriorytetAlarmu })}>
              <option value="info">{t("UI-M13-LIVE-PR-INFO")}</option>
              <option value="ostrzezenie">{t("UI-M13-LIVE-PR-OSTRZEZENIE")}</option>
              <option value="krytyczny">{t("UI-M13-LIVE-PR-KRYTYCZNY")}</option>
            </PoleSelect>
            <Button type="button" variant="outline" onClick={() => setSzkic((s) => ({ ...s, progi: s.progi.filter((_, j) => j !== i) }))}>
              {t("UI-M13-LIVE-USUN-PROG")}
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setSzkic((s) => ({ ...s, progi: [...s.progi, NOWY_PROG] }))}>
          {t("UI-M13-LIVE-DODAJ-PROG")}
        </Button>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="live-powiadom">
        <h2 id="live-powiadom" className="text-base font-semibold">{t("UI-M13-LIVE-POWIADOM-TYTUL")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-M13-LIVE-POWIADOM-OPIS")}</p>
        <PoleSelect label={t("UI-M13-LIVE-POWIADOM-MIN")} pomoc={<PomocPola ekran="pomiary-na-zywo" pole="powiadomieniaMin" />} value={szkic.powiadomieniaMin} onChange={(e) => ustaw("powiadomieniaMin", e.target.value as MinPriorytetPowiadomien)}>
          <option value="wylaczone">{t("UI-M13-LIVE-POWIADOM-WYLACZONE")}</option>
          <option value="info">{t("UI-M13-LIVE-PR-INFO")}</option>
          <option value="ostrzezenie">{t("UI-M13-LIVE-PR-OSTRZEZENIE")}</option>
          <option value="krytyczny">{t("UI-M13-LIVE-PR-KRYTYCZNY")}</option>
        </PoleSelect>
        {zgoda === "brak-obslugi" && <p className="text-small text-muted-foreground">{t("UI-M13-LIVE-POWIADOM-BRAK-OBSLUGI")}</p>}
        {zgoda === "denied" && <p role="alert" className="text-small text-werdykt-uwaga-foreground">{t("UI-M13-LIVE-POWIADOM-ZABLOKOWANE")}</p>}
        {zgoda === "granted" && <p role="status" className="text-small">{t("UI-M13-LIVE-POWIADOM-GOTOWE")}</p>}
        {zgoda === "default" && (
          <Button type="button" variant="outline" onClick={() => void Notification.requestPermission().then(setZgoda)}>
            {t("UI-M13-LIVE-POWIADOM-ZEZWOL")}
          </Button>
        )}
      </section>

      <section className="flex flex-col gap-2" aria-labelledby="live-alarmy">
        <h2 id="live-alarmy" className="text-base font-semibold">{t("UI-M13-LIVE-ALARMY")}</h2>
        {progi.length === 0 ? (
          <p className="text-small text-muted-foreground">{t("UI-M13-LIVE-ALARMY-BEZ-PROGOW")}</p>
        ) : alarmy.length === 0 ? (
          <p role="status" className="text-small">{t("UI-M13-LIVE-ALARMY-BRAK")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {alarmy.map((a, i) => (
              <li key={`${a.progId}|${a.kanal}|${i}`} role="alert" className={cn("rounded-md border-2 p-3 text-small", KLASA_PRIORYTETU[a.priorytet])}>
                <p className="font-medium">
                  {t(`UI-M13-LIVE-PR-${a.priorytet.toUpperCase()}`)}: {a.kanal} · {t(`UI-M13-TEL-W-${a.wielkosc.toUpperCase()}`)} {formatuj(a.wartosc)} {WIELKOSCI[a.wielkosc].jednostka}
                </p>
                <p className="text-caption text-muted-foreground">
                  {t(a.kierunek === "ponizej" ? "UI-M13-LIVE-ALARM-PONIZEJ" : "UI-M13-LIVE-ALARM-POWYZEJ", { prog: formatuj(a.prog), jednostka: WIELKOSCI[a.wielkosc].jednostka })} · {new Date(a.czas).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { usePersistedDraft, useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { IndexedDbMagazynProbek } from "@/lib/adapters/telemetria/magazyn-probek"
import { wczytajRejestr } from "@/lib/adapters/telemetria/rejestr-zrodel"
import { epizodyAlarmow, ocenAlarmy, ostatnieWartosci, probkiDoChwili, type PriorytetAlarmu, type ProgAlarmu } from "@/lib/core/telemetria/alarmy"
import { WIELKOSCI, type ProbkaTelemetrii, type Wielkosc } from "@/lib/core/telemetria/probka"
import { pustyRejestr, type Rejestr } from "@/lib/core/telemetria/rejestr"
import { useTranslate } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

interface Szkic {
  zrodloId: string
  oknoH: "6" | "24" | "168"
  /** Replay position within the range, 0–1000 (1000 = now). */
  chwila: string
}

/** The thresholds are owned by the live screen; this screen only reads its draft. */
interface SzkicProgow {
  progi?: { wielkosc: Wielkosc; kanal: string; kierunek: "ponizej" | "powyzej"; wartosc: string; priorytet: PriorytetAlarmu }[]
}

const SZKIC_POCZATKOWY: Szkic = { zrodloId: "", oknoH: "24", chwila: "1000" }
const KLASA_PRIORYTETU: Record<PriorytetAlarmu, string> = {
  info: "border-muted-foreground/40",
  ostrzezenie: "border-werdykt-uwaga-border bg-werdykt-uwaga-bg",
  krytyczny: "border-werdykt-blad-border bg-werdykt-blad-bg",
}
const KROKI_SUWAKA = 1000

const formatuj = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(1))

export default function HistoriaZdarzenPage() {
  const t = useTranslate()
  // autosave: source, range and replay position; samples live in the sample store, thresholds in the live screen's draft.
  const [zapisany, setSzkic] = usePersistedDraft<Szkic>("historia-zdarzen", SZKIC_POCZATKOWY)
  const szkic = useMemo<Szkic>(() => ({ ...SZKIC_POCZATKOWY, ...zapisany }), [zapisany])
  const ustaw = <K extends keyof Szkic>(pole: K, wartosc: Szkic[K]) => setSzkic((s) => ({ ...s, [pole]: wartosc }))
  const { dane: szkicProgow } = useOdczytDraftu<SzkicProgow>("pomiary-na-zywo")

  const [rejestr, setRejestr] = useState<Rejestr>(pustyRejestr())
  const [probki, setProbki] = useState<ProbkaTelemetrii[]>([])
  const [koniec, setKoniec] = useState(() => Date.now())
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
  const zrodloId = zrodlo?.id

  useEffect(() => {
    let aktywny = true
    const teraz = Date.now()
    const start = setTimeout(async () => {
      if (!zrodloId) return setProbki([])
      const dane = await magazyn.zakres(zrodloId, teraz - oknoMs, teraz)
      if (!aktywny) return
      setKoniec(teraz)
      setProbki(dane)
    }, 0)
    return () => {
      aktywny = false
      clearTimeout(start)
    }
  }, [zrodloId, magazyn, oknoMs])

  const progi = useMemo<ProgAlarmu[]>(
    () =>
      (szkicProgow?.progi ?? []).flatMap((p, i) => {
        const wartosc = Number(String(p.wartosc).replace(",", "."))
        return String(p.wartosc).trim() === "" || !Number.isFinite(wartosc)
          ? []
          : [{ id: String(i), wielkosc: p.wielkosc, kanal: p.kanal.trim() || undefined, kierunek: p.kierunek, wartosc, priorytet: p.priorytet }]
      }),
    [szkicProgow],
  )

  const epizody = useMemo(() => epizodyAlarmow(probki, progi), [probki, progi])
  const polozenie = Math.min(KROKI_SUWAKA, Math.max(0, Number(szkic.chwila) || 0))
  const chwila = koniec - oknoMs + (polozenie / KROKI_SUWAKA) * oknoMs
  const doChwili = useMemo(() => probkiDoChwili(probki, chwila), [probki, chwila])
  const wartosci = useMemo(
    () => [...ostatnieWartosci(doChwili).values()].sort((a, b) => (a.kanal + a.wielkosc).localeCompare(b.kanal + b.wielkosc)),
    [doChwili],
  )
  const alarmyWChwili = useMemo(() => ocenAlarmy(doChwili, progi), [doChwili, progi])

  const czasTrwania = (ms: number) => {
    const s = Math.round(ms / 1000)
    if (s < 60) return t("UI-M13-HIST-SEK", { n: String(s) })
    const min = Math.round(s / 60)
    return min < 60 ? t("UI-M13-HIST-MIN", { n: String(min) }) : t("UI-M13-HIST-GODZ", { n: String(Math.floor(min / 60)), m: String(min % 60) })
  }
  const godz = (ms: number) => new Date(ms).toLocaleString()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/historia-zdarzen" />
      <NaglowekEkranu tytul={t("UI-M13-HIST-TYTUL")} ekran="historia-zdarzen">
        {t("UI-M13-HIST-OPIS")}
      </NaglowekEkranu>

      {zrodla.length === 0 ? (
        <StanPusty tytul={t("UI-M13-HIST-BRAK-ZRODEL")}>
          <p>{t("UI-M13-HIST-BRAK-ZRODEL-OPIS")}</p>
        </StanPusty>
      ) : (
        <section className="flex flex-col gap-3" aria-labelledby="hist-zakres">
          <h2 id="hist-zakres" className="text-base font-semibold">{t("UI-M13-HIST-ZAKRES-TYTUL")}</h2>
          <PoleSelect label={t("UI-M13-HIST-ZRODLO")} pomoc={<PomocPola ekran="historia-zdarzen" pole="zrodloId" />} value={zrodlo?.id ?? ""} onChange={(e) => ustaw("zrodloId", e.target.value)}>
            {zrodla.map((z) => (
              <option key={z.id} value={z.id}>{z.nazwa}</option>
            ))}
          </PoleSelect>
          <PoleSelect label={t("UI-M13-HIST-OKNO")} pomoc={<PomocPola ekran="historia-zdarzen" pole="oknoH" />} value={szkic.oknoH} onChange={(e) => ustaw("oknoH", e.target.value as Szkic["oknoH"])}>
            <option value="6">{t("UI-M13-HIST-OKNO-6")}</option>
            <option value="24">{t("UI-M13-HIST-OKNO-24")}</option>
            <option value="168">{t("UI-M13-HIST-OKNO-168")}</option>
          </PoleSelect>
          <p className="text-caption text-muted-foreground">{t("UI-M13-HIST-PROGI-INFO")}</p>
        </section>
      )}

      {zrodlo && probki.length === 0 && (
        <StanPusty tytul={t("UI-M13-HIST-BRAK-PROBEK")}>
          <p>{t("UI-M13-HIST-BRAK-PROBEK-OPIS")}</p>
        </StanPusty>
      )}

      {zrodlo && probki.length > 0 && (
        <section className="flex flex-col gap-2" aria-labelledby="hist-zdarzenia">
          <h2 id="hist-zdarzenia" className="text-base font-semibold">{t("UI-M13-HIST-ZDARZENIA")}</h2>
          {progi.length === 0 ? (
            <p className="text-small text-muted-foreground">{t("UI-M13-HIST-BRAK-PROGOW")}</p>
          ) : epizody.length === 0 ? (
            <p role="status" className="text-small">{t("UI-M13-HIST-BRAK-ZDARZEN")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {epizody.map((e, i) => {
                const jednostka = WIELKOSCI[e.wielkosc].jednostka
                return (
                  <li key={`${e.progId}|${e.kanal}|${e.odMs}|${i}`} className={cn("rounded-md border-2 p-3 text-small", KLASA_PRIORYTETU[e.priorytet])}>
                    <p className="font-medium">
                      {t(`UI-M13-HIST-PRIORYTET-${e.priorytet.toUpperCase()}`)}:{" "}
                      {t("UI-M13-HIST-EPIZOD", {
                        kanal: e.kanal,
                        wielkosc: t(`UI-M13-TEL-W-${e.wielkosc.toUpperCase()}`),
                        ekstremum: formatuj(e.ekstremum),
                        jednostka,
                        kierunek: t(e.kierunek === "ponizej" ? "UI-M13-HIST-PONIZEJ" : "UI-M13-HIST-POWYZEJ"),
                        prog: formatuj(e.prog),
                      })}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {e.doMs === null
                        ? t("UI-M13-HIST-TRWA", { od: godz(e.odMs) })
                        : t("UI-M13-HIST-OD-DO", { od: godz(e.odMs), do: godz(e.doMs), czas: czasTrwania(e.doMs - e.odMs) })}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {zrodlo && probki.length > 0 && (
        <section className="flex flex-col gap-3" aria-labelledby="hist-odtw">
          <h2 id="hist-odtw" className="text-base font-semibold">{t("UI-M13-HIST-ODTW-TYTUL")}</h2>
          <label className="flex flex-col gap-1 text-small">
            <span className="flex items-center gap-1 font-medium">
              {t("UI-M13-HIST-CHWILA")}
              <PomocPola ekran="historia-zdarzen" pole="chwila" />
            </span>
            <input type="range" min={0} max={KROKI_SUWAKA} step={1} value={polozenie} onChange={(e) => ustaw("chwila", e.target.value)} />
          </label>
          <p role="status" className="text-small font-medium">{t("UI-M13-HIST-CHWILA-WYBRANA", { czas: godz(chwila) })}</p>
          {wartosci.length === 0 ? (
            <p className="text-small text-muted-foreground">{t("UI-M13-HIST-BRAK-W-CHWILI")}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {wartosci.map((p) => (
                <li key={`${p.kanal}|${p.wielkosc}`} className="rounded-md border p-3 text-small">
                  <p className="text-caption text-muted-foreground">{p.kanal} · {t(`UI-M13-TEL-W-${p.wielkosc.toUpperCase()}`)}</p>
                  <p className="text-base font-semibold">
                    {t("UI-M13-HIST-WARTOSC-WIEK", { wartosc: formatuj(p.wartosc as number), jednostka: WIELKOSCI[p.wielkosc].jednostka, wiek: czasTrwania(chwila - p.czas) })}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {progi.length > 0 && (
            <>
              <h3 className="text-small font-semibold">{t("UI-M13-HIST-ALARMY-W-CHWILI")}</h3>
              {alarmyWChwili.length === 0 ? (
                <p className="text-small">{t("UI-M13-HIST-ALARMY-BRAK-W-CHWILI")}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {alarmyWChwili.map((a, i) => (
                    <li key={`${a.progId}|${a.kanal}|${i}`} className={cn("rounded-md border-2 p-3 text-small", KLASA_PRIORYTETU[a.priorytet])}>
                      {t(`UI-M13-HIST-PRIORYTET-${a.priorytet.toUpperCase()}`)}: {a.kanal} · {t(`UI-M13-TEL-W-${a.wielkosc.toUpperCase()}`)} {formatuj(a.wartosc)} {WIELKOSCI[a.wielkosc].jednostka}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </main>
  )
}

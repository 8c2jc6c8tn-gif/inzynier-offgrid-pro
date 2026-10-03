"use client"

import { useEffect, useMemo, useState } from "react"
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
import { podsumujSerie, probkiDoCsv } from "@/lib/core/telemetria/podsumowanie"
import { WIELKOSCI, type ProbkaTelemetrii } from "@/lib/core/telemetria/probka"
import { pustyRejestr, type Rejestr } from "@/lib/core/telemetria/rejestr"
import { useTranslate } from "@/lib/i18n/language-context"

interface Szkic {
  zrodloId: string
  oknoH: "24" | "168" | "720"
  /** Largest gap (minutes) still counted into energy; empty = not given, so no energy is computed. */
  maxPrzerwaMin: string
}

const SZKIC_POCZATKOWY: Szkic = { zrodloId: "", oknoH: "24", maxPrzerwaMin: "" }

const formatuj = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(2))

export default function PodsumowanieTelemetriiPage() {
  const t = useTranslate()
  // autosave: source, range and gap limit; samples live in the sample store.
  const [zapisany, setSzkic] = usePersistedDraft<Szkic>("podsumowanie-telemetrii", SZKIC_POCZATKOWY)
  const szkic = useMemo<Szkic>(() => ({ ...SZKIC_POCZATKOWY, ...zapisany }), [zapisany])
  const ustaw = <K extends keyof Szkic>(pole: K, wartosc: Szkic[K]) => setSzkic((s) => ({ ...s, [pole]: wartosc }))

  const [rejestr, setRejestr] = useState<Rejestr>(pustyRejestr())
  const [probki, setProbki] = useState<ProbkaTelemetrii[]>([])
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
  const zrodloId = zrodlo?.id
  const oknoMs = Number(szkic.oknoH) * 3_600_000

  useEffect(() => {
    let aktywny = true
    const start = setTimeout(async () => {
      if (!zrodloId) return setProbki([])
      const teraz = Date.now()
      const dane = await magazyn.zakres(zrodloId, teraz - oknoMs, teraz)
      if (aktywny) setProbki(dane)
    }, 0)
    return () => {
      aktywny = false
      clearTimeout(start)
    }
  }, [zrodloId, magazyn, oknoMs])

  const przerwaMin = Number(szkic.maxPrzerwaMin.replace(",", "."))
  const maxPrzerwaMs = szkic.maxPrzerwaMin.trim() !== "" && Number.isFinite(przerwaMin) && przerwaMin > 0 ? przerwaMin * 60_000 : null
  const serie = useMemo(() => podsumujSerie(probki, maxPrzerwaMs), [probki, maxPrzerwaMs])

  function pobierzCsv() {
    const blob = new Blob([probkiDoCsv(probki)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pomiary-${zrodloId ?? "zrodlo"}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/podsumowanie-telemetrii" />
      <NaglowekEkranu tytul={t("UI-M13-POD-TYTUL")} ekran="podsumowanie-telemetrii">
        {t("UI-M13-POD-OPIS")}
      </NaglowekEkranu>

      {zrodla.length === 0 ? (
        <StanPusty tytul={t("UI-M13-POD-BRAK-ZRODEL")}>
          <p>{t("UI-M13-POD-BRAK-ZRODEL-OPIS")}</p>
        </StanPusty>
      ) : (
        <section className="flex flex-col gap-3" aria-labelledby="pod-zakres">
          <h2 id="pod-zakres" className="text-base font-semibold">{t("UI-M13-POD-ZAKRES-TYTUL")}</h2>
          <PoleSelect label={t("UI-M13-POD-ZRODLO")} pomoc={<PomocPola ekran="podsumowanie-telemetrii" pole="zrodloId" />} value={zrodlo?.id ?? ""} onChange={(e) => ustaw("zrodloId", e.target.value)}>
            {zrodla.map((z) => (
              <option key={z.id} value={z.id}>{z.nazwa}</option>
            ))}
          </PoleSelect>
          <PoleSelect label={t("UI-M13-POD-OKNO")} pomoc={<PomocPola ekran="podsumowanie-telemetrii" pole="oknoH" />} value={szkic.oknoH} onChange={(e) => ustaw("oknoH", e.target.value as Szkic["oknoH"])}>
            <option value="24">{t("UI-M13-POD-OKNO-24")}</option>
            <option value="168">{t("UI-M13-POD-OKNO-168")}</option>
            <option value="720">{t("UI-M13-POD-OKNO-720")}</option>
          </PoleSelect>
          <Pole label={t("UI-M13-POD-MAX-PRZERWA")} unit="min" pomoc={<PomocPola ekran="podsumowanie-telemetrii" pole="maxPrzerwaMin" />} inputMode="decimal" value={szkic.maxPrzerwaMin} onChange={(e) => ustaw("maxPrzerwaMin", e.target.value)} />
        </section>
      )}

      {zrodlo && probki.length === 0 && (
        <StanPusty tytul={t("UI-M13-POD-BRAK-PROBEK")}>
          <p>{t("UI-M13-POD-BRAK-PROBEK-OPIS")}</p>
        </StanPusty>
      )}

      {zrodlo && probki.length > 0 && (
        <>
          <section className="flex flex-col gap-2" aria-labelledby="pod-serie">
            <h2 id="pod-serie" className="text-base font-semibold">{t("UI-M13-POD-SERIE")}</h2>
            {maxPrzerwaMs === null && <p className="text-small text-muted-foreground">{t("UI-M13-POD-ENERGIA-BEZ-LIMITU")}</p>}
            <ul className="flex flex-col gap-2">
              {serie.map((s) => {
                const jednostka = WIELKOSCI[s.wielkosc].jednostka
                return (
                  <li key={`${s.kanal}|${s.wielkosc}`} className="rounded-md border p-3 text-small">
                    <p className="font-medium">{s.kanal} · {t(`UI-M13-TEL-W-${s.wielkosc.toUpperCase()}`)}</p>
                    <p>
                      {s.min === null || s.max === null || s.srednia === null
                        ? t("UI-M13-POD-BRAK-WARTOSCI")
                        : t("UI-M13-POD-STATY", { min: formatuj(s.min), max: formatuj(s.max), srednia: formatuj(s.srednia), jednostka })}
                    </p>
                    <p className="text-caption text-muted-foreground">{t("UI-M13-POD-PROBKI", { n: String(s.liczbaProbek), pominiete: String(s.pominiete) })}</p>
                    {s.energiaWh !== null && <p className="font-medium">{t("UI-M13-POD-ENERGIA", { kwh: formatuj(s.energiaWh / 1000) })}</p>}
                    {s.pominieteLuki > 0 && <p className="text-caption text-muted-foreground">{t("UI-M13-POD-ENERGIA-LUKI", { n: String(s.pominieteLuki) })}</p>}
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="flex flex-col gap-2" aria-labelledby="pod-eksport">
            <h2 id="pod-eksport" className="text-base font-semibold">{t("UI-M13-POD-EKSPORT-TYTUL")}</h2>
            <p className="text-small text-muted-foreground">{t("UI-M13-POD-EKSPORT-OPIS")}</p>
            <Button type="button" onClick={pobierzCsv}>{t("UI-M13-POD-EKSPORT-PRZYCISK")}</Button>
          </section>
        </>
      )}
    </main>
  )
}

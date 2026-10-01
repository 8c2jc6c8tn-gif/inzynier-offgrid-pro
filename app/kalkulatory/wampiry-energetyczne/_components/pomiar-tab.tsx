"use client"

import type { CalcResult } from "@/lib/core/calc-result"
import type { PomiarMocyJalowejInput, PomiarPozycja } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/input"
import type { PomiarMocyJalowejResult } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/calculator"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"

export function PomiarTab({
  input,
  onChange,
  result,
}: {
  input: PomiarMocyJalowejInput
  onChange: (pozycje: PomiarPozycja[]) => void
  result: CalcResult<PomiarMocyJalowejResult>
}) {
  const t = useTranslate()
  function dodaj() {
    onChange([...input.pozycje, { id: crypto.randomUUID(), nazwa: "", mocJalowaW: 0 }])
  }

  function usun(id: string) {
    onChange(input.pozycje.filter((p) => p.id !== id))
  }

  function aktualizuj(id: string, patch: Partial<PomiarPozycja>) {
    onChange(input.pozycje.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {t("UI-WAMENE-COMPOMTAB-ZMIERZYLES-REALNY-POBOR")}
      </p>

      <ul className="flex flex-col gap-2">
        {input.pozycje.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-small">
            <input
              type="text"
              placeholder={t("UI-WAMENE-COMPOMTAB-NAZWA-URZADZENIA")}
              value={p.nazwa}
              onChange={(e) => aktualizuj(p.id, { nazwa: e.target.value })}
              className="min-h-10 flex-1 min-w-24 rounded-md border border-input bg-background px-2"
            />
            <PomocPola ekran="wampiry-energetyczne" pole="nazwa" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="W"
              value={p.mocJalowaW || ""}
              onChange={(e) => aktualizuj(p.id, { mocJalowaW: Number(e.target.value) })}
              className="min-h-10 w-20 rounded-md border border-input bg-background px-2"
              aria-label={t("UI-WAMENE-COMPOMTAB-ZMIERZONA-MOC-JALOWA", { p: p.nazwa || "pozycja" })}
            />
            <PomocPola ekran="wampiry-energetyczne" pole="mocJalowa" />
            <button
              type="button"
              onClick={() => usun(p.id)}
              className="text-caption text-muted-foreground underline"
              aria-label={t("UI-WAMENE-COMPOMTAB-USUN-2", { p: p.nazwa || t("UI-WAMENE-COMPOMTAB-POZYCJE") })}
            >
              {t("UI-WAMENE-COMPOMTAB-USUN")}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={dodaj}
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        {t("UI-WAMENE-COMPOMTAB-DODAJ-POMIAR")}
      </button>

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul={t("UI-WAMENE-COMPOMTAB-DODAJ-PRZYNAJMNIEJ-JEDEN")} />
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)}>
          <WynikGlowny>{result.value.sumaW.toFixed(1)} W</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-WAMENE-COMPOMTAB-KWH-DOBE-KWH", { energiaDobowaKwh: result.value.energiaDobowaKwh.toFixed(2), energiaRocznaKwh: result.value.energiaRocznaKwh.toFixed(0) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </div>
  )
}

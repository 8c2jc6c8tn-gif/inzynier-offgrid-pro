"use client"

import { useMemo } from "react"
import { calculateAwariaStringaZima } from "@/lib/core/modules/stress-test/awaria-stringa-zima/calculator"
import type { AwariaStringaZimaInput } from "@/lib/core/modules/stress-test/awaria-stringa-zima/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = Record<keyof AwariaStringaZimaInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  produkcjaCalkowitaKwhDoba: "",
  produkcjaStringuKwhDoba: "",
  zapotrzebowanieKwhDoba: "",
  pojemnoscBateriiKwh: "",
  dodPct: "",
  sprawnoscFalownikaPct: "",
}

const POLA: { pole: keyof AwariaStringaZimaInput; label: string; unit: string }[] = [
  { pole: "produkcjaCalkowitaKwhDoba", label: "UI-AWASTRZIM-PRODUKCJA-INSTALACJI-NAJGORS", unit: "UI-J-KWH-DOBA" },
  { pole: "produkcjaStringuKwhDoba", label: "UI-AWASTRZIM-PRODUKCJA-STRINGU-KTORY", unit: "UI-J-KWH-DOBA" },
  { pole: "zapotrzebowanieKwhDoba", label: "UI-AWASTRZIM-ZAPOTRZEBOWANIE-TYM-MIESIACU", unit: "UI-J-KWH-DOBA" },
  { pole: "pojemnoscBateriiKwh", label: "UI-AWASTRZIM-POJEMNOSC-BATERII-OPCJONALNI", unit: "kWh" },
  { pole: "dodPct", label: "UI-AWASTRZIM-UZYTECZNA-GLEBOKOSC-ROZLADOW", unit: "%" },
  { pole: "sprawnoscFalownikaPct", label: "UI-AWASTRZIM-SPRAWNOSC-FALOWNIKA", unit: "%" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function AwariaStringaZimaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("awaria-stringa-zima", STAN_POCZATKOWY)
  const result = useMemo(
    () => calculateAwariaStringaZima(Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as AwariaStringaZimaInput),
    [stan],
  )
  const { produkcjaPoAwariiKwhDoba, deficytDobowyKwh, dniNaBaterii } = result.value
  const deficyt = deficytDobowyKwh !== null && deficytDobowyKwh > 0

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/awaria-stringa-zima" />
      <NaglowekEkranu tytul={t("UI-AWASTRZIM-AWARIA-STRINGA-ZIMA")} ekran="awaria-stringa-zima" wynik={result}>
        {t("UI-AWASTRZIM-JEDEN-CHORY-STRING")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit.startsWith("UI-") ? t(unit) : unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="awaria-stringa-zima" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-AWASTRZIM-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-AWASTRZIM-WPISZ-PRODUKCJE-INSTALACJI")}</p>
      ) : (
        <WerdyktPanel poziom={deficyt ? "uwaga" : "ok"} etykieta={deficyt ? t("UI-AWASTRZIM-BEZ-AGREGATU-SYSTEM") : t("UI-AWASTRZIM-POZOSTALE-STRINGI-WYSTARCZA")}>
          {deficytDobowyKwh !== null && (
            <WynikGlowny>{deficyt ? t("UI-AWASTRZIM-DEFICYT-KWH-DOBE", { deficytDobowyKwh: f1(deficytDobowyKwh) }) : t("UI-AWASTRZIM-ZAPAS-KWH-DOBE", { p: f1(-deficytDobowyKwh) })}</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {produkcjaPoAwariiKwhDoba !== null && <li>{t("UI-AWASTRZIM-PRODUKCJA-AWARII-KWH", { produkcjaPoAwariiKwhDoba: f1(produkcjaPoAwariiKwhDoba) })}</li>}
            {dniNaBaterii !== null && <li>{t("UI-AWASTRZIM-BATERIA-WYSTARCZY-DNIA", { dniNaBaterii: f1(dniNaBaterii) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}

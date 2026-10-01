"use client"

import { useId, useMemo } from "react"
import { calculatePompyZaworyWMrozie } from "@/lib/core/modules/stress-test/pompy-zawory-w-mrozie/calculator"
import type { ElementArmatury, TypArmatury } from "@/lib/core/modules/stress-test/pompy-zawory-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  temperaturaMiejscaC: string
  elementy: ElementArmatury[]
  maZaworZewnetrzny: boolean
  zaworZewnetrznyOprozniony: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaMiejscaC: "",
  elementy: [],
  maZaworZewnetrzny: false,
  zaworZewnetrznyOprozniony: false,
}

const TYPY: { id: TypArmatury; label: string }[] = [
  { id: "pompa", label: "UI-POMZAWWMRO-POMPA-CIEPLA-OBIEGOWA" },
  { id: "zawor", label: "UI-POMZAWWMRO-ZAWOR" },
  { id: "silownik", label: "UI-POMZAWWMRO-SILOWNIK" },
  { id: "inne", label: "UI-POMZAWWMRO-INNE" },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function PompyZaworyWMroziePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pompy-zawory-w-mrozie", STAN_POCZATKOWY)
  const idZawor = useId()
  const idOprozniony = useId()

  function aktualizuj(id: string, zmiana: Partial<ElementArmatury>) {
    setStan((prev) => ({ ...prev, elementy: prev.elementy.map((e) => (e.id === id ? { ...e, ...zmiana } : e)) }))
  }

  const result = useMemo(
    () =>
      calculatePompyZaworyWMrozie({
        temperaturaMiejscaC: stan.temperaturaMiejscaC === "" ? null : Number(stan.temperaturaMiejscaC),
        elementy: stan.elementy,
        maZaworZewnetrzny: stan.maZaworZewnetrzny,
        zaworZewnetrznyOprozniony: stan.zaworZewnetrznyOprozniony,
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pompy-zawory-w-mrozie" />
      <NaglowekEkranu tytul={t("UI-POMZAWWMRO-POMPY-ZAWORY-MROZIE")} ekran="pompy-zawory-w-mrozie" wynik={result}>
        {t("UI-POMZAWWMRO-KTORE-POMPY-ZAWORY")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-POMZAWWMRO-NAJNIZSZA-TEMPERATURA-MIEJSC")}
        unit="°C"
        type="number"
        inputMode="decimal"
        value={stan.temperaturaMiejscaC}
        onChange={(e) => setStan((prev) => ({ ...prev, temperaturaMiejscaC: e.target.value }))}
        pomoc={<PomocPola ekran="pompy-zawory-w-mrozie" pole="temp" />}
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-POMZAWWMRO-POMPY-ZAWORY-SILOWNIKI")}</p>
        <p className="text-caption text-muted-foreground">
          {t("UI-POMZAWWMRO-MINIMALNA-TEMPERATURE-PRACY")}
        </p>
        <ul className="flex flex-col gap-3">
          {stan.elementy.map((e, i) => {
            const opis = e.nazwa || `element ${i + 1}`
            return (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-POMZAWWMRO-NAZWA")}
                  value={e.nazwa}
                  onChange={(ev) => aktualizuj(e.id, { nazwa: ev.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-POMZAWWMRO-NAZWA-ELEMENT", { p: i + 1 })}
                />
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="nazwa" />
                <select
                  value={e.typ}
                  onChange={(ev) => aktualizuj(e.id, { typ: ev.target.value as TypArmatury })}
                  className={`${pole} max-w-full`}
                  aria-label={t("UI-POMZAWWMRO-TYP", { opis })}
                >
                  {TYPY.map((typ) => (
                    <option key={typ.id} value={typ.id}>
                      {t(typ.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="typ" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={t("UI-POMZAWWMRO-MIN-C")}
                  value={e.minTempPracyC ?? ""}
                  onChange={(ev) =>
                    aktualizuj(e.id, { minTempPracyC: ev.target.value === "" ? null : Number(ev.target.value) })
                  }
                  className={`${pole} w-24`}
                  aria-label={t("UI-POMZAWWMRO-MINIMALNA-TEMPERATURA-PRACY", { opis })}
                />
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="tempMin" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, elementy: prev.elementy.filter((x) => x.id !== e.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-POMZAWWMRO-USUN-2", { opis })}
                >
                  {t("UI-POMZAWWMRO-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({
              ...prev,
              elementy: [...prev.elementy, { id: crypto.randomUUID(), nazwa: "", typ: "pompa", minTempPracyC: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-POMZAWWMRO-DODAJ-ELEMENT")}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <PoleCheckbox
          id={idZawor}
          label={t("UI-POMZAWWMRO-MAM-ZAWOR-ZEWNETRZNY")}
          checked={stan.maZaworZewnetrzny}
          onChange={(e) => setStan((prev) => ({ ...prev, maZaworZewnetrzny: e.target.checked }))}
        />
        {stan.maZaworZewnetrzny && (
          <PoleCheckbox
            id={idOprozniony}
            label={t("UI-POMZAWWMRO-ZAWOR-ZEWNETRZNY-OPROZNIONY")}
            checked={stan.zaworZewnetrznyOprozniony}
            onChange={(e) => setStan((prev) => ({ ...prev, zaworZewnetrznyOprozniony: e.target.checked }))}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-POMZAWWMRO-WPISZ-TEMPERATURE-DODAJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasWarning ? "uwaga" : "ok"}
          etykieta={hasWarning ? t("UI-POMZAWWMRO-PRZYGOTUJ-POMPY-ZAWORY") : t("UI-POMZAWWMRO-POMPY-ZAWORY-ZAKRESIE")}
        >
          {result.value.oceny.length > 0 && (
            <>
              <WynikGlowny>
                {t("UI-POMZAWWMRO-PONIZEJ-MINIMUM", { liczbaPonizejMin: result.value.liczbaPonizejMin, length: result.value.oceny.length })}
              </WynikGlowny>
              <ul className="mt-2 flex flex-col gap-1 text-small">
                {result.value.oceny.map((o) => (
                  <li key={o.id}>
                    {o.zapasK === null ? "ℹ️" : o.zapasK < 0 ? "🟡" : "✅"} {o.nazwa}
                    {o.zapasK === null ? ` ${t("UI-POMZAWWMRO-BRAK-DANYCH-KARTY")}` : ` ${t("UI-POMZAWWMRO-ZAPAS", { zapasK: f0(o.zapasK) })}`}
                  </li>
                ))}
              </ul>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

"use client"

import { useMemo } from "react"
import { calculateGniazdoZapalniczki } from "@/lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/calculator"
import type { GniazdoZapalniczkiInput, UrzadzenieGniazda } from "@/lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  napiecieV: GniazdoZapalniczkiInput["napiecieV"]
  pradBezpiecznikaA: string
  urzadzenia: UrzadzenieGniazda[]
}

const STAN_POCZATKOWY: FormularzStan = { napiecieV: 0, pradBezpiecznikaA: "", urzadzenia: [] }

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function GniazdoZapalniczkiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("gniazdo-zapalniczki", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<UrzadzenieGniazda>) {
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(
    () =>
      calculateGniazdoZapalniczki({
        napiecieV: stan.napiecieV,
        pradBezpiecznikaA: stan.pradBezpiecznikaA === "" ? 0 : Number(stan.pradBezpiecznikaA),
        urzadzenia: stan.urzadzenia,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/gniazdo-zapalniczki" />
      <NaglowekEkranu
        tytul={t("UI-GNIZAP-GNIAZDO-ZAPALNICZKI-MOZNA")}
        ekran="gniazdo-zapalniczki"
        wynik={result}
      >
        {t("UI-GNIZAP-GNIAZDO-ZAPALNICZKI-WLASNY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-GNIZAP-NAPIECIE-INSTALACJI-POJAZDU")}
          value={stan.napiecieV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieV: Number(e.target.value) as FormularzStan["napiecieV"] }))}
          pomoc={<PomocPola ekran="gniazdo-zapalniczki" pole="napiecie" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          <option value={12}>{t("UI-GNIZAP-SAMOCHOD-OSOBOWY-KAMPER")}</option>
          <option value={24}>{t("UI-GNIZAP-CIEZAROWKA-AUTOBUS")}</option>
        </PoleSelect>
        <NapiecieZProfilu
          aktualne={String(stan.napiecieV)}
          dozwolone={[12, 24]}
          onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieV: Number(v) as FormularzStan["napiecieV"] }))}
        />
        <Pole
          label={t("UI-GNIZAP-BEZPIECZNIK-GNIAZDA")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pradBezpiecznikaA}
          onChange={(e) => setStan((prev) => ({ ...prev, pradBezpiecznikaA: e.target.value }))}
          pomoc={<PomocPola ekran="gniazdo-zapalniczki" pole="bezpiecznik" />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-GNIZAP-URZADZENIA-WLACZONE-JEDNOCZE")}</p>
        <p className="flex items-center gap-3 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            {t("UI-GZ-NAZWA")} <PomocPola ekran="gniazdo-zapalniczki" pole="nazwaUrzadzenia" />
          </span>
          <span className="flex items-center gap-1">
            {t("UI-GZ-MOC")} <PomocPola ekran="gniazdo-zapalniczki" pole="mocUrzadzenia" />
          </span>
        </p>
        <ul className="flex flex-col gap-2">
          {stan.urzadzenia.map((u, i) => (
            <li key={u.id} className="flex flex-wrap items-center gap-2">
              <input
                placeholder={t("UI-GNIZAP-NAZWA-URZADZENIA")}
                value={u.nazwa}
                onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                className="min-h-10 min-w-24 flex-1 rounded-md border border-input bg-background px-2"
                aria-label={t("UI-GNIZAP-NAZWA-URZADZENIE", { p: i + 1 })}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="W"
                value={u.mocW || ""}
                onChange={(e) => aktualizuj(u.id, { mocW: Number(e.target.value) })}
                className="min-h-10 w-20 rounded-md border border-input bg-background px-2"
                aria-label={t("UI-GNIZAP-MOC", { p: u.nazwa || t("UI-GNIZAP-URZADZENIE-N", { n: i + 1 }) })}
              />
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                className="text-caption text-muted-foreground underline"
                aria-label={t("UI-GNIZAP-USUN-2", { p: u.nazwa || t("UI-GNIZAP-URZADZENIE-N", { n: i + 1 }) })}
              >
                {t("UI-GNIZAP-USUN")}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: 0 }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-GNIZAP-DODAJ-URZADZENIE")}
        </button>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-GNIZAP-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-GNIZAP-WYBIERZ-NAPIECIE-WPISZ")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? t("UI-GNIZAP-GNIAZDO-PRZECIAZONE") : t("UI-GNIZAP-GNIAZDO-WYTRZYMA")}>
          <WynikGlowny>{f1(result.value.pradA)} A</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-GNIZAP-DOSTEPNYCH-BEZPIECZNIKA", { sumaMocyW: f0(result.value.sumaMocyW), mocMaxW: f0(result.value.mocMaxW), obciazeniePct: f0(result.value.obciazeniePct) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}

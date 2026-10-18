"use client"

import { useMemo } from "react"
import { calculateRyzykoZamarzniecia } from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/calculator"
import type {
  InstalacjaGruntowa,
  MetodaRozmrazania,
  TypInstalacjiGruntowej,
} from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { ZAPAS_RURY_WODNEJ_POD_STREFA_CM } from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/constants"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { ZnakStanu } from "@/components/ui/znak-stanu"

type FormularzStan = {
  glebokoscPrzemarzaniaCm: string
  instalacje: InstalacjaGruntowa[]
  metodaRozmrazania: MetodaRozmrazania
}

const STAN_POCZATKOWY: FormularzStan = { glebokoscPrzemarzaniaCm: "", instalacje: [], metodaRozmrazania: "nie-dotyczy" }

const TYPY: { id: TypInstalacjiGruntowej; label: string }[] = [
  { id: "kabel", label: "UI-RYZZAM-KABEL-ZIEMNY" },
  { id: "rura-wodna", label: "UI-RYZZAM-RURA-WODNA" },
  { id: "uziom", label: "UI-RYZZAM-UZIOM" },
  { id: "inne", label: "UI-RYZZAM-INNE" },
]
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function RyzykoZamarznieciaPage() {
  const t = useTranslate()
  const { f0 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ryzyko-zamarzniecia", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<InstalacjaGruntowa>) {
    setStan((prev) => ({ ...prev, instalacje: prev.instalacje.map((e) => (e.id === id ? { ...e, ...zmiana } : e)) }))
  }

  const result = useMemo(
    () =>
      calculateRyzykoZamarzniecia({
        glebokoscPrzemarzaniaCm: stan.glebokoscPrzemarzaniaCm === "" ? null : Number(stan.glebokoscPrzemarzaniaCm),
        instalacje: stan.instalacje,
        metodaRozmrazania: stan.metodaRozmrazania,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-zamarzniecia" />
      <NaglowekEkranu
        tytul={t("UI-RYZZAM-RYZYKO-ZAMARZNIECIA-GRUNT")}
        ekran="ryzyko-zamarzniecia"
        wynik={result}
        parametry={{ zapas: ZAPAS_RURY_WODNEJ_POD_STREFA_CM }}
      >
        {t("UI-RYZZAM-KABLE-RURY-UZIOMY")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-RYZZAM-GLEBOKOSC-PRZEMARZANIA-GRUNT")}
        unit="cm"
        type="number"
        inputMode="decimal"
        min={0}
        value={stan.glebokoscPrzemarzaniaCm}
        onChange={(e) => setStan((prev) => ({ ...prev, glebokoscPrzemarzaniaCm: e.target.value }))}
        pomoc={<PomocPola ekran="ryzyko-zamarzniecia" pole="glebokoscPrzemarzania" />}
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-RYZZAM-LEZY-GRUNCIE")}</p>
        <p className="text-caption text-muted-foreground">{t("UI-RYZZAM-GLEBOKOSC-WIERZCHU-KABLA")}</p>
        <ul className="flex flex-col gap-3">
          {stan.instalacje.map((e, i) => {
            const opis = e.nazwa || `instalacja ${i + 1}`
            return (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-RYZZAM-NAZWA")}
                  value={e.nazwa}
                  onChange={(ev) => aktualizuj(e.id, { nazwa: ev.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-RYZZAM-NAZWA-INSTALACJA", { p: i + 1 })}
                />
                <PomocPola ekran="ryzyko-zamarzniecia" pole="nazwa" />
                <select
                  value={e.typ}
                  onChange={(ev) => aktualizuj(e.id, { typ: ev.target.value as TypInstalacjiGruntowej })}
                  className={pole}
                  aria-label={t("UI-RYZZAM-TYP", { opis })}
                >
                  {TYPY.map((typ) => (
                    <option key={typ.id} value={typ.id}>
                      {t(typ.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="ryzyko-zamarzniecia" pole="typ" />
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="cm"
                  value={e.glebokoscCm ?? ""}
                  onChange={(ev) => aktualizuj(e.id, { glebokoscCm: ev.target.value === "" ? null : Number(ev.target.value) })}
                  className={`${pole} w-20`}
                  aria-label={t("UI-RYZZAM-GLEBOKOSC-ULOZENIA", { opis })}
                />
                <PomocPola ekran="ryzyko-zamarzniecia" pole="glebokosc" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, instalacje: prev.instalacje.filter((x) => x.id !== e.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-RYZZAM-USUN-2", { opis })}
                >
                  {t("UI-RYZZAM-USUN")}
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
              instalacje: [...prev.instalacje, { id: crypto.randomUUID(), nazwa: "", typ: "kabel", glebokoscCm: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-RYZZAM-DODAJ-INSTALACJE")}
        </button>
      </div>

      <PoleSelect
        label={t("UI-RYZZAM-ROZMROZISZ-ZAMARZNIETA-RURE")}
        value={stan.metodaRozmrazania}
        onChange={(e) => setStan((prev) => ({ ...prev, metodaRozmrazania: e.target.value as MetodaRozmrazania }))}
        pomoc={<PomocPola ekran="ryzyko-zamarzniecia" pole="rozmrazanie" />}
      >
        <option value="nie-dotyczy">{t("UI-RYZZAM-DOTYCZY")}</option>
        <option value="kabel-grzewczy">{t("UI-RYZZAM-KABEL-GRZEWCZY")}</option>
        <option value="otwarty-ogien">{t("UI-RYZZAM-OTWARTY-OGIEN-PALNIK")}</option>
      </PoleSelect>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-RYZZAM-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-RYZZAM-WPISZ-GLEBOKOSC-PRZEMARZANIA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-RYZZAM-INSTALACJA-ZAGROZONA-MROZEM") : hasWarning ? t("UI-RYZZAM-MALY-ZAPAS-POD") : t("UI-RYZZAM-PONIZEJ-STREFY-PRZEMARZANIA")}
        >
          {result.value.oceny.length > 0 && (
            <>
              <WynikGlowny>
                {t("UI-RYZZAM-STREFIE-PRZEMARZANIA", { liczbaWStrefie: result.value.liczbaWStrefie, length: result.value.oceny.length })}
              </WynikGlowny>
              <ul className="mt-2 flex flex-col gap-1 text-small">
                {result.value.oceny.map((o) => (
                  <li key={o.id}>
                    <ZnakStanu poziom={o.zapasCm === null ? "info" : o.wStrefiePrzemarzania ? "blad" : o.zapasCm < 0 ? "uwaga" : "ok"} />{o.nazwa}
                    {o.zapasCm === null ? ` ${t("UI-RYZZAM-BRAK-GLEBOKOSCI")}` : ` ${t("UI-RYZZAM-WYMAGANE-ZAPAS", { wymaganaCm: f0(o.wymaganaCm), zapasCm: f0(o.zapasCm) })}`}
                  </li>
                ))}
              </ul>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}

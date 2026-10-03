"use client"

import { useMemo } from "react"
import { calculateZamkiDrzwiEwakuacyjnych } from "@/lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/calculator"
import type { TypZamka, ZachowaniePrzyZaniku } from "@/lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Flagi =
  | "maZasilanieAwaryjne"
  | "maOtwarcieReczneMechaniczne"
  | "maPrzyciskEwakuacyjny" | "zwalnianiePoAlarmiePozarowym" | "maKontaktron"
type FormularzStan = {
  typZamka: TypZamka | ""
  zachowaniePrzyZanikuZasilania: ZachowaniePrzyZaniku | ""
} & Record<Flagi, boolean>

// Dane bezpieczeństwa domyślnie false — nigdy ukryty "tak".
const STAN_POCZATKOWY: FormularzStan = {
  typZamka: "",
  zachowaniePrzyZanikuZasilania: "",
  maZasilanieAwaryjne: false,
  maOtwarcieReczneMechaniczne: false,
  maPrzyciskEwakuacyjny: false,
  zwalnianiePoAlarmiePozarowym: false,
  maKontaktron: false,
}

/** `label` and `hint` are translation keys (`t()`). */
const FLAGI: { pole: Flagi; label: string; hint?: string }[] = [
  { pole: "maZasilanieAwaryjne", label: "UI-ZDE-F-AWARYJNE" },
  {
    pole: "maOtwarcieReczneMechaniczne",
    label: "UI-ZDE-F-RECZNE",
    hint: "UI-ZDE-F-RECZNE-HINT",
  },
  { pole: "zwalnianiePoAlarmiePozarowym", label: "UI-ZDE-F-ALARM" },
  { pole: "maPrzyciskEwakuacyjny", label: "UI-ZDE-F-PRZYCISK" },
  { pole: "maKontaktron", label: "UI-ZDE-F-KONTAKTRON" },
]

export default function ZamkiDrzwiEwakuacyjnychPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zamki-drzwi-ewakuacyjnych", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateZamkiDrzwiEwakuacyjnych({
        ...stan,
        typZamka: stan.typZamka === "" ? null : stan.typZamka,
        zachowaniePrzyZanikuZasilania: stan.zachowaniePrzyZanikuZasilania === "" ? null : stan.zachowaniePrzyZanikuZasilania,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const poziom = hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zamki-drzwi-ewakuacyjnych" />
      <NaglowekEkranu tytul={t("UI-ZAMDRZEWA-ZAMKI-DRZWI-EWAKUACYJNYCH")} ekran="zamki-drzwi-ewakuacyjnych" wynik={result}>
        {t("UI-ZAMDRZEWA-POZARZE-MOZE-BYC")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-ZAMDRZEWA-TYP-ZAMKA")}
          value={stan.typZamka}
          onChange={(e) => setStan((prev) => ({ ...prev, typZamka: e.target.value as FormularzStan["typZamka"] }))}
          pomoc={<PomocPola ekran="zamki-drzwi-ewakuacyjnych" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="elektromagnetyczny">{t("UI-ZAMDRZEWA-ZWORA-ELEKTROMAGNETYCZNA")}</option>
          <option value="elektrozaczep">{t("UI-ZAMDRZEWA-ELEKTROZACZEP")}</option>
          <option value="silownik">{t("UI-ZAMDRZEWA-SILOWNIK-DRZWI")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-ZAMDRZEWA-ROBI-ZAMEK-ZANIKU")}
          value={stan.zachowaniePrzyZanikuZasilania}
          onChange={(e) =>
            setStan((prev) => ({ ...prev, zachowaniePrzyZanikuZasilania: e.target.value as FormularzStan["zachowaniePrzyZanikuZasilania"] }))
          }
          pomoc={<PomocPola ekran="zamki-drzwi-ewakuacyjnych" pole="zanikPradu" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="otwiera">{t("UI-ZAMDRZEWA-OTWIERA-DRZWI-FAIL")}</option>
          <option value="blokuje">{t("UI-ZAMDRZEWA-BLOKUJE-DRZWI-FAIL")}</option>
          <option value="nie-wiem">{t("UI-NIE-WIEM")}</option>
        </PoleSelect>
        {FLAGI.map(({ pole, label, hint }) => (
          <PoleCheckbox
            key={pole}
            id={`zamek-${pole}`}
            label={t(label)}
            hint={hint && t(hint)}
            // `?? false`: drafts saved before D53 lack maOtwarcieReczneMechaniczne.
            checked={stan[pole] ?? false}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ZAMDRZEWA-WYBIERZ-TYP-ZAMKA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            hasCritical ? t("UI-ZAMDRZEWA-DRZWI-MOGA-ZOSTAC") : hasWarning ? t("UI-ZAMDRZEWA-BRAKI-LOGICE-ZWALNIANIA") : t("UI-ZAMDRZEWA-DROGA-EWAKUACYJNA-ZABEZPIECZ")
          }
        >
          <WynikGlowny>{result.value.failSafe ? t("UI-ZAMDRZEWA-FAIL-SAFE") : t("UI-ZAMDRZEWA-FAIL-SAFE-2")}</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-ZAMDRZEWA-BRAKI", { liczbaBrakow: result.value.liczbaBrakow })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}

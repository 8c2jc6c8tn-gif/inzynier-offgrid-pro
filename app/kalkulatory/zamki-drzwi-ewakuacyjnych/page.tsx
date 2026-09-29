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
      <NaglowekEkranu tytul="Zamki drzwi ewakuacyjnych" ekran="zamki-drzwi-ewakuacyjnych" wzor={result.formula}>
        W pożarze nie może być zablokowanych drzwi — dobra zasada projektowa to „fail-safe”: brak prądu = drzwi otwarte,
        nigdy odwrotnie. Moduł 8, Ekran 3.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Typ zamka"
          value={stan.typZamka}
          onChange={(e) => setStan((prev) => ({ ...prev, typZamka: e.target.value as FormularzStan["typZamka"] }))}
          pomoc={<PomocPola ekran="zamki-drzwi-ewakuacyjnych" pole="typ" />}
        >
          <option value="">— wybierz —</option>
          <option value="elektromagnetyczny">Zwora elektromagnetyczna</option>
          <option value="elektrozaczep">Elektrozaczep</option>
          <option value="silownik">Siłownik drzwi</option>
        </PoleSelect>
        <PoleSelect
          label="Co robi zamek przy zaniku prądu?"
          value={stan.zachowaniePrzyZanikuZasilania}
          onChange={(e) =>
            setStan((prev) => ({ ...prev, zachowaniePrzyZanikuZasilania: e.target.value as FormularzStan["zachowaniePrzyZanikuZasilania"] }))
          }
          pomoc={<PomocPola ekran="zamki-drzwi-ewakuacyjnych" pole="zanikPradu" />}
        >
          <option value="">— wybierz —</option>
          <option value="otwiera">Otwiera drzwi (fail-safe)</option>
          <option value="blokuje">Blokuje drzwi (fail-secure)</option>
          <option value="nie-wiem">Nie wiem</option>
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
        <p className="text-small text-muted-foreground">Wybierz typ zamka i jego zachowanie przy zaniku prądu.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            hasCritical ? "Drzwi mogą zostać zablokowane" : hasWarning ? "Są braki w logice zwalniania" : "Droga ewakuacyjna zabezpieczona"
          }
        >
          <WynikGlowny>{result.value.failSafe ? "Fail-safe" : "Nie fail-safe"}</WynikGlowny>
          <p className="mt-2 text-small">Braki: {result.value.liczbaBrakow}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

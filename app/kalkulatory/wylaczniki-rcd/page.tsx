"use client"

import { useMemo } from "react"
import { calculateWylaczniki } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/calculator"
import type { CelOchrony, TypRcd } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  falownikHybrydowy: boolean
  odbiornikiZSilnikami: boolean
  zainstalowanyTyp: TypRcd | ""
  celOchrony: CelOchrony
  progMa: string
}

const STAN_POCZATKOWY: FormularzStan = {
  falownikHybrydowy: false,
  odbiornikiZSilnikami: false,
  zainstalowanyTyp: "",
  celOchrony: "osob",
  progMa: "",
}

export default function WylacznikiRcdPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wylaczniki-rcd", STAN_POCZATKOWY)
  const { falownikHybrydowy, odbiornikiZSilnikami, zainstalowanyTyp, celOchrony, progMa } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setFalownikHybrydowy = (a: boolean | ((p: boolean) => boolean)) => setPole("falownikHybrydowy", a)
  const setOdbiornikiZSilnikami = (a: boolean | ((p: boolean) => boolean)) => setPole("odbiornikiZSilnikami", a)
  const setZainstalowanyTyp = (a: (TypRcd | "") | ((p: TypRcd | "") => TypRcd | "")) => setPole("zainstalowanyTyp", a)
  const setCelOchrony = (a: CelOchrony | ((p: CelOchrony) => CelOchrony)) => setPole("celOchrony", a)
  const setProgMa = (a: string | ((p: string) => string)) => setPole("progMa", a)

  const result = useMemo(
    () =>
      calculateWylaczniki({
        falownikHybrydowy,
        odbiornikiZSilnikami,
        zainstalowanyTyp: zainstalowanyTyp === "" ? null : zainstalowanyTyp,
        celOchrony,
        progMa: progMa === "" ? 0 : Number(progMa),
      }),
    [falownikHybrydowy, odbiornikiZSilnikami, zainstalowanyTyp, celOchrony, progMa],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij wszystkie pola",
    red: "Zabronione — RCD nie spełnia wymagań",
    green: "RCD dobrany poprawnie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wylaczniki-rcd" />
      <NaglowekEkranu tytul="Wyłączniki RCD">
        RCD to strażnik, który wyczuwa, że prąd ucieka tam, gdzie nie powinien — np. do twojego
        ciała — i wyłącza w ułamku sekundy. Moduł 5, Ekran 16.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="falownik-hybrydowy"
          label="Falownik generuje składową stałą (typowe dla hybrydowych)"
          checked={falownikHybrydowy}
          onChange={(e) => setFalownikHybrydowy(e.target.checked)}
        />
        <PoleCheckbox
          id="odbiorniki-z-silnikami"
          label="W obwodzie są odbiorniki z silnikami"
          checked={odbiornikiZSilnikami}
          onChange={(e) => setOdbiornikiZSilnikami(e.target.checked)}
        />
        <PoleSelect
          label="Zainstalowany typ RCD"
          value={zainstalowanyTyp}
          onChange={(e) => setZainstalowanyTyp(e.target.value as TypRcd)}
        >
          <option value="">— wybierz —</option>
          <option value="AC">Typ AC</option>
          <option value="A">Typ A</option>
          <option value="B">Typ B</option>
        </PoleSelect>
        <PoleSelect label="Cel ochrony tego obwodu" value={celOchrony} onChange={(e) => setCelOchrony(e.target.value as CelOchrony)}>
          <option value="osob">Ochrona osób (30 mA)</option>
          <option value="pozarowa">Ochrona przeciwpożarowa (300 mA)</option>
        </PoleSelect>
        <Pole
          label="Prąd różnicowy zainstalowanego RCD"
          unit="mA"
          type="number"
          inputMode="decimal"
          min={0}
          value={progMa}
          onChange={(e) => setProgMa(e.target.value)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>Wymagany próg: {result.value.progWymaganyMa} mA</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}

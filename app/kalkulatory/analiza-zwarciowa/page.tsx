"use client"

import { useMemo } from "react"
import { calculateAnalizaZwarciowa } from "@/lib/core/modules/okablowanie/analiza-zwarciowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  napiecieBateriiV: string
  rezystancjaWewnetrznaBateriiOhm: string
  iscPanelaA: string
  liczbaStringowRownoleglych: string
  aicZabezpieczeniaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieBateriiV: "",
  rezystancjaWewnetrznaBateriiOhm: "",
  iscPanelaA: "",
  liczbaStringowRownoleglych: "",
  aicZabezpieczeniaA: "",
}

export default function AnalizaZwarciowaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("analiza-zwarciowa", STAN_POCZATKOWY)
  const { napiecieBateriiV, rezystancjaWewnetrznaBateriiOhm, iscPanelaA, liczbaStringowRownoleglych, aicZabezpieczeniaA } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieBateriiV = (a: string | ((p: string) => string)) => setPole("napiecieBateriiV", a)
  const setRezystancjaWewnetrznaBateriiOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaBateriiOhm", a)
  const setIscPanelaA = (a: string | ((p: string) => string)) => setPole("iscPanelaA", a)
  const setLiczbaStringowRownoleglych = (a: string | ((p: string) => string)) => setPole("liczbaStringowRownoleglych", a)
  const setAicZabezpieczeniaA = (a: string | ((p: string) => string)) => setPole("aicZabezpieczeniaA", a)

  const result = useMemo(
    () =>
      calculateAnalizaZwarciowa({
        napiecieBateriiV: napiecieBateriiV === "" ? 0 : Number(napiecieBateriiV),
        rezystancjaWewnetrznaBateriiOhm:
          rezystancjaWewnetrznaBateriiOhm === "" ? 0 : Number(rezystancjaWewnetrznaBateriiOhm),
        iscPanelaA: iscPanelaA === "" ? 0 : Number(iscPanelaA),
        liczbaStringowRownoleglych: liczbaStringowRownoleglych === "" ? 0 : Number(liczbaStringowRownoleglych),
        aicZabezpieczeniaA: aicZabezpieczeniaA === "" ? 0 : Number(aicZabezpieczeniaA),
      }),
    [napiecieBateriiV, rezystancjaWewnetrznaBateriiOhm, iscPanelaA, liczbaStringowRownoleglych, aicZabezpieczeniaA],
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
    red: "Zabronione — zdolność wyłączania za niska",
    green: "Prąd zwarciowy policzony",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/analiza-zwarciowa" />
      <NaglowekEkranu tytul="Analiza zwarciowa">
        Zwarcie to jak wybuch — trzeba wiedzieć, ile energii popłynie, zanim bezpiecznik zdąży
        przerwać obwód. Moduł 5, Ekran 12 — punkt odniesienia dla doboru bezpieczników,
        wyłączników DC i selektywności w innych ekranach tego modułu.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie baterii"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieBateriiV}
          onChange={(e) => setNapiecieBateriiV(e.target.value)}
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="Ω"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaWewnetrznaBateriiOhm}
          onChange={(e) => setRezystancjaWewnetrznaBateriiOhm(e.target.value)}
          hint="Z pomiaru lub karty katalogowej ogniw."
        />
        <Pole
          label="Prąd zwarciowy panelu (Isc)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iscPanelaA}
          onChange={(e) => setIscPanelaA(e.target.value)}
        />
        <Pole
          label="Liczba stringów PV równoległych"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaStringowRownoleglych}
          onChange={(e) => setLiczbaStringowRownoleglych(e.target.value)}
        />
        <Pole
          label="AIC sprawdzanego zabezpieczenia (opcjonalnie)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={aicZabezpieczeniaA}
          onChange={(e) => setAicZabezpieczeniaA(e.target.value)}
          hint="Zdolność wyłączania, z karty katalogowej bezpiecznika/wyłącznika."
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            I_zw maks. = {result.value.pradZwarciowyMaksymalnyA.toLocaleString("pl-PL")} A
          </WynikGlowny>
        )}
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <p className="mt-1 text-small text-muted-foreground">
            Bateria: {result.value.pradZwarciowyBateriaA.toLocaleString("pl-PL")} A · PV:{" "}
            {result.value.pradZwarciowyPvA.toLocaleString("pl-PL")} A
          </p>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}

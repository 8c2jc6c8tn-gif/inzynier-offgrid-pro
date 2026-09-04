"use client"

import { useMemo, useState } from "react"
import { calculateDetekcjaZwarciaEFuse } from "@/lib/core/modules/baterie/detekcja-zwarcia-efuse/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function DetekcjaZwarciaEFusePage() {
  const [napiecieBateriiV, setNapiecieBateriiV] = useState("")
  const [rezystancjaWewnetrznaOhm, setRezystancjaWewnetrznaOhm] = useState("")
  const [zdolnoscLaczeniowaTranzystorowA, setZdolnoscLaczeniowaTranzystorowA] = useState("")

  const result = useMemo(
    () =>
      calculateDetekcjaZwarciaEFuse({
        napiecieBateriiV: napiecieBateriiV === "" ? 0 : Number(napiecieBateriiV),
        rezystancjaWewnetrznaOhm: rezystancjaWewnetrznaOhm === "" ? 0 : Number(rezystancjaWewnetrznaOhm),
        zdolnoscLaczeniowaTranzystorowA:
          zdolnoscLaczeniowaTranzystorowA === "" ? 0 : Number(zdolnoscLaczeniowaTranzystorowA),
      }),
    [napiecieBateriiV, rezystancjaWewnetrznaOhm, zdolnoscLaczeniowaTranzystorowA],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.value.wymaganyEFuse
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/detekcja-zwarcia-efuse" />
      <NaglowekEkranu tytul="Detekcja zwarcia i e-Fuse">
        Zwykły bezpiecznik wyłącza zwarcie w ok. 10 ms — elektroniczny e-Fuse w mniej niż 100 µs.
        Przy bardzo wysokich prądach zwarciowych ta różnica decyduje, czy tranzystory BMS
        przetrwają. Moduł 4, Ekran 9.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie baterii"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieBateriiV}
          onChange={(e) => setNapiecieBateriiV(e.target.value)}
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="Ω"
          type="number"
          inputMode="decimal"
          value={rezystancjaWewnetrznaOhm}
          onChange={(e) => setRezystancjaWewnetrznaOhm(e.target.value)}
        />
        <Pole
          label="Zdolność łączeniowa tranzystorów BMS"
          unit="A"
          type="number"
          inputMode="decimal"
          value={zdolnoscLaczeniowaTranzystorowA}
          onChange={(e) => setZdolnoscLaczeniowaTranzystorowA(e.target.value)}
          hint="Z karty katalogowej BMS."
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby sprawdzić, czy potrzebna jest funkcja e-Fuse.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "INVALID_INPUT"
                ? "Nie da się policzyć — sprawdź wpisane dane"
                : result.value.wymaganyEFuse
                  ? "Wymagana funkcja e-Fuse"
                  : "Zdolność łączeniowa wystarcza"
            }
          >
            {result.status !== "INVALID_INPUT" && (
              <WynikGlowny>
                I_zw = {result.value.pradZwarciowyA.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} A
              </WynikGlowny>
            )}
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}

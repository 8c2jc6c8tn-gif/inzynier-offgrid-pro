"use client"

import { useMemo, useState } from "react"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const LICZBA = (v: number) => v.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

export default function DoborPrzekrojuKablaPage() {
  const [pradA, setPradA] = useState("")
  const [napiecieV, setNapiecieV] = useState("")
  const [dlugoscTrasyM, setDlugoscTrasyM] = useState("")
  const [material, setMaterial] = useState<Material>("Cu")
  const [sposobUlozenia, setSposobUlozenia] = useState<SposobUlozenia>("swobodnie")
  const [temperaturaOtoczeniaC, setTemperaturaOtoczeniaC] = useState("")
  const [liczbaKabliWWiazce, setLiczbaKabliWWiazce] = useState("")
  const [dopuszczalnySpadekNapieciaPct, setDopuszczalnySpadekNapieciaPct] = useState("")
  const [sprawdzamWlasny, setSprawdzamWlasny] = useState(false)
  const [sprawdzanyPrzekrojMm2, setSprawdzanyPrzekrojMm2] = useState("")

  const result = useMemo(
    () =>
      calculateDoborPrzekrojuKabla({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        dlugoscTrasyM: dlugoscTrasyM === "" ? 0 : Number(dlugoscTrasyM),
        material,
        sposobUlozenia,
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        liczbaKabliWWiazce: liczbaKabliWWiazce === "" ? 0 : Number(liczbaKabliWWiazce),
        dopuszczalnySpadekNapieciaPct:
          dopuszczalnySpadekNapieciaPct === "" ? 0 : Number(dopuszczalnySpadekNapieciaPct),
        sprawdzanyPrzekrojMm2: sprawdzamWlasny && sprawdzanyPrzekrojMm2 !== "" ? Number(sprawdzanyPrzekrojMm2) : null,
      }),
    [
      pradA,
      napiecieV,
      dlugoscTrasyM,
      material,
      sposobUlozenia,
      temperaturaOtoczeniaC,
      liczbaKabliWWiazce,
      dopuszczalnySpadekNapieciaPct,
      sprawdzamWlasny,
      sprawdzanyPrzekrojMm2,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const werdykt: "incomplete" | "invalid" | "red" | "yellow" | "green" =
    result.status === "INCOMPLETE"
      ? "incomplete"
      : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE"
        ? "invalid"
        : hasCritical
          ? "red"
          : result.status === "VALID_WITH_WARNINGS"
            ? "yellow"
            : "green"

  const werdyktPoziom: Record<Exclude<typeof werdykt, "incomplete">, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const werdyktEtykieta: Record<Exclude<typeof werdykt, "incomplete">, string> = {
    invalid: "Nie da się policzyć — sprawdź wpisane dane",
    red: "Zabronione",
    yellow: "Dopuszczalne, ale na granicy",
    green: "Zalecane",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-przekroju-kabla" />
      <NaglowekEkranu tytul="Dobór przekroju kabla">
        Prąd płynący długim kablem traci energię jak woda w długim wężu — im dłuższa droga i
        cieńsza rura, tym mniej ciśnienia (napięcia) zostaje na końcu. Moduł 5, Ekran 1.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Prąd roboczy obwodu (I)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc="Prąd płynący w tym obwodzie w normalnej pracy. Znajdziesz go w danych panelu/falownika albo policzysz: P (W) ÷ U (V)."
        />
        <Pole
          label="Napięcie systemowe (U)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc="Napięcie DC (12/24/48V) lub AC (230V) tego obwodu."
        />
        <Pole
          label="Długość trasy (L, jedna strona)"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscTrasyM}
          onChange={(e) => setDlugoscTrasyM(e.target.value)}
          pomoc="Rzeczywista długość kabla od źródła do odbiornika — nie odległość w linii prostej, tylko po trasie prowadzenia (z zakrętami, pionami)."
        />
        <PoleSelect
          label="Materiał przewodnika"
          value={material}
          onChange={(e) => setMaterial(e.target.value as Material)}
          pomoc="Miedź (Cu) — standard. Aluminium (Al) — tańsze, ale wymaga większego przekroju."
        >
          <option value="Cu">Miedź (Cu)</option>
          <option value="Al">Aluminium (Al)</option>
        </PoleSelect>
        <PoleSelect
          label="Sposób ułożenia"
          value={sposobUlozenia}
          onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}
          pomoc="Im gorsze chłodzenie kabla, tym mniej prądu może bezpiecznie przenieść."
        >
          <option value="swobodnie">Swobodnie (na ścianie, w powietrzu)</option>
          <option value="w_peszlu">W peszlu / rurze instalacyjnej</option>
          <option value="w_ziemi">W ziemi</option>
          <option value="w_wiazce">W wiązce z innymi kablami</option>
        </PoleSelect>
        {(sposobUlozenia === "w_wiazce" || sposobUlozenia === "w_peszlu" || sposobUlozenia === "w_ziemi") && (
          <Pole
            label="Liczba kabli w wiązce (jeśli dotyczy)"
            unit="szt."
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaKabliWWiazce}
            onChange={(e) => setLiczbaKabliWWiazce(e.target.value)}
            pomoc="Kable leżące razem grzeją się nawzajem — im więcej, tym mocniej trzeba przewymiarować przekrój."
          />
        )}
        <Pole
          label="Temperatura otoczenia"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
          pomoc="Maksymalna spodziewana temperatura w miejscu prowadzenia kabla (np. poddasze latem, nie średnia roczna)."
        />
        <Pole
          label="Dopuszczalny spadek napięcia"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={dopuszczalnySpadekNapieciaPct}
          onChange={(e) => setDopuszczalnySpadekNapieciaPct(e.target.value)}
          hint="Domyślnie: 2% AC / 3% DC"
          pomoc="Im dalej prąd płynie, tym więcej energii traci się po drodze."
        />

        <PoleCheckbox
          id="sprawdz-wlasny-przekroj"
          label="Sprawdź mój własny przekrój zamiast dobierać automatycznie"
          checked={sprawdzamWlasny}
          onChange={(e) => setSprawdzamWlasny(e.target.checked)}
        />
        {sprawdzamWlasny && (
          <Pole
            label="Przekrój do sprawdzenia"
            unit="mm²"
            type="number"
            inputMode="decimal"
            min={0}
            value={sprawdzanyPrzekrojMm2}
            onChange={(e) => setSprawdzanyPrzekrojMm2(e.target.value)}
          />
        )}
      </div>

      {werdykt === "incomplete" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć dobór przekroju.</p>
      ) : (
        <WerdyktPanel poziom={werdyktPoziom[werdykt]} etykieta={werdyktEtykieta[werdykt]}>
          {werdykt !== "invalid" && (
            <>
              <WynikGlowny>{result.value.przekrojMm2} mm²</WynikGlowny>
              <p className="mt-1 text-small">
                Obciążalność efektywna: {LICZBA(result.value.obciazalnoscEfektywnaA)} A · spadek napięcia:{" "}
                {LICZBA(result.value.spadekNapieciaPct)}%.
              </p>
              <p className="mt-1 text-small">
                Margines obciążalności: {LICZBA(result.value.marginesObciazalnosciPct)}% · margines spadku
                napięcia: {LICZBA(result.value.marginesSpadkuPct)}%.
              </p>
              {result.value.strataRocznaKwh > 0 && (
                <p className="mt-1 text-small">
                  Orientacyjna roczna strata energii w kablu (praca ciągła): {LICZBA(result.value.strataRocznaKwh)}{" "}
                  kWh/rok.
                </p>
              )}
            </>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

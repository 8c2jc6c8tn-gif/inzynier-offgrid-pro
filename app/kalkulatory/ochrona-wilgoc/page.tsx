"use client"

import { useMemo, useState } from "react"
import { calculateOchronaWilgoc } from "@/lib/core/modules/baterie/ochrona-wilgoc/calculator"
import { OPCJE_IP } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function OchronaWilgocPage() {
  const [temperaturaOtoczeniaC, setTemperaturaOtoczeniaC] = useState("")
  const [wilgotnoscPct, setWilgotnoscPct] = useState("")
  const [temperaturaObudowyC, setTemperaturaObudowyC] = useState("")
  const [srodowiskoWilgotne, setSrodowiskoWilgotne] = useState(false)
  const [ipKod, setIpKod] = useState("")

  const result = useMemo(
    () =>
      calculateOchronaWilgoc({
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        wilgotnoscPct: wilgotnoscPct === "" ? 0 : Number(wilgotnoscPct),
        temperaturaObudowyC: temperaturaObudowyC === "" ? null : Number(temperaturaObudowyC),
        srodowiskoWilgotne,
        ipKod: ipKod === "" ? 0 : Number(ipKod),
      }),
    [temperaturaOtoczeniaC, wilgotnoscPct, temperaturaObudowyC, srodowiskoWilgotne, ipKod],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-wilgoc" />
      <NaglowekEkranu tytul="Ochrona przed wilgocią i kondensacją">
        Mokry BMS i miedziane szyny to gotowy przepis na zwarcie — kondensacja to cichy zabójca
        elektroniki. Moduł 4, Ekran 10.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Temperatura otoczenia"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
        />
        <Pole
          label="Wilgotność względna"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={wilgotnoscPct}
          onChange={(e) => setWilgotnoscPct(e.target.value)}
        />
        <Pole
          label="Temperatura obudowy / ogniw"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaObudowyC}
          onChange={(e) => setTemperaturaObudowyC(e.target.value)}
          hint="Zmierzona lub spodziewana — może być niższa niż otoczenia (wychłodzenie radiacyjne w nocy)."
        />
        <PoleSelect label="Kod IP obudowy" value={ipKod} onChange={(e) => setIpKod(e.target.value)}>
          <option value="">— wybierz —</option>
          {OPCJE_IP.map((o) => (
            <option key={o.kod} value={o.kod}>
              {o.label}
            </option>
          ))}
        </PoleSelect>
        <PoleCheckbox
          id="srodowisko-wilgotne"
          checked={srodowiskoWilgotne}
          onChange={(e) => setSrodowiskoWilgotne(e.target.checked)}
          label="Miejsce narażone na wilgoć (garaż, komora zewnętrzna)"
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć ocenę ryzyka kondensacji.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "INVALID_INPUT"
                ? "Nie da się ocenić — sprawdź wpisane dane"
                : hasCritical
                  ? "Obudowa poniżej wymaganego IP"
                  : result.value.ryzykoKondensacji
                    ? "Ryzyko kondensacji"
                    : "Bez ryzyka kondensacji"
            }
          >
            {result.status !== "INVALID_INPUT" && (
              <WynikGlowny>Punkt rosy: {result.value.punktRosyC.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}°C</WynikGlowny>
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

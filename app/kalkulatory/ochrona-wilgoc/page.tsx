"use client"

import { useMemo } from "react"
import { calculateOchronaWilgoc } from "@/lib/core/modules/baterie/ochrona-wilgoc/calculator"
import { OPCJE_IP } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { MAGNUS_A, MAGNUS_B, MIN_IP_KOD_WILGOTNE } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"

type FormularzStan = {
  temperaturaOtoczeniaC: string
  wilgotnoscPct: string
  temperaturaObudowyC: string
  srodowiskoWilgotne: boolean
  ipKod: string
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaOtoczeniaC: "",
  wilgotnoscPct: "",
  temperaturaObudowyC: "",
  srodowiskoWilgotne: false,
  ipKod: "",
}

export default function OchronaWilgocPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-wilgoc", STAN_POCZATKOWY)
  const { temperaturaOtoczeniaC, wilgotnoscPct, temperaturaObudowyC, srodowiskoWilgotne, ipKod } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaOtoczeniaC = (a: string | ((p: string) => string)) => setPole("temperaturaOtoczeniaC", a)
  const setWilgotnoscPct = (a: string | ((p: string) => string)) => setPole("wilgotnoscPct", a)
  const setTemperaturaObudowyC = (a: string | ((p: string) => string)) => setPole("temperaturaObudowyC", a)
  const setSrodowiskoWilgotne = (a: boolean | ((p: boolean) => boolean)) => setPole("srodowiskoWilgotne", a)
  const setIpKod = (a: string | ((p: string) => string)) => setPole("ipKod", a)

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
      <NaglowekEkranu
        tytul="Ochrona przed wilgocią i kondensacją"
        ekran="ochrona-wilgoc"
        wynik={result}
        parametry={{ minIp: MIN_IP_KOD_WILGOTNE, magnusA: MAGNUS_A, magnusB: MAGNUS_B }}
      >
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
          pomoc={<PomocPola ekran="ochrona-wilgoc" pole="temperatura" />}
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
          pomoc={<PomocPola ekran="ochrona-wilgoc" pole="wilgotnosc" />}
        />
        <Pole
          label="Temperatura obudowy / ogniw"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaObudowyC}
          onChange={(e) => setTemperaturaObudowyC(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-wilgoc" pole="temperaturaObudowy" />}
        />
        <PoleSelect
          label="Kod IP obudowy"
          value={ipKod}
          onChange={(e) => setIpKod(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-wilgoc" pole="ip" params={{ minIp: MIN_IP_KOD_WILGOTNE }} />}
        >
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
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}

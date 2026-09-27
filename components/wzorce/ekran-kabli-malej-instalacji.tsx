"use client"

import { useId, useMemo } from "react"
import { calculateKableBezpiecznikiMale } from "@/lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/calculator"
import type { KableBezpiecznikiMaleInput } from "@/lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/input"
import type { SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { DOMYSLNY_SPADEK_DC_PCT } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pradA: string
  napiecieV: KableBezpiecznikiMaleInput["napiecieV"]
  dlugoscTrasyM: string
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: string
  liczbaKabliWWiazce: string
  dopuszczalnySpadekNapieciaPct: string
  sprawdzamWlasny: boolean
  sprawdzanyPrzekrojMm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pradA: "",
  napiecieV: 0,
  dlugoscTrasyM: "",
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: "",
  liczbaKabliWWiazce: "",
  dopuszczalnySpadekNapieciaPct: "",
  sprawdzamWlasny: false,
  sprawdzanyPrzekrojMm2: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

/** Form + verdict shared by M12/E2 (small installation) and M12/E15 (camper/vehicle, `pojazd`). */
export function EkranKabliMalejInstalacji({ kluczSzkicu, pojazd }: { kluczSzkicu: string; pojazd: boolean }) {
  const [stan, setStan] = usePersistedDraft<FormularzStan>(kluczSzkicu, STAN_POCZATKOWY)
  const idWlasny = useId()
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateKableBezpiecznikiMale({
        pradA: liczba(stan.pradA),
        napiecieV: stan.napiecieV,
        dlugoscTrasyM: liczba(stan.dlugoscTrasyM),
        sposobUlozenia: stan.sposobUlozenia,
        temperaturaOtoczeniaC: stan.temperaturaOtoczeniaC === "" ? null : Number(stan.temperaturaOtoczeniaC),
        liczbaKabliWWiazce: liczba(stan.liczbaKabliWWiazce),
        dopuszczalnySpadekNapieciaPct: liczba(stan.dopuszczalnySpadekNapieciaPct),
        sprawdzanyPrzekrojMm2: stan.sprawdzamWlasny && stan.sprawdzanyPrzekrojMm2 !== "" ? Number(stan.sprawdzanyPrzekrojMm2) : null,
        pojazd,
      }),
    [stan, pojazd],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical")
    ? "blad"
    : result.warnings.some((w) => w.level === "warning")
      ? "uwaga"
      : "ok"
  const v = result.value

  return (
    <>
      <div className="flex flex-col gap-4">
        <Pole label="Prąd obciążenia" unit="A" type="number" inputMode="decimal" min={0} value={stan.pradA} onChange={ustaw("pradA")} hint="Moc odbiornika ÷ napięcie, np. przetwornica 600 W / 12 V = 50 A." />
        <PoleSelect
          label="Napięcie instalacji"
          value={stan.napiecieV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieV: Number(e.target.value) as FormularzStan["napiecieV"] }))}
        >
          <option value={0}>— wybierz —</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
        </PoleSelect>
        <Pole label="Długość trasy (w jedną stronę)" unit="m" type="number" inputMode="decimal" min={0} value={stan.dlugoscTrasyM} onChange={ustaw("dlugoscTrasyM")} />
        <PoleSelect
          label="Sposób ułożenia"
          value={stan.sposobUlozenia}
          onChange={(e) => setStan((prev) => ({ ...prev, sposobUlozenia: e.target.value as SposobUlozenia }))}
        >
          <option value="swobodnie">Swobodnie (na ścianie, w powietrzu)</option>
          <option value="w_peszlu">W peszlu / rurze instalacyjnej</option>
          <option value="w_ziemi">W ziemi</option>
          <option value="w_wiazce">W wiązce z innymi kablami</option>
        </PoleSelect>
        {stan.sposobUlozenia !== "swobodnie" && (
          <Pole label="Liczba kabli w wiązce" unit="szt." type="number" inputMode="numeric" min={0} value={stan.liczbaKabliWWiazce} onChange={ustaw("liczbaKabliWWiazce")} />
        )}
        <Pole
          label="Temperatura otoczenia"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperaturaOtoczeniaC}
          onChange={ustaw("temperaturaOtoczeniaC")}
          hint={pojazd ? "Najwyższa spodziewana — np. komora silnika albo nagrzany kamper latem." : "Najwyższa spodziewana w miejscu prowadzenia kabla."}
        />
        <Pole
          label="Dopuszczalny spadek napięcia"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.dopuszczalnySpadekNapieciaPct}
          onChange={ustaw("dopuszczalnySpadekNapieciaPct")}
          hint={`Dla instalacji DC zwykle ${DOMYSLNY_SPADEK_DC_PCT}%.`}
        />
        <PoleCheckbox
          id={idWlasny}
          label="Sprawdź mój przekrój zamiast dobierać automatycznie"
          checked={stan.sprawdzamWlasny}
          onChange={(e) => setStan((prev) => ({ ...prev, sprawdzamWlasny: e.target.checked }))}
        />
        {stan.sprawdzamWlasny && (
          <Pole label="Mój przekrój" unit="mm²" type="number" inputMode="decimal" min={0} value={stan.sprawdzanyPrzekrojMm2} onChange={ustaw("sprawdzanyPrzekrojMm2")} />
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij prąd, napięcie, długość, temperaturę i dopuszczalny spadek.</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="blad" etykieta="Poza zakresem tablic">
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "blad" ? "Przekrój poniżej minimum" : stan.sprawdzamWlasny ? "Twój przekrój" : "Minimalny przekrój"}
        >
          <WynikGlowny>
            {f1(v.przekrojMm2)} mm² · bezpiecznik ≥ {f2(v.bezpiecznikMinA)} A
          </WynikGlowny>
          <p className="mt-1 text-small">
            Obciążalność {f1(v.obciazalnoscA)} A · spadek napięcia {f2(v.spadekNapieciaPct)}%
            {v.wymaganyMm2 !== v.przekrojMm2 && ` · minimum ${f1(v.wymaganyMm2)} mm²`}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}

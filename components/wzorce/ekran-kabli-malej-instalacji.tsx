"use client"

import { useId, useMemo } from "react"
import { calculateKableBezpiecznikiMale } from "@/lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/calculator"
import type { KableBezpiecznikiMaleInput } from "@/lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/input"
import type { SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { DOMYSLNY_SPADEK_DC_PCT } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"

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

/** Form + verdict shared by M12/E2 (small installation) and M12/E15 (camper/vehicle, `pojazd`). */
export function EkranKabliMalejInstalacji({ kluczSzkicu, pojazd }: { kluczSzkicu: string; pojazd: boolean }) {
  const t = useTranslate()
  const { f1, f2 } = useFormaty()
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
        <Pole label={t("UI-EKRKABMALINS-PRAD-OBCIAZENIA")} unit="A" type="number" inputMode="decimal" min={0} value={stan.pradA} onChange={ustaw("pradA")} pomoc={<PomocPola ekran="kable-male-instalacje" pole="prad" />} />
        <PoleSelect
          label={t("UI-EKRKABMALINS-NAPIECIE-INSTALACJI")}
          value={stan.napiecieV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieV: Number(e.target.value) as FormularzStan["napiecieV"] }))}
          pomoc={<PomocPola ekran="kable-male-instalacje" pole="napiecie" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
        </PoleSelect>
        <Pole label={t("UI-EKRKABMALINS-DLUGOSC-TRASY-JEDNA")} unit="m" type="number" inputMode="decimal" min={0} value={stan.dlugoscTrasyM} onChange={ustaw("dlugoscTrasyM")} pomoc={<PomocPola ekran="kable-male-instalacje" pole="dlugosc" />} />
        <PoleSelect
          label={t("UI-EKRKABMALINS-SPOSOB-ULOZENIA")}
          value={stan.sposobUlozenia}
          onChange={(e) => setStan((prev) => ({ ...prev, sposobUlozenia: e.target.value as SposobUlozenia }))}
          pomoc={<PomocPola ekran="kable-male-instalacje" pole="ulozenie" />}
        >
          <option value="swobodnie">{t("UI-EKRKABMALINS-SWOBODNIE-SCIANIE-POWIETRZU")}</option>
          <option value="w_peszlu">{t("UI-EKRKABMALINS-PESZLU-RURZE-INSTALACYJNEJ")}</option>
          <option value="w_ziemi">{t("UI-EKRKABMALINS-ZIEMI")}</option>
          <option value="w_wiazce">{t("UI-EKRKABMALINS-WIAZCE-INNYMI-KABLAMI")}</option>
        </PoleSelect>
        {stan.sposobUlozenia !== "swobodnie" && (
          <Pole label={t("UI-EKRKABMALINS-LICZBA-KABLI-WIAZCE")} unit={t("UI-J-SZT")} type="number" inputMode="numeric" min={0} value={stan.liczbaKabliWWiazce} onChange={ustaw("liczbaKabliWWiazce")} pomoc={<PomocPola ekran="kable-male-instalacje" pole="wiazka" />} />
        )}
        <Pole
          label={t("UI-EKRKABMALINS-TEMPERATURA-OTOCZENIA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperaturaOtoczeniaC}
          onChange={ustaw("temperaturaOtoczeniaC")}
          pomoc={<PomocPola ekran="kable-male-instalacje" pole={pojazd ? "temperaturaPojazd" : "temperatura"} />}
        />
        <Pole
          label={t("UI-EKRKABMALINS-DOPUSZCZALNY-SPADEK-NAPIECIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.dopuszczalnySpadekNapieciaPct}
          onChange={ustaw("dopuszczalnySpadekNapieciaPct")}
          pomoc={<PomocPola ekran="kable-male-instalacje" pole="spadek" params={{ spadek: DOMYSLNY_SPADEK_DC_PCT }} />}
        />
        <PoleCheckbox
          id={idWlasny}
          label={t("UI-EKRKABMALINS-SPRAWDZ-MOJ-PRZEKROJ")}
          checked={stan.sprawdzamWlasny}
          onChange={(e) => setStan((prev) => ({ ...prev, sprawdzamWlasny: e.target.checked }))}
        />
        {stan.sprawdzamWlasny && (
          <Pole label={t("UI-EKRKABMALINS-MOJ-PRZEKROJ")} unit="mm²" type="number" inputMode="decimal" min={0} value={stan.sprawdzanyPrzekrojMm2} onChange={ustaw("sprawdzanyPrzekrojMm2")} pomoc={<PomocPola ekran="kable-male-instalacje" pole="przekroj" />} />
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-EKRKABMALINS-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-EKRKABMALINS-WYPELNIJ-PRAD-NAPIECIE")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-EKRKABMALINS-POZA-ZAKRESEM-TABLIC")}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "blad" ? t("UI-EKRKABMALINS-PRZEKROJ-PONIZEJ-MINIMUM") : stan.sprawdzamWlasny ? t("UI-EKRKABMALINS-PRZEKROJ") : t("UI-EKRKABMALINS-MINIMALNY-PRZEKROJ")}
        >
          <WynikGlowny>
            {t("UI-EKRKABMALINS-BEZPIECZNIK", { przekrojMm2: f1(v.przekrojMm2), bezpiecznikMinA: f2(v.bezpiecznikMinA) })}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-EKRKABMALINS-OBCIAZALNOSC-SPADEK-NAPIECIA", { obciazalnoscA: f1(v.obciazalnoscA), spadekNapieciaPct: f2(v.spadekNapieciaPct) })}
            {v.wymaganyMm2 !== v.przekrojMm2 && ` ${t("UI-EKRKABMALINS-MINIMUM", { wymaganyMm2: f1(v.wymaganyMm2) })}`}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </>
  )
}

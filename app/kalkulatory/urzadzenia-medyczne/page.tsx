"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateUrzadzeniaMedyczne } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-medyczne/calculator"
import { MINIMUM_DOB_MEDYCZNE, URZADZENIA_MEDYCZNE, type UrzadzenieMedyczne } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-medyczne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "mocW" | "godzinNaDobe" | "napiecieV" | "uzytecznaPct" | "sprawnoscFalownikaPct" | "posiadanyAh"
type TakNie = "" | "tak" | "nie"

type FormularzStan = Record<PolaLiczbowe, string> & {
  urzadzenie: UrzadzenieMedyczne | ""
  przezFalownik: TakNie
  maZapasoweZrodlo: TakNie
}

const STAN_POCZATKOWY: FormularzStan = {
  urzadzenie: "",
  mocW: "",
  godzinNaDobe: "",
  napiecieV: "",
  uzytecznaPct: "",
  przezFalownik: "",
  sprawnoscFalownikaPct: "",
  posiadanyAh: "",
  maZapasoweZrodlo: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const takNie = (s: TakNie) => (s === "" ? null : s === "tak")
const r1 = (x: number) => Math.round(x * 10) / 10

export default function UrzadzeniaMedycznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("urzadzenia-medyczne", STAN_POCZATKOWY)
  const ustaw = (klucz: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [klucz]: e.target.value }))
  const pole = (klucz: PolaLiczbowe) => ({ type: "number", inputMode: "decimal" as const, min: 0, value: stan[klucz], onChange: ustaw(klucz) })

  const result = useMemo(
    () =>
      calculateUrzadzeniaMedyczne({
        urzadzenie: stan.urzadzenie === "" ? null : stan.urzadzenie,
        mocW: liczba(stan.mocW),
        godzinNaDobe: liczba(stan.godzinNaDobe),
        napiecieV: liczba(stan.napiecieV),
        uzytecznaPct: liczba(stan.uzytecznaPct),
        przezFalownik: takNie(stan.przezFalownik),
        sprawnoscFalownikaPct: liczba(stan.sprawnoscFalownikaPct),
        posiadanyAh: liczba(stan.posiadanyAh),
        maZapasoweZrodlo: takNie(stan.maZapasoweZrodlo),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value
  const takNieOpcje = (
    <>
      <option value="">{t("UI-WYBIERZ")}</option>
      <option value="tak">{t("UI-TAK")}</option>
      <option value="nie">{t("UI-NIE")}</option>
    </>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/urzadzenia-medyczne" />
      <NaglowekEkranu tytul={t("UI-M12-MED-TYTUL")} ekran="urzadzenia-medyczne" wynik={result} parametry={{ doby: MINIMUM_DOB_MEDYCZNE }}>
        {t("UI-M12-MED-OPIS", { doby: MINIMUM_DOB_MEDYCZNE })}
      </NaglowekEkranu>

      <PoleSelect label={t("UI-M12-MED-URZADZENIE")} value={stan.urzadzenie} onChange={ustaw("urzadzenie")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="urzadzenie" />}>
        <option value="">{t("UI-WYBIERZ")}</option>
        {URZADZENIA_MEDYCZNE.map((u) => (
          <option key={u} value={u}>
            {t(`UI-M12-MED-U-${u.toUpperCase()}`)}
          </option>
        ))}
      </PoleSelect>
      <Pole label={t("UI-M12-MA-MOC")} unit="W" {...pole("mocW")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="moc" />} />
      <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinNaDobe")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="godziny" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-MED-ZASILANIE")}</legend>
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="napiecie" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("uzytecznaPct")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="uzyteczna" />} />
        <PoleSelect label={t("UI-M12-KZ-FALOWNIK")} value={stan.przezFalownik} onChange={ustaw("przezFalownik")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="falownik" />}>
          {takNieOpcje}
        </PoleSelect>
        {stan.przezFalownik === "tak" && (
          <Pole label={t("UI-M12-BM-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscFalownikaPct")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="sprawnoscFalownika" />} />
        )}
        <Pole label={t("UI-M12-BM-POSIADANY")} unit="Ah" {...pole("posiadanyAh")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="posiadany" />} />
        <PoleSelect label={t("UI-M12-MED-ZAPAS")} value={stan.maZapasoweZrodlo} onChange={ustaw("maZapasoweZrodlo")} pomoc={<PomocPola ekran="urzadzenia-medyczne" pole="zapas" />}>
          {takNieOpcje}
        </PoleSelect>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-MED-W-UWAGA" : "UI-M12-MED-W-OK")}>
          <WynikGlowny>{t("UI-M12-MED-WYNIK", { ah: Math.ceil(v.minimalnyAh), doby: MINIMUM_DOB_MEDYCZNE })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-MED-ZUZYCIE", { wh: Math.round(v.zuzycieDobaWh) })}</p>
          {v.dobyPosiadany > 0 && <p className="mt-1 text-small">{t("UI-M12-MED-POSIADANY-WYNIK", { doby: r1(v.dobyPosiadany) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/systemy-podtrzymania-zycia" className="text-small underline">
        {t("UI-M12-MED-LINK-SURVIVAL")}
      </Link>
    </main>
  )
}

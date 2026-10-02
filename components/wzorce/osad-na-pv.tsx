"use client"

import type { ReactNode } from "react"
import type { CalcResult } from "@/lib/core/calc-result"
import { KAT_SPLUKIWANIE_MAX } from "@/lib/core/modules/pv/czystosc-i-snieg/constants"
import type { OsadNaPvResult } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import type { OsadNaPvInput } from "@/lib/core/modules/stress-test/osad-na-pv/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"

/**
 * Shared parts of the two deposit screens built on one engine (`stress-test/osad-na-pv`): Ekran 7 „Śnieg i
 * oblodzenie na PV” and Ekran 14 „Wieczna mgła i szadź” — the optional own numbers, the „what if” table and the
 * „co z tym zrobić” section (mitigation options with the energy break-even). Both screens keep the same field
 * keys in their help (`lib/i18n/pomoc/m07b-stress-test.ts`).
 */

export type EkranOsadu = "snieg-na-pv" | "szadz-na-pv"

/** Form state shared by both screens (strings, saved as the draft). `dni` / `pozostala` are the OPTIONAL overrides. */
export type StanOsadu = {
  produkcja: string
  dni: string
  pozostala: string
  powierzchnia: string
  kabelMoc: string
  kabelGodz: string
  foliaMoc: string
  foliaGodz: string
  automatMoc: string
  automatGodz: string
}

export const STAN_OSADU: StanOsadu = {
  produkcja: "",
  dni: "",
  pozostala: "",
  powierzchnia: "",
  kabelMoc: "",
  kabelGodz: "",
  foliaMoc: "",
  foliaGodz: "",
  automatMoc: "",
  automatGodz: "",
}

const liczba0 = (s: string) => (s.trim() === "" ? 0 : Number(s))
const liczbaNull = (s: string) => (s.trim() === "" ? null : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** The engine inputs that come from the shared part of the form. */
export function wejscieOsaduZeStanu(stan: StanOsadu): Pick<
  OsadNaPvInput,
  "produkcjaDobaKwh" | "dniWlasne" | "pozostalaWlasnaPct" | "powierzchniaM2" | "kabel" | "folia" | "automat"
> {
  return {
    produkcjaDobaKwh: liczba0(stan.produkcja),
    dniWlasne: liczbaNull(stan.dni),
    pozostalaWlasnaPct: liczbaNull(stan.pozostala),
    powierzchniaM2: liczba0(stan.powierzchnia),
    kabel: { mocWNaM2: liczba0(stan.kabelMoc), godziny: liczba0(stan.kabelGodz) },
    folia: { mocWNaM2: liczba0(stan.foliaMoc), godziny: liczba0(stan.foliaGodz) },
    automat: { mocW: liczba0(stan.automatMoc), godziny: liczba0(stan.automatGodz) },
  }
}

type Setter<S> = (aktualizator: (poprzedni: S) => S) => void

function polaLiczbowe<S extends StanOsadu>(stan: S, setStan: Setter<S>) {
  return (klucz: keyof StanOsadu) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
}

/** Daily production + the optional own numbers (the user does not have to know the days or the %). */
export function PolaProdukcjiIWlasne<S extends StanOsadu>({ ekran, stan, setStan }: { ekran: EkranOsadu; stan: S; setStan: Setter<S> }) {
  const t = useTranslate()
  const pole = polaLiczbowe(stan, setStan)
  return (
    <>
      <Pole label={t("UI-M7-OSAD-PRODUKCJA")} unit="kWh" {...pole("produkcja")} pomoc={<PomocPola ekran={ekran} pole="produkcja" />} />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{t("UI-M7-OSAD-WLASNE-TYTUL")}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-OSAD-WLASNE-OPIS")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-OSAD-DNI")} unit={t("UI-J-DNI")} {...pole("dni")} pomoc={<PomocPola ekran={ekran} pole="dni" />} />
          <Pole label={t("UI-M7-OSAD-POZOSTALA")} unit="%" max={100} {...pole("pozostala")} pomoc={<PomocPola ekran={ekran} pole="pozostala" />} />
        </div>
      </fieldset>
    </>
  )
}

/** The „what if” table: energy lost for 1, 3, 5, 7 days of cover (+ the source examples and the user's own days). */
export function TabelaCoJesli({ wynik, szadz }: { wynik: CalcResult<OsadNaPvResult>; szadz: boolean }) {
  const t = useTranslate()
  const v = wynik.value
  return (
    <div className="mt-2 flex flex-col gap-1">
      <p className="text-small font-medium">{t("UI-M7-OSAD-TAB-TYTUL")}</p>
      <p className="text-caption">
        {t("UI-M7-OSAD-TAB-PROCENT", {
          proc: r2(v.pozostalaProdukcjaPct),
          zrodlo: t(v.pozostalaZrodlo === "wlasna" ? "UI-M7-OSAD-TAB-ZRODLO-WLASNA" : "UI-M7-OSAD-TAB-ZRODLO-PRZYKLAD"),
        })}
      </p>
      <table className="w-full text-small">
        <thead>
          <tr className="text-left">
            <th className="font-medium">{t("UI-M7-OSAD-TAB-DNI")}</th>
            <th className="font-medium">{t("UI-M7-OSAD-TAB-STRATA")}</th>
            <th className="font-medium">{t("UI-M7-OSAD-TAB-POD")}</th>
          </tr>
        </thead>
        <tbody>
          {v.scenariusze.map((s) => (
            <tr key={s.dni}>
              <td>
                {r2(s.dni)}
                {s.przykladZrodla && <span className="text-caption"> ({t(szadz ? "UI-M7-OSAD-TAB-PRZYKLAD-SZADZ" : "UI-M7-OSAD-TAB-PRZYKLAD-SNIEG")})</span>}
                {s.wlasny && <span className="text-caption"> ({t("UI-M7-OSAD-TAB-WLASNY")})</span>}
              </td>
              <td>{r2(s.utrataKwh)}</td>
              <td>{r2(s.produkcjaPodOsademKwh)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type IdOpcji = "nachylenie" | "reczne" | "automat" | "kabel" | "folia"

/**
 * „Co z tym zrobić”: the five options side by side, the inputs of the active ones (datasheet power, hours, panel
 * area), the break-even tables and the recommendation (manual clearing and tilt first, heating only when it pays
 * back, on demand, from surplus or the generator — never from a low battery; warranty caution).
 */
export function SekcjaCoZTymZrobic<S extends StanOsadu>({
  ekran,
  stan,
  setStan,
  wynik,
}: {
  ekran: EkranOsadu
  stan: S
  setStan: Setter<S>
  wynik: CalcResult<OsadNaPvResult>
}) {
  const t = useTranslate()
  const pole = polaLiczbowe(stan, setStan)
  const aktywne = wynik.status === "INCOMPLETE" || wynik.status === "INVALID_INPUT" ? [] : wynik.value.opcjeAktywne
  const opcja = (id: IdOpcji, n: number, pola?: ReactNode) => (
    <li key={id} className="flex flex-col gap-1">
      <span className="font-medium">{`${n}. ${t(`UI-M7-OSAD-O-${id.toUpperCase()}`)}`}</span>
      <span className="text-muted-foreground">{t(`UI-M7-OSAD-O-${id.toUpperCase()}-OPIS`, { prog: KAT_SPLUKIWANIE_MAX })}</span>
      {pola}
    </li>
  )

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small font-medium">{t("UI-M7-OSAD-ZARADCZE-TYTUL")}</h2>
      <p className="text-caption text-muted-foreground">{t("UI-M7-OSAD-ZARADCZE-OPIS")}</p>
      <ul className="flex flex-col gap-3 text-small">
        {opcja("nachylenie", 1)}
        {opcja("reczne", 2)}
        {opcja(
          "automat",
          3,
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M7-OSAD-AUTOMAT-MOC")} unit="W" {...pole("automatMoc")} pomoc={<PomocPola ekran={ekran} pole="automatMoc" />} />
            <Pole label={t("UI-M7-OSAD-GODZINY")} unit="h" {...pole("automatGodz")} pomoc={<PomocPola ekran={ekran} pole="automatGodz" />} />
          </div>,
        )}
        {opcja(
          "kabel",
          4,
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M7-OSAD-MOC-M2")} unit="W/m²" {...pole("kabelMoc")} pomoc={<PomocPola ekran={ekran} pole="kabelMoc" />} />
            <Pole label={t("UI-M7-OSAD-GODZINY")} unit="h" {...pole("kabelGodz")} pomoc={<PomocPola ekran={ekran} pole="kabelGodz" />} />
          </div>,
        )}
        {opcja(
          "folia",
          5,
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M7-OSAD-MOC-M2")} unit="W/m²" {...pole("foliaMoc")} pomoc={<PomocPola ekran={ekran} pole="foliaMoc" />} />
            <Pole label={t("UI-M7-OSAD-GODZINY")} unit="h" {...pole("foliaGodz")} pomoc={<PomocPola ekran={ekran} pole="foliaGodz" />} />
          </div>,
        )}
      </ul>
      <Pole label={t("UI-M7-OSAD-POWIERZCHNIA")} unit="m²" {...pole("powierzchnia")} pomoc={<PomocPola ekran={ekran} pole="powierzchnia" />} />

      {aktywne.map((o) => (
        <div key={o.id} className="flex flex-col gap-1 text-small">
          <p className="font-medium">{t("UI-M7-OSAD-BILANS-TYTUL", { opcja: t(`UI-M7-OSAD-O-${o.id.toUpperCase()}`), kwh: r2(o.energiaKwh) })}</p>
          <table className="w-full text-small">
            <thead>
              <tr className="text-left">
                <th className="font-medium">{t("UI-M7-OSAD-TAB-DNI")}</th>
                <th className="font-medium">{t("UI-M7-OSAD-TAB-ODZYSK")}</th>
                <th className="font-medium">{t("UI-M7-OSAD-TAB-ZWRACA")}</th>
              </tr>
            </thead>
            <tbody>
              {o.wiersze.map((w) => (
                <tr key={w.dni}>
                  <td>{r2(w.dni)}</td>
                  <td>{r2(w.odzyskKwh)}</td>
                  <td>{t(w.oplaca ? "UI-M7-OSAD-ZWRACA-TAK" : "UI-M7-OSAD-ZWRACA-NIE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-caption">
            {o.progOplacalnosciDni === null
              ? t("UI-M7-OSAD-BILANS-NIGDY")
              : t("UI-M7-OSAD-BILANS-PROG", { dni: r2(o.progOplacalnosciDni) })}
          </p>
        </div>
      ))}

      <div className="flex flex-col gap-1 rounded-md border p-3 text-small">
        <p className="font-medium">{t("UI-M7-OSAD-REKOMENDACJA-TYTUL")}</p>
        <p>{t("UI-M7-OSAD-REKOMENDACJA")}</p>
        <p className="text-muted-foreground">{t("UI-M7-OSAD-GWARANCJA-UWAGA")}</p>
      </div>
    </section>
  )
}

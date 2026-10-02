"use client"

import { useMemo } from "react"
import type { Grupa, OkresRozliczeniowy, OsdId, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"
import { calculateRachunek } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import { STREFY_GRUPY } from "@/lib/core/modules/siec/rachunek-za-prad/constants"
import type { Fazy, RachunekInput, Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  ETYKIETA_SKLADNIKA,
  ETYKIETA_STREFY,
  GRUPY_DOM,
  GRUPY_FIRMA,
  PoleOsd,
  ZrodloDanych,
  czyOsdMaStawki,
  liczba,
  liczbaLubNull,
  nadpisanie,
  poziomWerdyktu,
  } from "./wspolne"
import { useZuzycieMiesieczne } from "./zuzycie-miesieczne"
import { useZl } from "@/lib/waluta/use-waluta"
import { useTranslate } from "@/lib/i18n/language-context"

type Strefowe = Partial<Record<Strefa, string>>

export type StanRachunku = {
  osd: OsdId
  grupa: Grupa
  rok: string
  fazy: Fazy
  mocUmownaKw: string
  okres: OkresRozliczeniowy
  zuzycie: Strefowe
  ceny: Strefowe
  handlowa: string
  energiaMocowa: string
  zFaktury: boolean
  wlZmienna: Strefowe
  wlStala: string
  wlAbonament: string
  wlJakosciowa: string
  wlOze: string
  wlKogeneracyjna: string
  wlMocowa: string
}

export const kluczRachunku = (segment: Segment) => `siec-rachunek-${segment}`

export function poczatkowyRachunek(segment: Segment): StanRachunku {
  return {
    osd: "tauron",
    grupa: segment === "dom" ? "G11" : "C11",
    rok: "2026",
    fazy: "trojfazowa",
    mocUmownaKw: "",
    okres: segment === "dom" ? "2" : "1",
    zuzycie: {},
    ceny: {},
    handlowa: "",
    energiaMocowa: "",
    zFaktury: false,
    wlZmienna: {},
    wlStala: "",
    wlAbonament: "",
    wlJakosciowa: "",
    wlOze: "",
    wlKogeneracyjna: "",
    wlMocowa: "",
  }
}

/** Strefowe → numbers only for the zones of the group; empty = not entered. */
function strefoweLiczby(s: Strefowe, strefy: Strefa[], puste: "pomin" | "zero"): Partial<Record<Strefa, number>> {
  const wynik: Partial<Record<Strefa, number>> = {}
  for (const z of strefy) {
    const v = s[z] ?? ""
    if (v !== "") wynik[z] = Number(v)
    else if (puste === "zero") wynik[z] = 0
  }
  return wynik
}

/**
 * Engine input from the D1/F1 draft — also used by the echo screens (D7/F8 read the bill through
 * `useOdczytDraftu`, never write it). Monthly consumption comes from D3/F6 when all 12 months exist.
 */
export function wejscieRachunku(segment: Segment, stan: StanRachunku, zuzycieMies: number[] | null): RachunekInput {
  const g = segment === "dom"
  const strefy = STREFY_GRUPY[stan.grupa]
  const pokazFaktura = stan.zFaktury || !czyOsdMaStawki(stan.osd)
  return {
    segment,
    osd: stan.osd,
    grupa: stan.grupa,
    dataRozliczenia: `${stan.rok === "" ? "0000" : stan.rok.padStart(4, "0")}-12-31`,
    fazy: stan.fazy,
    mocUmownaKw: liczba(stan.mocUmownaKw),
    okresRozliczeniowy: stan.okres,
    zuzycieStrefKwh: strefoweLiczby(stan.zuzycie, strefy, "zero"),
    zuzycieMiesieczneKwh: zuzycieMies,
    cenaEnergiiZlKwh: strefoweLiczby(stan.ceny, strefy, "pomin"),
    oplataHandlowaZlMies: liczbaLubNull(stan.handlowa),
    energiaMocowaKwh: g ? null : liczbaLubNull(stan.energiaMocowa),
    stawkiWlasne: pokazFaktura
      ? {
          sieciowaZmienna: strefoweLiczby(stan.wlZmienna, strefy, "pomin"),
          sieciowaStala: nadpisanie(stan.wlStala),
          abonamentZlMies: nadpisanie(stan.wlAbonament),
          jakosciowaZlKwh: nadpisanie(stan.wlJakosciowa),
          ozeZlKwh: nadpisanie(stan.wlOze),
          kogeneracyjnaZlKwh: nadpisanie(stan.wlKogeneracyjna),
          ...(g ? { mocowaGZlMies: nadpisanie(stan.wlMocowa) } : { mocowaCZlKwh: nadpisanie(stan.wlMocowa) }),
        }
      : {},
  }
}

/**
 * M14 — D1 „Mój rachunek dziś” (dom) / F1 „Mój rachunek dziś (C)” (firma): one form, segment as a
 * parameter (echo, D12/D20). Rates from the ✅ data file or from the invoice (D36).
 * 🔎 TD22 (`dlug-techniczny.md`): the settlement date is the 31.12 of the entered year. Monthly
 * consumption (TD22 pt 3, closed 28.09.2026) is read from D3/F6 when all 12 months are filled.
 */
export function FormularzRachunku({ segment }: { segment: Segment }) {
  const t = useTranslate()
  const zl = useZl()
  const [stan, setStan] = usePersistedDraft<StanRachunku>(kluczRachunku(segment), poczatkowyRachunek(segment))
  const { zuzycie: zuzycieMies } = useZuzycieMiesieczne(segment)
  const ustaw = <K extends keyof StanRachunku>(pole: K, v: StanRachunku[K]) => setStan((p) => ({ ...p, [pole]: v }))
  const ustawStrefe = (pole: "zuzycie" | "ceny" | "wlZmienna", z: Strefa, v: string) =>
    setStan((p) => ({ ...p, [pole]: { ...p[pole], [z]: v } }))

  const g = segment === "dom"
  const strefy = STREFY_GRUPY[stan.grupa]
  const maStawki = czyOsdMaStawki(stan.osd)
  const pokazFaktura = stan.zFaktury || !maStawki

  const result = useMemo(
    () => calculateRachunek(wejscieRachunku(segment, stan, zuzycieMies)),
    [segment, stan, zuzycieMies],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <>
      <div className="flex flex-col gap-4">
        <PoleOsd value={stan.osd} onChange={(osd) => ustaw("osd", osd)} />
        <PoleSelect
          label={t("UI-FORRAC-GRUPA-TARYFOWA")}
          value={stan.grupa}
          onChange={(e) => ustaw("grupa", e.target.value as Grupa)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="grupa" />}
        >
          {(g ? GRUPY_DOM : GRUPY_FIRMA).map((gr) => (
            <option key={gr} value={gr}>
              {gr}
            </option>
          ))}
        </PoleSelect>
        {g ? (
          <PoleSelect
            label={t("UI-FORRAC-PRZYLACZE")}
            value={stan.fazy}
            onChange={(e) => ustaw("fazy", e.target.value as Fazy)}
            pomoc={<PomocPola ekran="siec-rachunek" pole="przylacze" />}
          >
            <option value="jednofazowa">{t("UI-FORRAC-JEDNOFAZOWE")}</option>
            <option value="trojfazowa">{t("UI-FORRAC-TROJFAZOWE")}</option>
          </PoleSelect>
        ) : (
          <Pole
            label={t("UI-FORRAC-MOC-UMOWNA")}
            unit="kW"
            type="number"
            inputMode="decimal"
            value={stan.mocUmownaKw}
            onChange={(e) => ustaw("mocUmownaKw", e.target.value)}
            pomoc={<PomocPola ekran="siec-rachunek" pole="mocUmowna" />}
          />
        )}
        <Pole
          label={t("UI-FORRAC-ROK-ROZLICZENIA")}
          type="number"
          inputMode="numeric"
          value={stan.rok}
          onChange={(e) => ustaw("rok", e.target.value)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="rok" />}
        />
        <PoleSelect
          label={t("UI-FORRAC-OKRES-ROZLICZENIOWY")}
          value={stan.okres}
          onChange={(e) => ustaw("okres", e.target.value as OkresRozliczeniowy)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="okres" />}
        >
          <option value="1">{t("UI-FORRAC-MIESIAC")}</option>
          <option value="2">{t("UI-FORRAC-MIESIACE")}</option>
          <option value="6">{t("UI-FORRAC-MIESIECY")}</option>
          <option value="12">{t("UI-FORRAC-MIESIECY-2")}</option>
        </PoleSelect>

        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">{t("UI-FORRAC-ZUZYCIE-CENA-ENERGII")}</legend>
          {strefy.map((z) => (
            <div key={z} className="grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-FORRAC-ZUZYCIE", { p: t(ETYKIETA_STREFY[z]) })}
                unit={t("UI-J-KWH-ROK")}
                type="number"
                inputMode="decimal"
                value={stan.zuzycie[z] ?? ""}
                onChange={(e) => ustawStrefe("zuzycie", z, e.target.value)}
                pomoc={<PomocPola ekran="siec-rachunek" pole="zuzycieStrefy" />}
              />
              <Pole
                label={t("UI-FORRAC-CENA-ENERGII", { p: t(ETYKIETA_STREFY[z]) })}
                unit={t("UI-FORRAC-KWH-NETTO")}
                type="number"
                inputMode="decimal"
                value={stan.ceny[z] ?? ""}
                onChange={(e) => ustawStrefe("ceny", z, e.target.value)}
                pomoc={<PomocPola ekran="siec-rachunek" pole="cenaStrefy" />}
              />
            </div>
          ))}
          <Pole
            label={t("UI-FORRAC-OPLATA-HANDLOWA-SPRZEDAWCY")}
            unit={t("UI-FORRAC-MIES-NETTO")}
            type="number"
            inputMode="decimal"
            value={stan.handlowa}
            onChange={(e) => ustaw("handlowa", e.target.value)}
            pomoc={<PomocPola ekran="siec-rachunek" pole="handlowa" />}
          />
          {!g && (
            <Pole
              label={t("UI-FORRAC-ENERGIA-POBRANA-DNI")}
              unit={t("UI-J-KWH-ROK")}
              type="number"
              inputMode="decimal"
              value={stan.energiaMocowa}
              onChange={(e) => ustaw("energiaMocowa", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="energiaMocowa" />}
            />
          )}
        </fieldset>

        {maStawki && (
          <PoleCheckbox
            id={`siec-z-faktury-${segment}`}
            checked={stan.zFaktury}
            onChange={(e) => ustaw("zFaktury", e.target.checked)}
            label={t("UI-FORRAC-WPISZE-STAWKI-DYSTRYBUCYJNE")}
          />
        )}
        {pokazFaktura && (
          <fieldset className="flex flex-col gap-3 rounded-md border p-3">
            <legend className="px-1 text-small font-medium">{t("UI-FORRAC-MOJE-DANE-FAKTURY")}</legend>
            {strefy.map((z) => (
              <Pole
                key={z}
                label={t("UI-FORRAC-OPLATA-SIECIOWA-ZMIENNA", { p: t(ETYKIETA_STREFY[z]) })}
                unit={t("UI-J-ZL-KWH")}
                type="number"
                inputMode="decimal"
                value={stan.wlZmienna[z] ?? ""}
                onChange={(e) => ustawStrefe("wlZmienna", z, e.target.value)}
                pomoc={<PomocPola ekran="siec-rachunek" pole="siecZmienna" />}
              />
            ))}
            <Pole
              label={t("UI-FORRAC-OPLATA-SIECIOWA-STALA")}
              unit={g ? t("UI-J-ZL-MIES") : t("UI-FORRAC-MIES")}
              type="number"
              inputMode="decimal"
              value={stan.wlStala}
              onChange={(e) => ustaw("wlStala", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="siecStala" />}
            />
            <Pole
              label={t("UI-FORRAC-OPLATA-ABONAMENTOWA")}
              unit={t("UI-J-ZL-MIES")}
              type="number"
              inputMode="decimal"
              value={stan.wlAbonament}
              onChange={(e) => ustaw("wlAbonament", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="abonament" />}
            />
            <Pole
              label={t("UI-FORRAC-STAWKA-JAKOSCIOWA")}
              unit={t("UI-J-ZL-KWH")}
              type="number"
              inputMode="decimal"
              value={stan.wlJakosciowa}
              onChange={(e) => ustaw("wlJakosciowa", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="jakosciowa" />}
            />
            <Pole
              label={t("UI-FORRAC-OPLATA-OZE")}
              unit={t("UI-J-ZL-KWH")}
              type="number"
              inputMode="decimal"
              value={stan.wlOze}
              onChange={(e) => ustaw("wlOze", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="oze" />}
            />
            <Pole
              label={t("UI-FORRAC-OPLATA-KOGENERACYJNA")}
              unit={t("UI-J-ZL-KWH")}
              type="number"
              inputMode="decimal"
              value={stan.wlKogeneracyjna}
              onChange={(e) => ustaw("wlKogeneracyjna", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="kogeneracyjna" />}
            />
            <Pole
              label={t("UI-FORRAC-OPLATA-MOCOWA")}
              unit={g ? t("UI-J-ZL-MIES") : t("UI-J-ZL-KWH")}
              type="number"
              inputMode="decimal"
              value={stan.wlMocowa}
              onChange={(e) => ustaw("wlMocowa", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="mocowa" />}
            />
          </fieldset>
        )}
      </div>

      <ZrodloDanych>
        {zuzycieMies
          ? t("UI-FORRAC-STAWKI-ZMIENNE-CIAGU")
          : t("UI-FORRAC-WPISANIU-MIESIECY-ZUZYCIA")}
      </ZrodloDanych>

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-FORRAC-BRAKUJE-DANYCH-NIC")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-FORRAC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null && (
          <WerdyktPanel poziom={poziom} etykieta={t("UI-FORRAC-MOJ-RACHUNEK-ROCZNY")}>
            <WynikGlowny>{t("UI-FORRAC-BRUTTO-ROK", { bruttoZl: zl(v.bruttoZl) })}</WynikGlowny>
            <p className="mt-1 text-small">
              {t("UI-FORRAC-NETTO-VAT-SREDNIO", { nettoZl: zl(v.nettoZl), vatZl: zl(v.vatZl), sredniaCenaKwhBruttoZl: v.sredniaCenaKwhBruttoZl.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) })}
            </p>
            <p className="mt-2 text-small font-medium">
              {t("UI-FORRAC-CENA-TRZYMANIA-SIECI", { cenaTrzymaniaSieciBruttoZl: zl(v.cenaTrzymaniaSieciBruttoZl), zmienneNettoZl: zl(v.zmienneNettoZl) })}
            </p>
            <table className="mt-3 w-full text-small">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-normal">{t("UI-FORRAC-SKLADNIK")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-FORRAC-NETTO-ROK")}</th>
                  <th className="py-1 pl-2 font-normal">{t("UI-FORRAC-CHARAKTER")}</th>
                </tr>
              </thead>
              <tbody>
                {v.skladniki.map((s) => (
                  <tr key={s.kod} className="border-t">
                    <td className="py-1">
                      {t(ETYKIETA_SKLADNIKA[s.kod])}
                      {s.zrodlo === "faktura" && s.kod !== "energia" && s.kod !== "handlowa" && (
                        <span className="text-muted-foreground"> {t("UI-FORRAC-FAKTURY")}</span>
                      )}
                    </td>
                    <td className="py-1 text-right tabular-nums">{zl(s.kwotaNettoZl, 2)}</td>
                    <td className="py-1 pl-2">{s.charakter === "staly" ? t("UI-FORRAC-STALY") : t("UI-FORRAC-ZMIENNY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </>
  )
}

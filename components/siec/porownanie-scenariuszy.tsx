"use client"

import Link from "next/link"
import { useMemo } from "react"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { isComputed } from "@/lib/core/calc-result"
import { calculateRachunek } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { calculateScenariuszePrzejscia } from "@/lib/core/modules/siec/scenariusze-przejscia/calculator"
import { OPIS_SCENARIUSZA, SCENARIUSZE } from "@/lib/core/modules/siec/scenariusze-przejscia/constants"
import type { IdScenariusza, ParametryScenariusza } from "@/lib/core/modules/siec/scenariusze-przejscia/input"
import { HORYZONT_DOMYSLNY_LAT } from "@/lib/core/modules/siec/sciezka-cen-energii/constants"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { type StanRachunku, kluczRachunku, wejscieRachunku } from "./formularz-rachunku"
import { POCZATKOWY_WZROSTU, PoleWzrostuCen, type StanWzrostuCen, trybZeStanu } from "./pole-wzrostu-cen"
import { type StanPvMagazynu, kluczPv } from "./pv-magazyn"
import { uzyskZeStanu } from "./uzysk-pv"
import { liczbaLubNull, poziomWerdyktu, zl } from "./wspolne"
import { useZuzycieMiesieczne } from "./zuzycie-miesieczne"
import { useTranslate } from "@/lib/i18n/language-context"

type StanScenariusza = { inwestycja: string; dotacja: string; moc: string; pojemnosc: string; kosztMagazynu: string; serwis: string }

type Stan = {
  horyzont: string
  wzrost: StanWzrostuCen
  stopa: string
  kosztStaly: string
  cenaZmienna: string
  wartoscNadwyzki: string
  zywotnosc: string
  agregatMoc: string
  agregatLH: string
  paliwo: string
  scen: Record<IdScenariusza, StanScenariusza>
  osobyZalezne: "" | "tak" | "nie"
  zapasRedundantny: boolean
  prog: string
  czasBezZasilania: string
  potwierdzamD: boolean
}

const PUSTY_SCEN: StanScenariusza = { inwestycja: "", dotacja: "", moc: "", pojemnosc: "", kosztMagazynu: "", serwis: "" }

const POCZATKOWY: Stan = {
  horyzont: String(HORYZONT_DOMYSLNY_LAT),
  wzrost: POCZATKOWY_WZROSTU,
  stopa: "0",
  kosztStaly: "",
  cenaZmienna: "",
  wartoscNadwyzki: "",
  zywotnosc: "",
  agregatMoc: "",
  agregatLH: "",
  paliwo: "",
  scen: { A: PUSTY_SCEN, B: PUSTY_SCEN, C: PUSTY_SCEN, D: PUSTY_SCEN },
  osobyZalezne: "",
  zapasRedundantny: false,
  prog: "",
  czasBezZasilania: "",
  potwierdzamD: false,
}

/** Translation keys (`t()`). */
const NAZWA: Record<IdScenariusza, string> = {
  A: "UI-SCEN-NAZWA-A",
  B: "UI-SCEN-NAZWA-B",
  C: "UI-SCEN-NAZWA-C",
  D: "UI-SCEN-NAZWA-D",
}

const ROK_BAZOWY = Number(DANE_ROZLICZEN.stanNa.slice(0, 4))
const num = (s: string) => (s === "" ? 0 : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/**
 * M14 — D7 „Porównanie scenariuszy A–D” (dom) / F8 (firma, with RF1), Wzorzec G. Echo of D1/F1
 * (grid costs), D3/F6 (12 months) and D4/F6 (PV yield, self-consumption, storage efficiency);
 * never writes their drafts. Always the full A–D table — never one „best” verdict.
 */
export function PorownanieScenariuszy({ segment }: { segment: Segment }) {
  const t = useTranslate()
  const firma = segment === "firma"
  const [stan, setStan] = usePersistedDraft<Stan>(`siec-scenariusze-${segment}`, POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const ustawScen = (id: IdScenariusza, z: Partial<StanScenariusza>) =>
    setStan((p) => ({ ...p, scen: { ...p.scen, [id]: { ...p.scen[id], ...z } } }))

  const { zuzycie, wczytano: w1 } = useZuzycieMiesieczne(segment)
  const { dane: pv, wczytano: w2 } = useOdczytDraftu<StanPvMagazynu>(kluczPv(segment))
  const { dane: rachunekStan, wczytano: w3 } = useOdczytDraftu<StanRachunku>(kluczRachunku(segment))

  // Echo D1/F1: fixed part = „cena trzymania sieci”, variable brutto per kWh = (brutto − fixed) / kWh.
  const echoRachunku = useMemo(() => {
    if (!rachunekStan) return null
    const r = calculateRachunek(wejscieRachunku(segment, rachunekStan, zuzycie))
    if (!isComputed(r.status) || r.value.zuzycieRoczneKwh <= 0) return null
    return {
      staly: r.value.cenaTrzymaniaSieciBruttoZl,
      zmienna: (r.value.bruttoZl - r.value.cenaTrzymaniaSieciBruttoZl) / r.value.zuzycieRoczneKwh,
    }
  }, [rachunekStan, segment, zuzycie])

  const uzysk = uzyskZeStanu(pv?.uzysk)
  const pvMoc = pv?.mocPvKwp ? Number(pv.mocPvKwp) : 0
  const pvPojemnosc = pv?.pojemnoscKwh ? Number(pv.pojemnoscKwh) : 0

  const result = useMemo(() => {
    const parametry = (id: IdScenariusza): ParametryScenariusza => {
      const s = stan.scen[id]
      return {
        inwestycjaZl: liczbaLubNull(s.inwestycja),
        dotacjaZl: num(s.dotacja),
        mocPvKwp: s.moc === "" ? pvMoc : Number(s.moc),
        pojemnoscMagazynuKwh: id === "A" ? 0 : s.pojemnosc === "" ? pvPojemnosc : Number(s.pojemnosc),
        kosztMagazynuZl: id === "A" ? 0 : num(s.kosztMagazynu),
        serwisRokZl: num(s.serwis),
      }
    }
    return calculateScenariuszePrzejscia({
      segment,
      rokBazowy: ROK_BAZOWY,
      horyzontLat: num(stan.horyzont),
      tryb: trybZeStanu(stan.wzrost),
      stopaDyskontowaProcent: num(stan.stopa),
      zuzycieMiesieczneKwh: zuzycie ?? [],
      uzyskMiesiecznyKwhNaKwp: uzysk ?? [],
      autokonsumpcjaBezposrednia: pv?.autokonsumpcjaProcent ? Number(pv.autokonsumpcjaProcent) / 100 : null,
      sprawnoscMagazynu: pv?.sprawnoscProcent ? Number(pv.sprawnoscProcent) / 100 : null,
      zywotnoscMagazynuLat: liczbaLubNull(stan.zywotnosc),
      siec: {
        kosztStalyRokBruttoZl: stan.kosztStaly !== "" ? Number(stan.kosztStaly) : (echoRachunku?.staly ?? null),
        cenaZmiennaKwhBruttoZl: stan.cenaZmienna !== "" ? Number(stan.cenaZmienna) : (echoRachunku?.zmienna ?? null),
        wartoscNadwyzkiKwhZl: liczbaLubNull(stan.wartoscNadwyzki),
      },
      agregat: { mocKw: num(stan.agregatMoc), zuzycieLH: liczbaLubNull(stan.agregatLH), cenaPaliwaZlL: liczbaLubNull(stan.paliwo) },
      scenariusze: { A: parametry("A"), B: parametry("B"), C: parametry("C"), D: parametry("D") },
      kontrola: {
        osobyZalezneOdZasilania: stan.osobyZalezne === "" ? null : stan.osobyZalezne === "tak",
        zapasRedundantny: stan.zapasRedundantny,
        progGodzinAgregatuMies: liczbaLubNull(stan.prog),
        dopuszczalnyCzasBezZasilaniaH: liczbaLubNull(stan.czasBezZasilania),
      },
    })
  }, [stan, segment, zuzycie, uzysk, pv, pvMoc, pvPojemnosc, echoRachunku])

  if (!w1 || !w2 || !w3) return <StanLadowania linie={8} />
  const brakZrodel = !zuzycie || !uzysk
  const v = result.value
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const inflacja = v?.inflacjaProcent != null

  return (
    <>
      {brakZrodel && (
        <StanPusty tytul={t("UI-SCEN-NAJPIERW")}>
          {firma ? (
            <Link className="underline" href="/kalkulatory/pv-w-firmie">
              {t("UI-SIEC-LINK-PV-FIRMA")}
            </Link>
          ) : (
            <>
              <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
                {t("UI-SIEC-LINK-ZUZYCIE")}
              </Link>{" "}
              ·{" "}
              <Link className="underline" href="/kalkulatory/pv-i-magazyn">
                {t("UI-SIEC-LINK-PV-DOM")}
              </Link>
            </>
          )}
        </StanPusty>
      )}

      <PoleWzrostuCen
        stan={stan.wzrost}
        onChange={(z) => ustaw({ wzrost: { ...stan.wzrost, ...z } })}
        rokBazowy={ROK_BAZOWY}
        horyzontLat={num(stan.horyzont)}
      />

      <SekcjaAkordeon tytul={t("UI-SCEN-SIEC-HORYZONT")}>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-SCEN-HORYZONT")}
            unit={t("UI-J-LAT")}
            type="number"
            inputMode="numeric"
            min={10}
            max={25}
            value={stan.horyzont}
            onChange={(e) => ustaw({ horyzont: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="horyzont" />}
          />
          <Pole
            label={t("UI-SCEN-STOPA")}
            unit={t("UI-J-PROC-ROK")}
            type="number"
            inputMode="decimal"
            value={stan.stopa}
            onChange={(e) => ustaw({ stopa: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="stopa" />}
          />
          <Pole
            label={t("UI-SCEN-CENA-TRZYMANIA")}
            unit={t("UI-J-ZL-ROK")}
            type="number"
            inputMode="decimal"
            value={stan.kosztStaly}
            placeholder={echoRachunku ? f0(echoRachunku.staly) : ""}
            onChange={(e) => ustaw({ kosztStaly: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="cenaSieci" />}
          />
          <Pole
            label={t("UI-SCEN-KOSZT-ZMIENNY")}
            unit={t("UI-J-ZL-KWH")}
            type="number"
            inputMode="decimal"
            value={stan.cenaZmienna}
            placeholder={echoRachunku ? echoRachunku.zmienna.toFixed(2) : ""}
            onChange={(e) => ustaw({ cenaZmienna: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="kosztKwh" />}
          />
          <Pole
            label={t("UI-SCEN-WARTOSC-ODDANEJ")}
            unit={t("UI-J-ZL-KWH")}
            type="number"
            inputMode="decimal"
            value={stan.wartoscNadwyzki}
            onChange={(e) => ustaw({ wartoscNadwyzki: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="wartoscOddanej" />}
          />
          <Pole
            label={t("UI-SCEN-ZYWOTNOSC")}
            unit={t("UI-J-LAT")}
            type="number"
            inputMode="decimal"
            value={stan.zywotnosc}
            onChange={(e) => ustaw({ zywotnosc: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="zywotnosc" />}
          />
        </div>
        <p className="text-small text-muted-foreground">
          {t("UI-SCEN-DOMYSLNIE", {
            ekran: t(firma ? "UI-SCEN-EKRAN-PV-FIRMA" : "UI-SCEN-EKRAN-PV-DOM"),
            moc: f0(pvMoc),
            pojemnosc: f0(pvPojemnosc),
          })}
        </p>
      </SekcjaAkordeon>

      {SCENARIUSZE.map((id) => (
        <SekcjaAkordeon key={id} tytul={t(NAZWA[id])}>
          <div className="grid grid-cols-2 gap-3">
            <Pole
              label={t("UI-SCEN-INWESTYCJA")}
              unit={t("UI-J-ZL")}
              type="number"
              inputMode="decimal"
              value={stan.scen[id].inwestycja}
              onChange={(e) => ustawScen(id, { inwestycja: e.target.value })}
              pomoc={<PomocPola ekran="siec-scenariusze" pole="inwestycja" />}
            />
            <Pole
              label={t("UI-SCEN-DOTACJA")}
              unit={t("UI-J-ZL")}
              type="number"
              inputMode="decimal"
              value={stan.scen[id].dotacja}
              onChange={(e) => ustawScen(id, { dotacja: e.target.value })}
              pomoc={<PomocPola ekran="siec-scenariusze" pole="dotacja" />}
            />
            <Pole
              label={t("UI-SCEN-MOC-PV")}
              unit="kWp"
              type="number"
              inputMode="decimal"
              value={stan.scen[id].moc}
              placeholder={String(pvMoc)}
              onChange={(e) => ustawScen(id, { moc: e.target.value })}
              pomoc={<PomocPola ekran="siec-scenariusze" pole="mocPv" />}
            />
            {id !== "A" && (
              <>
                <Pole
                  label={t("UI-SCEN-MAGAZYN")}
                  unit="kWh"
                  type="number"
                  inputMode="decimal"
                  value={stan.scen[id].pojemnosc}
                  placeholder={String(pvPojemnosc)}
                  onChange={(e) => ustawScen(id, { pojemnosc: e.target.value })}
                  pomoc={<PomocPola ekran="siec-scenariusze" pole="magazyn" />}
                />
                <Pole
                  label={t("UI-SCEN-KOSZT-MAGAZYNU")}
                  unit={t("UI-J-ZL")}
                  type="number"
                  inputMode="decimal"
                  value={stan.scen[id].kosztMagazynu}
                  onChange={(e) => ustawScen(id, { kosztMagazynu: e.target.value })}
                  pomoc={<PomocPola ekran="siec-scenariusze" pole="kosztMagazynu" />}
                />
              </>
            )}
            <Pole
              label={t("UI-SCEN-SERWIS")}
              unit={t("UI-J-ZL-ROK")}
              type="number"
              inputMode="decimal"
              value={stan.scen[id].serwis}
              onChange={(e) => ustawScen(id, { serwis: e.target.value })}
              pomoc={<PomocPola ekran="siec-scenariusze" pole="serwis" />}
            />
          </div>
          {id === "D" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-SCEN-AGREGAT-MOC")}
                unit="kW"
                type="number"
                inputMode="decimal"
                value={stan.agregatMoc}
                onChange={(e) => ustaw({ agregatMoc: e.target.value })}
                pomoc={<PomocPola ekran="siec-scenariusze" pole="agregatMoc" />}
              />
              <Pole
                label={t("UI-SCEN-ZUZYCIE-PALIWA")}
                unit="l/h"
                type="number"
                inputMode="decimal"
                value={stan.agregatLH}
                onChange={(e) => ustaw({ agregatLH: e.target.value })}
                pomoc={<PomocPola ekran="siec-scenariusze" pole="paliwoZuzycie" />}
              />
              <Pole
                label={t("UI-SCEN-CENA-PALIWA")}
                unit={t("UI-J-ZL-L")}
                type="number"
                inputMode="decimal"
                value={stan.paliwo}
                onChange={(e) => ustaw({ paliwo: e.target.value })}
                pomoc={<PomocPola ekran="siec-scenariusze" pole="paliwoCena" />}
              />
              <Pole
                label={t("UI-SCEN-PROG-AGREGATU")}
                unit={t("UI-J-H-MIES")}
                type="number"
                inputMode="decimal"
                value={stan.prog}
                onChange={(e) => ustaw({ prog: e.target.value })}
                pomoc={<PomocPola ekran="siec-scenariusze" pole="progAgregatu" />}
              />
            </div>
          )}
          {OPIS_SCENARIUSZA[id].wyspa && id === "C" && (
            <p className="mt-2 text-small text-muted-foreground">{t("UI-SCEN-OPIS-C")}</p>
          )}
        </SekcjaAkordeon>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-SCEN-PYTANIA-KONTROLNE")}</h2>
        <PoleSelect
          label={t("UI-SCEN-MEDYCZNY")}
          value={stan.osobyZalezne}
          onChange={(e) => ustaw({ osobyZalezne: e.target.value as Stan["osobyZalezne"] })}
          pomoc={<PomocPola ekran="siec-scenariusze" pole="medyczny" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="nie">{t("UI-NIE")}</option>
          <option value="tak">{t("UI-TAK")}</option>
        </PoleSelect>
        <PoleCheckbox id={`siec-zapas-${segment}`} checked={stan.zapasRedundantny} onChange={(e) => ustaw({ zapasRedundantny: e.target.checked })} label={t("UI-SCEN-ZAPAS-REDUNDANTNY")} />
        {firma && (
          <Pole
            label={t("UI-SCEN-CZAS-BEZ-ZASILANIA")}
            unit="h"
            type="number"
            inputMode="decimal"
            value={stan.czasBezZasilania}
            onChange={(e) => ustaw({ czasBezZasilania: e.target.value })}
            pomoc={<PomocPola ekran="siec-scenariusze" pole="czasBezZasilania" />}
          />
        )}
      </section>

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-SIEC-BRAK-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE" || !v ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-SIEC-NIE-DA-SIE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziom ?? "ok"} etykieta={t("UI-SCEN-NA-LAT", { lat: stan.horyzont })}>
          <p className="text-small">
            <strong>{t("UI-SCEN-NAJTANSZY")}</strong> {v.najtanszy ? t(NAZWA[v.najtanszy]) : "—"}.{" "}
            <strong>{t("UI-SCEN-NAJBARDZIEJ-NIEZALEZNY")}</strong>{" "}
            {v.najbardziejNiezalezny ? t(NAZWA[v.najbardziejNiezalezny]) : "—"}. {t("UI-SCEN-DWIE-ODPOWIEDZI")}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-small tabular-nums">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-normal">{t("UI-SCEN-TH-SCEN")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-INWESTYCJA")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-KOSZT-ROK1")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-TCO")}</th>
                  {inflacja && <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-ZAPLACISZ")}</th>}
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-ZWROT")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-WLASNA")}</th>
                  <th className="py-1 text-right font-normal">{t("UI-SCEN-TH-AGREGAT")}</th>
                  <th className="py-1 pl-2 font-normal">{t("UI-SCEN-TH-ODWRACALNOSC")}</th>
                </tr>
              </thead>
              <tbody>
                {v.scenariusze.map((s) => {
                  const ukryj = s.id === "D" && !stan.potwierdzamD
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="py-1 font-medium">{s.id}</td>
                      <td className="py-1 text-right">{zl(s.inwestycjaNettoZl)}</td>
                      <td className="py-1 text-right">{zl(s.kosztRok1Zl)}</td>
                      <td className="py-1 text-right">{ukryj ? t("UI-SCEN-POTWIERDZ") : zl(s.tcoDzisiejszeZl)}</td>
                      {inflacja && <td className="py-1 text-right">{ukryj ? "—" : zl(s.tcoNominalneZl)}</td>}
                      <td className="py-1 text-right">{s.id === "A"
                          ? "—"
                          : s.okresZwrotuLat === null
                            ? t("UI-SCEN-PONAD-LAT", { lat: stan.horyzont })
                            : t("UI-SCEN-LAT", { lat: s.okresZwrotuLat })}</td>
                      <td className="py-1 text-right">{Math.round(s.pokrycieWlasne * 100)}%</td>
                      <td className="py-1 text-right">{s.id === "D"
                          ? t("UI-SCEN-GODZINY-AGREGATU", { rok: f0(s.godzinyAgregatuRok), mies: f0(s.godzinyAgregatuMaxMies) })
                          : "—"}</td>
                      <td className="py-1 pl-2">{s.odwracalny ? t("UI-SCEN-ODWR-PELNA") : t("UI-SCEN-ODWR-NIE")}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {v.scenariusze.some((s) => s.id === "D") && (
            <PoleCheckbox
              id={`siec-potwierdz-d-${segment}`}
              className="mt-3"
              checked={stan.potwierdzamD}
              onChange={(e) => ustaw({ potwierdzamD: e.target.checked })}
              label={t("UI-SCEN-POTWIERDZ-D")}
            />
          )}
          <p className="mt-2 text-small text-muted-foreground">
            {t("UI-SCEN-WYMIANY")}{" "}
            {v.scenariusze
              .filter((s) => s.wymianyMagazynu.length > 0)
              .map((s) => t("UI-SCEN-WYMIANA-W-ROKU", { scen: s.id, lata: s.wymianyMagazynu.join(", ") }))
              .join("; ") || t("UI-SCEN-BRAK-WYMIAN")}
            {t("UI-SCEN-DALEJ")}{" "}
            <Link className="underline" href="/kalkulatory/ryzyka-odlaczenia">
              {t("UI-SIEC-LINK-RYZYKA")}
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
              {t("UI-SIEC-LINK-PROCEDURA")}
            </Link>
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}

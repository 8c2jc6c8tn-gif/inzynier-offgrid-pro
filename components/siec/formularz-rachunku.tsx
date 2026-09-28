"use client"

import { useMemo } from "react"
import type { Grupa, OkresRozliczeniowy, OsdId, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"
import { calculateRachunek } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import { STREFY_GRUPY } from "@/lib/core/modules/siec/rachunek-za-prad/constants"
import type { Fazy, Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
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
  zl,
} from "./wspolne"

type Strefowe = Partial<Record<Strefa, string>>

type Stan = {
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

function poczatkowy(segment: Segment): Stan {
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
 * M14 — D1 „Mój rachunek dziś” (dom) / F1 „Mój rachunek dziś (C)” (firma): one form, segment as a
 * parameter (echo, D12/D20). Rates from the ✅ data file or from the invoice (D36).
 * 🔎 TD22 (`dlug-techniczny.md`): no monthly consumption field yet (the engine supports it) and the
 * settlement date is the 31.12 of the entered year.
 */
export function FormularzRachunku({ segment }: { segment: Segment }) {
  const [stan, setStan] = usePersistedDraft<Stan>(`siec-rachunek-${segment}`, poczatkowy(segment))
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))
  const ustawStrefe = (pole: "zuzycie" | "ceny" | "wlZmienna", z: Strefa, v: string) =>
    setStan((p) => ({ ...p, [pole]: { ...p[pole], [z]: v } }))

  const g = segment === "dom"
  const strefy = STREFY_GRUPY[stan.grupa]
  const maStawki = czyOsdMaStawki(stan.osd)
  const pokazFaktura = stan.zFaktury || !maStawki

  const result = useMemo(
    () =>
      calculateRachunek({
        segment,
        osd: stan.osd,
        grupa: stan.grupa,
        dataRozliczenia: `${stan.rok === "" ? "0000" : stan.rok.padStart(4, "0")}-12-31`,
        fazy: stan.fazy,
        mocUmownaKw: liczba(stan.mocUmownaKw),
        okresRozliczeniowy: stan.okres,
        zuzycieStrefKwh: strefoweLiczby(stan.zuzycie, strefy, "zero"),
        zuzycieMiesieczneKwh: null,
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
      }),
    [segment, stan, strefy, g, pokazFaktura],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <>
      <div className="flex flex-col gap-4">
        <PoleOsd value={stan.osd} onChange={(osd) => ustaw("osd", osd)} />
        <PoleSelect label="Grupa taryfowa" value={stan.grupa} onChange={(e) => ustaw("grupa", e.target.value as Grupa)}>
          {(g ? GRUPY_DOM : GRUPY_FIRMA).map((gr) => (
            <option key={gr} value={gr}>
              {gr}
            </option>
          ))}
        </PoleSelect>
        {g ? (
          <PoleSelect label="Przyłącze" value={stan.fazy} onChange={(e) => ustaw("fazy", e.target.value as Fazy)}>
            <option value="jednofazowa">jednofazowe</option>
            <option value="trojfazowa">trójfazowe</option>
          </PoleSelect>
        ) : (
          <Pole
            label="Moc umowna"
            unit="kW"
            type="number"
            inputMode="decimal"
            value={stan.mocUmownaKw}
            onChange={(e) => ustaw("mocUmownaKw", e.target.value)}
            hint="C11/C12a/C12b do 40 kW, C21/C22a/C22b powyżej 40 kW."
          />
        )}
        <Pole
          label="Rok rozliczenia"
          type="number"
          inputMode="numeric"
          value={stan.rok}
          onChange={(e) => ustaw("rok", e.target.value)}
          hint="Stawki w aplikacji dotyczą 2026 r. Dla innego roku wpiszesz je z faktury."
        />
        <PoleSelect
          label="Okres rozliczeniowy"
          value={stan.okres}
          onChange={(e) => ustaw("okres", e.target.value as OkresRozliczeniowy)}
          hint="Od niego zależy opłata abonamentowa. Prosument jest rozliczany co 1 miesiąc."
        >
          <option value="1">co 1 miesiąc</option>
          <option value="2">co 2 miesiące</option>
          <option value="6">co 6 miesięcy</option>
          <option value="12">co 12 miesięcy</option>
        </PoleSelect>

        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">Zużycie i cena energii (z faktur)</legend>
          {strefy.map((z) => (
            <div key={z} className="grid grid-cols-2 gap-3">
              <Pole
                label={`Zużycie — ${ETYKIETA_STREFY[z]}`}
                unit="kWh/rok"
                type="number"
                inputMode="decimal"
                value={stan.zuzycie[z] ?? ""}
                onChange={(e) => ustawStrefe("zuzycie", z, e.target.value)}
              />
              <Pole
                label={`Cena energii — ${ETYKIETA_STREFY[z]}`}
                unit="zł/kWh netto"
                type="number"
                inputMode="decimal"
                value={stan.ceny[z] ?? ""}
                onChange={(e) => ustawStrefe("ceny", z, e.target.value)}
              />
            </div>
          ))}
          <Pole
            label="Opłata handlowa sprzedawcy"
            unit="zł/mies. netto"
            type="number"
            inputMode="decimal"
            value={stan.handlowa}
            onChange={(e) => ustaw("handlowa", e.target.value)}
            hint="Wpisz 0, jeśli na fakturze jej nie ma."
          />
          {!g && (
            <Pole
              label="Energia pobrana w dni robocze 7:00–22:00"
              unit="kWh/rok"
              type="number"
              inputMode="decimal"
              value={stan.energiaMocowa}
              onChange={(e) => ustaw("energiaMocowa", e.target.value)}
              hint="Od niej liczona jest opłata mocowa firmy. Z faktury albo portalu pomiarowego OSD."
            />
          )}
        </fieldset>

        {maStawki && (
          <PoleCheckbox
            id={`siec-z-faktury-${segment}`}
            checked={stan.zFaktury}
            onChange={(e) => ustaw("zFaktury", e.target.checked)}
            label="Wpiszę stawki dystrybucyjne z mojej faktury (puste pole = stawka z taryfy 2026)"
          />
        )}
        {pokazFaktura && (
          <fieldset className="flex flex-col gap-3 rounded-md border p-3">
            <legend className="px-1 text-small font-medium">Moje dane z faktury (netto)</legend>
            {strefy.map((z) => (
              <Pole
                key={z}
                label={`Opłata sieciowa zmienna — ${ETYKIETA_STREFY[z]}`}
                unit="zł/kWh"
                type="number"
                inputMode="decimal"
                value={stan.wlZmienna[z] ?? ""}
                onChange={(e) => ustawStrefe("wlZmienna", z, e.target.value)}
              />
            ))}
            <Pole
              label="Opłata sieciowa stała"
              unit={g ? "zł/mies." : "zł/kW/mies."}
              type="number"
              inputMode="decimal"
              value={stan.wlStala}
              onChange={(e) => ustaw("wlStala", e.target.value)}
            />
            <Pole
              label="Opłata abonamentowa"
              unit="zł/mies."
              type="number"
              inputMode="decimal"
              value={stan.wlAbonament}
              onChange={(e) => ustaw("wlAbonament", e.target.value)}
            />
            <Pole
              label="Stawka jakościowa"
              unit="zł/kWh"
              type="number"
              inputMode="decimal"
              value={stan.wlJakosciowa}
              onChange={(e) => ustaw("wlJakosciowa", e.target.value)}
            />
            <Pole
              label="Opłata OZE"
              unit="zł/kWh"
              type="number"
              inputMode="decimal"
              value={stan.wlOze}
              onChange={(e) => ustaw("wlOze", e.target.value)}
            />
            <Pole
              label="Opłata kogeneracyjna"
              unit="zł/kWh"
              type="number"
              inputMode="decimal"
              value={stan.wlKogeneracyjna}
              onChange={(e) => ustaw("wlKogeneracyjna", e.target.value)}
            />
            <Pole
              label="Opłata mocowa"
              unit={g ? "zł/mies." : "zł/kWh"}
              type="number"
              inputMode="decimal"
              value={stan.wlMocowa}
              onChange={(e) => ustaw("wlMocowa", e.target.value)}
            />
          </fieldset>
        )}
      </div>

      <ZrodloDanych />

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta="Brakuje danych — nic nie zgadujemy">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null && (
          <WerdyktPanel poziom={poziom} etykieta="Mój rachunek roczny">
            <WynikGlowny>{zl(v.bruttoZl)} brutto / rok</WynikGlowny>
            <p className="mt-1 text-small">
              Netto {zl(v.nettoZl)} + VAT {zl(v.vatZl)}. Średnio {v.sredniaCenaKwhBruttoZl.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} zł
              za 1 kWh brutto.
            </p>
            <p className="mt-2 text-small font-medium">
              „Cena trzymania sieci”: {zl(v.cenaTrzymaniaSieciBruttoZl)} brutto / rok — tyle kosztuje samo posiadanie
              przyłącza, nawet przy zużyciu bliskim zera. PV i magazyn obniżają tylko część zmienną (
              {zl(v.zmienneNettoZl)} netto).
            </p>
            <table className="mt-3 w-full text-small">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-normal">Składnik</th>
                  <th className="py-1 text-right font-normal">Netto / rok</th>
                  <th className="py-1 pl-2 font-normal">Charakter</th>
                </tr>
              </thead>
              <tbody>
                {v.skladniki.map((s) => (
                  <tr key={s.kod} className="border-t">
                    <td className="py-1">
                      {ETYKIETA_SKLADNIKA[s.kod]}
                      {s.zrodlo === "faktura" && s.kod !== "energia" && s.kod !== "handlowa" && (
                        <span className="text-muted-foreground"> (z faktury)</span>
                      )}
                    </td>
                    <td className="py-1 text-right tabular-nums">{zl(s.kwotaNettoZl, 2)}</td>
                    <td className="py-1 pl-2">{s.charakter === "staly" ? "stały" : "zmienny"}</td>
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

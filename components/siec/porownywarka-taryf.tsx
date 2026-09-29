"use client"

import { useMemo } from "react"
import type { Grupa, OkresRozliczeniowy, OsdId, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"
import { calculatePorownanieTaryf, type PowodWylaczenia } from "@/lib/core/modules/siec/porownanie-taryf/calculator"
import type { WariantTaryfy } from "@/lib/core/modules/siec/porownanie-taryf/input"
import { STREFY_GRUPY } from "@/lib/core/modules/siec/rachunek-za-prad/constants"
import type { Fazy, Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { ETYKIETA_STREFY, GRUPY_DOM, GRUPY_FIRMA, PoleOsd, ZrodloDanych, liczba, liczbaLubNull, poziomWerdyktu, zl } from "./wspolne"

type WariantStan = { aktywny: boolean; zuzycie: Partial<Record<Strefa, string>>; ceny: Partial<Record<Strefa, string>> }

type Stan = {
  osd: OsdId
  fazy: Fazy
  mocUmownaKw: string
  rok: string
  okres: OkresRozliczeniowy
  handlowa: string
  energiaMocowa: string
  warianty: Partial<Record<Grupa, WariantStan>>
}

const POWOD: Record<PowodWylaczenia, string> = {
  moc: "niedostępna przy tej mocy umownej",
  segment: "nie dla tego kafla",
  "brak-stawek": "brak stawek 2026 tego OSD w aplikacji",
  niekompletne: "brakuje danych (zużycie lub ceny energii)",
  blad: "błędne dane",
}

/**
 * M14 — D2 „Która taryfa G” (dom) / F2 „Porównywarka taryf C” (firma). Echo of the bill engine per
 * group. The zone split and sale prices come from the user for each group (zone hours are OSD data
 * the app does not have yet — no assumed split).
 */
export function PorownywarkaTaryf({ segment }: { segment: Segment }) {
  const grupy = segment === "dom" ? GRUPY_DOM : GRUPY_FIRMA
  const [stan, setStan] = usePersistedDraft<Stan>(`siec-porownanie-${segment}`, {
    osd: "tauron",
    fazy: "trojfazowa",
    mocUmownaKw: "",
    rok: "2026",
    okres: segment === "dom" ? "2" : "1",
    handlowa: "",
    energiaMocowa: "",
    warianty: {},
  })
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))
  const wariant = (gr: Grupa): WariantStan => stan.warianty[gr] ?? { aktywny: false, zuzycie: {}, ceny: {} }
  const ustawWariant = (gr: Grupa, zmiana: Partial<WariantStan>) =>
    setStan((p) => ({ ...p, warianty: { ...p.warianty, [gr]: { ...wariant(gr), ...zmiana } } }))

  const result = useMemo(() => {
    const warianty: WariantTaryfy[] = grupy
      .filter((gr) => stan.warianty[gr]?.aktywny)
      .map((gr) => {
        const w = stan.warianty[gr]!
        const zuzycie: Partial<Record<Strefa, number>> = {}
        const ceny: Partial<Record<Strefa, number>> = {}
        for (const z of STREFY_GRUPY[gr]) {
          zuzycie[z] = liczba(w.zuzycie[z] ?? "")
          if ((w.ceny[z] ?? "") !== "") ceny[z] = Number(w.ceny[z])
        }
        return { grupa: gr, zuzycieStrefKwh: zuzycie, cenaEnergiiZlKwh: ceny }
      })
    return calculatePorownanieTaryf({
      segment,
      osd: stan.osd,
      dataRozliczenia: `${stan.rok === "" ? "0000" : stan.rok.padStart(4, "0")}-12-31`,
      fazy: stan.fazy,
      mocUmownaKw: liczba(stan.mocUmownaKw),
      okresRozliczeniowy: stan.okres,
      zuzycieMiesieczneKwh: null,
      oplataHandlowaZlMies: liczbaLubNull(stan.handlowa),
      energiaMocowaKwh: segment === "dom" ? null : liczbaLubNull(stan.energiaMocowa),
      warianty,
    })
  }, [segment, stan, grupy])
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const najtansza = result.value.pozycje[0]?.rachunek

  return (
    <>
      <div className="flex flex-col gap-4">
        <PoleOsd value={stan.osd} onChange={(osd) => ustaw("osd", osd)} />
        {segment === "dom" ? (
          <PoleSelect
            label="Przyłącze"
            value={stan.fazy}
            onChange={(e) => ustaw("fazy", e.target.value as Fazy)}
            pomoc={<PomocPola ekran="siec-rachunek" pole="przylacze" />}
          >
            <option value="jednofazowa">jednofazowe</option>
            <option value="trojfazowa">trójfazowe</option>
          </PoleSelect>
        ) : (
          <>
            <Pole
              label="Moc umowna"
              unit="kW"
              type="number"
              inputMode="decimal"
              value={stan.mocUmownaKw}
              onChange={(e) => ustaw("mocUmownaKw", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="mocUmowna" />}
            />
            <Pole
              label="Energia pobrana w dni robocze 7:00–22:00"
              unit="kWh/rok"
              type="number"
              inputMode="decimal"
              value={stan.energiaMocowa}
              onChange={(e) => ustaw("energiaMocowa", e.target.value)}
              pomoc={<PomocPola ekran="siec-rachunek" pole="energiaMocowa" />}
            />
          </>
        )}
        <Pole
          label="Rok rozliczenia"
          type="number"
          inputMode="numeric"
          value={stan.rok}
          onChange={(e) => ustaw("rok", e.target.value)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="rok" />}
        />
        <PoleSelect
          label="Okres rozliczeniowy"
          value={stan.okres}
          onChange={(e) => ustaw("okres", e.target.value as OkresRozliczeniowy)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="okres" />}
        >
          <option value="1">co 1 miesiąc</option>
          <option value="2">co 2 miesiące</option>
          <option value="6">co 6 miesięcy</option>
          <option value="12">co 12 miesięcy</option>
        </PoleSelect>
        <Pole
          label="Opłata handlowa sprzedawcy"
          unit="zł/mies. netto"
          type="number"
          inputMode="decimal"
          value={stan.handlowa}
          onChange={(e) => ustaw("handlowa", e.target.value)}
          pomoc={<PomocPola ekran="siec-rachunek" pole="handlowa" />}
        />

        <p className="text-small text-muted-foreground">
          Zaznacz grupy do porównania. Dla każdej podaj, jak to samo roczne zużycie rozkłada się na jej strefy (z faktur
          albo portalu OSD), i cenę energii sprzedawcy w tej grupie. Godziny stref różnią się między OSD — aplikacja ich nie
          zakłada.
        </p>
        {grupy.map((gr) => {
          const w = wariant(gr)
          return (
            <div key={gr} className="flex flex-col gap-3">
              <PoleCheckbox
                id={`siec-wariant-${segment}-${gr}`}
                checked={w.aktywny}
                onChange={(e) => ustawWariant(gr, { aktywny: e.target.checked })}
                label={`Porównaj ${gr}`}
              />
              {w.aktywny &&
                STREFY_GRUPY[gr].map((z) => (
                  <div key={z} className="grid grid-cols-2 gap-3 pl-4">
                    <Pole
                      label={`${gr} — zużycie, ${ETYKIETA_STREFY[z]}`}
                      unit="kWh/rok"
                      type="number"
                      inputMode="decimal"
                      value={w.zuzycie[z] ?? ""}
                      onChange={(e) => ustawWariant(gr, { zuzycie: { ...w.zuzycie, [z]: e.target.value } })}
                      pomoc={<PomocPola ekran="siec-rachunek" pole="zuzycieStrefy" />}
                    />
                    <Pole
                      label={`${gr} — cena energii, ${ETYKIETA_STREFY[z]}`}
                      unit="zł/kWh netto"
                      type="number"
                      inputMode="decimal"
                      value={w.ceny[z] ?? ""}
                      onChange={(e) => ustawWariant(gr, { ceny: { ...w.ceny, [z]: e.target.value } })}
                      pomoc={<PomocPola ekran="siec-rachunek" pole="cenaStrefy" />}
                    />
                  </div>
                ))}
            </div>
          )
        })}
      </div>

      <ZrodloDanych>Porównanie tylko na stawkach z taryf — bez stawek z faktury.</ZrodloDanych>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się porównać — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel
          poziom={poziom ?? "uwaga"}
          etykieta={najtansza ? `Najtańsza: ${result.value.najtanszaGrupa}` : "Brak grupy do porównania"}
        >
          {najtansza && <WynikGlowny>{zl(najtansza.bruttoZl)} brutto / rok</WynikGlowny>}
          <table className="mt-3 w-full text-small">
            <tbody>
              {result.value.pozycje.map((p) => (
                <tr key={p.grupa} className="border-t">
                  <td className="py-1 font-medium">{p.grupa}</td>
                  <td className="py-1 text-right tabular-nums">
                    {p.rachunek ? (
                      <>
                        {zl(p.rachunek.bruttoZl)}
                        {najtansza && p.rachunek !== najtansza && (
                          <span className="text-muted-foreground"> (+{zl(p.rachunek.bruttoZl - najtansza.bruttoZl)})</span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">wyłączona: {POWOD[p.wylaczona!]}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}

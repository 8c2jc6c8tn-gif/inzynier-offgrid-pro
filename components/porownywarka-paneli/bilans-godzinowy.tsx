"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { MAKS_PANELI_W_DOBORZE } from "@/lib/core/modules/pv/porownywarka-paneli/bilans-godzinowy"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import type { BilansSeed } from "@/lib/porownywarka-paneli/stan"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/**
 * Zakładka „Bilans godzinowy” (spec 34): ile energii z paneli zużyjesz od razu, ile przejdzie przez baterię, a ile trzeba dobrać
 * z sieci albo agregatu — godzina po godzinie roku TMY. Pojemność baterii wpisuje użytkownik albo bierze z profilu sprzętu
 * (wynik ekranu „Dobór pojemności baterii”); nic nie jest podstawiane po cichu.
 */
export function BilansGodzinowyPaneli(p: {
  panele: WynikPanelu[]
  zUzytecznoscia: boolean
  bil: BilansSeed
  onBil: (zmiana: Partial<BilansSeed>) => void
  /** Pojemność użyteczna z profilu sprzętu [kWh]; `undefined` = nie policzono. */
  pojemnoscZProfilu: number | undefined
  mikro: boolean
}) {
  const t = useTranslate()
  const zProfilu = p.pojemnoscZProfilu !== undefined ? Math.round(p.pojemnoscZProfilu * 10) / 10 : undefined
  const wyniki = p.panele.filter((x) => x.bilansGodzinowy !== null)
  return (
    <div className="flex flex-col gap-4 text-small">
      <p className="text-muted-foreground">{t("UI-PORP-BIL-OPIS")}</p>
      {!p.zUzytecznoscia ? (
        <>
          <p className="text-muted-foreground">{t("UI-PORP-BIL-BRAK-ZUZYCIA")}</p>
          <Link href={p.mikro ? "/kalkulatory/zuzycie-per-urzadzenie" : "/kalkulatory/zuzycie-miesieczne"} className="underline">
            {p.mikro ? t("UI-PORP-ZUZYCIE-MIKRO-LINK") : t("UI-PORP-ZUZYCIE-LINK")}
          </Link>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pole
              label={t("UI-PORP-BIL-POJEMNOSC")}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={p.bil.pojemnosc}
              onChange={(e) => p.onBil({ pojemnosc: e.target.value })}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="bilPojemnosc" />}
            />
            <Pole
              label={t("UI-PORP-BIL-SPRAWNOSC")}
              unit="%"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={p.bil.sprawnosc}
              onChange={(e) => p.onBil({ sprawnosc: e.target.value })}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="bilSprawnosc" />}
            />
            <Pole
              label={t("UI-PORP-BIL-CEL")}
              unit="%"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={p.bil.celZimy ?? ""}
              onChange={(e) => p.onBil({ celZimy: e.target.value })}
              placeholder={t("UI-PORP-BIL-CEL-PODPOWIEDZ")}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="bilCel" />}
            />
          </div>
          {zProfilu !== undefined ? (
            <div className="flex flex-wrap items-center gap-2">
              <span>{t("UI-PORP-BIL-Z-PROFILU", { kwh: f1(zProfilu) })}</span>
              <Button type="button" variant="secondary" onClick={() => p.onBil({ pojemnosc: String(zProfilu) })}>
                {t("UI-PORP-BIL-UZYJ")}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("UI-PORP-BIL-BRAK-PROFILU")}{" "}
              <Link href="/kalkulatory/dobor-pojemnosci-baterii" className="underline">
                {t("UI-PORP-BIL-LINK-BATERIA")}
              </Link>
            </p>
          )}

          {wyniki.length === 0 ? (
            <p className="text-muted-foreground">{t("UI-PORP-BIL-PODAJ")}</p>
          ) : (
            wyniki.map((panel) => {
              const b = panel.bilansGodzinowy!
              const procent = (x: number | null) => (x === null ? "–" : f0(x))
              const koszt = (x: number | null) => (x === null ? t("UI-PORP-BIL-BRAK-WYCENY") : f0(x))
              const wiersze: Array<[string, string, string]> = [
                [t("UI-PORP-BIL-W-ZUZYCIE"), f0(b.zuzycieZimaKwh), f0(b.zuzycieRokKwh)],
                [t("UI-PORP-BIL-W-POKRYCIE"), procent(b.pokrycieZimaPct), procent(b.pokrycieRokPct)],
                [t("UI-PORP-BIL-W-BEZPOS"), f0(b.bezposrednioZimaKwh), f0(b.bezposrednioRokKwh)],
                [t("UI-PORP-BIL-W-BATERIA"), f0(b.zBateriiZimaKwh), f0(b.zBateriiRokKwh)],
                [t("UI-PORP-BIL-W-BRAK"), f0(b.brakZimaKwh), f0(b.brakRokKwh)],
                [t("UI-PORP-BIL-W-ODCIETE"), f0(b.odcieteZimaKwh), f0(b.odcieteRokKwh)],
                [t("UI-PORP-BIL-W-KOSZT"), koszt(b.kosztBrakuZimaZl), koszt(b.kosztBrakuRokZl)],
              ]
              if (b.cykleRok !== null) wiersze.push([t("UI-PORP-BIL-W-CYKLE"), "", f1(b.cykleRok)])
              const dobor = b.doborNaZime
              if (dobor) {
                const godz =
                  dobor.panelowGodzinowo !== null
                    ? f0(dobor.panelowGodzinowo)
                    : t("UI-PORP-BIL-DOBOR-NIEOSIAGALNE", { maks: MAKS_PANELI_W_DOBORZE, pokr: f0(dobor.pokrycieMaksPct) })
                wiersze.push([t("UI-PORP-BIL-W-DOBOR-SUMA"), dobor.panelowSumowo === null ? "–" : f0(dobor.panelowSumowo), ""])
                wiersze.push([t("UI-PORP-BIL-W-DOBOR-GODZ"), godz, ""])
              }
              const wykorzystaneGodzinowo = b.bezposrednioRokKwh + b.zBateriiRokKwh
              return (
                <div key={panel.id} className="flex flex-col gap-2">
                  <h3 className="font-medium">{t("UI-PORP-BIL-PANEL", { panel: panel.nazwa, n: panel.liczbaPaneli })}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-small">
                      <thead>
                        <tr className="text-right">
                          <th className="p-1" />
                          <th className="p-1 font-medium">{t("UI-PORP-BIL-KOL-ZIMA")}</th>
                          <th className="p-1 font-medium">{t("UI-PORP-BIL-KOL-ROK")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wiersze.map(([etykieta, zima, rok]) => (
                          <tr key={etykieta} className="border-t">
                            <th className="p-1 text-left font-normal">{etykieta}</th>
                            <td className="p-1 text-right tabular-nums">{zima}</td>
                            <td className="p-1 text-right tabular-nums">{rok}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {b.doborNaZime && (
                    <p className="text-caption text-muted-foreground">
                      {t("UI-PORP-BIL-DOBOR-NOTA", {
                        cel: f0(b.doborNaZime.celPct),
                        zuzycie: f0(b.doborNaZime.zuzycieZimaKwh),
                        panel: f1(b.doborNaZime.zimaNaPanelKwh),
                        bat: f1(b.pojemnoscKwh),
                      })}
                    </p>
                  )}
                  {panel.uzytecznaRokKwh !== null && (
                    <p className="text-caption text-muted-foreground">
                      {t("UI-PORP-BIL-POROWNANIE", { mies: f0(panel.uzytecznaRokKwh), godz: f0(wykorzystaneGodzinowo) })}
                    </p>
                  )}
                  <details>
                    <summary className="cursor-pointer text-caption">{t("UI-PORP-BIL-MIESIACE")}</summary>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-caption">
                        <tbody>
                          {b.brakMiesiaceKwh.map((kwh, m) => (
                            <tr key={m} className="border-t">
                              <th className="p-1 text-left font-normal">{t(`UI-MIESIAC-${m + 1}`)}</th>
                              <td className="p-1 text-right tabular-nums">{f0(kwh)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )
            })
          )}
          <p className="text-caption text-muted-foreground">{t("UI-PORP-BIL-NOTA")}</p>
        </>
      )}
    </div>
  )
}

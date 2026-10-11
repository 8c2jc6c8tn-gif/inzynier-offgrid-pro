"use client"

import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { useTranslate } from "@/lib/i18n/language-context"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

/**
 * Sekcja „Test: co, jeśli panel ma mniej mocy, niż deklaruje” w zakładce „Opłacalność” (spec 38): jedno pole (procent, bez wartości domyślnej)
 * i obok siebie liczby z karty oraz po zaniżeniu mocy. Główne wyniki ekranu się nie zmieniają.
 */
export function TestZanizeniaMocy(p: { panele: WynikPanelu[]; wartosc: string; onWartosc: (v: string) => void; waluta: string }) {
  const t = useTranslate()
  const z = p.panele.filter((w) => w.zanizenieMocy !== null)
  const brak = <span className="text-muted-foreground">{t("UI-PORP-BRAK-DANYCH")}</span>
  return (
    <section className="flex flex-col gap-2 rounded-lg border p-3" aria-labelledby="zan-tytul">
      <h3 id="zan-tytul" className="text-body font-medium">
        {t("UI-PORP-ZAN-TYTUL")}
      </h3>
      <Pole
        label={t("UI-PORP-ZAN-POLE")}
        unit="%"
        type="number"
        inputMode="decimal"
        step="any"
        placeholder="15"
        value={p.wartosc}
        onChange={(e) => p.onWartosc(e.target.value)}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="zanizenieMocy" />}
      />
      <p className="text-caption text-muted-foreground">{t("UI-PORP-ZAN-NOTA")}</p>
      {z.map((w) => {
        const s = w.zanizenieMocy!
        const wiersze: [string, string | null, string | null][] = [
          ["UI-PORP-MOC-KWP", `${f2(w.mocKwp)} kWp`, `${f2(s.mocKwp)} kWp`],
          ["UI-PORP-ZIMA-KWH", `${f1(w.zimaKwh)} kWh`, `${f1(s.zimaKwh)} kWh`],
          ["UI-PORP-ROK-KWH", `${f0(w.rokKwh)} kWh`, `${f0(s.rokKwh)} kWh`],
          [
            "UI-PORP-CENA-ZA-WP",
            w.cenaZaWpZl === null ? null : `${f2(w.cenaZaWpZl)} ${p.waluta}/Wp`,
            s.cenaZaWpZl === null ? null : `${f2(s.cenaZaWpZl)} ${p.waluta}/Wp`,
          ],
          [
            "UI-PORP-KOSZT-ZIMOWEJ-KWH",
            w.kosztZimowejKwhZl === null ? null : `${f2(w.kosztZimowejKwhZl)} ${p.waluta}/kWh`,
            s.kosztZimowejKwhZl === null ? null : `${f2(s.kosztZimowejKwhZl)} ${p.waluta}/kWh`,
          ],
          [
            "UI-PORP-ZWROT",
            w.okresZwrotuLat === null ? null : t("UI-PORP-LATA", { x: f1(w.okresZwrotuLat) }),
            s.okresZwrotuLat === null ? null : t("UI-PORP-LATA", { x: f1(s.okresZwrotuLat) }),
          ],
        ]
        return (
          <div key={w.id} className="overflow-x-auto">
            <table className="w-full text-small">
              <caption className="p-1 text-left font-medium">{w.nazwa}</caption>
              <thead>
                <tr className="text-left">
                  <th className="p-1" />
                  <th className="p-1 font-medium">{t("UI-PORP-ZAN-KOLUMNA-KARTA")}</th>
                  <th className="p-1 font-medium">{t("UI-PORP-ZAN-KOLUMNA-PO", { x: f1(s.zanizeniePct) })}</th>
                </tr>
              </thead>
              <tbody>
                {wiersze.map(([klucz, karta, po]) => (
                  <tr key={klucz} className="border-t">
                    <th className="p-1 text-left font-normal">{t(klucz)}</th>
                    <td className="p-1 tabular-nums">{karta ?? brak}</td>
                    <td className="p-1 tabular-nums">{po ?? brak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </section>
  )
}

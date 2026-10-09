"use client"

import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { OchronaWariantu } from "@/lib/core/modules/pv/porownywarka-paneli/elektryka"
import { useTranslate } from "@/lib/i18n/language-context"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

/**
 * Zakładka „Elektryka” (A3): napięcie stringów zimą, limit napięcia z karty i wszystkie równe układy N paneli z ochroną stringów.
 * Jedno pole wejściowe — najniższa temperatura miejsca (bez wartości domyślnej). Bez falownika nie wskazuję „najlepszego” układu.
 */
export function ElektrykaPaneli(p: {
  panele: WynikPanelu[]
  /** Panele bez danych elektrycznych w katalogu (nazwy). */
  bezDanych: string[]
  tmin: string
  onTmin: (v: string) => void
  /** Najniższa godzinowa temperatura z danych pogodowych roku typowego; `null` = dane bez temperatury. */
  tmyMinC: number | null
  /** Są panele z danymi elektrycznymi, a temperatury nie podano. */
  brakTmin: boolean
}) {
  const t = useTranslate()
  const ochrona = (o: OchronaWariantu | null) => {
    if (o === null) return t("UI-PORP-ELE-OCH-BRAK-KARTY")
    const zakres = { min: f1(o.inMinA), max: f1(o.inMaxA) }
    if (!o.zakresPoprawny) return t("UI-PORP-ELE-OCH-ZAKRES", zakres)
    if (o.wymagana) return t("UI-PORP-ELE-OCH-TAK", zakres)
    return t(o.alternatywaKablowa ? "UI-PORP-ELE-OCH-ALT" : "UI-PORP-ELE-OCH-NIE")
  }
  const z = p.panele.filter((x) => x.elektryka !== null)
  return (
    <div className="flex flex-col gap-4">
      <Pole
        label={t("UI-PORP-ELE-TMIN")}
        unit="°C"
        type="number"
        inputMode="decimal"
        step="any"
        placeholder="-25"
        value={p.tmin}
        onChange={(e) => p.onTmin(e.target.value)}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="tminC" />}
      />
      {p.tmyMinC !== null && <p className="text-caption text-muted-foreground">{t("UI-PORP-ELE-TMIN-TMY", { tmin: f1(p.tmyMinC) })}</p>}
      {p.bezDanych.map((nazwa) => (
        <p key={nazwa} role="status" className="text-small text-muted-foreground">
          {t("UI-PORP-ELE-BRAK-DANYCH-PANELU", { nazwa })}
        </p>
      ))}
      {p.brakTmin && <p className="text-small text-muted-foreground">{t("UI-PORP-ELE-BRAK-TMIN")}</p>}
      {z.map((w) => {
        const e = w.elektryka!
        return (
          <section key={w.id} className="flex flex-col gap-2 rounded-lg border p-3">
            <h3 className="text-small font-medium">{t("UI-PORP-ELE-PANEL", { nazwa: w.nazwa, n: w.liczbaPaneli })}</h3>
            <p className="text-small">{t("UI-PORP-ELE-VOC-ZIMA", { tmin: f1(e.tminC), voc: f2(e.vocZimaPanelaV) })}</p>
            <p className="text-small text-muted-foreground">{t("UI-PORP-ELE-MAKS", { limit: f0(e.limitNapieciaV), maks: e.maxPaneliWSzeregu })}</p>
            {e.warianty.length === 0 ? (
              <p className="text-small">{t("UI-PORP-ELE-WARIANTY-BRAK")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {e.warianty.map((v) => (
                  <li key={v.panelowWSzeregu} className="rounded-md border p-2 text-small">
                    <p className="font-medium">{t("UI-PORP-ELE-UKLAD", { s: v.panelowWSzeregu, p: v.stringowRownolegle })}</p>
                    <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
                      {(
                        [
                          ["UI-PORP-ELE-KOL-VOC", `${f1(v.vocZimaStringuV)} V`],
                          ["UI-PORP-ELE-KOL-VMP", `${f1(v.vmpStringuV)} V`],
                          ["UI-PORP-ELE-KOL-IMP", `${f1(v.impMacierzyA)} A`],
                          ["UI-PORP-ELE-KOL-ISC", `${f1(v.iscMacierzyA)} A`],
                        ] as const
                      ).map(([klucz, wartosc]) => (
                        <div key={klucz}>
                          <dt className="text-caption text-muted-foreground">{t(klucz)}</dt>
                          <dd className="tabular-nums">{wartosc}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-1">
                      <span className="text-caption text-muted-foreground">{t("UI-PORP-ELE-KOL-OCH")}: </span>
                      {ochrona(v.ochrona)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
      {z.length > 0 && (
        <>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-ELE-NOTA")}</p>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-ELE-NOTA-MIX")}</p>
        </>
      )}
    </div>
  )
}

"use client"

import { DATA_PRZEGLADU_PRODUCENTOW, lataJakoZakresy, opisProducenta, type FaktProducenta, type KodKraju } from "@/lib/core/dane/producenci-paneli"
import { useTranslate } from "@/lib/i18n/language-context"

const KLUCZ_KRAJU: Record<KodKraju, string> = {
  CN: "UI-PORP-PROD-KRAJ-CN",
  KR: "UI-PORP-PROD-KRAJ-KR",
  CH: "UI-PORP-PROD-KRAJ-CH",
  DE: "UI-PORP-PROD-KRAJ-DE",
  GB: "UI-PORP-PROD-KRAJ-GB",
  ES: "UI-PORP-PROD-KRAJ-ES",
  IT: "UI-PORP-PROD-KRAJ-IT",
  TR: "UI-PORP-PROD-KRAJ-TR",
}

/**
 * Zakładka „Producenci” (spec 15, Etap C): fakty o producentach paneli z katalogu, każdy z odnośnikiem do źródła. Bez ocen i bez punktów;
 * brak informacji pokazany wprost (czego nie sprawdzano), żeby brak wzmianki nie wyglądał jak dobra wiadomość.
 */
export function OpisyProducentow({ producenci, jestPanelPozaKatalogiem }: { producenci: string[]; jestPanelPozaKatalogiem: boolean }) {
  const t = useTranslate()
  const tekstFaktu = (f: FaktProducenta): string => {
    switch (f.rodzaj) {
      case "zalozona":
        return f.miejsce ? t("UI-PORP-PROD-F-zalozona-miejsce", { rok: f.rok, miejsce: f.miejsce }) : t("UI-PORP-PROD-F-zalozona", { rok: f.rok })
      case "siedziba":
        return t("UI-PORP-PROD-F-siedziba", { miasto: f.miasto })
      case "siedziba-miedzynarodowa":
        return t("UI-PORP-PROD-F-siedziba-miedzynarodowa", { miasto: f.miasto })
      case "gielda":
        return t("UI-PORP-PROD-F-gielda", { gielda: f.gielda, symbol: f.symbol, odRok: f.odRok })
      case "grupa":
        return t("UI-PORP-PROD-F-grupa", { grupa: f.grupa })
      case "wysylki":
        return t("UI-PORP-PROD-F-wysylki", { rok: f.rok, mw: f.mw.toLocaleString("pl-PL") })
      case "biura-europa":
        return t("UI-PORP-PROD-F-biura-europa", { kraje: f.kraje.map((k) => t(KLUCZ_KRAJU[k])).join(", ") })
      case "pvel":
        return t("UI-PORP-PROD-F-pvel", { lata: lataJakoZakresy(f.lata) })
      case "retc":
        return t("UI-PORP-PROD-F-retc")
      case "hurtownia-pl":
        return t("UI-PORP-PROD-F-hurtownia-pl", { hurtownia: f.hurtownia })
      case "dystrybutor-pl-sponsorowany":
        return t("UI-PORP-PROD-F-dystrybutor-pl-sponsorowany", { data: f.data, dystrybutor: f.dystrybutor })
      case "brak-polski-na-stronie":
        return t("UI-PORP-PROD-F-brak-polski-na-stronie")
      case "pvel-wg-sprzedawcy-niepotwierdzone":
        return t("UI-PORP-PROD-F-pvel-wg-sprzedawcy-niepotwierdzone")
      case "zrodlo-niespojne":
        return t("UI-PORP-PROD-F-zrodlo-niespojne")
    }
  }
  const opisy = producenci.map((p) => opisProducenta(p)).filter((o) => o !== undefined)
  return (
    <div className="flex flex-col gap-4 text-small">
      <p className="text-muted-foreground">{t("UI-PORP-PROD-OPIS")}</p>
      {opisy.length === 0 && <p className="text-muted-foreground">{t("UI-PORP-PROD-BRAK-PANELI")}</p>}
      {opisy.map((o) => (
        <section key={o.producent} className="flex flex-col gap-2 rounded-lg border p-3">
          <h3 className="font-medium">{o.producent}</h3>
          <p className="text-caption text-muted-foreground">
            {t("UI-PORP-PROD-STATUS", { data: DATA_PRZEGLADU_PRODUCENTOW.split("-").reverse().join(".") })}
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>{t("UI-PORP-PROD-KRAJ", { kraj: t(KLUCZ_KRAJU[o.kraj]) })}</li>
            {o.fakty.map((f, i) => (
              <li key={i}>
                {tekstFaktu(f)}{" "}
                <a href={f.zrodlo.url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap underline" title={f.zrodlo.tytul}>
                  [{t("UI-PORP-PROD-ZRODLO")}]
                </a>
              </li>
            ))}
            {o.nieustalono.map((n) => (
              <li key={n}>{t("UI-PORP-PROD-N-rok-zalozenia")}</li>
            ))}
          </ul>
        </section>
      ))}
      {jestPanelPozaKatalogiem && <p className="text-caption text-muted-foreground">{t("UI-PORP-PROD-BRAK-KATALOGU")}</p>}
      <p className="text-caption text-muted-foreground">{t("UI-PORP-PROD-NIE-SPRAWDZANO")}</p>
    </div>
  )
}

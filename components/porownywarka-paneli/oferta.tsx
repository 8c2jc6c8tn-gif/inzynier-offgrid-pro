"use client"

import { useEffect, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Pole, PoleTekst } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import type { Assumption } from "@/lib/core/calc-result"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import type { FormularzStan } from "@/lib/porownywarka-paneli/stan"
import type { PodsumowanieUrzadzenia } from "@/lib/porownywarka-paneli/urzadzenie"
import { PozycjeBos } from "./urzadzenie-bos"
import { wierszeWyniku } from "./wiersze-wyniku"

/** Wiersze tabeli wyniku, które trafiają na wydruk (reszta zostaje na ekranie: to dane robocze, nie oferta). */
const WIERSZE_OFERTY = [
  "UI-PORP-LICZBA-SZTUK",
  "UI-PORP-MOC-KWP",
  "UI-PORP-MASA-RAZEM",
  "UI-PORP-ZIMA-KWH",
  "UI-PORP-ROK-KWH",
  "UI-PORP-CENA-RAZEM",
  "UI-PORP-CENA-ZA-WP",
  "UI-PORP-WARTOSC-ROK",
  "UI-PORP-ZWROT",
  "UI-PORP-MOC-25",
]

/** Class on <body> while the offer tab is open: print CSS (globals.css) then leaves only the sheet rendered into `.druk-root`. */
const KLASA_DRUKU = "druk-oferty"

const bezSubskrypcji = () => () => {}
const cel = () => document.body
const celNaSerwerze = () => null

export type DaneOferty = {
  panele: WynikPanelu[]
  /** Zdanie-wniosek z góry wyniku (zimowa różnica między panelami). */
  wniosek: string
  podsumowanie: PodsumowanieUrzadzenia | null
  zalozenia: Assumption[]
  szerokosc: number | null
  dlugosc: number | null
  nachylenie: string
  azymut: string
  waluta: string
}

/**
 * Zakładka „Oferta (wydruk)”: trzy opcjonalne pola (dla kogo, wykonawca, uwagi) i kartka z wynikiem do wydruku albo zapisu jako PDF
 * przez okno drukowania przeglądarki. Kartka jest renderowana dwa razy: podglądem w zakładce i w portalu `.druk-root`, który jest
 * jedyną widoczną treścią podczas wydruku. Treść to te same liczby co na ekranie (wspólne wiersze i lista osprzętu), nic nowego.
 */
export function OfertaPaneli(p: {
  dane: DaneOferty
  stan: FormularzStan
  ustaw: <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => void
}) {
  const t = useTranslate()
  const portal = useSyncExternalStore(bezSubskrypcji, cel, celNaSerwerze)
  useEffect(() => {
    document.body.classList.add(KLASA_DRUKU)
    return () => document.body.classList.remove(KLASA_DRUKU)
  }, [])
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">{t("UI-PORP-OF-OPIS")}</p>
      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <Pole
          label={t("UI-PORP-OF-DLA")}
          type="text"
          value={p.stan.ofertaDla ?? ""}
          onChange={(e) => p.ustaw("ofertaDla", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaDla" />}
        />
        <Pole
          label={t("UI-PORP-OF-WYKONAWCA")}
          type="text"
          value={p.stan.ofertaWykonawca ?? ""}
          onChange={(e) => p.ustaw("ofertaWykonawca", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaWykonawca" />}
        />
        <PoleTekst
          label={t("UI-PORP-OF-UWAGI")}
          rows={3}
          value={p.stan.ofertaUwagi ?? ""}
          onChange={(e) => p.ustaw("ofertaUwagi", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaUwagi" />}
        />
        <Button type="button" className="min-h-11 w-fit" onClick={() => window.print()}>
          {t("UI-PORP-OF-DRUKUJ")}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <ArkuszOferty {...p} />
      </div>
      {portal &&
        createPortal(
          <div className="druk-root hidden bg-white text-black print:block">
            <ArkuszOferty {...p} />
          </div>,
          portal,
        )}
    </div>
  )
}

function ArkuszOferty(p: { dane: DaneOferty; stan: FormularzStan }) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const { dane, stan } = p
  const wiersze = wierszeWyniku(t, dane.waluta).filter(([klucz, wartosc]) => WIERSZE_OFERTY.includes(klucz) && dane.panele.some((x) => wartosc(x) !== null))
  const dla = (stan.ofertaDla ?? "").trim()
  const wykonawca = (stan.ofertaWykonawca ?? "").trim()
  const uwagi = (stan.ofertaUwagi ?? "").trim()
  const podsumowanie = dane.podsumowanie
  return (
    <article className="flex min-w-[20rem] flex-col gap-4 bg-white p-4 text-small text-black">
      <header className="flex flex-col gap-1 border-b border-neutral-400 pb-2">
        <h2 className="text-lg font-semibold">{t("UI-PORP-OF-TYTUL")}</h2>
        <p>{t("UI-PORP-OF-DATA", { data: new Date().toLocaleDateString(jezyk) })}</p>
        {dla !== "" && <p>{t("UI-PORP-OF-DLA-LINIA", { nazwa: dla })}</p>}
        {wykonawca !== "" && <p>{t("UI-PORP-OF-WYKONAWCA-LINIA", { nazwa: wykonawca })}</p>}
        <p className="text-neutral-700">
          {dane.szerokosc !== null && dane.dlugosc !== null
            ? t("UI-PORP-OF-MIEJSCE", { nachylenie: dane.nachylenie, azymut: dane.azymut, szer: dane.szerokosc.toFixed(2), dl: dane.dlugosc.toFixed(2) })
            : t("UI-PORP-OF-MIEJSCE-BEZ-WSP", { nachylenie: dane.nachylenie, azymut: dane.azymut })}
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("UI-PORP-OF-POROWNANIE")}</h3>
        {dane.wniosek !== "" && <p className="font-medium">{dane.wniosek}</p>}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border-b border-neutral-400 p-1" />
              {dane.panele.map((x) => (
                <th key={x.id} className="border-b border-neutral-400 p-1 font-medium">
                  {x.nazwa}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wiersze.map(([klucz, wartosc]) => (
              <tr key={klucz}>
                <th className="border-b border-neutral-300 p-1 text-left font-normal">{t(klucz)}</th>
                {dane.panele.map((x) => (
                  <td key={x.id} className="border-b border-neutral-300 p-1 tabular-nums">
                    {wartosc(x) ?? t("UI-PORP-BRAK-DANYCH")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {podsumowanie && podsumowanie.panele.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">{t("UI-PORP-OF-URZADZENIE-TYTUL")}</h3>
          <p>{t("UI-PORP-OF-URZADZENIE", { nazwa: `${podsumowanie.urzadzenie.producent} ${podsumowanie.urzadzenie.model}` })}</p>
          {podsumowanie.panele.map((x) => (
            <div key={x.wynik.id} className="flex flex-col gap-1">
              <h4 className="font-medium">{t("UI-PORP-ELE-PANEL", { nazwa: x.wynik.nazwa, n: x.wynik.liczbaPaneli })}</h4>
              {x.wybrany === null ? (
                <p>{t("UI-PORP-OF-BEZ-UKLADU")}</p>
              ) : (
                <>
                  <p>
                    {t("UI-PORP-URZ-BOS-UKLAD-WYBRANY", { s: x.wybrany.panelowWSzeregu, p: x.wybrany.stringowRownolegle })}{" "}
                    {t("UI-PORP-URZ-LICZBA-URZ", { d: x.wybrany.liczbaUrzadzen! })}
                  </p>
                  {podsumowanie.mikro ? <p className="text-neutral-700">{t("UI-PORP-URZ-BOS-MIKRO")}</p> : <PozycjeBos panel={x} waluta={dane.waluta} druk />}
                </>
              )}
            </div>
          ))}
        </section>
      )}

      {uwagi !== "" && (
        <section className="flex flex-col gap-1">
          <h3 className="font-semibold">{t("UI-PORP-OF-UWAGI-TYTUL")}</h3>
          <p className="whitespace-pre-wrap">{uwagi}</p>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <h3 className="font-semibold">{t("UI-PORP-OF-ZALOZENIA")}</h3>
        <ZalozeniaLista assumptions={dane.zalozenia} className="text-neutral-700" />
        <p className="text-neutral-700">{t("UI-PORP-OF-ZASTRZEZENIE")}</p>
      </section>

      <footer className="border-t border-neutral-400 pt-2 text-caption text-neutral-700">{t("UI-PORP-OF-STOPKA")}</footer>
    </article>
  )
}

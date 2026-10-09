"use client"

import { useEffect, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { EdytorProfiluFirmy } from "@/components/firma/edytor-profilu-firmy"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect, PoleTekst } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import type { Assumption } from "@/lib/core/calc-result"
import { DATA_CENNIKA_BOS } from "@/lib/core/dane/cennik-bos"
import { CALCULATOR_VERSION, type WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { linieKontaktuFirmy, PROFIL_FIRMY_PUSTY, type ProfilFirmy } from "@/lib/firma/profil-firmy"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { LITERY_WERSJI, slotyWersji, wersjeOferty, type WersjaOferty } from "@/lib/porownywarka-paneli/oferta"
import type { FormularzStan } from "@/lib/porownywarka-paneli/stan"
import { wersjaZeZnacznikiem } from "@/lib/wersja"
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
  /** ISO time the weather data were downloaded (traceability stamp); `null` when the data carry no such time. */
  pogodaPobrano: string | null
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
  // Company details are typed once and kept on the device for every printout, not inside this comparison's draft.
  const [firma, setFirma] = usePersistedDraft<ProfilFirmy>("profil-firmy", PROFIL_FIRMY_PUSTY)
  useEffect(() => {
    document.body.classList.add(KLASA_DRUKU)
    return () => document.body.classList.remove(KLASA_DRUKU)
  }, [])
  const sloty = slotyWersji(p.stan, p.dane.panele)
  const wersje = wersjeOferty(p.stan, p.dane.panele)
  const ustawSlot = (i: number, zmiana: Partial<(typeof sloty)[number]>) =>
    p.ustaw(
      "ofertaWersje",
      sloty.map((slot, k) => (k === i ? { ...slot, ...zmiana } : slot)),
    )
  const arkusz = { dane: p.dane, stan: p.stan, firma, wersje }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">{t("UI-PORP-OF-OPIS")}</p>
      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <fieldset className="flex flex-col gap-3">
          <legend className="text-small font-medium">{t("UI-PORP-OF-WERSJE-TYTUL")}</legend>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-OF-WERSJE-OPIS")}</p>
          {sloty.map((slot, i) => {
            const litera = LITERY_WERSJI[i]!
            return (
              <div key={litera} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PoleSelect
                  label={t("UI-PORP-OF-WERSJA-PANEL", { litera })}
                  value={slot.panelId}
                  onChange={(e) => ustawSlot(i, { panelId: e.target.value })}
                  pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaWersjaPanel" />}
                >
                  <option value="">{t("UI-PORP-OF-WERSJA-BRAK")}</option>
                  {p.dane.panele.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nazwa}
                    </option>
                  ))}
                </PoleSelect>
                <Pole
                  label={t("UI-PORP-OF-WERSJA-ETYKIETA", { litera })}
                  type="text"
                  value={slot.etykieta}
                  onChange={(e) => ustawSlot(i, { etykieta: e.target.value })}
                  pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaWersjaEtykieta" />}
                />
              </div>
            )
          })}
          <PoleSelect
            label={t("UI-PORP-OF-ZALECANA")}
            value={p.stan.ofertaZalecana ?? ""}
            onChange={(e) => p.ustaw("ofertaZalecana", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="ofertaZalecana" />}
          >
            <option value="">{t("UI-PORP-OF-ZALECANA-BRAK")}</option>
            {wersje.map((w) => (
              <option key={w.litera} value={w.litera}>
                {t("UI-PORP-OF-WERSJA-LITERA", { litera: w.litera })}
              </option>
            ))}
          </PoleSelect>
        </fieldset>
        <EdytorProfiluFirmy firma={firma} ustaw={(zmiana) => setFirma((prev) => ({ ...prev, ...zmiana }))} />
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
        <Button type="button" className="min-h-11 w-fit" disabled={wersje.length === 0} onClick={() => window.print()}>
          {t("UI-PORP-OF-DRUKUJ")}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <ArkuszOferty {...arkusz} />
      </div>
      {portal &&
        createPortal(
          <div className="druk-root hidden bg-white text-black print:block">
            <ArkuszOferty {...arkusz} />
          </div>,
          portal,
        )}
    </div>
  )
}

type PropsArkusza = { dane: DaneOferty; stan: FormularzStan; firma: ProfilFirmy; wersje: WersjaOferty[] }

function ArkuszOferty({ dane, stan, firma, wersje }: PropsArkusza) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const panele = wersje.map((w) => w.panel)
  const wiersze = wierszeWyniku(t, dane.waluta).filter(([klucz, wartosc]) => WIERSZE_OFERTY.includes(klucz) && panele.some((x) => wartosc(x) !== null))
  const dla = (stan.ofertaDla ?? "").trim()
  const wykonawca = (stan.ofertaWykonawca ?? "").trim()
  const uwagi = (stan.ofertaUwagi ?? "").trim()
  const podsumowanie = dane.podsumowanie
  const data = new Date().toLocaleDateString(jezyk)
  const liniaFirmy = linieKontaktuFirmy(firma, t("UI-FIRMA-NIP"))
  const nazwaFirmy = firma.nazwa.trim()
  const naglowekWersji = (w: WersjaOferty) =>
    w.etykieta === ""
      ? t("UI-PORP-OF-WERSJA-NAGLOWEK", { litera: w.litera, panel: w.panel.nazwa })
      : t("UI-PORP-OF-WERSJA-NAGLOWEK-ETYKIETA", { litera: w.litera, etykieta: w.etykieta, panel: w.panel.nazwa })
  const sekcjeUrzadzenia = podsumowanie
    ? wersje.flatMap((w) => {
        const x = podsumowanie.panele.find((y) => y.wynik.id === w.panel.id)
        return x ? [{ w, x }] : []
      })
    : []
  const pokazBos = podsumowanie !== null && !podsumowanie.mikro && sekcjeUrzadzenia.some(({ x }) => x.wybrany !== null)
  return (
    <table className="w-full min-w-[20rem] border-collapse bg-white text-small text-black">
      <tbody>
        <tr>
          <td className="p-4 align-top">
            <article className="flex flex-col gap-4">
              <p className="self-end rounded border border-neutral-400 bg-neutral-100 px-2 py-0.5 text-caption font-semibold">{t("UI-PORP-OF-MARKA-GORA")}</p>
              <header className="flex flex-col gap-2 border-b border-neutral-400 pb-2">
                {(firma.logo !== "" || nazwaFirmy !== "" || liniaFirmy.length > 0) && (
                  <div className="flex flex-wrap items-center gap-4">
                    {firma.logo !== "" && (
                      // eslint-disable-next-line @next/next/no-img-element -- a data URL kept on the device
                      <img src={firma.logo} alt={t("UI-FIRMA-LOGO-ALT")} className="max-h-20 max-w-[12rem] object-contain" />
                    )}
                    <div className="flex flex-col text-neutral-700">
                      {nazwaFirmy !== "" && <p className="text-base font-semibold text-black">{nazwaFirmy}</p>}
                      {liniaFirmy.map((linia) => (
                        <p key={linia}>{linia}</p>
                      ))}
                    </div>
                  </div>
                )}
                <h2 className="text-lg font-semibold">{t("UI-PORP-OF-TYTUL")}</h2>
                <p>{t("UI-PORP-OF-DATA", { data })}</p>
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
                {wersje.length === 0 ? (
                  <p>{t("UI-PORP-OF-WERSJE-PUSTO")}</p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left align-bottom">
                        <th className="border-b border-neutral-400 p-1" />
                        {wersje.map((w) => (
                          <th key={w.litera} className="border-b border-neutral-400 p-1 font-medium">
                            <span className="block font-semibold">
                              {t("UI-PORP-OF-WERSJA-LITERA", { litera: w.litera })}
                              {w.zalecana && ` · ${t("UI-PORP-OF-ZALECANA-ZNACZNIK")}`}
                            </span>
                            {w.etykieta !== "" && <span className="block font-normal text-neutral-700">{w.etykieta}</span>}
                            <span className="block">{w.panel.nazwa}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wiersze.map(([klucz, wartosc]) => (
                        <tr key={klucz}>
                          <th className="border-b border-neutral-300 p-1 text-left font-normal">{t(klucz)}</th>
                          {panele.map((x) => (
                            <td key={x.id} className="border-b border-neutral-300 p-1 tabular-nums">
                              {wartosc(x) ?? t("UI-PORP-BRAK-DANYCH")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <p className="text-neutral-700">{t("UI-PORP-OF-MARKA-SRODEK")}</p>
              </section>

              {podsumowanie && sekcjeUrzadzenia.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className="break-after-avoid font-semibold">{t("UI-PORP-OF-URZADZENIE-TYTUL")}</h3>
                  <p className="break-after-avoid">{t("UI-PORP-OF-URZADZENIE", { nazwa: `${podsumowanie.urzadzenie.producent} ${podsumowanie.urzadzenie.model}` })}</p>
                  {sekcjeUrzadzenia.map(({ w, x }) => (
                    <div key={w.litera} className="flex break-inside-avoid flex-col gap-1">
                      <h4 className="font-medium">
                        {naglowekWersji(w)} ({t("UI-PORP-OF-SZTUK", { n: x.wynik.liczbaPaneli })})
                      </h4>
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

              <section className="flex break-inside-avoid flex-col gap-1">
                <h3 className="font-semibold">{t("UI-PORP-OF-SLAD-TYTUL")}</h3>
                <p className="text-neutral-700">{t("UI-PORP-OF-SLAD-OPIS")}</p>
                <ul className="list-disc pl-5 text-neutral-700">
                  <li>{t("UI-PORP-OF-SLAD-APP", { wersja: wersjaZeZnacznikiem() })}</li>
                  <li>{t("UI-PORP-OF-SLAD-SILNIK", { wersja: CALCULATOR_VERSION })}</li>
                  {dane.pogodaPobrano && <li>{t("UI-PORP-OF-SLAD-POGODA", { data: new Date(dane.pogodaPobrano).toLocaleDateString(jezyk) })}</li>}
                  {podsumowanie && sekcjeUrzadzenia.length > 0 && <li>{t("UI-PORP-OF-SLAD-KATALOG", { data: podsumowanie.urzadzenie.dataOdczytu })}</li>}
                  {pokazBos && <li>{t("UI-PORP-OF-SLAD-CENNIK", { data: DATA_CENNIKA_BOS })}</li>}
                </ul>
              </section>

              <section className="flex break-inside-avoid flex-col gap-1 rounded border border-neutral-400 bg-neutral-100 p-3">
                <h3 className="font-semibold">{t("UI-PORP-OF-MARKA-CTA-TYTUL")}</h3>
                <p>{t("UI-PORP-OF-MARKA-CTA")}</p>
              </section>
            </article>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td className="border-t border-neutral-400 px-4 py-2 text-caption text-neutral-700">{t("UI-PORP-OF-STOPKA", { wersja: wersjaZeZnacznikiem(), data })}</td>
        </tr>
      </tfoot>
    </table>
  )
}

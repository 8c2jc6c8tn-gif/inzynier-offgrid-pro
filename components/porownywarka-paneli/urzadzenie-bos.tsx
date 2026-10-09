"use client"

import { useMemo } from "react"
import { WyborUrzadzeniaPv } from "@/components/urzadzenia-pv/wybor-urzadzenia"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { CENNIK_BOS, VAT_OSPRZETU, type BosId } from "@/lib/core/dane/cennik-bos"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { LimityWejsciaPv, OcenaWariantuUrzadzenia } from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"
import { useTranslate, useSymbolWaluty } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import type { FormularzStan } from "@/lib/porownywarka-paneli/stan"
import { kluczUkladu, podsumujUrzadzenie, wylaczoneBos, type PanelNaUrzadzeniu } from "@/lib/porownywarka-paneli/urzadzenie"
import { useDenominacja } from "@/lib/waluta/use-waluta"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

const KLUCZ_POZYCJI: Record<BosId, string> = {
  "kabel-pv": "UI-PORP-URZ-BOS-L-KABEL",
  mc4: "UI-PORP-URZ-BOS-L-MC4",
  "bezpiecznik-dc": "UI-PORP-URZ-BOS-L-BEZPIECZNIK",
  "rozlacznik-dc": "UI-PORP-URZ-BOS-L-ROZLACZNIK",
  "spd-dc": "UI-PORP-URZ-BOS-L-SPD",
  "rozdzielnia-dc": "UI-PORP-URZ-BOS-L-ROZDZIELNIA",
  konstrukcja: "UI-PORP-URZ-BOS-L-KONSTRUKCJA",
}
const KLUCZ_JEDNOSTKI = {
  m: "UI-PORP-URZ-J-M",
  para: "UI-PORP-URZ-J-PARA",
  zestaw: "UI-PORP-URZ-J-ZESTAW",
  szt: "UI-PORP-URZ-J-SZT",
  panel: "UI-PORP-URZ-J-PANEL",
} as const

type Tlumacz = ReturnType<typeof useTranslate>

/** Value of a catalogue limit as text, or the standard "the datasheet does not give it" wording. */
function zakresOkna(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${f0(min)}–${f0(max)} V`
  if (max !== null) return `≤ ${f0(max)} V`
  if (min !== null) return `≥ ${f0(min)} V`
  return null
}

/**
 * Zakładka „Falownik i osprzęt” (A4): panele z A3 dopasowane do urządzenia z katalogu (falownik, regulator MPPT, mikroinwerter) —
 * cztery kontrole na wejściu PV, liczba urządzeń, limit mocy — oraz orientacyjny koszt osprzętu dla wybranego układu stringów.
 * Brak limitu na karcie urządzenia to „brak danych”, nie zgadnięta liczba; ceny osprzętu to zakresy z cennika, zawsze do nadpisania.
 */
export function UrzadzenieIBos(p: {
  panele: WynikPanelu[]
  /** Dane paneli przekazane do silnika (moc i elektryka każdego panelu). */
  dane: DanePanelu[]
  stan: FormularzStan
  ustaw: <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => void
  /** Przejście na zakładkę „Elektryka”, gdzie wpisuje się najniższą temperaturę. */
  naElektryke: () => void
}) {
  const t = useTranslate()
  const waluta = useSymbolWaluty()
  const { kurs } = useDenominacja()
  const { stan, ustaw } = p
  const podsumowanie = useMemo(() => podsumujUrzadzenie({ stan, panele: p.panele, dane: p.dane, kurs }), [stan, p.panele, p.dane, kurs])
  const urzadzenie = podsumowanie?.urzadzenie
  const limity = podsumowanie?.limity ?? null
  const mikro = podsumowanie?.mikro ?? false
  const wylaczone = wylaczoneBos(stan)
  const akumV = liczba(stan.akumV ?? "") ?? null
  const wymagaAkumulatora = urzadzenie !== undefined && (urzadzenie.napieciaAkumulatoraV?.length ?? 0) > 1 && urzadzenie.mocPvNominalna !== null

  const maDaneElektryczne = p.dane.some((x) => x.elektryka)
  // Results carry the electrics only when the lowest temperature is typed, so "no results at all" means that temperature is missing.
  const brakTmin = maDaneElektryczne && p.panele.every((x) => x.elektryka === null)

  const przelaczPozycje = (id: BosId, wliczona: boolean) =>
    ustaw("bosWylaczone", wliczona ? wylaczone.filter((x) => x !== id) : [...wylaczone.filter((x) => x !== id), id])
  const ustawCene = (id: BosId, tekst: string) => ustaw("bosCeny", { ...stan.bosCeny, [id]: tekst })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">{t("UI-PORP-URZ-OPIS")}</p>

      <section className="flex flex-col gap-3 rounded-lg border p-3">
        <WyborUrzadzeniaPv
          urzadzenieId={stan.urzadzenieId ?? ""}
          onWybierz={(id) => {
            ustaw("urzadzenieId", id)
            ustaw("akumV", "")
          }}
          rodzaje={["regulator-mppt", "falownik-hybrydowy", "mikroinwerter-sieciowy"]}
        />
        {urzadzenie && wymagaAkumulatora && (
          <PoleSelect
            label={t("UI-PORP-URZ-AKUM")}
            value={stan.akumV ?? ""}
            onChange={(e) => ustaw("akumV", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="urzAkumulator" />}
          >
            <option value="">{t("UI-PORP-URZ-AKUM-WYBIERZ")}</option>
            {urzadzenie.napieciaAkumulatoraV!.map((v) => (
              <option key={v} value={String(v)}>
                {v} V
              </option>
            ))}
          </PoleSelect>
        )}
        {limity && <LimityUrzadzenia limity={limity} />}
        <Pole
          label={t("UI-PORP-URZ-TRASA")}
          unit="m"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={stan.trasaM ?? ""}
          onChange={(e) => ustaw("trasaM", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="urzTrasa" />}
        />
        <Pole
          label={t("UI-PORP-URZ-CENA-URZ")}
          unit={waluta}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={stan.cenaUrzadzenia ?? ""}
          onChange={(e) => ustaw("cenaUrzadzenia", e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="urzCenaUrzadzenia" />}
        />
      </section>

      {!urzadzenie && <p className="text-small">{t("UI-PORP-URZ-BRAK-WYBORU")}</p>}
      {urzadzenie && wymagaAkumulatora && akumV === null && <p className="text-small text-muted-foreground">{t("UI-PORP-URZ-AKUM-BRAK")}</p>}
      {urzadzenie && !maDaneElektryczne && <p className="text-small text-muted-foreground">{t("UI-PORP-URZ-BRAK-DANYCH-PANELI")}</p>}
      {urzadzenie && brakTmin && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-small">{t("UI-PORP-URZ-BRAK-TMIN")}</p>
          <Button type="button" variant="outline" onClick={p.naElektryke}>
            {t("UI-PORP-URZ-DO-ELEKTRYKI")}
          </Button>
        </div>
      )}

      {podsumowanie?.panele.map((x) => (
        <PanelNaUrzadzeniu
          key={x.wynik.id}
          panel={x}
          mikro={mikro}
          onUklad={(klucz) => ustaw("bosUklad", { ...stan.bosUklad, [x.wynik.id]: klucz })}
          waluta={waluta}
        />
      ))}

      {urzadzenie && !mikro && (
        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-URZ-CENY-TYTUL")}</summary>
          <div className="mt-3 flex flex-col gap-3">
            <p className="text-caption text-muted-foreground">{t("UI-PORP-URZ-CENY-OPIS")}</p>
            {CENNIK_BOS.map((poz) => {
              const min = poz.nettoMinZl * (1 + VAT_OSPRZETU) * kurs
              const max = poz.nettoMaxZl * (1 + VAT_OSPRZETU) * kurs
              return (
                <div key={poz.id} className="flex flex-col gap-2 rounded-md border p-2">
                  <PoleCheckbox
                    id={`bos-${poz.id}`}
                    label={t(KLUCZ_POZYCJI[poz.id])}
                    hint={poz.pewnosc === "bardzo-orientacyjna" ? t("UI-PORP-URZ-BOS-BARDZO") : undefined}
                    checked={!wylaczone.includes(poz.id)}
                    onChange={(e) => przelaczPozycje(poz.id, e.target.checked)}
                  />
                  <Pole
                    label={t("UI-PORP-URZ-CENA-WLASNA", { pozycja: t(KLUCZ_POZYCJI[poz.id]) })}
                    unit={`${waluta}/${t(KLUCZ_JEDNOSTKI[poz.jednostka])}`}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    placeholder={min === max ? f2(min) : `${f2(min)}–${f2(max)}`}
                    value={stan.bosCeny?.[poz.id] ?? ""}
                    onChange={(e) => ustawCene(poz.id, e.target.value)}
                    pomoc={<PomocPola ekran="porownywarka-paneli" pole="urzCenaOsprzetu" />}
                  />
                </div>
              )
            })}
          </div>
        </details>
      )}

      {podsumowanie && podsumowanie.panele.length > 0 && (
        <>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-URZ-NOTA")}</p>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-URZ-NOTA-ILOSCI")}</p>
        </>
      )}
    </div>
  )
}

/** The limits the checks use, as read from the device card — including the ones the card does not give. */
function LimityUrzadzenia({ limity }: { limity: LimityWejsciaPv }) {
  const t = useTranslate()
  const brak = t("UI-PORP-URZ-KARTA-NIE-PODAJE")
  if (!limity.maWejsciePv) return <p className="text-small">{t("UI-PORP-URZ-BEZ-WEJSCIA-PV")}</p>
  const okno = zakresOkna(limity.mpptMinV, limity.mpptMaxV)
  const moc =
    limity.mocLimitW === null || limity.mocLimitRodzaj === null
      ? null
      : `${f0(limity.mocLimitW)} W (${t(
          limity.mocLimitRodzaj === "wejscie-pv" ? "UI-PORP-URZ-MOC-R-WEJSCIE" : limity.mocLimitRodzaj === "wyjscie-ac" ? "UI-PORP-URZ-MOC-R-AC" : "UI-PORP-URZ-MOC-R-NOMINALNA",
        )})`
  const wiersze: [string, string][] = [
    [
      "UI-PORP-URZ-L-VOC",
      limity.vocMaxV === null ? brak : limity.vocLimitZastepczy ? t("UI-PORP-URZ-L-VOC-ZAST", { v: f0(limity.vocMaxV) }) : `${f0(limity.vocMaxV)} V`,
    ],
    ["UI-PORP-URZ-L-OKNO", okno ?? t("UI-PORP-URZ-L-OKNO-BRAK")],
    ["UI-PORP-URZ-L-PRAD", limity.iMaxWejsciaA === null ? brak : `${f1(limity.iMaxWejsciaA)} A`],
    ["UI-PORP-URZ-L-ISC", limity.iscMaxWejsciaA === null ? brak : `${f1(limity.iscMaxWejsciaA)} A`],
    ["UI-PORP-URZ-L-WEJSCIA", limity.liczbaWejsc === null ? brak : String(limity.liczbaWejsc)],
    ["UI-PORP-URZ-L-MOC", moc ?? brak],
  ]
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-1 rounded-md bg-muted/40 p-2 text-small sm:grid-cols-2">
      {wiersze.map(([klucz, wartosc]) => (
        <div key={klucz}>
          <dt className="text-caption text-muted-foreground">{t(klucz)}</dt>
          <dd className="tabular-nums">{wartosc}</dd>
        </div>
      ))}
    </dl>
  )
}

type PanelProps = {
  panel: PanelNaUrzadzeniu
  mikro: boolean
  onUklad: (klucz: string) => void
  waluta: string
}

function PanelNaUrzadzeniu(p: PanelProps) {
  const t = useTranslate()
  const { wynik, dopasowanie: d, wybrany, bos } = p.panel
  const proponowany = d.proponowany === null ? null : d.warianty[d.proponowany]!
  const mieszczace = d.warianty.filter((w) => w.liczbaUrzadzen !== null)

  const limity = d.limity
  const mocRodzaj = limity.mocLimitRodzaj === "wejscie-pv" ? "UI-PORP-URZ-MOC-R-WEJSCIE" : limity.mocLimitRodzaj === "wyjscie-ac" ? "UI-PORP-URZ-MOC-R-AC" : "UI-PORP-URZ-MOC-R-NOMINALNA"

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-3">
      <h3 className="text-small font-medium">{t("UI-PORP-ELE-PANEL", { nazwa: wynik.nazwa, n: wynik.liczbaPaneli })}</h3>

      <p className="text-small font-medium">
        {proponowany === null
          ? t("UI-PORP-URZ-BRAK-PROPOZYCJI")
          : t("UI-PORP-URZ-PROPOZYCJA", { s: proponowany.panelowWSzeregu, p: proponowany.stringowRownolegle, d: proponowany.liczbaUrzadzen! })}
      </p>
      <p className="text-small text-muted-foreground">
        {d.maxPaneliNaUrzadzenie === null
          ? t("UI-PORP-URZ-MAX-BRAK")
          : d.maxPaneliNaUrzadzenie === 0
            ? t("UI-PORP-URZ-MAX-ZERO")
            : t(d.maxPaneliSzacunek ? "UI-PORP-URZ-MAX-SZACUNEK" : "UI-PORP-URZ-MAX", { n: d.maxPaneliNaUrzadzenie })}
      </p>

      <ul className="flex flex-col gap-2">
        {d.warianty.map((w, i) => (
          <li key={kluczUkladu(w)} className="rounded-md border p-2 text-small">
            <p className="font-medium">
              {t("UI-PORP-URZ-UKLAD", { s: w.panelowWSzeregu, p: w.stringowRownolegle })}
              {" — "}
              {w.liczbaUrzadzen === null ? t("UI-PORP-URZ-NIE-MIESCI") : t("UI-PORP-URZ-LICZBA-URZ", { d: w.liczbaUrzadzen })}
              {i === d.proponowany && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-caption">{t("UI-PORP-URZ-PROPOZYCJA-ZNACZNIK")}</span>}
            </p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {kontrole(w, t).map(([ikona, tekst], j) => (
                <li key={j}>
                  <span aria-hidden="true" className="mr-1">
                    {ikona}
                  </span>
                  {tekst}
                </li>
              ))}
            </ul>
            {w.liczbaUrzadzen !== null && w.mocLimitW !== null && (
              <p className="mt-1 text-muted-foreground">
                {w.nadmiarMocyW === 0
                  ? t("UI-PORP-URZ-MOC-OK", { p: f0(w.mocPaneliW), l: f0(w.mocLimitW), rodzaj: t(mocRodzaj) })
                  : t("UI-PORP-URZ-MOC-NADMIAR", { p: f0(w.mocPaneliW), l: f0(w.mocLimitW), rodzaj: t(mocRodzaj), n: f0(w.nadmiarMocyW!) })}
              </p>
            )}
          </li>
        ))}
      </ul>

      {p.mikro && wybrany !== null && <p className="text-small text-muted-foreground">{t("UI-PORP-URZ-BOS-MIKRO")}</p>}

      {bos && wybrany && (
        <div className="flex flex-col gap-2 border-t pt-3">
          <h4 className="text-small font-medium">{t("UI-PORP-URZ-BOS-TYTUL")}</h4>
          {mieszczace.length > 1 && (
            <PoleSelect
              label={t("UI-PORP-URZ-BOS-UKLAD")}
              value={kluczUkladu(wybrany)}
              onChange={(ev) => p.onUklad(ev.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="urzUkladBos" />}
            >
              {mieszczace.map((w) => (
                <option key={kluczUkladu(w)} value={kluczUkladu(w)}>
                  {t("UI-PORP-URZ-UKLAD", { s: w.panelowWSzeregu, p: w.stringowRownolegle })} ({t("UI-PORP-URZ-LICZBA-URZ", { d: w.liczbaUrzadzen! })})
                </option>
              ))}
            </PoleSelect>
          )}
          <p className="text-small">{t("UI-PORP-URZ-BOS-UKLAD-WYBRANY", { s: wybrany.panelowWSzeregu, p: wybrany.stringowRownolegle })}</p>
          <PozycjeBos panel={p.panel} waluta={p.waluta} />
          <p className="text-caption text-muted-foreground">{t("UI-PORP-URZ-BOS-NOTA")}</p>
        </div>
      )}
    </section>
  )
}

const zakresKwot = (min: number, max: number, waluta: string) => (Math.round(min) === Math.round(max) ? `${f0(min)} ${waluta}` : `${f0(min)}–${f0(max)} ${waluta}`)

/**
 * Pozycje osprzętu wybranego układu z ilością, ceną jednostkową, sumami i łączną kwotą — ta sama lista na ekranie i w wydruku oferty
 * (`druk`: bez ramek, ciemny tekst na białej kartce).
 */
export function PozycjeBos(p: { panel: PanelNaUrzadzeniu; waluta: string; druk?: boolean }) {
  const t = useTranslate()
  const { bos, ochronaA3, razemMin, razemMax } = p.panel
  if (!bos) return null
  const przygaszony = p.druk ? "text-neutral-700" : "text-muted-foreground"
  return (
    <>
      <ul className="flex flex-col gap-1">
        {bos.linie
          .filter((l) => l.wliczona)
          .map((l) => (
            <li key={l.id} className={p.druk ? "border-b border-neutral-300 py-1 text-small" : "rounded-md border p-2 text-small"}>
              <p className="font-medium">
                {t(KLUCZ_POZYCJI[l.id])}
                {l.pewnosc === "bardzo-orientacyjna" && <span className={`ml-2 text-caption ${przygaszony}`}> ({t("UI-PORP-URZ-BOS-BARDZO")})</span>}
              </p>
              <p className={`tabular-nums ${przygaszony}`}>
                {l.ilosc === null
                  ? t("UI-PORP-URZ-BOS-BRAK-ILOSCI")
                  : t("UI-PORP-URZ-BOS-WIERSZ", {
                      n: f0(l.ilosc),
                      j: t(KLUCZ_JEDNOSTKI[l.jednostka]),
                      cena: l.cenaMin === l.cenaMax ? f2(l.cenaMin) : `${f2(l.cenaMin)}–${f2(l.cenaMax)}`,
                      waluta: p.waluta,
                    })}
                {l.sumaMin !== null && l.sumaMax !== null && ` = ${zakresKwot(l.sumaMin, l.sumaMax, p.waluta)}`}
              </p>
              {l.id === "bezpiecznik-dc" && <p className={`text-caption ${przygaszony}`}>{t("UI-PORP-URZ-BOS-BEZPIECZNIK-UWAGA")}</p>}
            </li>
          ))}
      </ul>
      {ochronaA3 === null && <p className={`text-caption ${przygaszony}`}>{t("UI-PORP-URZ-BOS-OCHRONA-NIEZNANA")}</p>}
      {bos.brakIlosci.includes("kabel-pv") && <p className={`text-caption ${przygaszony}`}>{t("UI-PORP-URZ-BOS-BRAK-TRASY")}</p>}
      <p className="text-small font-medium">{t("UI-PORP-URZ-BOS-SUMA", { zakres: zakresKwot(bos.sumaMin, bos.sumaMax, p.waluta) })}</p>
      {razemMin !== null && razemMax !== null ? (
        <p className="text-small font-medium">{t("UI-PORP-URZ-BOS-RAZEM", { zakres: zakresKwot(razemMin, razemMax, p.waluta) })}</p>
      ) : (
        <p className={`text-caption ${przygaszony}`}>{t("UI-PORP-URZ-BOS-RAZEM-BRAK")}</p>
      )}
    </>
  )
}

/** One line per check: a symbol (✓ fits, ✗ does not, ? the card does not say) and the sentence with the numbers. */
function kontrole(w: OcenaWariantuUrzadzenia, t: Tlumacz): [string, string][] {
  const wynik: [string, string][] = []
  if (w.ukladNiedozwolony) wynik.push(["✗", t("UI-PORP-URZ-K-UKLAD-NIEDOZWOLONY")])

  const j = w.napiecieJalowe
  const jParams = { v: f1(j.wartoscV), l: j.limitV === null ? "" : f0(j.limitV), proc: j.wykorzystanieProc === null ? "" : f0(j.wykorzystanieProc) }
  wynik.push(
    j.status === "ok"
      ? ["✓", t("UI-PORP-URZ-K-VOC-OK", jParams)]
      : j.status === "przekroczone"
        ? ["✗", t("UI-PORP-URZ-K-VOC-ZA-DUZO", jParams)]
        : j.limitV === null
          ? ["?", t("UI-PORP-URZ-K-VOC-BRAK", jParams)]
          : ["?", t("UI-PORP-URZ-K-VOC-ZAST", jParams)],
  )

  const o = w.oknoMppt
  const zakres = zakresOkna(o.minV, o.maxV)
  const oParams = { v: f1(o.vmpV), zakres: zakres ?? "", min: o.minV === null ? "" : f0(o.minV), max: o.maxV === null ? "" : f0(o.maxV) }
  wynik.push(
    o.status === "ok"
      ? ["✓", t("UI-PORP-URZ-K-OKNO-OK", oParams)]
      : o.status === "ponizej"
        ? ["✗", t("UI-PORP-URZ-K-OKNO-PONIZEJ", oParams)]
        : o.status === "powyzej"
          ? ["✗", t("UI-PORP-URZ-K-OKNO-POWYZEJ", oParams)]
          : ["?", t("UI-PORP-URZ-K-OKNO-BRAK")],
  )

  const prad = (c: OcenaWariantuUrzadzenia["pradRoboczy"], ok: string, zaDuzo: string, brak: string): [string, string] => {
    const params = { a: f1(c.wartoscA), l: c.limitA === null ? "" : f1(c.limitA) }
    return c.status === "ok" ? ["✓", t(ok, params)] : c.status === "przekroczone" ? ["✗", t(zaDuzo, params)] : ["?", t(brak)]
  }
  wynik.push(prad(w.pradRoboczy, "UI-PORP-URZ-K-PRAD-OK", "UI-PORP-URZ-K-PRAD-ZA-DUZO", "UI-PORP-URZ-K-PRAD-BRAK"))
  wynik.push(prad(w.pradZwarcia, "UI-PORP-URZ-K-ISC-OK", "UI-PORP-URZ-K-ISC-ZA-DUZO", "UI-PORP-URZ-K-ISC-BRAK"))
  return wynik
}

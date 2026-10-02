"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWspolczynnik } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/calculator"
import {
  DOMYSLNE_WAGI_PCT,
  PROG_SLABY_PUNKT_PCT,
  SKLADOWE,
  type SkladowaId,
  type WagiPct,
} from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/constants"
import {
  zAnalizySpof,
  zBlackoutu,
  zDeficytow,
  zStrategiiZamarzanie,
  type SeedBlackout,
  type SeedDeficytow,
  type SeedSpof,
  type SeedStrategii,
} from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/zrodla"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const EKRAN = "wspolczynnik-bezpieczenstwa-zimowego"

type Pola =
  | "produkcja"
  | "zapotrzebowanie"
  | "autonomia"
  | "wymaganaAutonomia"
  | "komponenty"
  | "spof"
  | "mocAgregatu"
  | "mocWymagana"
  | "okno"
  | "wymaganyCzas"
type FormularzStan = Record<Pola, string> & {
  brakAgregatu: boolean
  wlasneWagi: boolean
  wagi: Record<SkladowaId, string>
}

const wagiJakTekst = (w: WagiPct): Record<SkladowaId, string> =>
  Object.fromEntries(SKLADOWE.map((id) => [id, String(w[id])])) as Record<SkladowaId, string>

const STAN_POCZATKOWY: FormularzStan = {
  produkcja: "",
  zapotrzebowanie: "",
  autonomia: "",
  wymaganaAutonomia: "",
  komponenty: "",
  spof: "",
  mocAgregatu: "",
  mocWymagana: "",
  okno: "",
  wymaganyCzas: "",
  brakAgregatu: false,
  wlasneWagi: false,
  wagi: wagiJakTekst(DOMYSLNE_WAGI_PCT),
}

/** Screens that feed each component (mirrors the table in docs/lista-do-zrobienia.md, „M7/E12 — skąd składowe”). */
const ZRODLA: { id: SkladowaId; wczytuje: [string, string][]; zalezy: [string, string][] }[] = [
  {
    id: "pokrycie",
    wczytuje: [["/kalkulatory/deficyty-miesieczne", "UI-M7-WSP-L-E2"]],
    zalezy: [
      ["/kalkulatory/zuzycie-miesieczne", "UI-M7-WSP-L-M2-ZUZYCIE"],
      ["/kalkulatory/liczba-paneli", "UI-M7-WSP-L-M3-PANELE"],
      ["/kalkulatory/snieg-na-pv", "UI-M7-WSP-L-E7"],
    ],
  },
  {
    id: "autonomia",
    wczytuje: [["/kalkulatory/blackout", "UI-M7-WSP-L-E4"]],
    zalezy: [
      ["/kalkulatory/dni-autonomii", "UI-M7-WSP-L-M4-DNI"],
      ["/kalkulatory/strategia-zamarzanie", "UI-M7-WSP-L-E6"],
      ["/kalkulatory/deficyty-miesieczne", "UI-M7-WSP-L-E2"],
    ],
  },
  {
    id: "odpornosc",
    wczytuje: [["/kalkulatory/analiza-spof", "UI-M7-WSP-L-E10"]],
    zalezy: [
      ["/kalkulatory/elektronika-w-mrozie", "UI-M7-WSP-L-E19"],
      ["/kalkulatory/pompy-zawory-w-mrozie", "UI-M7-WSP-L-E21"],
    ],
  },
  {
    id: "agregat",
    wczytuje: [["/kalkulatory/deficyty-miesieczne", "UI-M7-WSP-L-E2"]],
    zalezy: [
      ["/kalkulatory/agregat-pradotworczy", "UI-M7-WSP-L-M2-AGREGAT"],
      ["/kalkulatory/agregat-w-mrozie", "UI-M7-WSP-L-E8"],
    ],
  },
  {
    id: "reakcja",
    wczytuje: [["/kalkulatory/strategia-zamarzanie", "UI-M7-WSP-L-E6"]],
    zalezy: [
      ["/kalkulatory/pojemnosc-cieplna", "UI-M7-WSP-L-M6-POJ"],
      ["/kalkulatory/pre-heat", "UI-M7-WSP-L-E18"],
      ["/kalkulatory/ryzyko-zamarzniecia", "UI-M7-WSP-L-E22"],
    ],
  },
]

/** The user's own weights from the form; null while „own weights” is off (the default set is used). */
const wagiZeStanu = (stan: FormularzStan): WagiPct | null =>
  stan.wlasneWagi
    ? (Object.fromEntries(SKLADOWE.map((id) => [id, stan.wagi[id].trim() === "" ? 0 : Number(stan.wagi[id])])) as WagiPct)
    : null

const liczba = (s: string) => (s.trim() === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r0 = (x: number) => Math.round(x)

const przycisk = "min-h-11 self-start rounded-md border px-3 text-small font-medium hover:bg-muted"

export default function WspolczynnikBezpieczenstwaZimowegoPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>(EKRAN, STAN_POCZATKOWY)
  const e2 = useOdczytDraftu<SeedDeficytow>("deficyty-miesieczne").dane
  const e4 = useOdczytDraftu<SeedBlackout>("blackout").dane
  const e6 = useOdczytDraftu<SeedStrategii>("strategia-zamarzanie").dane
  const e10 = useOdczytDraftu<SeedSpof>("analiza-spof").dane

  const z2 = useMemo(() => zDeficytow(e2), [e2])
  const z4 = useMemo(() => zBlackoutu(e4), [e4])
  const z6 = useMemo(() => zStrategiiZamarzanie(e6), [e6])
  const z10 = useMemo(() => zAnalizySpof(e10), [e10])

  const wpisz = (zmiana: Partial<Record<Pola, string>>) => setStan((prev) => ({ ...prev, ...zmiana }))
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const wagiWlasne = wagiZeStanu(stan)
  const sumaWagWpisanych = wagiWlasne ? SKLADOWE.reduce((s, id) => s + wagiWlasne[id], 0) : 100

  const result = useMemo(
    () =>
      calculateWspolczynnik({
        produkcjaNajgorszyMiesiacKwh: liczba(stan.produkcja),
        zapotrzebowanieNajgorszyMiesiacKwh: liczba(stan.zapotrzebowanie),
        autonomiaDni: liczba(stan.autonomia),
        wymaganaAutonomiaDni: liczba(stan.wymaganaAutonomia),
        liczbaKomponentow: liczba(stan.komponenty),
        liczbaSpof: liczba(stan.spof),
        brakAgregatu: stan.brakAgregatu,
        mocAgregatuKw: liczba(stan.mocAgregatu),
        mocWymaganaAgregatuKw: liczba(stan.mocWymagana),
        oknoReakcjiH: liczba(stan.okno),
        wymaganyCzasReakcjiH: liczba(stan.wymaganyCzas),
        wagiWlasne: wagiZeStanu(stan),
      }),
    [stan],
  )
  const v = result.value
  const nazwa = (id: SkladowaId) => t(`UI-M7-WSP-SK-${id.toUpperCase()}`)
  const zapotrzebowanie = liczba(stan.zapotrzebowanie)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href={`/kalkulatory/${EKRAN}`} />
      <NaglowekEkranu tytul={t("UI-M7-WSP-TYTUL")} ekran={EKRAN} wynik={result} parametry={{ prog: PROG_SLABY_PUNKT_PCT }}>
        {t("UI-M7-WSP-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{`1. ${nazwa("pokrycie")}`}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-SKO-POKRYCIE")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-WSP-PRODUKCJA")} unit="kWh" {...pole("produkcja")} pomoc={<PomocPola ekran={EKRAN} pole="produkcja" />} />
          <Pole label={t("UI-M7-WSP-ZAPOTRZEBOWANIE")} unit="kWh" {...pole("zapotrzebowanie")} pomoc={<PomocPola ekran={EKRAN} pole="zapotrzebowanie" />} />
        </div>
        {z2.najwiekszyDeficytKwh !== null && zapotrzebowanie !== null && zapotrzebowanie > 0 && (
          <button
            type="button"
            className={przycisk}
            onClick={() => wpisz({ produkcja: String(r1(Math.max(0, zapotrzebowanie - z2.najwiekszyDeficytKwh!))) })}
          >
            {t("UI-M7-WSP-WSTAW-PRODUKCJE", { deficyt: r1(z2.najwiekszyDeficytKwh) })}
          </button>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{`2. ${nazwa("autonomia")}`}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-SKO-AUTONOMIA")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-WSP-AUTONOMIA")} unit={t("UI-J-DNI")} {...pole("autonomia")} pomoc={<PomocPola ekran={EKRAN} pole="autonomia" />} />
          <Pole label={t("UI-M7-WSP-WYMAGANA-AUTONOMIA")} unit={t("UI-J-DNI")} {...pole("wymaganaAutonomia")} pomoc={<PomocPola ekran={EKRAN} pole="wymaganaAutonomia" />} />
        </div>
        {z4 && (
          <button
            type="button"
            className={przycisk}
            onClick={() => wpisz({ autonomia: String(r1(z4.autonomiaDni)), wymaganaAutonomia: String(z4.wymaganaAutonomiaDni) })}
          >
            {t("UI-M7-WSP-WSTAW-AUTONOMIE", { dni: r1(z4.autonomiaDni), wym: z4.wymaganaAutonomiaDni })}
          </button>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{`3. ${nazwa("odpornosc")}`}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-SKO-ODPORNOSC")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-WSP-KOMPONENTY")} unit={t("UI-J-SZT")} {...pole("komponenty")} pomoc={<PomocPola ekran={EKRAN} pole="komponenty" />} />
          <Pole label={t("UI-M7-WSP-SPOF")} unit={t("UI-J-SZT")} {...pole("spof")} pomoc={<PomocPola ekran={EKRAN} pole="spof" />} />
        </div>
        {z10 && (
          <button
            type="button"
            className={przycisk}
            onClick={() => wpisz({ komponenty: String(z10.liczbaKomponentow), spof: String(z10.liczbaSpof) })}
          >
            {t("UI-M7-WSP-WSTAW-SPOF", { spof: z10.liczbaSpof, n: z10.liczbaKomponentow })}
          </button>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{`4. ${nazwa("agregat")}`}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-SKO-AGREGAT")}</p>
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="wsp-brak-agregatu"
            className="flex-1"
            label={t("UI-M7-WSP-BRAK-AGREGATU")}
            checked={stan.brakAgregatu}
            onChange={(e) => setStan((prev) => ({ ...prev, brakAgregatu: e.target.checked }))}
          />
          <PomocPola ekran={EKRAN} pole="brakAgregatu" />
        </div>
        {!stan.brakAgregatu && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Pole label={t("UI-M7-WSP-MOC-AGREGATU")} unit="kW" {...pole("mocAgregatu")} pomoc={<PomocPola ekran={EKRAN} pole="mocAgregatu" />} />
              <Pole label={t("UI-M7-WSP-MOC-WYMAGANA")} unit="kW" {...pole("mocWymagana")} pomoc={<PomocPola ekran={EKRAN} pole="mocWymagana" />} />
            </div>
            {z2.mocAgregatuKw !== null && (
              <button type="button" className={przycisk} onClick={() => wpisz({ mocAgregatu: String(z2.mocAgregatuKw) })}>
                {t("UI-M7-WSP-WSTAW-AGREGAT", { moc: r1(z2.mocAgregatuKw) })}
              </button>
            )}
          </>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{`5. ${nazwa("reakcja")}`}</legend>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-SKO-REAKCJA")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-WSP-OKNO")} unit="h" {...pole("okno")} pomoc={<PomocPola ekran={EKRAN} pole="okno" />} />
          <Pole label={t("UI-M7-WSP-WYMAGANY-CZAS")} unit="h" {...pole("wymaganyCzas")} pomoc={<PomocPola ekran={EKRAN} pole="wymaganyCzas" />} />
        </div>
        {z6 && (
          <button type="button" className={przycisk} onClick={() => wpisz({ okno: String(r1(z6.czasKrytycznychH)) })}>
            {t("UI-M7-WSP-WSTAW-REAKCJE", { h: r1(z6.czasKrytycznychH) })}
          </button>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-small font-medium">{t("UI-M7-WSP-WAGI-TYTUL")}</legend>
        <p className="text-small font-medium">{t(stan.wlasneWagi ? "UI-M7-WSP-ZESTAW-WLASNY" : "UI-M7-WSP-ZESTAW-DOMYSLNY")}</p>
        <div
          role="note"
          className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small text-werdykt-uwaga-foreground"
        >
          {t(stan.wlasneWagi ? "UI-M7-WSP-NOTA-WLASNE" : "UI-M7-WSP-NOTA-WSTEPNE")}
        </div>
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="wsp-wlasne-wagi"
            className="flex-1"
            label={t("UI-M7-WSP-WAGI-WLASNE")}
            checked={stan.wlasneWagi}
            onChange={(e) => setStan((prev) => ({ ...prev, wlasneWagi: e.target.checked }))}
          />
          <PomocPola ekran={EKRAN} pole="wlasneWagi" />
        </div>
        {stan.wlasneWagi ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {SKLADOWE.map((id) => (
                <Pole
                  key={id}
                  label={t("UI-M7-WSP-WAGA", { nazwa: nazwa(id) })}
                  unit="%"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={stan.wagi[id]}
                  onChange={(e) => setStan((prev) => ({ ...prev, wagi: { ...prev.wagi, [id]: e.target.value } }))}
                  pomoc={<PomocPola ekran={EKRAN} pole="waga" />}
                />
              ))}
            </div>
            <p className={`text-small ${Math.abs(sumaWagWpisanych - 100) > 0.01 ? "font-medium text-werdykt-blad-foreground" : "text-muted-foreground"}`}>
              {t("UI-M7-WSP-WAGI-SUMA", { suma: r1(sumaWagWpisanych) })}
            </p>
            <button
              type="button"
              className={przycisk}
              onClick={() => setStan((prev) => ({ ...prev, wagi: wagiJakTekst(DOMYSLNE_WAGI_PCT) }))}
            >
              {t("UI-M7-WSP-WAGI-PRZYWROC")}
            </button>
          </>
        ) : (
          <ul className="text-small text-muted-foreground">
            {SKLADOWE.map((id) => (
              <li key={id}>
                {nazwa(id)}: {DOMYSLNE_WAGI_PCT[id]}%
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-WSP-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-M7-WSP-UZUPELNIJ", { lista: v.brakujace.map(nazwa).join(", ") })}
        </p>
      ) : (
        <WerdyktPanel poziom={v.slabePunkty.length > 0 ? "uwaga" : "ok"} etykieta={t(v.slabePunkty.length > 0 ? "UI-M7-WSP-W-UWAGA" : "UI-M7-WSP-W-OK")}>
          <WynikGlowny>{t("UI-M7-WSP-WYNIK", { proc: r0(v.wskaznikPct!) })}</WynikGlowny>
          {v.najslabsza && (
            <p className="mt-1 text-small">{t("UI-M7-WSP-NAJSLABSZA", { nazwa: nazwa(v.najslabsza.id), proc: r0(v.najslabsza.wynikPct) })}</p>
          )}
          {v.slabePunkty.length > 0 && (
            <p className="mt-1 text-small">{t("UI-M7-WSP-SLABE-LISTA", { lista: v.slabePunkty.map(nazwa).join(", ") })}</p>
          )}
          <p className="mt-2 text-small font-medium">{t(v.zestawWag === "wlasne" ? "UI-M7-WSP-ZESTAW-WLASNY" : "UI-M7-WSP-ZESTAW-DOMYSLNY")}</p>
          <table className="mt-1 w-full text-small">
            <thead>
              <tr className="text-left">
                <th className="font-medium">{t("UI-M7-WSP-TAB-SKLADOWA")}</th>
                <th className="font-medium">{t("UI-M7-WSP-TAB-WYNIK")}</th>
                <th className="font-medium">{t("UI-M7-WSP-TAB-WAGA")}</th>
                <th className="font-medium">{t("UI-M7-WSP-TAB-WKLAD")}</th>
              </tr>
            </thead>
            <tbody>
              {v.skladowe.map((c) => (
                <tr key={c.id}>
                  <td>{nazwa(c.id)}</td>
                  <td>{r0(c.wynikPct!)}%</td>
                  <td>{r1(c.wagaPct)}%</td>
                  <td>{r1(c.wkladPkt!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div role="note" className="mt-2 rounded-md border border-current p-2 text-small font-medium">
            {t(v.zestawWag === "wlasne" ? "UI-M7-WSP-NOTA-WLASNE" : "UI-M7-WSP-NOTA-WSTEPNE")}
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-small font-medium">{t("UI-M7-WSP-ZRODLA-TYTUL")}</h2>
        <p className="text-caption text-muted-foreground">{t("UI-M7-WSP-ZRODLA-OPIS")}</p>
        <ul className="flex flex-col gap-3 text-small">
          {ZRODLA.map((z) => (
            <li key={z.id} className="flex flex-col gap-1">
              <span className="font-medium">{nazwa(z.id)}</span>
              <span className="text-muted-foreground">{t(`UI-M7-WSP-ZR-${z.id.toUpperCase()}`)}</span>
              <span>
                {t("UI-M7-WSP-WCZYTUJE")}{" "}
                {z.wczytuje.map(([href, klucz], i) => (
                  <span key={href}>
                    {i > 0 && ", "}
                    <Link href={href} className="underline">
                      {t(klucz)}
                    </Link>
                  </span>
                ))}
              </span>
              <span>
                {t("UI-M7-WSP-ZALEZY")}{" "}
                {z.zalezy.map(([href, klucz], i) => (
                  <span key={href}>
                    {i > 0 && ", "}
                    <Link href={href} className="underline">
                      {t(klucz)}
                    </Link>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

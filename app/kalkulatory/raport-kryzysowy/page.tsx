"use client"

/** Ekran zbiorczy (Wzorzec G): czyta zapisane szkice ekranów 1, 2, 4 i 12; jedyne własne pola (opcjonalna liczba paneli) zapisują się automatycznie w szkicu „raport-kryzysowy”. */
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { zBlackoutu, type SeedBlackout } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/zrodla"
import { useTranslate } from "@/lib/i18n/language-context"
import { zbudujRaport, type CzescRaportu } from "@/lib/stress-test/raport-kryzysowy"
import { KLUCZ_DRAFTU_SYMULACJI_MROZU, STAN_POCZATKOWY_SYMULACJI, type StanSymulacjiMrozu } from "@/lib/stress-test/symulacja-mrozu"
import { useWynikSymulacjiMrozu } from "@/lib/stress-test/use-symulacja-mrozu"
import { wynikDeficytowZeSzkicu, type PolaDeficytow } from "@/lib/stress-test/wejscie-deficytow"
import { wejscieWspolczynnika, wynikWspolczynnikaZeSzkicu, type PolaWspolczynnika } from "@/lib/stress-test/wejscie-wspolczynnika"
import { ZnakStanu } from "@/components/ui/znak-stanu"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

const EKRANY: Record<CzescRaportu, { href: string; tytul: string }> = {
  symulacja: { href: "/kalkulatory/symulacja-mrozu", tytul: "UI-M7-RAPORT-SEKCJA-SYM" },
  deficyty: { href: "/kalkulatory/deficyty-miesieczne", tytul: "UI-M7-RAPORT-SEKCJA-DEF" },
  blackout: { href: "/kalkulatory/blackout", tytul: "UI-M7-RAPORT-SEKCJA-BLACKOUT" },
  wspolczynnik: { href: "/kalkulatory/wspolczynnik-bezpieczenstwa-zimowego", tytul: "UI-M7-RAPORT-SEKCJA-WSP" },
}

/** Optional numbers for the panel count (form strings); the only inputs of this report, kept on the device like every other screen. */
type PaneleSeed = { liczbaDzis: string; uzyskPanelu: string }
const PUSTE_PANELE: PaneleSeed = { liczbaDzis: "", uzyskPanelu: "" }
const liczbaLubNull = (s: string) => (s.trim() === "" || !Number.isFinite(Number(s.replace(",", "."))) ? null : Number(s.replace(",", ".")))

export default function RaportKryzysowyPage() {
  const t = useTranslate()
  const [panele, setPanele] = usePersistedDraft<PaneleSeed>("raport-kryzysowy", PUSTE_PANELE)
  const e1 = useOdczytDraftu<StanSymulacjiMrozu>(KLUCZ_DRAFTU_SYMULACJI_MROZU)
  const e2 = useOdczytDraftu<Partial<PolaDeficytow>>("deficyty-miesieczne")
  const e4 = useOdczytDraftu<SeedBlackout>("blackout")
  const e12 = useOdczytDraftu<PolaWspolczynnika>("wspolczynnik-bezpieczenstwa-zimowego")

  const stanSymulacji = useMemo(() => ({ ...STAN_POCZATKOWY_SYMULACJI, ...e1.dane }), [e1.dane])
  const { result: symulacja } = useWynikSymulacjiMrozu(stanSymulacji)
  const raport = useMemo(
    () =>
      zbudujRaport({
        symulacja: e1.dane ? symulacja : null,
        deficyty: wynikDeficytowZeSzkicu(e2.dane),
        blackout: zBlackoutu(e4.dane),
        wspolczynnik: e12.dane ? { wynik: wynikWspolczynnikaZeSzkicu(e12.dane)!, wejscie: wejscieWspolczynnika(e12.dane) } : null,
        panele: { liczbaDzis: liczbaLubNull(panele.liczbaDzis), uzyskPaneluKwh: liczbaLubNull(panele.uzyskPanelu) },
      }),
    [e1.dane, symulacja, e2.dane, e4.dane, e12.dane, panele],
  )

  if (!(e1.wczytano && e2.wczytano && e4.wczytano && e12.wczytano)) return <StanLadowania linie={6} />

  const { symulacja: sym, deficyty: def, blackout, wspolczynnik: wsp } = raport
  const nazwaSkladowej = (id: string) => t(`UI-M7-WSP-SK-${id.toUpperCase()}`)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/raport-kryzysowy" />
      <NaglowekEkranu tytul={t("UI-M7-RAPORT-TYTUL")} ekran="raport-kryzysowy">
        {t("UI-M7-RAPORT-OPIS")}
      </NaglowekEkranu>

      {raport.dostepne.length === 0 ? (
        <StanPusty tytul={t("UI-M7-RAPORT-PUSTY-TYTUL")}>{t("UI-M7-RAPORT-PUSTY")}</StanPusty>
      ) : (
        <WerdyktPanel poziom={raport.wymagaUwagi ? "uwaga" : "ok"} etykieta={raport.wymagaUwagi ? t("UI-M7-RAPORT-WYNIK-UWAGA") : t("UI-M7-RAPORT-WYNIK-OK")}>
          {wsp?.wskaznikPct != null && <WynikGlowny>{t("UI-M7-RAPORT-WSKAZNIK", { proc: f0(wsp.wskaznikPct) })}</WynikGlowny>}
          {wsp?.pokrycieNajgorszegoMiesiaca && (
            <p className="mt-2 text-small">
              {wsp.pokrycieNajgorszegoMiesiaca.brakKwh > 0
                ? t("UI-M7-RAPORT-POKRYCIE", {
                    pokrycie: f0(wsp.pokrycieNajgorszegoMiesiaca.pokrycieProc),
                    kwh: f0(wsp.pokrycieNajgorszegoMiesiaca.brakKwh),
                    brak: f0(wsp.pokrycieNajgorszegoMiesiaca.brakProc),
                  })
                : t("UI-M7-RAPORT-POKRYCIE-PELNE")}
            </p>
          )}
          {wsp?.pokrycieNajgorszegoMiesiaca?.wzrostPvPct != null && (
            <p className="mt-1 text-small">{t("UI-M7-RAPORT-POKRYCIE-WZROST", { proc: f0(wsp.pokrycieNajgorszegoMiesiaca.wzrostPvPct) })}</p>
          )}
          {wsp?.pokrycieNajgorszegoMiesiaca?.dodatkowePanele && (
            <p className="mt-1 text-small">
              {t("UI-M7-RAPORT-PANELE-WYNIK", {
                kwh: f0(wsp.pokrycieNajgorszegoMiesiaca.brakKwh),
                n: wsp.pokrycieNajgorszegoMiesiaca.dodatkowePanele.sztuk,
                uzysk: f1(wsp.pokrycieNajgorszegoMiesiaca.dodatkowePanele.uzyskPaneluKwh),
              })}
            </p>
          )}
          {wsp?.najslabsza && (
            <p className="mt-1 text-small">{t("UI-M7-RAPORT-NAJSLABSZA", { nazwa: nazwaSkladowej(wsp.najslabsza.id), proc: f0(wsp.najslabsza.wynikPct) })}</p>
          )}
        </WerdyktPanel>
      )}

      {wsp?.pokrycieNajgorszegoMiesiaca && wsp.pokrycieNajgorszegoMiesiaca.brakKwh > 0 && (
        <section className="flex flex-col gap-3 rounded-lg border p-4 text-small print:hidden">
          <div>
            <h2 className="font-semibold">{t("UI-M7-RAPORT-PANELE-TYTUL")}</h2>
            <p className="text-muted-foreground">{t("UI-M7-RAPORT-PANELE-OPIS")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pole
              id="raport-liczba-paneli"
              label={t("UI-M7-RAPORT-PANELE-LICZBA")}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={panele.liczbaDzis}
              onChange={(e) => setPanele((s) => ({ ...s, liczbaDzis: e.target.value }))}
              pomoc={<PomocPola ekran="raport-kryzysowy" pole="liczbaDzis" />}
            />
            <Pole
              id="raport-uzysk-panelu"
              label={t("UI-M7-RAPORT-PANELE-UZYSK")}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={panele.uzyskPanelu}
              onChange={(e) => setPanele((s) => ({ ...s, uzyskPanelu: e.target.value }))}
              pomoc={<PomocPola ekran="raport-kryzysowy" pole="uzyskPanelu" />}
            />
          </div>
          <p className="text-caption text-muted-foreground">{t("UI-M7-RAPORT-PANELE-UWAGA")}</p>
        </section>
      )}

      <Sekcja czesc="symulacja" gotowa={sym !== null}>
        {sym && (
          <>
            {sym.scenariusze.map((s) => (
              <p key={s.temperaturaC}>
                {s.dniZDeficytem > 0
                  ? t("UI-M7-RAPORT-SYM-DEFICYT", { temperatura: f1(s.temperaturaC), dni: s.dniZDeficytem, kwh: f0(s.deficytMiesiacaKwh), seria: s.najdluzszaSeriaDni, proc: f0(s.pokrycieEnergetycznePct) })
                  : t("UI-M7-RAPORT-SYM-BEZ-DEFICYTU", { temperatura: f1(s.temperaturaC) })}
              </p>
            ))}
            {!sym.ogrzewanieWPopycie && <p className="text-muted-foreground">{t("UI-M7-RAPORT-SYM-BEZ-OGRZEWANIA")}</p>}
          </>
        )}
      </Sekcja>

      <Sekcja czesc="deficyty" gotowa={def !== null}>
        {def &&
          (def.sumaDeficytKwh > 0 ? (
            <>
              <p>{t("UI-M7-RAPORT-DEF-SUMA", { kwh: f0(def.sumaDeficytKwh), miesiecy: def.miesiecyZDeficytem })}</p>
              <p>{t("UI-M7-RAPORT-DEF-AGREGAT", { godziny: f0(def.sumaGodzin), paliwo: f0(def.sumaPaliwaL), koszt: f0(def.sumaKosztZl) })}</p>
              {def.miesiacNajdluzszy !== null && <p>{t("UI-M7-RAPORT-DEF-NAJDLUZSZY", { miesiac: t(KLUCZE_MIESIECY[def.miesiacNajdluzszy - 1]!) })}</p>}
            </>
          ) : (
            <p>{t("UI-M7-RAPORT-DEF-BEZ")}</p>
          ))}
      </Sekcja>

      <Sekcja czesc="blackout" gotowa={blackout !== null}>
        {blackout && (
          <>
            <p>
              {t(blackout.wystarcza ? "UI-M7-RAPORT-BLACKOUT-OK" : "UI-M7-RAPORT-BLACKOUT-ZA-MALO", { dni: f1(blackout.autonomiaDni), wymagane: f0(blackout.wymaganaAutonomiaDni) })}
            </p>
            {!blackout.wystarcza && blackout.dodatkowaPojemnoscKwh != null && blackout.dodatkowaPojemnoscKwh > 0 && (
              <p>{t("UI-M7-RAPORT-BLACKOUT-DOLOZ", { kwh: f1(blackout.dodatkowaPojemnoscKwh), dni: f0(blackout.wymaganaAutonomiaDni) })}</p>
            )}
          </>
        )}
      </Sekcja>

      <Sekcja czesc="wspolczynnik" gotowa={wsp !== null}>
        {wsp &&
          (wsp.wskaznikPct !== null ? (
            <>
              <p>{t("UI-M7-RAPORT-WSKAZNIK", { proc: f0(wsp.wskaznikPct) })}</p>
              {wsp.slabePunkty.length > 0 && <p>{t("UI-M7-RAPORT-SLABE", { lista: wsp.slabePunkty.map(nazwaSkladowej).join(", ") })}</p>}
            </>
          ) : (
            <p>{t("UI-M7-RAPORT-WSP-NIEPELNY", { lista: wsp.brakujaceSkladowe.map(nazwaSkladowej).join(", ") })}</p>
          ))}
      </Sekcja>

      <p className="text-small text-muted-foreground">{t("UI-M7-RAPORT-ODSWIEZ")}</p>
      <button type="button" className="min-h-11 w-fit rounded-md border px-3 text-small font-medium hover:bg-muted print:hidden" onClick={() => window.print()}>
        {t("UI-M7-RAPORT-DRUKUJ")}
      </button>
    </main>
  )
}

function Sekcja({ czesc, gotowa, children }: { czesc: CzescRaportu; gotowa: boolean; children?: ReactNode }) {
  const t = useTranslate()
  const e = EKRANY[czesc]
  return (
    <section className="flex flex-col gap-1 rounded-lg border p-4 text-small">
      <h2 className="font-semibold">
        {gotowa ? <ZnakStanu poziom="ok" /> : "○ "}{t(e.tytul)}
      </h2>
      {gotowa ? children : <p className="text-muted-foreground">{t("UI-M7-RAPORT-BRAK")}</p>}
      <Link href={e.href} className="mt-1 w-fit underline print:hidden">
        {t(gotowa ? "UI-M7-RAPORT-OTWORZ" : "UI-M7-RAPORT-UZUPELNIJ")}
      </Link>
    </section>
  )
}

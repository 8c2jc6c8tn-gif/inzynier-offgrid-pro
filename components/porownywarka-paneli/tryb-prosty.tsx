"use client"

import type { ReactNode } from "react"
import { WyborZKatalogu } from "@/components/porownywarka-paneli/wybor-z-katalogu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import type { CalcResult } from "@/lib/core/calc-result"
import type { PorownywarkaResult } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { MAKS_PANELI_W_ZESTAWIE } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { werdyktProsty } from "@/lib/core/modules/pv/porownywarka-paneli/werdykt-prosty"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import type { MiejsceSeed, PanelSeed, FormularzStan } from "@/lib/porownywarka-paneli/stan"
import { azymutStrony, odczytajStrone, STRONY_SWIATA, type StronaSwiata } from "@/lib/porownywarka-paneli/strona-swiata"

/** Switch between the simple and the full mode of the screen; both modes edit the same draft, so nothing is lost on switching. */
export function PrzelacznikTrybu({ tryb, onZmien }: { tryb: "prosty" | "pelny"; onZmien: (t: "prosty" | "pelny") => void }) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label={t("UI-PORP-PROSTY-TRYB-GRUPA")} className="flex flex-wrap gap-2">
        {(["prosty", "pelny"] as const).map((k) => (
          <Button
            key={k}
            type="button"
            aria-pressed={tryb === k}
            variant={tryb === k ? "default" : "outline"}
            className="min-h-11"
            onClick={() => onZmien(k)}
          >
            {t(k === "prosty" ? "UI-PORP-PROSTY-TRYB-PROSTY" : "UI-PORP-PROSTY-TRYB-PELNY")}
          </Button>
        ))}
      </div>
      {tryb === "prosty" && <p className="text-small text-muted-foreground">{t("UI-PORP-PROSTY-OPIS")}</p>}
    </div>
  )
}

export type PowierzchniaProjektu = { id: string; nazwa: string; nachylenieDeg: number; azymutDeg: number }

/** The three questions of the simple mode: where the panels stand, which panels, what electricity costs. */
export function PytaniaProste(p: {
  stan: FormularzStan
  miejsce: MiejsceSeed
  powierzchnie: PowierzchniaProjektu[]
  waluta: string
  /** The note about the monthly consumption (same block as in the full mode). */
  blokZuzycia: ReactNode
  ustaw: <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => void
  ustawMiejsce: <K extends keyof MiejsceSeed>(pole: K, v: MiejsceSeed[K]) => void
  wybierzPowierzchnie: (id: string) => void
  ustawPanel: (id: string, z: Partial<PanelSeed>) => void
  wstawZKatalogu: (idPanelu: string, idKatalogu: string) => void
  dodajPanel: () => void
  usunPanel: (id: string) => void
  naPelny: () => void
}) {
  const t = useTranslate()
  const { stan, miejsce } = p
  const strona = odczytajStrone(miejsce.azymut)
  const wartoscStrony = strona.rodzaj === "strona" ? strona.id : strona.rodzaj === "wlasna" ? "wlasna" : ""
  // Prices of the electricity: the simple mode only edits the single grid rate; any other kind of pricing was set in the full mode.
  const wycenaProsta = stan.wycena === "" || stan.wycena === "siec" || stan.wycena === "reczna"
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PORP-PROSTY-K1")}</h2>
        {p.powierzchnie.length > 0 && (
          <PoleSelect
            label={t("UI-PORP-MIEJSCE-Z-PROJEKTU")}
            value={miejsce.powierzchniaId}
            onChange={(e) => p.wybierzPowierzchnie(e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="miejsce" />}
          >
            <option value="">{t("UI-PORP-MIEJSCE-WLASNE")}</option>
            {p.powierzchnie.map((x) => (
              <option key={x.id} value={x.id}>
                {`${x.nazwa} (${x.nachylenieDeg}°, ${x.azymutDeg}°)`}
              </option>
            ))}
          </PoleSelect>
        )}
        <PoleSelect
          label={t("UI-PORP-PROSTY-STRONA")}
          value={wartoscStrony}
          onChange={(e) => p.ustawMiejsce("azymut", e.target.value === "" || e.target.value === "wlasna" ? miejsce.azymut : String(azymutStrony(e.target.value as StronaSwiata)))}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="stronaSwiata" />}
        >
          <option value="">{t("UI-PORP-PROSTY-STRONA-WYBIERZ")}</option>
          {STRONY_SWIATA.map((s) => (
            <option key={s.id} value={s.id}>
              {t(`UI-PORP-PROSTY-STRONA-${s.id}`)}
            </option>
          ))}
          {strona.rodzaj === "wlasna" && <option value="wlasna">{t("UI-PORP-PROSTY-STRONA-WLASNA", { az: strona.azymut })}</option>}
        </PoleSelect>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-PORP-NACHYLENIE")}
            unit="°"
            type="number"
            inputMode="decimal"
            min={0}
            max={90}
            step="any"
            value={miejsce.nachylenie}
            onChange={(e) => p.ustawMiejsce("nachylenie", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="nachylenie" />}
          />
          <Pole
            label={t("UI-PORP-LICZBA")}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={miejsce.liczbaPaneli}
            onChange={(e) => p.ustawMiejsce("liczbaPaneli", e.target.value)}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="liczbaPaneli" />}
          />
        </div>
        {p.blokZuzycia}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PORP-PROSTY-K2")}</h2>
        {stan.panele.map((panel, i) => (
          <fieldset key={panel.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <legend className="px-1 text-small font-medium">{t("UI-PORP-PANEL-N", { n: i + 1 })}</legend>
            <WyborZKatalogu katalogId={panel.katalogId} onWybierz={(id) => p.wstawZKatalogu(panel.id, id)} />
            <Pole
              label={t("UI-PORP-CENA")}
              unit={p.waluta}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={panel.cena}
              onChange={(e) => p.ustawPanel(panel.id, { cena: e.target.value })}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="cena" />}
            />
            {panel.katalogId === "" && panel.moc.trim() !== "" && (
              <div role="status" className="flex flex-col items-start gap-2 text-small text-muted-foreground">
                <p>{t("UI-PORP-PROSTY-PANEL-SPOZA")}</p>
                <Button type="button" variant="outline" className="min-h-11" onClick={p.naPelny}>
                  {t("UI-PORP-PROSTY-DO-PELNEGO")}
                </Button>
              </div>
            )}
            {stan.panele.length > 1 && (
              <Button variant="outline" className="min-h-11 self-start" onClick={() => p.usunPanel(panel.id)}>
                {t("UI-PORP-USUN")}
              </Button>
            )}
          </fieldset>
        ))}
        {stan.panele.length < MAKS_PANELI_W_ZESTAWIE ? (
          <Button variant="outline" className="min-h-11 self-start" onClick={p.dodajPanel}>
            {t("UI-PORP-DODAJ")}
          </Button>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-PORP-MAKS-PANELI")}</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PORP-PROSTY-K3")}</h2>
        {wycenaProsta ? (
          <Pole
            label={t("UI-PORP-STAWKA")}
            unit={`${p.waluta}/kWh`}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={stan.stawka}
            onChange={(e) => {
              p.ustaw("stawka", e.target.value)
              if (stan.wycena === "") p.ustaw("wycena", "siec")
            }}
            pomoc={<PomocPola ekran="porownywarka-paneli" pole="stawka" />}
          />
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-PORP-PROSTY-WYCENA-INNA")}</p>
        )}
      </section>
    </div>
  )
}

/** One plain-language recommendation drawn from the engine's result (decision table in `werdyktProsty`), with the reasons behind it. */
export function WerdyktProstyKarta({ wynik, waluta, naPelny }: { wynik: CalcResult<PorownywarkaResult>; waluta: string; naPelny: () => void }) {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const f2 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 2 })
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const v = wynik.value
  const w = werdyktProsty(v)
  const nazwa = (id: string) => v.panele.find((x) => x.id === id)?.nazwa ?? ""
  const poziom = wynik.status === "VALID" ? "ok" : "uwaga"
  // The string-voltage notes point to the "Electrical" tab, which the simple mode does not have.
  const ostrzezenia = wynik.warnings.filter((x) => !x.code.startsWith("PORP-ELEKTRYKA"))

  if (w.rodzaj === "brak-wyniku" || w.rodzaj === "jeden-panel") {
    return (
      <WerdyktPanel poziom={poziom} etykieta={t("UI-PORP-PROSTY-W-TYTUL")}>
        <p className="text-small">{t("UI-PORP-GC-JEDEN-PANEL")}</p>
        <WynikSzczegoly assumptions={[]} warnings={ostrzezenia} />
      </WerdyktPanel>
    )
  }

  const r = w.rekomendacja
  const naglowek =
    r.rodzaj === "wybierz"
      ? t(r.powod === "zima-i-cena" ? "UI-PORP-PROSTY-W-ZIMA-I-CENA" : r.powod === "zima" ? "UI-PORP-PROSTY-W-ZIMA" : "UI-PORP-PROSTY-W-CENA-REMIS", { panel: nazwa(r.panelId) })
      : r.rodzaj === "kompromis"
        ? t("UI-PORP-PROSTY-W-KOMPROMIS", { lider: nazwa(r.liderZimyId), tanszy: nazwa(r.najtanszyId) })
        : t("UI-PORP-PROSTY-W-BEZ-ROZNICY")
  const kosztyZimowejKwh = v.panele.flatMap((p) => (p.kosztZimowejKwhZl === null ? [] : [`${p.nazwa} ${f2(p.kosztZimowejKwhZl)} ${waluta}/kWh`]))

  return (
    <WerdyktPanel poziom={poziom} etykieta={t("UI-PORP-PROSTY-W-TYTUL")}>
      <WynikGlowny>{naglowek}</WynikGlowny>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-small">
        <li>
          {t(w.zimaBezRoznicy ? "UI-PORP-PROSTY-W-ZIMA-REMIS" : "UI-PORP-PROSTY-W-ZIMA-ROZNICA", {
            lider: nazwa(w.liderZimyId),
            drugi: nazwa(w.drugiId),
            kwh: f1(w.roznicaZimaKwh),
            proc: f1(w.roznicaZimaProc),
          })}
        </li>
        {w.roznicaZl !== null && !w.zimaBezRoznicy && (
          <li>
            {v.wycenaStrefowa !== null
              ? t("UI-PORP-GC-ZIMA-ZL-STREFY", { dzien: f2(v.wycenaStrefowa.zlKwhDzien), noc: f2(v.wycenaStrefowa.zlKwhNoc), zl: f0(w.roznicaZl) })
              : v.stawkaZlKwh !== null
                ? t("UI-PORP-GC-ZIMA-ZL", { stawka: f2(v.stawkaZlKwh), zl: f0(w.roznicaZl) })
                : null}
          </li>
        )}
        {kosztyZimowejKwh.length > 0 && <li>{t("UI-PORP-PROSTY-W-KOSZT", { lista: kosztyZimowejKwh.join("; ") })}</li>}
        {w.scenariusz && (
          <li>
            {t("UI-PORP-GC-WIECEJ", {
              tanszy: nazwa(w.scenariusz.tanszyId),
              drozszy: nazwa(w.scenariusz.drozszyId),
              x: w.scenariusz.dodatkowePanele,
              zima: t("UI-PORP-SC-WIECEJ", { kwh: f1(Math.abs(w.scenariusz.przewagaZimaKwh)) }),
            })}
          </li>
        )}
      </ul>
      <p className="mt-2 text-caption text-muted-foreground">{t("UI-PORP-PROSTY-W-ZASTRZEZENIE")}</p>
      <WynikSzczegoly assumptions={[]} warnings={ostrzezenia} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="min-h-11" onClick={naPelny}>
          {t("UI-PORP-PROSTY-DO-PELNEGO")}
        </Button>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-small underline">{t("UI-PORP-PROSTY-W-JAK")}</summary>
        <div className="mt-2">
          <WynikSzczegoly assumptions={wynik.assumptions} />
        </div>
      </details>
    </WerdyktPanel>
  )
}

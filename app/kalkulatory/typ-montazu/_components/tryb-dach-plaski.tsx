"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateDachPlaski } from "@/lib/core/modules/pv/typ-montazu/dach-plaski"
import type { MiejsceMontazu } from "@/lib/core/modules/pv/typ-montazu/input"
import { PROG_ZALEGANIA_SNIEGU_DEG } from "@/lib/core/modules/pv/typ-montazu/constants"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import {
  BledyDanych,
  dopiskMasyWlasnej,
  n,
  PolaStelaza,
  PolaWiatru,
  poziomZOstrzezen,
  STELAZ_PUSTY,
  stelazZSeeda,
  WIATR_PUSTY,
  wiatrZSeeda,
  type StelazSeed,
  type WiatrSeed,
  useFormatyMontazu,
} from "./wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Seed = { miejsce: string; nachylenieDeg: string; stelaz: StelazSeed; wiatr: WiatrSeed }
const PUSTY: Seed = { miejsce: "", nachylenieDeg: "", stelaz: STELAZ_PUSTY, wiatr: WIATR_PUSTY }

export function TrybDachPlaski() {
  const t = useTranslate()
  const { f0, f2, fMasa } = useFormatyMontazu()
  const { dane } = useLokalizacjaProjektu()
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-dach-plaski", PUSTY)
  const wysokoscPvgis = dane?.dane.meta.wysokoscNpmM
  const wynik = useMemo(
    () =>
      calculateDachPlaski({
        ...wiatrZSeeda(s.wiatr, wysokoscPvgis),
        ...stelazZSeeda(s.stelaz),
        miejsce: s.miejsce === "" ? null : (s.miejsce as MiejsceMontazu),
        nachylenieDeg: n(s.nachylenieDeg),
      }),
    [s, wysokoscPvgis],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {t("UI-TYPMON-COMTRYDACPLA-STELAZ-POD-KATEM")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect
          label={t("UI-TYPMON-COMTRYDACPLA-GDZIE-STOI-STELAZ")}
          value={s.miejsce}
          onChange={(e) => setS((p) => ({ ...p, miejsce: e.target.value }))}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="gdzieStelaz" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="grunt">{t("UI-TYPMON-COMTRYDACPLA-GRUNCIE")}</option>
          <option value="dach">{t("UI-TYPMON-COMTRYDACPLA-DACHU-PLASKIM")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-TYPMON-COMTRYDACPLA-KAT-NACHYLENIA-STELAZA")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.nachylenieDeg}
          onChange={(e) => setS((p) => ({ ...p, nachylenieDeg: e.target.value }))}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="katStelaza" params={{ progSnieg: PROG_ZALEGANIA_SNIEGU_DEG }} />}
        />
      </div>
      <PolaStelaza
        s={s.stelaz}
        ustaw={(pole, x) => setS((p) => ({ ...p, stelaz: { ...p.stelaz, [pole]: x } }))}
        poleKrawedzi="krawedzDachPlaski"
      />
      <PolaWiatru s={s.wiatr} ustaw={(pole, x) => setS((p) => ({ ...p, wiatr: { ...p.wiatr, [pole]: x } }))} wysokoscPvgis={wysokoscPvgis} />

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-TYPMON-COMTRYDACPLA-UZUPELNIJ-WSZYSTKIE-POLA")}</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={t("UI-TYPMON-COMTRYDACPLA-KAT-PODNIESIENIE-GORNEJ", { nachylenieDeg: s.nachylenieDeg })}>
          <WynikGlowny>{f2(v.podniesienieM)} m</WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            <li>
              {t("UI-TYPMON-COMTRYDACPLA-GORNA-KRAWEDZ-NAD", { zeM: f2(v.zeM), powierzchniaM2: f2(v.powierzchniaM2) })}
            </li>
            <li>
              {v.silaWiatruN === null
                ? t("UI-TYPMON-COMTRYDACPLA-SILA-WIATRU-BRAK")
                : t("UI-TYPMON-COMTRYDACPLA-SILA-WIATRU", { silaWiatruN: f0(v.silaWiatruN), p: f0(v.silaWiatruN / PRZYSPIESZENIE_ZIEMSKIE_M_S2), p2: v.balastKg === null ? t("UI-TYPMON-COMTRYDACPLA-POZIOMA-BEZ-BALASTU") : "." })}
            </li>
            {v.balastKg !== null && <li className="font-medium">{t("UI-TYPMON-COMTRYDACPLA-BALAST-PROJEKTOWY-1990", { balastKg: f0(v.balastKg), stelaz: dopiskMasyWlasnej(s.stelaz, t, fMasa) })}</li>}
            <li>{t("UI-TYPMON-COMTRYDACPLA-SNIEG-PANELACH-ZOSTAJE", { p: f0(v.mu1 * 100), mu1: f2(v.mu1) })}</li>
          </ul>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
          <p className="mt-2 text-small">
            {t("UI-TYPMON-COMTRYDACPLA-POROWNANIE-WSZYSTKICH-KATOW")}{" "}
            <Link href="/kalkulatory/zloty-srodek" className="underline">
              {t("UI-TYPMON-COMTRYDACPLA-ZLOTY-SRODEK")}
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}
    </div>
  )
}

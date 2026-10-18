"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateRegulowany, type MiesiacRegulowany } from "@/lib/core/modules/pv/typ-montazu/regulowany"
import {
  BledyDanych,
  dopiskMasyWlasnej,
  MIESIACE,
  n,
  PoleAzymutu,
  PolaStelaza,
  PolaWiatru,
  poziomZOstrzezen,
  STELAZ_PUSTY,
  stelazZSeeda,
  useTabelaNapromieniowania,
  WIATR_PUSTY,
  wiatrZSeeda,
  type StelazSeed,
  type WiatrSeed,
  useFormaty,
} from "./wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Seed = { azymutDeg: string; katMinDeg: string; katMaxDeg: string; stelaz: StelazSeed; wiatr: WiatrSeed }
const PUSTY: Seed = { azymutDeg: "", katMinDeg: "", katMaxDeg: "", stelaz: STELAZ_PUSTY, wiatr: WIATR_PUSTY }

type Wiersz = MiesiacRegulowany & { id: number }
const kolumny = (t: (kod: string) => string, f0: (x: number) => string, f2: (x: number) => string): Kolumna<Wiersz>[] => [
  { naglowek: t("UI-TYPMON-COMTRYREG-MIESIAC"), render: (r) => t(MIESIACE[r.miesiac]) },
  { naglowek: t("UI-TYPMON-COMTRYREG-KAT"), render: (r) => `${r.katDeg}°`, liczbowa: true },
  { naglowek: t("UI-TYPMON-COMTRYREG-PODNIESIENIE"), render: (r) => `${f2(r.podniesienieM)} m`, liczbowa: true },
  { naglowek: t("UI-TYPMON-COMTRYREG-WIATR"), render: (r) => (r.silaWiatruN === null ? t("UI-TYPMON-COMTRYREG-BRAK-DANYCH") : `${f0(r.silaWiatruN)} N`) },
  { naglowek: t("UI-TYPMON-COMTRYREG-BALAST"), render: (r) => (r.balastKg === null ? "—" : `${f0(r.balastKg)} kg`) },
]

export function TrybRegulowany() {
  const t = useTranslate()
  const { f0, f1, f2, fMasa } = useFormaty()
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-regulowany", PUSTY)
  const tab = useTabelaNapromieniowania(s.azymutDeg)
  const wynik = useMemo(
    () =>
      calculateRegulowany({
        tabela: tab.tabela,
        ...wiatrZSeeda(s.wiatr, tab.wysokoscPvgis),
        ...stelazZSeeda(s.stelaz),
        katMinDeg: n(s.katMinDeg),
        katMaxDeg: n(s.katMaxDeg),
      }),
    [tab.tabela, tab.wysokoscPvgis, s],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {t("UI-TYPMON-COMTRYREG-STELAZ-NAZIEMNY-KTOREMU")}{" "}
        <Link href="/kalkulatory/kat-i-azymut" className="underline">
          {t("UI-TYPMON-COMTRYREG-EKRAN-KAT-AZYMUT")}
        </Link>
        .
      </p>
      <PoleAzymutu wartosc={s.azymutDeg} ustaw={(x) => setS((p) => ({ ...p, azymutDeg: x }))} tab={tab} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          label={t("UI-TYPMON-COMTRYREG-NAJMNIEJSZY-KAT-REGULACJI")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.katMinDeg}
          onChange={(e) => setS((p) => ({ ...p, katMinDeg: e.target.value }))}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="katMin" />}
        />
        <Pole
          label={t("UI-TYPMON-COMTRYREG-NAJWIEKSZY-KAT-REGULACJI")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.katMaxDeg}
          onChange={(e) => setS((p) => ({ ...p, katMaxDeg: e.target.value }))}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="katMax" />}
        />
      </div>
      <PolaStelaza
        s={s.stelaz}
        ustaw={(pole, x) => setS((p) => ({ ...p, stelaz: { ...p.stelaz, [pole]: x } }))}
        poleKrawedzi="krawedzRegulowany"
      />
      <PolaWiatru s={s.wiatr} ustaw={(pole, x) => setS((p) => ({ ...p, wiatr: { ...p.wiatr, [pole]: x } }))} wysokoscPvgis={tab.wysokoscPvgis} />

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-TYPMON-COMTRYREG-POLICZ-NASLONECZNIENIE-UZUPE")}</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={t("UI-TYPMON-COMTRYREG-REGULACJA-MIESIAC-STALY", { katStalyDeg: v.katStalyDeg })}>
          <WynikGlowny>{t("UI-TYPMON-COMTRYREG-NASLONECZNIENIA", { zyskRegulacjiPct: f1(v.zyskRegulacjiPct) })}</WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            <li>
              {t("UI-TYPMON-COMTRYREG-ROCZNIE-KWH-REGULACJA", { napromieniowanieRegulowaneKwhM2: f0(v.napromieniowanieRegulowaneKwhM2), napromieniowanieStaleKwhM2: f0(v.napromieniowanieStaleKwhM2), katStalyDeg: v.katStalyDeg })}
            </li>
            <li className="font-medium">
              {v.balastWymaganyKg === null
                ? t("UI-TYPMON-COMTRYREG-BALAST-BRAK-DANYCH")
                : t("UI-TYPMON-COMTRYREG-BALAST-PROJEKTOWY-1990", { p: v.liczbaMiesiecyBezDanychWiatru > 0 ? t("UI-TYPMON-COMTRYREG-DO-30") : "", balastWymaganyKg: f0(v.balastWymaganyKg), stelaz: dopiskMasyWlasnej(s.stelaz, t, fMasa) })}
            </li>
          </ul>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny(t, f0, f2)} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={420} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}

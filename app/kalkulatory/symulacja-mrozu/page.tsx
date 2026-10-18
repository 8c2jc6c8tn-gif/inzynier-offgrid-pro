"use client"

import Link from "next/link"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { MAKS_SCENARIUSZY } from "@/lib/core/modules/stress-test/symulacja-mrozu/constants"
import type { WynikScenariusza } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import { useWynikSymulacjiMrozu } from "@/lib/stress-test/use-symulacja-mrozu"
import {
  KLUCZ_DRAFTU_SYMULACJI_MROZU,
  PUSTY_SCENARIUSZ,
  STAN_POCZATKOWY_SYMULACJI,
  type ScenariuszFormularza,
  type StanSymulacjiMrozu,
} from "@/lib/stress-test/symulacja-mrozu"

type PoleStanu = Exclude<keyof StanSymulacjiMrozu, "scenariusze" | "miesiac">

const POLA_PV: { pole: PoleStanu; label: string; unit: string; step?: number }[] = [
  { pole: "mocKwp", label: "UI-M7-SYMMR-MOC", unit: "kWp" },
  { pole: "pr", label: "UI-M7-SYMMR-PR", unit: "", step: 0.01 },
  { pole: "nachylenieDeg", label: "UI-M7-SYMMR-NACHYLENIE", unit: "°" },
  { pole: "azymutDeg", label: "UI-M7-SYMMR-AZYMUT", unit: "°" },
  { pole: "korektaProdukcjiPct", label: "UI-M7-SYMMR-KOREKTA", unit: "%" },
]
const POLA_ZUZYCIA: { pole: PoleStanu; label: string; unit: string }[] = [
  { pole: "zuzycieBazoweDobaKwh", label: "UI-M7-SYMMR-ZUZYCIE", unit: "kWh" },
  { pole: "dodatkoweZuzycieDobaKwh", label: "UI-M7-SYMMR-DODATKOWE", unit: "kWh" },
  { pole: "cop", label: "UI-M7-SYMMR-COP", unit: "" },
]
const POLA_MAGAZYNU: { pole: PoleStanu; label: string; unit: string }[] = [
  { pole: "magazynKwh", label: "UI-M7-SYMMR-MAGAZYN", unit: "kWh" },
  { pole: "magazynSprawnoscPct", label: "UI-M7-SYMMR-SPRAWNOSC", unit: "%" },
  { pole: "magazynStanPoczatkowyPct", label: "UI-M7-SYMMR-STAN-START", unit: "%" },
  { pole: "udzialNocyPct", label: "UI-M7-SYMMR-NOC", unit: "%" },
]

export default function SymulacjaMrozuPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const [stan, setStan, , wczytano] = usePersistedDraft<StanSymulacjiMrozu>(KLUCZ_DRAFTU_SYMULACJI_MROZU, STAN_POCZATKOWY_SYMULACJI)
  const { lokalizacja, dane, tmy, ekran1, produkcja, result } = useWynikSymulacjiMrozu(stan)

  const ustaw = (z: Partial<StanSymulacjiMrozu>) => setStan((s) => ({ ...s, ...z }))
  const ustawScenariusz = (i: number, z: Partial<ScenariuszFormularza>) => setStan((s) => ({ ...s, scenariusze: s.scenariusze.map((x, j) => (j === i ? { ...x, ...z } : x)) }))

  if (!wczytano) return <StanLadowania linie={6} />

  const v = result.value
  const scenariusze = v.scenariusze
  const zDeficytem = scenariusze.filter((s) => s.dniZDeficytem > 0)
  const pvMiesiaca = produkcja.reduce((a, p) => a + p, 0)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/symulacja-mrozu" />
      <NaglowekEkranu tytul={t("UI-M7-SYMMR-TYTUL")} ekran="symulacja-mrozu" wynik={result}>
        {t("UI-M7-SYMMR-OPIS")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M7-SYMMR-SEKCJA-PV")}</h2>
        <PoleSelect label={t("UI-M7-SYMMR-MIESIAC")} value={stan.miesiac} onChange={(e) => ustaw({ miesiac: e.target.value })} pomoc={<PomocPola ekran="symulacja-mrozu" pole="miesiac" />}>
          <option value="">{t("UI-M7-SYMMR-WYBIERZ")}</option>
          {KLUCZE_MIESIECY.map((m, i) => (
            <option key={m} value={String(i + 1)}>
              {t(m)}
            </option>
          ))}
        </PoleSelect>
        <div className="grid grid-cols-2 gap-3">
          {POLA_PV.map(({ pole, label, unit, step }) => (
            <Pole
              key={pole}
              label={t(label)}
              unit={unit}
              type="number"
              inputMode="decimal"
              step={step}
              value={stan[pole]}
              onChange={(e) => ustaw({ [pole]: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole={pole} />}
            />
          ))}
        </div>
        {produkcja.length > 0 ? (
          <p className="text-small">{t("UI-M7-SYMMR-PV-MIESIACA", { dni: produkcja.length, kwh: f0(pvMiesiaca) })}</p>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-M7-SYMMR-PV-BRAK")}</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M7-SYMMR-SEKCJA-ZUZYCIE")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {POLA_ZUZYCIA.map(({ pole, label, unit }) => (
            <Pole
              key={pole}
              label={t(label)}
              unit={unit}
              type="number"
              inputMode="decimal"
              value={stan[pole]}
              onChange={(e) => ustaw({ [pole]: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole={pole} />}
            />
          ))}
        </div>
        {ekran1 ? (
          <p className="text-small">
            {t(ekran1.zrodlo === "paliwo" ? "UI-M7-SYMMR-EKRAN1-PALIWO" : "UI-M7-SYMMR-EKRAN1-PRAD", { h: f1(ekran1.budynek.wspolczynnikStratZewnetrznychWK), ti: ekran1.budynek.temperaturaWewnetrznaC })}
            {ekran1.cop !== null && ekran1.zrodlo === "prad" && ` ${t("UI-M7-SYMMR-EKRAN1-COP", { cop: ekran1.cop })}`}
          </p>
        ) : (
          <p className="text-small text-muted-foreground">
            {t("UI-M7-SYMMR-EKRAN1-BRAK")}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-M7-SYMMR-EKRAN1-LINK")}
            </Link>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M7-SYMMR-SEKCJA-MAGAZYN")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {POLA_MAGAZYNU.map(({ pole, label, unit }) => (
            <Pole
              key={pole}
              label={t(label)}
              unit={unit}
              type="number"
              inputMode="decimal"
              value={stan[pole]}
              onChange={(e) => ustaw({ [pole]: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole={pole} />}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M7-SYMMR-SEKCJA-SCENARIUSZE")}</h2>
        {stan.scenariusze.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
            <Pole
              label={t("UI-M7-SYMMR-SC-TEMPERATURA")}
              unit="°C"
              type="number"
              inputMode="decimal"
              value={s.temperaturaC}
              onChange={(e) => ustawScenariusz(i, { temperaturaC: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole="scenariuszTemperaturaC" />}
            />
            <Pole
              label={t("UI-M7-SYMMR-SC-COP")}
              type="number"
              inputMode="decimal"
              value={s.cop}
              onChange={(e) => ustawScenariusz(i, { cop: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole="scenariuszCop" />}
            />
            <Pole
              label={t("UI-M7-SYMMR-SC-SPADEK")}
              unit="%"
              type="number"
              inputMode="decimal"
              value={s.spadekPojemnosciPct}
              onChange={(e) => ustawScenariusz(i, { spadekPojemnosciPct: e.target.value })}
              pomoc={<PomocPola ekran="symulacja-mrozu" pole="scenariuszSpadekPojemnosciPct" />}
            />
            <Button type="button" variant="outline" aria-label={t("UI-M7-SYMMR-SC-USUN")} onClick={() => setStan((p) => ({ ...p, scenariusze: p.scenariusze.filter((_, j) => j !== i) }))}>
              ×
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" disabled={stan.scenariusze.length >= MAKS_SCENARIUSZY} onClick={() => setStan((p) => ({ ...p, scenariusze: [...p.scenariusze, PUSTY_SCENARIUSZ] }))}>
          {t("UI-M7-SYMMR-SC-DODAJ")}
        </Button>
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-SYMMR-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <StanPusty tytul={t("UI-M7-SYMMR-WPISZ-TYTUL")}>{t("UI-M7-SYMMR-WPISZ")}</StanPusty>
      ) : (
        <WerdyktPanel
          poziom={zDeficytem.length > 0 || result.warnings.length > 0 ? "uwaga" : "ok"}
          etykieta={zDeficytem.length > 0 ? t("UI-M7-SYMMR-WYNIK-DEFICYT", { n: zDeficytem.length, razem: scenariusze.length }) : t("UI-M7-SYMMR-WYNIK-OK")}
        >
          <div className="mt-3 flex flex-col gap-4">
            {scenariusze.map((s) => (
              <KartaScenariusza key={s.temperaturaC} s={s} liczbaDni={v.liczbaDni} ogrzewanieWPopycie={v.ogrzewanieWPopycie} />
            ))}
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/deficyty-miesieczne" className="text-small underline">
        {t("UI-M7-SYMMR-LINK-E2")}
      </Link>
    </main>
  )
}

function KartaScenariusza({ s, liczbaDni, ogrzewanieWPopycie }: { s: WynikScenariusza; liczbaDni: number; ogrzewanieWPopycie: boolean }) {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  return (
    <section className="flex flex-col gap-1 text-small">
      <h3 className="font-medium">{t("UI-M7-SYMMR-KARTA-TYTUL", { temperatura: f1(s.temperaturaC) })}</h3>
      {s.cieploDobaKwh !== null && (
        <p>{t(ogrzewanieWPopycie ? "UI-M7-SYMMR-CIEPLO-PRAD" : "UI-M7-SYMMR-CIEPLO", { cieplo: f1(s.cieploDobaKwh), prad: f1(s.pradOgrzewaniaDobaKwh ?? 0), cop: s.copUzyty ?? 0 })}</p>
      )}
      <p>{t("UI-M7-SYMMR-POPYT", { popyt: f1(s.zapotrzebowanieDobaKwh) })}</p>
      {s.pojemnoscEfektywnaKwh > 0 && <p>{t("UI-M7-SYMMR-POJEMNOSC", { kwh: f1(s.pojemnoscEfektywnaKwh) })}</p>}
      {s.dniZDeficytem > 0 ? (
        <p className="font-medium">
          {t("UI-M7-SYMMR-DEFICYT", { dni: s.dniZDeficytem, wszystkie: liczbaDni, kwh: f0(s.deficytMiesiacaKwh), seria: s.najdluzszaSeriaDni, pierwszy: s.pierwszyDzienZDeficytem ?? 0 })}
        </p>
      ) : (
        <p className="font-medium">{t("UI-M7-SYMMR-BEZ-DEFICYTU", { wszystkie: liczbaDni })}</p>
      )}
      <p>{t("UI-M7-SYMMR-POKRYCIE", { proc: f0(s.pokrycieEnergetycznePct), max: f1(s.najwiekszyDeficytDobyKwh) })}</p>
      <details>
        <summary className="cursor-pointer">{t("UI-M7-SYMMR-DNI")}</summary>
        <table className="mt-2 w-full text-caption">
          <thead>
            <tr className="text-left">
              <th>{t("UI-M7-SYMMR-DNI-DZIEN")}</th>
              <th>{t("UI-M7-SYMMR-DNI-PV")}</th>
              <th>{t("UI-M7-SYMMR-DNI-POPYT")}</th>
              <th>{t("UI-M7-SYMMR-DNI-DEFICYT")}</th>
            </tr>
          </thead>
          <tbody>
            {s.dni.map((d) => (
              <tr key={d.dzien} className={d.deficytKwh > 0 ? "font-medium" : undefined}>
                <td>{d.dzien}</td>
                <td>{f1(d.produkcjaKwh)}</td>
                <td>{f1(d.zapotrzebowanieKwh)}</td>
                <td>{f1(d.deficytKwh)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  )
}

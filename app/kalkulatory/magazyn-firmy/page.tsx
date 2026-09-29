"use client"

import Link from "next/link"
import { useMemo } from "react"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { isComputed } from "@/lib/core/calc-result"
import { calculateOplacalnoscMagazynu } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import { calculateStrumienieBess, type IdStrumienia } from "@/lib/core/modules/siec/strumienie-bess/calculator"
import type { GrupaMocy } from "@/lib/core/modules/siec/strumienie-bess/input"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, zl } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

/** Draft of M4/E23 „Analiza opłacalności magazynu” — read-only echo (same field names). */
type StanE23 = { cenaBateriiZl: string; pojemnoscUzytecznaKwh: string; liczbaCykli: string; sprawnoscPct: string }

type Stan = {
  grupa: GrupaMocy
  autoKwh: string
  autoZysk: string
  arbKwh: string
  arbZysk: string
  mocowaKwh: string
  mocUmowna: string
}
const POCZATKOWY: Stan = { grupa: "C1x", autoKwh: "", autoZysk: "", arbKwh: "", arbZysk: "", mocowaKwh: "", mocUmowna: "" }

/** Translation keys (`t()`). */
const NAZWA: Record<IdStrumienia, string> = {
  autokonsumpcja: "UI-BESS-S-AUTOKONSUMPCJA",
  arbitraz: "UI-BESS-S-ARBITRAZ",
  mocowa: "UI-BESS-S-MOCOWA",
  mocUmowna: "UI-BESS-S-MOC-UMOWNA",
}

/**
 * M14 — F7 „Magazyn (BESS) — strumienie korzyści” (echo M4/E23), Wzorzec D + G. The cost of one
 * cycled kWh comes from the E23 draft (user's price); every stream value is a user entry, except
 * the capacity charge ✅ from the data file. No BESS prices from the source material (🔎B).
 */
export default function MagazynFirmyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-magazyn-firmy", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const { dane: e23, wczytano } = useOdczytDraftu<StanE23>("oplacalnosc-magazynu")

  const echo = useMemo(() => {
    if (!e23) return null
    const r = calculateOplacalnoscMagazynu({
      cenaBateriiZl: liczba(e23.cenaBateriiZl),
      pojemnoscUzytecznaKwh: liczba(e23.pojemnoscUzytecznaKwh),
      liczbaCykli: liczba(e23.liczbaCykli),
      sprawnoscPct: liczba(e23.sprawnoscPct),
      kosztAlternatywyZlZaKwh: null,
    })
    return isComputed(r.status) ? { koszt: r.value.kosztZaKwh, cena: liczba(e23.cenaBateriiZl) } : null
  }, [e23])

  const result = useMemo(
    () =>
      calculateStrumienieBess({
        dataRozliczenia: DANE_ROZLICZEN.stanNa,
        grupa: stan.grupa,
        kosztCykluZlKwh: echo?.koszt ?? null,
        cenaMagazynuZl: echo?.cena ?? null,
        autokonsumpcjaKwhRok: liczba(stan.autoKwh),
        autokonsumpcjaZyskZlKwh: liczbaLubNull(stan.autoZysk),
        arbitrazKwhRok: liczba(stan.arbKwh),
        arbitrazZyskZlKwh: liczbaLubNull(stan.arbZysk),
        mocowaKwhRok: liczba(stan.mocowaKwh),
        mocUmownaZlRok: liczbaLubNull(stan.mocUmowna),
      }),
    [stan, echo],
  )
  if (!wczytano) return <StanLadowania linie={6} />
  const v = result.value

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/magazyn-firmy" />
      <NaglowekEkranu
        tytul={t("UI-BESS-TYTUL")}
        ekran="magazyn-firmy"
        wynik={result}
      >
        {t("UI-BESS-OPIS")}
      </NaglowekEkranu>

      <p className="text-small">
        {t("UI-BESS-KOSZT-KWH")}{" "}
        {echo ? (
          <strong>{t("UI-BESS-KOSZT-WARTOSC", { koszt: echo.koszt.toFixed(2) })}</strong>
        ) : (
          <span className="text-muted-foreground">{t("UI-BESS-NIEPOLICZONY")}</span>
        )}{" "}
        —{" "}
        <Link className="underline" href="/kalkulatory/oplacalnosc-magazynu">
          {t(echo ? "UI-BESS-L-ZMIEN" : "UI-BESS-L-POLICZ")}
        </Link>
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-BESS-H-1")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-BESS-ENERGIA")}
            unit={t("UI-J-KWH-ROK")}
            type="number"
            inputMode="decimal"
            value={stan.autoKwh}
            onChange={(e) => ustaw({ autoKwh: e.target.value })}
            pomoc={<PomocPola ekran="magazyn-firmy" pole="energiaAutokonsumpcja" />}
          />
          <Pole
            label={t("UI-BESS-ZYSK")}
            unit={t("UI-J-ZL-KWH")}
            type="number"
            inputMode="decimal"
            value={stan.autoZysk}
            onChange={(e) => ustaw({ autoZysk: e.target.value })}
            pomoc={<PomocPola ekran="magazyn-firmy" pole="zyskKwh" />}
          />
        </div>
        <Link className="text-small underline" href="/kalkulatory/pv-w-firmie">
          {t("UI-BESS-L-NADWYZKA")}
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-BESS-H-2")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-BESS-ARBITRAZ-OPIS")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-BESS-ENERGIA")}
            unit={t("UI-J-KWH-ROK")}
            type="number"
            inputMode="decimal"
            value={stan.arbKwh}
            onChange={(e) => ustaw({ arbKwh: e.target.value })}
            pomoc={<PomocPola ekran="magazyn-firmy" pole="energiaAutokonsumpcja" />}
          />
          <Pole
            label={t("UI-BESS-ROZNICA")}
            unit={t("UI-J-ZL-KWH")}
            type="number"
            inputMode="decimal"
            value={stan.arbZysk}
            onChange={(e) => ustaw({ arbZysk: e.target.value })}
            pomoc={<PomocPola ekran="magazyn-firmy" pole="roznicaCen" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-BESS-H-3")}</h2>
        <Pole
          label={t("UI-BESS-ODDANE")}
          unit={t("UI-J-KWH-ROK")}
          type="number"
          inputMode="decimal"
          value={stan.mocowaKwh}
          onChange={(e) => ustaw({ mocowaKwh: e.target.value })}
          pomoc={<PomocPola ekran="magazyn-firmy" pole="energiaMocowa" />}
        />
        <Link className="text-small underline" href="/kalkulatory/oplata-mocowa">
          {t("UI-BESS-L-MOCOWA")}
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-BESS-H-4")}</h2>
        <PoleSelect
          label={t("UI-BESS-GRUPA")}
          value={stan.grupa}
          onChange={(e) => ustaw({ grupa: e.target.value as GrupaMocy })}
          pomoc={<PomocPola ekran="magazyn-firmy" pole="grupa" />}
        >
          <option value="C1x">{t("UI-BESS-GRUPA-C1")}</option>
          <option value="C2x">{t("UI-BESS-GRUPA-C2")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-BESS-OSZCZEDNOSC")}
          unit={t("UI-J-ZL-ROK")}
          type="number"
          inputMode="decimal"
          value={stan.mocUmowna}
          onChange={(e) => ustaw({ mocUmowna: e.target.value })}
          pomoc={<PomocPola ekran="magazyn-firmy" pole="mocUmowna" />}
        />
        <Link className="text-small underline" href="/kalkulatory/moc-umowna">
          {t("UI-BESS-L-MOC-UMOWNA")}
        </Link>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="font-semibold">{t("UI-BESS-H-5")}</h2>
        <p className="text-small text-muted-foreground">
          {t("UI-BESS-USLUGI-OPIS")}
        </p>
      </section>

      {result.status === "INCOMPLETE" || result.status === "INVALID_INPUT" || !v ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta={t("UI-BESS-UZUPELNIJ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta={t("UI-BESS-BILANS")}>
          <WynikGlowny>
            {v.bilansRokZl >= 0
              ? t("UI-BESS-PLUS-ROCZNIE", { kwota: zl(v.bilansRokZl) })
              : t("UI-BESS-MINUS-ROCZNIE", { kwota: zl(v.bilansRokZl) })}
          </WynikGlowny>
          <table className="mt-2 w-full text-small tabular-nums">
            <tbody>
              {v.strumienie.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-1">{t(NAZWA[s.id])}</td>
                  <td className="py-1 text-right">{zl(s.korzyscRokZl)}</td>
                </tr>
              ))}
              <tr className="border-t">
                <td className="py-1">{t("UI-BESS-ZUZYCIE")}</td>
                <td className="py-1 text-right">−{zl(v.kosztZuzyciaRokZl)}</td>
              </tr>
            </tbody>
          </table>
          {v.prostyZwrotLat !== null && (
            <p className="mt-2 text-small">{t("UI-BESS-ZWROT", { lat: v.prostyZwrotLat.toFixed(1) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

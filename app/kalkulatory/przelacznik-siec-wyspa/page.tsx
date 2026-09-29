"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculatePrzelacznik } from "@/lib/core/modules/siec/przelacznik-siec-wyspa/calculator"
import type { RodzajPrzelacznika, TrybPracy } from "@/lib/core/modules/siec/przelacznik-siec-wyspa/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import {
  type BezpieczenstwoAgregatuStan,
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { poziomWerdyktu } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = BezpieczenstwoAgregatuStan & {
  trybPracy: TrybPracy | ""
  przelacznik: RodzajPrzelacznika | ""
  przelaczaN: "" | "tak" | "nie"
  zgloszenieOsd: "" | "tak" | "nie"
  maAgregat: boolean
}

const POCZATKOWY: Stan = {
  trybPracy: "",
  przelacznik: "",
  przelaczaN: "",
  zgloszenieOsd: "",
  maAgregat: false,
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

const takNie = (s: "" | "tak" | "nie") => (s === "" ? null : s === "tak")

/**
 * M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (shared), Wzorzec F + E. `03_M14` §6 (D47:
 * the switch detail lives here, M8 links to it; HD 60364-5-551 🔎). Hard stops 1–3 via
 * `siec/przelacznik-siec-wyspa` (generator block = M2/E17, D48).
 */
export default function PrzelacznikSiecWyspaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-przelacznik", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const result = useMemo(
    () =>
      calculatePrzelacznik({
        trybPracy: stan.trybPracy || null,
        przelacznik: stan.przelacznik || null,
        przelaczaN: takNie(stan.przelaczaN),
        zgloszenieOsd: takNie(stan.zgloszenieOsd),
        maAgregat: stan.maAgregat,
        ...naWejscieBezpieczenstwa(stan),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przelacznik-siec-wyspa" />
      <NaglowekEkranu tytul={t("UI-PSW-TYTUL")} ekran="przelacznik-siec-wyspa" wynik={result}>
        {t("UI-PSW-OPIS")}
      </NaglowekEkranu>

      <ol className="flex flex-col gap-3">
        <KrokZMedia numer={1} tytul={t("UI-PSW-K1-T")}>
          {t("UI-PSW-K1-O")}
        </KrokZMedia>
        <KrokZMedia numer={2} tytul={t("UI-PSW-K2-T")}>
          {t("UI-PSW-K2-O")}
        </KrokZMedia>
        <KrokZMedia numer={3} tytul={t("UI-PSW-K3-T")}>
          {t("UI-PSW-K3-O")}
        </KrokZMedia>
        <KrokZMedia numer={4} tytul={t("UI-PSW-K4-T")}>
          {t("UI-PSW-K4-O")}
        </KrokZMedia>
      </ol>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PSW-SPRAWDZ")}</h2>
        <PoleSelect
          label={t("UI-PSW-TRYB")}
          value={stan.trybPracy}
          onChange={(e) => ustaw({ trybPracy: e.target.value as Stan["trybPracy"] })}
          pomoc={<PomocPola ekran="przelacznik-siec-wyspa" pole="tryb" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="przelaczany">{t("UI-PSW-TRYB-PRZELACZANY")}</option>
          <option value="rownolegle">{t("UI-PSW-TRYB-ROWNOLEGLE")}</option>
          <option value="bez-sieci">{t("UI-PSW-TRYB-BEZ-SIECI")}</option>
        </PoleSelect>
        {stan.trybPracy === "przelaczany" && (
          <>
            <PoleSelect
              label={t("UI-PSW-PRZELACZNIK")}
              value={stan.przelacznik}
              onChange={(e) => ustaw({ przelacznik: e.target.value as Stan["przelacznik"] })}
              pomoc={<PomocPola ekran="przelacznik-siec-wyspa" pole="przelacznik" />}
            >
              <option value="">{t("UI-WYBIERZ")}</option>
              <option value="reczny-z-zerem-blokada">{t("UI-PSW-PRZ-RECZNY")}</option>
              <option value="szr-blokada-el-mech">{t("UI-PSW-PRZ-SZR")}</option>
              <option value="brak-lub-bez-blokady">{t("UI-PSW-PRZ-BRAK")}</option>
            </PoleSelect>
            <PoleSelect
              label={t("UI-PSW-N")}
              value={stan.przelaczaN}
              onChange={(e) => ustaw({ przelaczaN: e.target.value as Stan["przelaczaN"] })}
              pomoc={<PomocPola ekran="przelacznik-siec-wyspa" pole="przewodN" />}
            >
              <option value="">{t("UI-PSW-N-NIE-WIEM")}</option>
              <option value="tak">{t("UI-PSW-N-TAK")}</option>
              <option value="nie">{t("UI-PSW-N-NIE")}</option>
            </PoleSelect>
          </>
        )}
        {stan.trybPracy === "rownolegle" && (
          <PoleSelect
            label={t("UI-PSW-ZGLOSZENIE")}
            value={stan.zgloszenieOsd}
            onChange={(e) => ustaw({ zgloszenieOsd: e.target.value as Stan["zgloszenieOsd"] })}
            pomoc={<PomocPola ekran="przelacznik-siec-wyspa" pole="zgloszenie" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="tak">{t("UI-TAK")}</option>
            <option value="nie">{t("UI-NIE")}</option>
          </PoleSelect>
        )}
        <PoleCheckbox id="siec-przelacznik-agregat" checked={stan.maAgregat} onChange={(e) => ustaw({ maAgregat: e.target.checked })} label={t("UI-PSW-MA-AGREGAT")} />
        {stan.maAgregat && (
          <PolaBezpieczenstwaAgregatu
            miejsceAgregatu={stan.miejsceAgregatu}
            podlaczenieAgregatu={stan.podlaczenieAgregatu}
            onChange={(z) => ustaw(z)}
          />
        )}
      </section>

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-PSW-ODPOWIEDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel
          poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"}
          etykieta={
            result.value.twardeStopy > 0 ? t("UI-PSW-STOP", { n: result.value.twardeStopy }) : t("UI-PSW-BEZ-STOPOW")
          }
        >
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      <p className="text-small text-muted-foreground">
        {t("UI-PSW-POWIAZANE")}{" "}
        <Link className="underline" href="/kalkulatory/agregat-pradotworczy">
          {t("UI-PSW-L-AGREGAT")}
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
          {t("UI-PSW-L-PROCEDURA")}
        </Link>
      </p>
    </main>
  )
}

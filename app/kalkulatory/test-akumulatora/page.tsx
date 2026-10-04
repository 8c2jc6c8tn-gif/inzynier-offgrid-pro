"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateTestAkumulatora } from "@/lib/core/modules/kalkulator-mobilny/test-akumulatora/calculator"
import { CZAS_SPOCZYNKU_H } from "@/lib/core/modules/kalkulator-mobilny/test-akumulatora/constants"
import type { ChemiaTestu } from "@/lib/core/modules/kalkulator-mobilny/test-akumulatora/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "napiecieZnamionoweV" | "napiecieSpoczynkoweV" | "mocObciazeniaW" | "napiecieObciazenieV" | "rezystancjaKartaMOhm"

type FormularzStan = Record<PolaLiczbowe, string> & { chemia: ChemiaTestu | null }

const STAN_POCZATKOWY: FormularzStan = {
  chemia: null,
  napiecieZnamionoweV: "",
  napiecieSpoczynkoweV: "",
  mocObciazeniaW: "",
  napiecieObciazenieV: "",
  rezystancjaKartaMOhm: "",
}

const CHEMIE: ChemiaTestu[] = ["olow", "lifepo4"]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

const POZIOM = { dobry: "ok", "do-wymiany": "uwaga", uszkodzony: "uwaga", niejasny: "uwaga" } as const

export default function TestAkumulatoraPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("test-akumulatora", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateTestAkumulatora({
        chemia: stan.chemia,
        napiecieZnamionoweV: liczba(stan.napiecieZnamionoweV),
        napiecieSpoczynkoweV: liczba(stan.napiecieSpoczynkoweV),
        mocObciazeniaW: liczba(stan.mocObciazeniaW),
        napiecieObciazenieV: liczba(stan.napiecieObciazenieV),
        rezystancjaKartaMOhm: liczba(stan.rezystancjaKartaMOhm),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/test-akumulatora" />
      <NaglowekEkranu tytul={t("UI-M12-TA-TYTUL")} ekran="test-akumulatora" wynik={result} parametry={{ h: CZAS_SPOCZYNKU_H }}>
        {t("UI-M12-TA-OPIS")}
      </NaglowekEkranu>

      <div role="tablist" aria-label={t("UI-M12-TA-CHEMIA")} className="flex flex-wrap gap-2">
        {CHEMIE.map((c) => (
          <Button key={c} role="tab" aria-selected={c === stan.chemia} variant={c === stan.chemia ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, chemia: c }))}>
            {t(`UI-M12-TA-CH-${c.toUpperCase()}`)}
          </Button>
        ))}
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-TA-KROK1", { h: CZAS_SPOCZYNKU_H })}</legend>
        <Pole label={t("UI-M12-TA-ZNAMIONOWE")} unit="V" {...pole("napiecieZnamionoweV")} pomoc={<PomocPola ekran="test-akumulatora" pole="znamionowe" />} />
        <Pole label={t("UI-M12-TA-SPOCZYNKOWE")} unit="V" {...pole("napiecieSpoczynkoweV")} pomoc={<PomocPola ekran="test-akumulatora" pole="spoczynkowe" params={{ h: CZAS_SPOCZYNKU_H }} />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-TA-KROK2")}</legend>
        <Pole label={t("UI-M12-TA-MOC-OBCIAZENIA")} unit="W" {...pole("mocObciazeniaW")} pomoc={<PomocPola ekran="test-akumulatora" pole="mocObciazenia" />} />
        <Pole label={t("UI-M12-TA-POD-OBCIAZENIEM")} unit="V" {...pole("napiecieObciazenieV")} pomoc={<PomocPola ekran="test-akumulatora" pole="podObciazeniem" />} />
        <Pole label={t("UI-M12-TA-REZYSTANCJA-KARTA")} unit="mΩ" {...pole("rezystancjaKartaMOhm")} pomoc={<PomocPola ekran="test-akumulatora" pole="rezystancjaKarta" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={POZIOM[v.stan]} etykieta={t(`UI-M12-TA-S-${v.stan.toUpperCase()}`)}>
          {v.rezystancjaMOhm > 0 && (
            <WynikGlowny>{t("UI-M12-TA-WYNIK", { r: r1(v.rezystancjaMOhm), a: r1(v.pradA), du: Math.round(v.spadekV * 100) / 100 })}</WynikGlowny>
          )}
          {v.wzrostPct !== null && <p className="mt-1 text-small">{t("UI-M12-TA-WZROST", { pct: Math.round(v.wzrostPct) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/soh-per-ogniwo" className="text-small underline">
          {t("UI-M12-TA-LINK-SOH")}
        </Link>
        <Link href="/kalkulatory/ratowanie-akumulatora-maly" className="text-small underline">
          {t("UI-M12-TA-LINK-RATOWANIE")}
        </Link>
      </div>
    </main>
  )
}

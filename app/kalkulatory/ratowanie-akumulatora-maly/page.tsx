"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateRatowanieAkumulatoraMaly } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/calculator"
import { PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/constants"
import type { ChemiaRatowania } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  chemia: ChemiaRatowania | ""
  napiecieSpoczynkoweV: string
}

const STAN_POCZATKOWY: FormularzStan = { chemia: "", napiecieSpoczynkoweV: "" }

const NAZWY_PROCEDUR: Record<string, string> = {
  "M11/A9": "UI-RATAKUMAL-RATOWANIE-GLEBOKO-ROZLADOWAN",
  "M11/B10": "UI-RATAKUMAL-OCENA-ZUZYCIA-SIARCZANOWANIE",
  "M11/B11": "UI-RATAKUMAL-RATOWANIE-ZASIARCZONEGO",
}

export default function RatowanieAkumulatoraMalyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ratowanie-akumulatora-maly", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateRatowanieAkumulatoraMaly({
        chemia: stan.chemia === "" ? null : stan.chemia,
        napiecieSpoczynkoweV: stan.napiecieSpoczynkoweV === "" ? null : Number(stan.napiecieSpoczynkoweV),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ratowanie-akumulatora-maly" />
      <NaglowekEkranu
        tytul={t("UI-RATAKUMAL-RATOWANIE-ROZLADOWANEGO-AKUM")}
        ekran="ratowanie-akumulatora-maly"
        wynik={result}
        parametry={{ prog: PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V }}
      >
        {t("UI-RATAKUMAL-WYBIERZ-TYP-AKUMULATORA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-RATAKUMAL-TYP-AKUMULATORA")}
          value={stan.chemia}
          onChange={(e) => setStan((prev) => ({ ...prev, chemia: e.target.value as FormularzStan["chemia"] }))}
          pomoc={<PomocPola ekran="ratowanie-akumulatora-maly" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="AGM">AGM</option>
          <option value="kwasowy">{t("UI-RATAKUMAL-KWASOWY-ZALEWOWY")}</option>
          <option value={t("UI-RATAKUMAL-LIFEPO4")}>{t("UI-RATAKUMAL-LIFEPO4")}</option>
        </PoleSelect>
        {stan.chemia !== "LiFePO4" && (
          <Pole
            label={t("UI-RATAKUMAL-NAPIECIE-SPOCZYNKOWE-OPCJONA")}
            unit="V"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.napiecieSpoczynkoweV}
            onChange={(e) => setStan((prev) => ({ ...prev, napiecieSpoczynkoweV: e.target.value }))}
            pomoc={<PomocPola ekran="ratowanie-akumulatora-maly" pole="napiecie" params={{ prog: PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V }} />}
          />
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-RATAKUMAL-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-RATAKUMAL-WYBIERZ-TYP-AKUMULATORA-2")}</p>
      ) : (
        <WerdyktPanel poziom={result.value.krytycznieRozladowany ? "uwaga" : "ok"} etykieta={t("UI-RATAKUMAL-PELNA-PROCEDURA-RATOWANIA")}>
          <ol className="mt-1 list-decimal pl-5 text-small">
            {result.value.procedury.map((p) => (
              <li key={p.ekran}>
                <Link href={p.href} className="underline">
                  {NAZWY_PROCEDUR[p.ekran] ? t(NAZWY_PROCEDUR[p.ekran]!) : p.ekran}
                </Link>
              </li>
            ))}
          </ol>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

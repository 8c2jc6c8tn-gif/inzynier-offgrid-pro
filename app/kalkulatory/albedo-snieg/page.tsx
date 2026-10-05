"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateAlbedoSnieg } from "@/lib/core/modules/stress-test/albedo-snieg/calculator"
import type { TypMontazuAlbedo } from "@/lib/core/modules/stress-test/albedo-snieg/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { produkcja: string; typ: TypMontazuAlbedo | ""; zysk: string }

const STAN_POCZATKOWY: FormularzStan = { produkcja: "", typ: "", zysk: "" }

/** Mounting type → its i18n suffix (option label and the source-example hint). */
const TYPY: Record<TypMontazuAlbedo, string> = {
  dach: "DACH",
  stromy: "STROMY",
  "pionowy-jednostronny": "PIONOWY",
  bifacjalny: "BIFACJALNY",
}

const r1 = (x: number) => Math.round(x * 10) / 10

export default function AlbedoSniegPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("albedo-snieg", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateAlbedoSnieg({
        produkcjaOkresKwh: stan.produkcja === "" ? 0 : Number(stan.produkcja),
        typMontazu: stan.typ === "" ? null : stan.typ,
        zyskPct: stan.zysk === "" ? null : Number(stan.zysk),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/albedo-snieg" />
      <NaglowekEkranu tytul={t("UI-M7-ALBS-TYTUL")} ekran="albedo-snieg" wynik={result}>
        {t("UI-M7-ALBS-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-ALBS-DANE")}</legend>
        <Pole
          label={t("UI-M7-ALBS-PRODUKCJA")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={stan.produkcja}
          onChange={(e) => setStan((prev) => ({ ...prev, produkcja: e.target.value }))}
          pomoc={<PomocPola ekran="albedo-snieg" pole="produkcja" />}
        />
        <PoleSelect
          label={t("UI-M7-ALBS-TYP")}
          value={stan.typ}
          onChange={(e) => setStan((prev) => ({ ...prev, typ: e.target.value as FormularzStan["typ"] }))}
          pomoc={<PomocPola ekran="albedo-snieg" pole="typMontazu" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {(Object.keys(TYPY) as TypMontazuAlbedo[]).map((typ) => (
            <option key={typ} value={typ}>
              {t(`UI-M7-ALBS-TYP-${TYPY[typ]}`)}
            </option>
          ))}
        </PoleSelect>
        {stan.typ !== "" && <p className="text-small text-muted-foreground">{t(`UI-M7-ALBS-PODPOWIEDZ-${TYPY[stan.typ]}`)}</p>}
        <Pole
          label={t("UI-M7-ALBS-ZYSK")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={stan.zysk}
          onChange={(e) => setStan((prev) => ({ ...prev, zysk: e.target.value }))}
          pomoc={<PomocPola ekran="albedo-snieg" pole="zysk" />}
        />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-ALBS-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-ALBS-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={result.status === "VALID" ? "ok" : "uwaga"} etykieta={t("UI-M7-ALBS-W-SZACUNEK")}>
          <WynikGlowny>{t("UI-M7-ALBS-WYNIK", { z: r1(v.zyskKwh) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M7-ALBS-L-RAZEM", { e: r1(v.produkcjaZZyskiemKwh) })}</li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/panele-bifacjalne" className="text-small underline">
        {t("UI-M7-ALBS-LINK-BIFACJALNE")}
      </Link>
      <Link href="/kalkulatory/snieg-na-pv" className="text-small underline">
        {t("UI-M7-ALBS-LINK-SNIEG")}
      </Link>
    </main>
  )
}

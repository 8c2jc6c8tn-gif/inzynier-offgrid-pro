"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateAudytZimowy } from "@/lib/core/modules/ai/audyt-zimowy/calculator"
import { POZYCJE_AUDYTU, type PozycjaAudytu } from "@/lib/core/modules/ai/audyt-zimowy/constants"
import type { StanPozycji } from "@/lib/core/modules/ai/audyt-zimowy/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Stan = { pozycje: Partial<Record<PozycjaAudytu, StanPozycji | "">>; zapas: string; wymagany: string }
const STAN_POCZATKOWY: Stan = { pozycje: {}, zapas: "", wymagany: "" }

const ETYKIETA: Record<PozycjaAudytu, string> = {
  "test-generatora": "UI-M10-AZ-TEST-GENERATORA",
  "test-webasto": "UI-M10-AZ-TEST-WEBASTO",
  "przeglad-grzewczej": "UI-M10-AZ-PRZEGLAD-GRZEWCZEJ",
  "zapas-paliwa": "UI-M10-AZ-ZAPAS-PALIWA",
  "grzalki-bms": "UI-M10-AZ-GRZALKI-BMS",
}
const POMOC: Record<PozycjaAudytu, "testGeneratora" | "testWebasto" | "przegladGrzewczej" | "zapasPaliwa" | "grzalkiBms"> = {
  "test-generatora": "testGeneratora",
  "test-webasto": "testWebasto",
  "przeglad-grzewczej": "przegladGrzewczej",
  "zapas-paliwa": "zapasPaliwa",
  "grzalki-bms": "grzalkiBms",
}
const STANY: StanPozycji[] = ["gotowe", "zaplanowane", "brak", "nie-dotyczy"]
const ETYKIETA_STANU: Record<StanPozycji, string> = {
  gotowe: "UI-M10-AZ-STAN-GOTOWE",
  zaplanowane: "UI-M10-AZ-STAN-ZAPLANOWANE",
  brak: "UI-M10-AZ-STAN-BRAK",
  "nie-dotyczy": "UI-M10-AZ-STAN-NIE-DOTYCZY",
}

/** Moduł 10, Ekran 12 — generalny audyt zimowy (dawne 12.36), Wzorzec G. */
export default function AudytZimowyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("audyt-zimowy", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateAudytZimowy({
        pozycje: Object.fromEntries(POZYCJE_AUDYTU.map((id) => [id, stan.pozycje[id] || null])),
        zapasPaliwaL: liczba(stan.zapas) ?? null,
        wymaganyZapasL: liczba(stan.wymagany) ?? null,
      }),
    [stan],
  )
  const v = result.value
  const paliwoZLiczb = v.pozycje.find((p) => p.id === "zapas-paliwa")?.zLiczb ?? false

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/audyt-zimowy" />
      <NaglowekEkranu tytul={t("UI-M10-AZ-TYTUL")} ekran="audyt-zimowy" wynik={result}>
        {t("UI-M10-AZ-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        {POZYCJE_AUDYTU.map((id) => (
          <PoleSelect
            key={id}
            label={t(ETYKIETA[id])}
            value={stan.pozycje[id] ?? ""}
            onChange={(e) => setStan((s) => ({ ...s, pozycje: { ...s.pozycje, [id]: e.target.value as StanPozycji | "" } }))}
            disabled={id === "zapas-paliwa" && paliwoZLiczb}
            pomoc={<PomocPola ekran="audyt-zimowy" pole={POMOC[id]} />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            {STANY.map((s) => (
              <option key={s} value={s}>
                {t(ETYKIETA_STANU[s])}
              </option>
            ))}
          </PoleSelect>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M10-AZ-PALIWO")}</h2>
        <Pole
          label={t("UI-M10-AZ-ZAPAS")}
          unit="l"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapas}
          onChange={(e) => setStan((s) => ({ ...s, zapas: e.target.value }))}
          pomoc={<PomocPola ekran="audyt-zimowy" pole="zapasL" />}
        />
        <Pole
          label={t("UI-M10-AZ-WYMAGANY")}
          unit="l"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.wymagany}
          onChange={(e) => setStan((s) => ({ ...s, wymagany: e.target.value }))}
          pomoc={<PomocPola ekran="audyt-zimowy" pole="wymaganyL" />}
        />
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M10-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M10-AZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)} etykieta={t("UI-M10-AZ-W-RAPORT")}>
          <WynikGlowny>{t("UI-M10-AZ-WYNIK", { gotowe: v.gotowe, n: v.liczbaPozycji })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.pozycje.map((p) => (
              <li key={p.id}>
                {t(ETYKIETA[p.id])}: {t(ETYKIETA_STANU[p.stan])}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/agregat-w-mrozie" className="text-small underline">
        {t("UI-M10-AZ-LINK-AGREGAT-MROZ")}
      </Link>
      <Link href="/kalkulatory/agregat-pradotworczy" className="text-small underline">
        {t("UI-M10-AZ-LINK-PALIWO")}
      </Link>
      <Link href="/kalkulatory/grzalki-bms-mroz" className="text-small underline">
        {t("UI-M10-AZ-LINK-GRZALKI")}
      </Link>
    </main>
  )
}

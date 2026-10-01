"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWyborPlytki, type DopasowaniePlytki } from "@/lib/core/modules/esp32/wybor-plytki/calculator"
import type { PotrzebaPlytki, WyborPlytkiInput, ZasilaniePlytki } from "@/lib/core/modules/esp32/wybor-plytki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { KartaPorownawcza } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = Omit<WyborPlytkiInput, "zasilanie"> & { zasilanie: ZasilaniePlytki | "" }

const STAN_POCZATKOWY: FormularzStan = {
  zasilanie: "",
  duzoGpio: false,
  antenaZewnetrzna: false,
  mocObliczeniowa: false,
  szybkieAdc: false,
}

/** `klucz` is the translation key prefix of the label (`-H` = hint). */
const POTRZEBY: { pole: PotrzebaPlytki; klucz: string }[] = [
  { pole: "duzoGpio", klucz: "UI-M9-E1-GPIO" },
  { pole: "antenaZewnetrzna", klucz: "UI-M9-E1-ANTENA" },
  { pole: "mocObliczeniowa", klucz: "UI-M9-E1-MOC" },
  { pole: "szybkieAdc", klucz: "UI-M9-E1-ADC" },
]

const ZASILANIA: { id: ZasilaniePlytki; klucz: string }[] = [
  { id: "stale", klucz: "UI-M9-E1-Z-STALE" },
  { id: "bateria", klucz: "UI-M9-E1-Z-BATERIA" },
  { id: "poe", klucz: "UI-M9-E1-Z-POE" },
]

export default function WyborPlytkiEsp32Page() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wybor-plytki-esp32", STAN_POCZATKOWY)
  const result = useMemo(
    () => calculateWyborPlytki({ ...stan, zasilanie: stan.zasilanie === "" ? null : stan.zasilanie }),
    [stan],
  )
  const { rekomendacja, liczbaPotrzeb } = result.value
  const nazwa = (id: string) => t(`UI-M9-P-${id}-N`)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wybor-plytki-esp32" />
      <NaglowekEkranu tytul={t("UI-M9-E1-TYTUL")} ekran="wybor-plytki-esp32" wynik={result}>
        {t("UI-M9-E1-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <PoleSelect
          label={t("UI-M9-E1-ZASILANIE")}
          value={stan.zasilanie}
          onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as FormularzStan["zasilanie"] }))}
          pomoc={<PomocPola ekran="wybor-plytki-esp32" pole="zasilanie" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {ZASILANIA.map((z) => (
            <option key={z.id} value={z.id}>
              {t(z.klucz)}
            </option>
          ))}
        </PoleSelect>
        <h2 className="text-small font-semibold">{t("UI-M9-E1-POTRZEBY")}</h2>
        {POTRZEBY.map(({ pole, klucz }) => (
          <PoleCheckbox
            key={pole}
            id={`plytka-${pole}`}
            label={t(klucz)}
            hint={t(`${klucz}-H`)}
            checked={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M9-E1-WYBIERZ")}</p>
      ) : (
        <WerdyktPanel
          poziom={liczbaPotrzeb > 0 && result.warnings.length === 0 ? "ok" : "uwaga"}
          etykieta={t(
            rekomendacja.length === 0 ? "UI-M9-E1-W-DOWOLNA" : rekomendacja.length > 1 ? "UI-M9-E1-W-REMIS" : "UI-M9-E1-W-POLECANA",
          )}
        >
          <WynikGlowny>{rekomendacja.length === 0 ? t("UI-M9-E1-DOWOLNA") : rekomendacja.map(nazwa).join(" / ")}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <KartaPorownawcza<DopasowaniePlytki>
        minWidth={420}
        wiersze={result.value.plytki}
        kolumny={[
          {
            naglowek: t("UI-M9-E1-KOL-PLYTKA"),
            render: (p) => <span className={rekomendacja.includes(p.id) ? "font-semibold" : undefined}>{nazwa(p.id)}</span>,
          },
          { naglowek: t("UI-M9-E1-KOL-CECHA"), render: (p) => t(`UI-M9-P-${p.id}-C`) },
          { naglowek: t("UI-M9-E1-KOL-POKRYTE"), render: (p) => `${p.dopasowania} / ${liczbaPotrzeb}`, liczbowa: true },
        ]}
      />

      <p className="text-small text-muted-foreground">
        {t("UI-M9-E1-KARTA")}{" "}
        <Link href="/kalkulatory/zasilanie-esp32" className="underline">
          {t("UI-M9-E1-L-ZASILANIE")}
        </Link>
        {", "}
        <Link href="/kalkulatory/przydzial-pinow" className="underline">
          {t("UI-M9-E1-L-PINY")}
        </Link>
        .
      </p>
    </main>
  )
}

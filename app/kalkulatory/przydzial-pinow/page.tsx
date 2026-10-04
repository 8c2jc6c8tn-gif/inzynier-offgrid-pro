"use client"

import { useMemo } from "react"
import { calculatePrzydzialPinow } from "@/lib/core/modules/esp32/przydzial-pinow/calculator"
import type { FunkcjaPinu, PrzypisaniePinu } from "@/lib/core/modules/esp32/przydzial-pinow/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Wiersz = PrzypisaniePinu & { id: string }
type FormularzStan = { piny: Wiersz[]; wifiAktywne: boolean }

const STAN_POCZATKOWY: FormularzStan = { piny: [], wifiAktywne: false }

const FUNKCJE: { id: FunkcjaPinu; label: string }[] = [
  { id: "i2c-sda", label: "I2C SDA" },
  { id: "i2c-scl", label: "I2C SCL" },
  { id: "spi-mosi", label: "SPI MOSI" },
  { id: "spi-miso", label: "SPI MISO" },
  { id: "spi-sck", label: "SPI SCK" },
  { id: "spi-cs", label: "SPI CS" },
  { id: "uart-tx", label: "UART TX" },
  { id: "uart-rx", label: "UART RX" },
  { id: "adc", label: "UI-PRZPIN-ADC-ANALOGOWE" },
  { id: "1-wire", label: "UI-PRZPIN-WIRE" },
  { id: "pwm", label: "PWM" },
  { id: "wejscie", label: "UI-PRZPIN-WEJSCIE-CYFROWE" },
  { id: "wyjscie", label: "UI-PRZPIN-WYJSCIE-CYFROWE" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"
const liczba = (v: string) => (v === "" ? null : Number(v))

export default function PrzydzialPinowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przydzial-pinow", STAN_POCZATKOWY)
  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ ...prev, piny: prev.piny.map((p) => (p.id === id ? { ...p, ...zmiana } : p)) }))
  }
  const result = useMemo(() => calculatePrzydzialPinow({ piny: stan.piny, wifiAktywne: stan.wifiAktywne }), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przydzial-pinow" />
      <NaglowekEkranu tytul={t("UI-PRZPIN-PRZYDZIAL-PINOW-GPIO")} ekran="przydzial-pinow" wynik={result}>
        {t("UI-PRZPIN-ZANIM-PODLACZYSZ-KABLE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-PRZPIN-MAPA-PINOW")}</p>
        <p className="text-caption text-muted-foreground">{t("UI-PRZPIN-KILKA-CZUJNIKOW-TEJ")}</p>
        <ul className="flex flex-col gap-3">
          {stan.piny.map((p, i) => {
            const opis = p.opis || `pin ${i + 1}`
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="GPIO"
                  value={p.gpio ?? ""}
                  onChange={(e) => aktualizuj(p.id, { gpio: liczba(e.target.value) })}
                  className={`${pole} w-20`}
                  aria-label={t("UI-PRZPIN-NUMER-GPIO-PIN", { p: i + 1 })}
                />
                <PomocPola ekran="przydzial-pinow" pole="gpio" />
                <select
                  value={p.funkcja}
                  onChange={(e) => aktualizuj(p.id, { funkcja: e.target.value as FunkcjaPinu })}
                  className={pole}
                  aria-label={t("UI-PRZPIN-FUNKCJA", { opis })}
                >
                  {FUNKCJE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label.startsWith("UI-") ? t(f.label) : f.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="przydzial-pinow" pole="funkcja" />
                <input
                  placeholder={t("UI-PRZPIN-OPIS")}
                  value={p.opis}
                  onChange={(e) => aktualizuj(p.id, { opis: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-PRZPIN-OPIS-PIN", { p: i + 1 })}
                />
                <PomocPola ekran="przydzial-pinow" pole="opis" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, piny: prev.piny.filter((x) => x.id !== p.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-PRZPIN-USUN-2", { opis })}
                >
                  {t("UI-PRZPIN-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, piny: [...prev.piny, { id: crypto.randomUUID(), gpio: null, funkcja: "i2c-sda", opis: "" }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-PRZPIN-DODAJ-PIN")}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <PoleCheckbox
          id="piny-wifi"
          className="flex-1"
          label={t("UI-PRZPIN-AKTYWNE-PODCZAS-POMIAROW")}
          checked={stan.wifiAktywne}
          onChange={(e) => setStan((prev) => ({ ...prev, wifiAktywne: e.target.checked }))}
        />
        <PomocPola ekran="przydzial-pinow" pole="wifi" />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PRZPIN-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PRZPIN-DODAJ-PINY-NUMEREM")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? t("UI-PRZPIN-KONFLIKT-PINOW") : t("UI-PRZPIN-MAPA-PINOW-BEZ")}>
          <WynikGlowny>
            {t("UI-PRZPIN-KONFLIKTY-PRZYPISANIA", { liczbaKonfliktow: result.value.liczbaKonfliktow, liczbaPrzypisan: result.value.liczbaPrzypisan })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}

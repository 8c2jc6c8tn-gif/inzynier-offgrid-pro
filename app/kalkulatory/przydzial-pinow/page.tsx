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
  { id: "adc", label: "ADC (analogowe)" },
  { id: "1-wire", label: "1-Wire" },
  { id: "pwm", label: "PWM" },
  { id: "wejscie", label: "Wejście cyfrowe" },
  { id: "wyjscie", label: "Wyjście cyfrowe" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"
const liczba = (v: string) => (v === "" ? null : Number(v))

export default function PrzydzialPinowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przydzial-pinow", STAN_POCZATKOWY)
  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ ...prev, piny: prev.piny.map((p) => (p.id === id ? { ...p, ...zmiana } : p)) }))
  }
  const result = useMemo(() => calculatePrzydzialPinow({ piny: stan.piny, wifiAktywne: stan.wifiAktywne }), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przydzial-pinow" />
      <NaglowekEkranu tytul="Przydział pinów GPIO" ekran="przydzial-pinow" wynik={result}>
        Zanim podłączysz kable, rozplanuj piny na mapie — inaczej zrobisz sobie plątaninę, którą trudno będzie rozplątać. Moduł
        9, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Mapa pinów</p>
        <p className="text-caption text-muted-foreground">Kilka czujników na tej samej magistrali I2C/1-Wire/SPI może dzielić pin — wpisz go wtedy przy każdym.</p>
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
                  aria-label={`Numer GPIO — pin ${i + 1}`}
                />
                <PomocPola ekran="przydzial-pinow" pole="gpio" />
                <select
                  value={p.funkcja}
                  onChange={(e) => aktualizuj(p.id, { funkcja: e.target.value as FunkcjaPinu })}
                  className={pole}
                  aria-label={`Funkcja — ${opis}`}
                >
                  {FUNKCJE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="przydzial-pinow" pole="funkcja" />
                <input
                  placeholder="Opis"
                  value={p.opis}
                  onChange={(e) => aktualizuj(p.id, { opis: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Opis — pin ${i + 1}`}
                />
                <PomocPola ekran="przydzial-pinow" pole="opis" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, piny: prev.piny.filter((x) => x.id !== p.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={`Usuń ${opis}`}
                >
                  Usuń
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
          + Dodaj pin
        </button>
      </div>

      <div className="flex items-center gap-2">
        <PoleCheckbox
          id="piny-wifi"
          className="flex-1"
          label="Wi-Fi aktywne podczas pomiarów"
          checked={stan.wifiAktywne}
          onChange={(e) => setStan((prev) => ({ ...prev, wifiAktywne: e.target.checked }))}
        />
        <PomocPola ekran="przydzial-pinow" pole="wifi" />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Dodaj piny z numerem GPIO.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? "Konflikt pinów" : "Mapa pinów bez konfliktów"}>
          <WynikGlowny>
            Konflikty: {result.value.liczbaKonfliktow} · przypisania: {result.value.liczbaPrzypisan}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

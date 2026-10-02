"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateArchitekturaKomunikacji } from "@/lib/core/modules/esp32/architektura-komunikacji/calculator"
import type { PolaczenieEsp32, ProtokolPolaczenia } from "@/lib/core/modules/esp32/architektura-komunikacji/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { PomocPola } from "@/components/ui/pomoc"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Wiersz = PolaczenieEsp32 & { id: string }
type FormularzStan = { polaczenia: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = { polaczenia: [] }

const PROTOKOLY: { id: ProtokolPolaczenia; label: string }[] = [
  { id: "rs485", label: "UI-ARCKOM-RS485-MODBUS" },
  { id: "can", label: "CAN" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "ethernet", label: "UI-ARCKOM-ETHERNET" },
  { id: "bluetooth", label: "UI-ARCKOM-BLUETOOTH" },
  { id: "lora", label: "UI-ARCKOM-LORA" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"
const liczba = (v: string) => (v === "" ? null : Number(v))

export default function ArchitekturaKomunikacjiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("architektura-komunikacji", STAN_POCZATKOWY)
  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ polaczenia: prev.polaczenia.map((p) => (p.id === id ? { ...p, ...zmiana } : p)) }))
  }
  const result = useMemo(() => calculateArchitekturaKomunikacji({ polaczenia: stan.polaczenia }), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/architektura-komunikacji" />
      <NaglowekEkranu tytul={t("UI-ARCKOM-ARCHITEKTURA-KOMUNIKACJI-ESP")} ekran="architektura-komunikacji" wynik={result}>
        {t("UI-ARCKOM-ESP32-TLUMACZ-MIEDZY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-ARCKOM-POLACZENIA")}</p>
        <ul className="flex flex-col gap-3">
          {stan.polaczenia.map((p, i) => {
            const opis = p.nazwa || t("UI-ARCKOM-POLACZENIE", { p: i + 1 })
            const magistrala = p.protokol === "rs485" || p.protokol === "can"
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                <input
                  placeholder={t("UI-ARCKOM-URZADZENIE")}
                  value={p.nazwa}
                  onChange={(e) => aktualizuj(p.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-ARCKOM-URZADZENIE-POLACZENIE", { p: i + 1 })}
                />
                <PomocPola ekran="architektura-komunikacji" pole="urzadzenie" />
                <select
                  value={p.protokol}
                  onChange={(e) => aktualizuj(p.id, { protokol: e.target.value as ProtokolPolaczenia })}
                  className={pole}
                  aria-label={t("UI-ARCKOM-PROTOKOL", { opis })}
                >
                  {PROTOKOLY.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.label.startsWith("UI-") ? t(x.label) : x.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="architektura-komunikacji" pole="protokol" />
                {magistrala && (
                  <>
                    <label className="flex items-center gap-1 text-caption">
                      <input
                        type="checkbox"
                        checked={p.maTransceiver}
                        onChange={(e) => aktualizuj(p.id, { maTransceiver: e.target.checked })}
                        className="h-5 w-5 accent-primary"
                        aria-label={t("UI-ARCKOM-TRANSCEIVER-2", { opis })}
                      />
                      {t("UI-ARCKOM-TRANSCEIVER")}
                    </label>
                    <PomocPola ekran="architektura-komunikacji" pole="transceiver" />
                    {p.protokol === "rs485" && (
                      <>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          placeholder={t("UI-ARCKOM-ADRES")}
                          value={p.adres ?? ""}
                          onChange={(e) => aktualizuj(p.id, { adres: liczba(e.target.value) })}
                          className={`${pole} w-20`}
                          aria-label={t("UI-ARCKOM-ADRES-MODBUS", { opis })}
                        />
                        <PomocPola ekran="architektura-komunikacji" pole="adres" />
                      </>
                    )}
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder={t("UI-ARCKOM-BIT")}
                      value={p.predkoscBps ?? ""}
                      onChange={(e) => aktualizuj(p.id, { predkoscBps: liczba(e.target.value) })}
                      className={`${pole} w-24`}
                      aria-label={t("UI-ARCKOM-PREDKOSC-BIT", { opis })}
                    />
                    <PomocPola ekran="architektura-komunikacji" pole="predkosc" />
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ polaczenia: prev.polaczenia.filter((x) => x.id !== p.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-ARCKOM-USUN-2", { opis })}
                >
                  {t("UI-ARCKOM-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({
              polaczenia: [...prev.polaczenia, { id: crypto.randomUUID(), nazwa: "", protokol: "rs485", maTransceiver: false, adres: null, predkoscBps: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-ARCKOM-DODAJ-POLACZENIE")}
        </button>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ARCKOM-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ARCKOM-DODAJ-POLACZENIA-ESP32")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-ARCKOM-PORT-ESP32-ZOSTANIE") : hasWarning ? t("UI-ARCKOM-KONFLIKTY-MAGISTRALI") : t("UI-ARCKOM-ARCHITEKTURA-POPRAWNA")}
        >
          <WynikGlowny>{t("UI-ARCKOM-PROBLEMY", { liczbaProblemow: result.value.liczbaProblemow })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      {/* Source (M9/E4): "Link: prowadzi do katalogu protokołów komunikacji" — Katalog 3. */}
      <Link href="/kalkulatory/katalog-protokolow" className="text-small underline">
        {t("UI-ARCKOM-LINK-KATALOG-PROTOKOLOW")}
      </Link>
    </main>
  )
}

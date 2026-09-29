"use client"

import { useMemo } from "react"
import { calculatePowiadomieniaAlarmowe } from "@/lib/core/modules/bezpieczenstwo/powiadomienia-alarmowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Flagi = "maSyrene" | "maKamery" | "autoWezwanieSluzb" | "zgodaNaWezwanieSluzb"
type FormularzStan = { liczbaKontaktow: string } & Record<Flagi, boolean>

// Zgoda na wezwanie służb domyślnie false — tylko wyraźna decyzja użytkownika.
const STAN_POCZATKOWY: FormularzStan = {
  liczbaKontaktow: "",
  maSyrene: false,
  maKamery: false,
  autoWezwanieSluzb: false,
  zgodaNaWezwanieSluzb: false,
}

const FLAGI: { pole: Flagi; label: string; hint?: string }[] = [
  { pole: "maSyrene", label: "Jest syrena / sygnalizator zewnętrzny" },
  { pole: "maKamery", label: "Są kamery monitoringu (nagrywanie po alarmie)" },
  { pole: "autoWezwanieSluzb", label: "Automatyczne wezwanie służb włączone" },
  {
    pole: "zgodaNaWezwanieSluzb",
    label: "Wyrażam wyraźną zgodę na automatyczne wezwanie służb",
    hint: "Bez tej zgody system nigdy sam nie wezwie służb.",
  },
]

export default function PowiadomieniaAlarmowePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("powiadomienia-alarmowe", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculatePowiadomieniaAlarmowe({
        ...stan,
        liczbaKontaktow: stan.liczbaKontaktow === "" ? null : Number(stan.liczbaKontaktow),
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/powiadomienia-alarmowe" />
      <NaglowekEkranu tytul="Syrena, powiadomienia i służby" ekran="powiadomienia-alarmowe" wzor={result.formula}>
        System nie tylko wykrywa zagrożenie, ale może też wezwać pomoc — ostatnia deska ratunku, gdy nikogo nie ma w domu.
        Moduł 8, Ekran 10.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Kontakty alarmowe"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stan.liczbaKontaktow}
          onChange={(e) => setStan((prev) => ({ ...prev, liczbaKontaktow: e.target.value }))}
          pomoc={<PomocPola ekran="powiadomienia-alarmowe" pole="kontakty" />}
        />
        {FLAGI.map(({ pole, label, hint }) => (
          <PoleCheckbox
            key={pole}
            id={`alarm-${pole}`}
            label={label}
            hint={hint}
            checked={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz liczbę kontaktów alarmowych (może być 0).</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Wezwanie służb bez zgody — wyłączone" : hasWarning ? "Są braki w powiadamianiu" : "Powiadamianie skonfigurowane"}
        >
          <WynikGlowny>{result.value.autoWezwanieAktywne ? "Auto-wezwanie służb: aktywne" : "Auto-wezwanie służb: nieaktywne"}</WynikGlowny>
          <p className="mt-2 text-small">Braki: {result.value.liczbaBrakow}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

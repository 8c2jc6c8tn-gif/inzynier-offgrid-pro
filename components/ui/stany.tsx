"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Trzy stany brzegowe, których brakowało jako nazwanych komponentów (docs/brief-dla-v0.md,
 * sekcja 8): pustka/niekompletność danych, błąd obliczenia i ładowanie. Wcześniej każdy ekran
 * budował swój własny box `cn("rounded-lg border-2 p-4", "border-muted-foreground/40 bg-muted
 * text-muted-foreground")` od zera (lokalizacja-i-klimat, systemy-podtrzymania-zycia,
 * procedura-black-start...) — to teraz jeden komponent.
 */

/** Brak/niekompletne dane wejściowe — status CalcResult "INCOMPLETE". Neutralne, nie ostrzegawcze:
 * to normalny stan początkowy formularza, nie błąd użytkownika. */
export function StanPusty({
  tytul,
  children,
  className,
}: {
  tytul: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-4 text-small text-muted-foreground",
        className,
      )}
    >
      <p className="font-medium text-foreground">{tytul}</p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}

/** Błąd — dane wejściowe są obecne, ale nie da się z nich policzyć wyniku (status "INVALID_INPUT"
 * poza kontekstem WerdyktPanel, np. gdy nie ma jeszcze poziomu do pokazania). Osobny od StanPusty,
 * bo wymaga innego tonu: to nie "uzupełnij dane", to "coś w danych jest nie tak". */
export function StanBledu({
  tytul,
  children,
  className,
}: {
  tytul: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border-2 border-werdykt-blad-border bg-werdykt-blad-bg p-4 text-small text-werdykt-blad-foreground",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-medium">
        <span aria-hidden="true">🔴</span>
        {tytul}
      </p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}

/** Ładowanie — szkielet do ekranów, które kiedyś doczekają się realnego async (np. Tryb Live po
 * podłączeniu telemetrii przez Modbus/MQTT). Dziś większość kalkulatorów liczy synchronicznie
 * (useMemo), więc to głównie token gotowy do użycia, nie coś widoczne na co dzień. */
export function StanLadowania({ linie = 3, className }: { linie?: number; className?: string }) {
  const t = useTranslate()
  return (
    <div
      role="status"
      aria-label={t("UI-STA-WCZYTYWANIE-DANYCH")}
      className={cn("flex flex-col gap-2 rounded-lg border p-4", className)}
    >
      {Array.from({ length: linie }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-muted"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
      <span className="sr-only">{t("UI-STA-WCZYTYWANIE")}</span>
    </div>
  )
}

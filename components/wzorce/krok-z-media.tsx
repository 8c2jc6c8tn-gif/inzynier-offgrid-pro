"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useTranslate } from "@/lib/i18n/language-context"
import { Ikona, IKONA } from "@/components/ui/ikona"

/**
 * Krok poradnika z opcjonalnym zdjęciem/nagraniem (na wyraźną prośbę właściciela projektu,
 * 2026-09-13: "poradnik musi prowadzić dokładnie krok po kroku z pokazaniem zdjęć albo nagrań").
 *
 * Gdy `media` nie jest podane — pokazuje jawny placeholder ("miejsce na materiał wizualny"), NIE
 * podstawia żadnego domyślnego/wygenerowanego obrazu. Prawdziwe zdjęcia/nagrania z realnego
 * montażu jeszcze nie zostały dostarczone (`docs/memory.md`, 2026-09-13) — ten komponent jest
 * gotowy, żeby je przyjąć (`media: { typ: "zdjecie"|"nagranie", url, opis }`), gdy się pojawią.
 */
export function KrokZMedia({
  numer,
  tytul,
  children,
  media,
  className,
}: {
  numer: number
  tytul: ReactNode
  children?: ReactNode
  media?: { typ: "zdjecie" | "nagranie"; url: string; opis: string }
  className?: string
}) {
  const t = useTranslate()
  return (
    <li className={cn("flex flex-col gap-2 rounded-lg border bg-card p-3", className)}>
      <p className="flex items-baseline gap-2">
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-caption font-semibold text-primary">
          {numer}
        </span>
        <span className="font-medium">{tytul}</span>
      </p>
      {children && <div className="text-small text-muted-foreground">{children}</div>}

      {media ? (
        media.typ === "zdjecie" ? (
          // eslint-disable-next-line @next/next/no-img-element -- media z realnego montażu, ścieżki dynamiczne spoza /public
          <img src={media.url} alt={media.opis} className="w-full rounded-md border" />
        ) : (
          <video src={media.url} controls className="w-full rounded-md border" aria-label={media.opis} />
        )
      ) : (
        <div
          role="img"
          aria-label={t("UI-KROZMED-BRAK-ZDJECIA-NAGRANIA", { p: typeof tytul === "string" ? tytul : numer })}
          className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/40 p-4 text-caption text-muted-foreground"
        >
          <Ikona nazwa={IKONA.camera} />
          {t("UI-KROZMED-MIEJSCE-ZDJECIE-NAGRANIE")}
        </div>
      )}
    </li>
  )
}

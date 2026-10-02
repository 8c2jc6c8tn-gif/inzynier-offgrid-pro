"use client"

import { useCallback } from "react"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { kluczKafelNazwa, kluczKafelOpis, kluczEkranu, tekstRejestru } from "@/lib/pulpit/tlumaczenia"
import type { EkranEntry, KafelEntry } from "@/lib/pulpit/registry"

/**
 * Translated registry texts (`lib/pulpit/registry.ts`): tile name/description and screen label.
 * Falls back to the Polish registry text when the key is missing — never an empty string.
 */
export function useTekstyRejestru() {
  const language = useLanguage()
  const nazwaKafla = useCallback(
    (kafel: Pick<KafelEntry, "id" | "nazwa">) => tekstRejestru(language, kluczKafelNazwa(kafel.id), kafel.nazwa),
    [language],
  )
  const opisKafla = useCallback(
    (kafel: Pick<KafelEntry, "id" | "opis">) => tekstRejestru(language, kluczKafelOpis(kafel.id), kafel.opis),
    [language],
  )
  const etykietaEkranu = useCallback(
    (kafel: Pick<KafelEntry, "id">, ekran: EkranEntry) =>
      tekstRejestru(language, kluczEkranu(kafel.id, ekran.href), ekran.label),
    [language],
  )
  return { nazwaKafla, opisKafla, etykietaEkranu }
}

export function NazwaKafla({ kafel }: { kafel: Pick<KafelEntry, "id" | "nazwa"> }) {
  return <>{useTekstyRejestru().nazwaKafla(kafel)}</>
}

export function OpisKafla({ kafel }: { kafel: Pick<KafelEntry, "id" | "opis"> }) {
  return <>{useTekstyRejestru().opisKafla(kafel)}</>
}

export function EtykietaEkranu({ kafel, ekran }: { kafel: Pick<KafelEntry, "id">; ekran: EkranEntry }) {
  return <>{useTekstyRejestru().etykietaEkranu(kafel, ekran)}</>
}

/** "Module {id} — {name}" heading of the module page, with the translated tile name. */
export function TytulModulu({ kafel }: { kafel: Pick<KafelEntry, "id" | "nazwa"> }) {
  const t = useTranslate()
  const { nazwaKafla } = useTekstyRejestru()
  return <>{t("UI-MOD-TYTUL", { id: kafel.id, nazwa: nazwaKafla(kafel) })}</>
}

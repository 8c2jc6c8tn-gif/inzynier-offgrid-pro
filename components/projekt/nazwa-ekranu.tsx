"use client"

import { useTekstyRejestru } from "@/components/tekst-rejestru"
import { znajdzKafelIEkranPoHref } from "@/lib/pulpit/registry"

/** Translated name of a screen from its key (`app/kalkulatory/<key>`); the key itself when the screen is not in the registry. */
export function useNazwaEkranu(): (klucz: string) => string {
  const { etykietaEkranu } = useTekstyRejestru()
  return (klucz) => {
    const w = znajdzKafelIEkranPoHref(`/kalkulatory/${klucz}`)
    return w ? etykietaEkranu(w.kafel, w.ekran) : klucz
  }
}

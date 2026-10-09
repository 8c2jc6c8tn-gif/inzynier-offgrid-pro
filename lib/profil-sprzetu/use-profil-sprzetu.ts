"use client"

/**
 * Odczyt/zapis Profilu sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) —
 * `IndexedDbStorageAdapter`, ten sam wzorzec co `use-persisted-draft.ts` (Seed, nie Wynik —
 * ale tu Seed jest współdzielony między ekranami, nie prywatny dla jednego formularza, więc
 * jeden ustalony klucz, nie `kluczEkranu` per wywołanie).
 *
 * Zapis zablokowany do zakończenia pierwszego wczytania (`wczytanoRef`), żeby wywołanie
 * `zapiszBaterie` tuż po zamontowaniu komponentu nie nadpisało jeszcze niewczytanych danych
 * pustym stanem startowym.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { migrujProfil, WERSJA_PROFILU_SPRZETU, type ProfilSprzetu, type ProfilSprzetuBaterii, type ProfilSprzetuPanelu } from "./types"

const KEY = "offgrid.profil-sprzetu.v1"

export function useProfilSprzetu(): {
  profil: ProfilSprzetu
  wczytano: boolean
  zapiszBaterie: (dane: Partial<ProfilSprzetuBaterii>) => void
  /** Zapisuje panel podstawowy (U14) — wołać wyłącznie po zgodzie użytkownika, nigdy automatycznie. */
  zapiszPanel: (panel: ProfilSprzetuPanelu) => void
} {
  const [profil, setProfil] = useState<ProfilSprzetu>({})
  const [wczytano, setWczytano] = useState(false)
  const wczytanoRef = useRef(false)

  useEffect(() => {
    let aktywny = true
    indexedDbStorageAdapter
      .getItem<ProfilSprzetu>(KEY)
      .then((zapisany) => {
        if (!aktywny) return
        if (zapisany !== null) setProfil(migrujProfil(zapisany))
      })
      .catch((err) => {
        consoleReporter.reportError({
          userMessage: "Nie udało się wczytać profilu sprzętu — pola trzeba wpisać ręcznie.",
          technicalDetails: `IndexedDbStorageAdapter.getItem(${KEY}) nie powiódł się`,
          source: "lib/profil-sprzetu/use-profil-sprzetu",
          cause: err,
        })
      })
      .finally(() => {
        if (aktywny) {
          wczytanoRef.current = true
          setWczytano(true)
        }
      })
    return () => {
      aktywny = false
    }
  }, [])

  // useCallback ze stabilną tożsamością (deps: []) — bezpieczne jako zależność useEffect w
  // komponentach wołających, bez ryzyka nieskończonej pętli renderowania (setProfil/wczytanoRef
  // to referencje stabilne między renderami).
  const zapisz = useCallback((zmiana: (poprzedni: ProfilSprzetu) => ProfilSprzetu) => {
    setProfil((poprzedni) => {
      const nowy: ProfilSprzetu = { ...zmiana(poprzedni), schemaVersion: WERSJA_PROFILU_SPRZETU }
      if (wczytanoRef.current) {
        indexedDbStorageAdapter.setItem(KEY, nowy).catch((err) => {
          consoleReporter.reportError({
            userMessage: "Nie udało się zapisać profilu sprzętu — zmiana obowiązuje tylko w tej sesji.",
            technicalDetails: `IndexedDbStorageAdapter.setItem(${KEY}) nie powiódł się`,
            source: "lib/profil-sprzetu/use-profil-sprzetu",
            cause: err,
          })
        })
      }
      return nowy
    })
  }, [])

  const zapiszBaterie = useCallback(
    (dane: Partial<ProfilSprzetuBaterii>) => zapisz((poprzedni) => ({ ...poprzedni, bateria: { ...poprzedni.bateria, ...dane } })),
    [zapisz],
  )
  const zapiszPanel = useCallback((panel: ProfilSprzetuPanelu) => zapisz((poprzedni) => ({ ...poprzedni, panel })), [zapisz])

  return { profil, wczytano, zapiszBaterie, zapiszPanel }
}

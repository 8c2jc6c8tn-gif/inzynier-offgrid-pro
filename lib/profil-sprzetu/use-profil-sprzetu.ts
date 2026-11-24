"use client"

/**
 * Odczyt/zapis Profilu sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) —
 * `IndexedDbStorageAdapter`, ten sam wzorzec co `use-persisted-draft.ts` (Seed, nie Wynik —
 * ale tu Seed jest współdzielony między ekranami, nie prywatny dla jednego formularza, więc
 * jeden ustalony klucz, nie `kluczEkranu` per wywołanie).
 *
 * Zapis zablokowany do zakończenia pierwszego wczytania (`wczytanoRef`), żeby wywołanie
 * `zapiszPanel` tuż po zamontowaniu komponentu nie nadpisało jeszcze niewczytanych danych
 * pustym stanem startowym.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { kluczProjektu } from "@/lib/projekt/projekty"
import { useAktywnyProjektId } from "@/lib/projekt/use-projekt"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { migrujProfil, WERSJA_PROFILU_SPRZETU, type ProfilSprzetu, type ProfilSprzetuPanelu } from "./types"

/** Per project (project 1 keeps the pre-project key `offgrid.profil-sprzetu.v1`). */
const BAZA = "profil-sprzetu.v1"

export function useProfilSprzetu(): {
  profil: ProfilSprzetu
  wczytano: boolean
  /** Zapisuje panel podstawowy (U14) — wołać wyłącznie po zgodzie użytkownika, nigdy automatycznie. */
  zapiszPanel: (panel: ProfilSprzetuPanelu) => void
} {
  const projektId = useAktywnyProjektId()
  const KEY = projektId ? kluczProjektu(projektId, BAZA) : null
  const [profil, setProfil] = useState<ProfilSprzetu>({})
  const [wczytano, setWczytano] = useState(false)
  const wczytanoRef = useRef(false)
  const keyRef = useRef(KEY)

  useEffect(() => {
    if (!KEY) return
    let aktywny = true
    keyRef.current = KEY
    wczytanoRef.current = false
    indexedDbStorageAdapter
      .getItem<ProfilSprzetu>(KEY)
      .then((zapisany) => {
        if (!aktywny) return
        setProfil(zapisany !== null ? migrujProfil(zapisany) : {})
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
  }, [KEY])

  // useCallback ze stabilną tożsamością (deps: []) — bezpieczne jako zależność useEffect w
  // komponentach wołających, bez ryzyka nieskończonej pętli renderowania (setProfil/wczytanoRef
  // to referencje stabilne między renderami).
  const zapisz = useCallback((zmiana: (poprzedni: ProfilSprzetu) => ProfilSprzetu) => {
    setProfil((poprzedni) => {
      const nowy: ProfilSprzetu = { ...zmiana(poprzedni), schemaVersion: WERSJA_PROFILU_SPRZETU }
      const KEY = keyRef.current
      if (wczytanoRef.current && KEY) {
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

  const zapiszPanel = useCallback((panel: ProfilSprzetuPanelu) => zapisz((poprzedni) => ({ ...poprzedni, panel })), [zapisz])

  return { profil, wczytano, zapiszPanel }
}

/**
 * Personalizacja wyglądu (kolory + czcionka) — "drobna preferencja UI", nie dana projektu
 * (ZASADY_APLIKACJI.md, Zasada 6), ten sam wzorzec co `lib/pulpit/storage.ts` i
 * `lib/theme/storage.ts` (useSyncExternalStore, zdarzenie CHANGE_EVENT, localStorage).
 *
 * Kolory są nadpisywane jako CSS custom properties bezpośrednio na <html> — reszta odcieni
 * (tło/obramowanie/tekst werdyktu) jest liczona automatycznie przez `color-mix()` w
 * `app/globals.css`, więc user zmienia jeden kolor bazowy, nie komplet trzech wartości.
 * To jest "grupowa" zmiana w drugim sensie: jedna grupa (np. "sukces") = jeden suwak, ale
 * wpływa jednocześnie na tło/obramowanie/tekst każdego miejsca w apce, które używa tego tokenu.
 *
 * The appearance style (`./style.ts`, D63–D67) lives in the same state: the style provides the base
 * tokens through `data-styl` on <html>; the user's colour overrides (inline style) win over it.
 */

import { consoleReporter } from "@/lib/core/reporter"
import { getSnapshot as trybMotywu, zastosujTryb } from "@/lib/theme/storage"
import type { IkonyKafli } from "@/lib/pulpit/maskotki"
import { jestHeksem, luminancja } from "./kolor"
import { jestStylem, znajdzStyl, type StylId } from "./style"

export type GrupaKolorow = "tlo" | "karty" | "tekst" | "akcent" | "sukces" | "uwaga" | "blad"

export const GRUPY_KOLOROW: { id: GrupaKolorow; etykietaKey: string; opisKey: string }[] = [
  { id: "tlo", etykietaKey: "UI-WYGLAD-KOLOR-TLO", opisKey: "UI-WYGLAD-KOLOR-TLO-OPIS" },
  { id: "karty", etykietaKey: "UI-WYGLAD-KOLOR-KARTY", opisKey: "UI-WYGLAD-KOLOR-KARTY-OPIS" },
  { id: "tekst", etykietaKey: "UI-WYGLAD-KOLOR-TEKST", opisKey: "UI-WYGLAD-KOLOR-TEKST-OPIS" },
  { id: "akcent", etykietaKey: "UI-WYGLAD-KOLOR-AKCENT", opisKey: "UI-WYGLAD-KOLOR-AKCENT-OPIS" },
  { id: "sukces", etykietaKey: "UI-WYGLAD-KOLOR-SUKCES", opisKey: "UI-WYGLAD-KOLOR-SUKCES-OPIS" },
  { id: "uwaga", etykietaKey: "UI-WYGLAD-KOLOR-UWAGA", opisKey: "UI-WYGLAD-KOLOR-UWAGA-OPIS" },
  { id: "blad", etykietaKey: "UI-WYGLAD-KOLOR-BLAD", opisKey: "UI-WYGLAD-KOLOR-BLAD-OPIS" },
]

const MAPA_ZMIENNYCH: Record<GrupaKolorow, string[]> = {
  tlo: ["--background"],
  karty: ["--card", "--popover"],
  tekst: ["--foreground", "--card-foreground", "--popover-foreground"],
  akcent: ["--primary"],
  sukces: ["--werdykt-ok"],
  uwaga: ["--werdykt-uwaga"],
  blad: ["--werdykt-blad"],
}

export type CzcionkaId = "inter" | "source-sans" | "roboto" | "lato"

export const CZCIONKI: { id: CzcionkaId; etykieta: string; zmienna: string }[] = [
  { id: "inter", etykieta: "Inter", zmienna: "--font-inter" },
  { id: "source-sans", etykieta: "Source Sans 3", zmienna: "--font-source-sans" },
  { id: "roboto", etykieta: "Roboto", zmienna: "--font-roboto" },
  { id: "lato", etykieta: "Lato", zmienna: "--font-lato" },
]

export type WagaTekstu = "normalna" | "pogrubiona"

export type WygladState = {
  kolory: Partial<Record<GrupaKolorow, string>>
  czcionka: CzcionkaId
  waga: WagaTekstu
  /** Appearance style from `./style.ts`; `null` = the default look (follows the light/dark theme). */
  styl: StylId | null
  /** Show the „Ukryte i sezonowe” group in the style picker (D67, open question — ✅🤖 toggle). */
  pokazUkryteStyle: boolean
  /** Tile illustrations: the Bob mascot (default) or the 3D icon set (D87). */
  ikonyKafli: IkonyKafli
}

const STORAGE_KEY = "offgrid.wyglad.v1"
const CHANGE_EVENT = "offgrid-wyglad-change"

const DOMYSLNY_STAN: WygladState = {
  kolory: {},
  czcionka: "inter",
  waga: "normalna",
  styl: null,
  pokazUkryteStyle: false,
  ikonyKafli: "bob",
}

function jestCzcionka(value: unknown): value is CzcionkaId {
  return CZCIONKI.some((c) => c.id === value)
}

function parsujStan(raw: string | null): WygladState {
  if (!raw) return DOMYSLNY_STAN
  try {
    const parsed = JSON.parse(raw) as Partial<WygladState>
    const kolory: Partial<Record<GrupaKolorow, string>> = {}
    if (parsed.kolory && typeof parsed.kolory === "object") {
      for (const grupa of GRUPY_KOLOROW) {
        const val = parsed.kolory[grupa.id]
        if (jestHeksem(val)) kolory[grupa.id] = val
      }
    }
    return {
      kolory,
      czcionka: jestCzcionka(parsed.czcionka) ? parsed.czcionka : "inter",
      waga: parsed.waga === "pogrubiona" ? "pogrubiona" : "normalna",
      // An id no longer in the table (renamed/removed style) falls back to the default look.
      styl: jestStylem(parsed.styl) ? parsed.styl : null,
      pokazUkryteStyle: parsed.pokazUkryteStyle === true,
      ikonyKafli: parsed.ikonyKafli === "3d" ? "3d" : "bob",
    }
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się odczytać zapisanego wyglądu — pokazany domyślny.",
      technicalDetails: `JSON.parse(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/wyglad/storage.parsujStan",
      cause: err,
    })
    return DOMYSLNY_STAN
  }
}

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się odczytać zapisanego wyglądu — pokazany domyślny.",
      technicalDetails: `localStorage.getItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/wyglad/storage.odczytajRaw",
      cause: err,
    })
    return null
  }
}

let cache: { raw: string | null; stan: WygladState } | null = null

export function getSnapshot(): WygladState {
  const raw = odczytajRaw()
  if (cache && cache.raw === raw) return cache.stan
  const stan = parsujStan(raw)
  cache = { raw, stan }
  return stan
}

export function getServerSnapshot(): WygladState {
  return DOMYSLNY_STAN
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zastosujWyglad(state: WygladState): void {
  if (typeof document === "undefined") return
  const root = document.documentElement

  for (const grupa of GRUPY_KOLOROW) {
    const wartosc = state.kolory[grupa.id]
    const zmienne = MAPA_ZMIENNYCH[grupa.id]
    if (wartosc) {
      for (const zmienna of zmienne) root.style.setProperty(zmienna, wartosc)
      if (grupa.id === "akcent") {
        const jasny = luminancja(wartosc) > 0.4
        root.style.setProperty("--primary-foreground", jasny ? "#0a0a0a" : "#fafafa")
      }
    } else {
      for (const zmienna of zmienne) root.style.removeProperty(zmienna)
      if (grupa.id === "akcent") root.style.removeProperty("--primary-foreground")
    }
  }

  const czcionka = CZCIONKI.find((c) => c.id === state.czcionka) ?? CZCIONKI[0]
  root.style.setProperty("--font-sans-user", `var(${czcionka.zmienna})`)

  root.classList.toggle("czcionka-pogrubiona", state.waga === "pogrubiona")

  // Style: its tokens come from the generated stylesheet (`./style.ts`) keyed by `data-styl`; the
  // light/dark class it needs is resolved by `zastosujTryb` (lib/theme) from `data-schemat-stylu`.
  const styl = znajdzStyl(state.styl)
  if (styl) {
    root.dataset.styl = styl.id
    root.dataset.schematStylu = styl.schemat === "ciemny" ? "dark" : "light"
  } else {
    delete root.dataset.styl
    delete root.dataset.schematStylu
  }
  zastosujTryb(trybMotywu())
}

function zapisz(state: WygladState): void {
  if (typeof window === "undefined") return
  zastosujWyglad(state)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    // localStorage niedostępny — preferencja zastosowana na tę sesję, nie zapamiętana.
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać wyglądu — zmiana obowiązuje tylko w tej sesji.",
      technicalDetails: `localStorage.setItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/wyglad/storage.zapisz",
      cause: err,
    })
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function ustawKolor(grupa: GrupaKolorow, hex: string): void {
  const aktualny = getSnapshot()
  zapisz({ ...aktualny, kolory: { ...aktualny.kolory, [grupa]: hex } })
}

/** Grupowa zmiana — jeden kolor zastosowany naraz do kilku zaznaczonych grup. */
export function ustawKoloryGrupowo(grupy: GrupaKolorow[], hex: string): void {
  const aktualny = getSnapshot()
  const nowe = { ...aktualny.kolory }
  for (const grupa of grupy) nowe[grupa] = hex
  zapisz({ ...aktualny, kolory: nowe })
}

export function usunKolor(grupa: GrupaKolorow): void {
  const aktualny = getSnapshot()
  const nowe = { ...aktualny.kolory }
  delete nowe[grupa]
  zapisz({ ...aktualny, kolory: nowe })
}

export function przywrocDomyslneKolory(): void {
  const aktualny = getSnapshot()
  zapisz({ ...aktualny, kolory: {} })
}

export function ustawCzcionke(czcionka: CzcionkaId): void {
  zapisz({ ...getSnapshot(), czcionka })
}

export function ustawWage(waga: WagaTekstu): void {
  zapisz({ ...getSnapshot(), waga })
}

export function ustawStyl(styl: StylId | null): void {
  zapisz({ ...getSnapshot(), styl })
}

export function ustawPokazUkryteStyle(pokaz: boolean): void {
  zapisz({ ...getSnapshot(), pokazUkryteStyle: pokaz })
}

export function ustawIkonyKafli(ikonyKafli: IkonyKafli): void {
  zapisz({ ...getSnapshot(), ikonyKafli })
}

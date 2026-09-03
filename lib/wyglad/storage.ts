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
 */

import { consoleReporter } from "@/lib/core/reporter"

export type GrupaKolorow = "tlo" | "karty" | "tekst" | "akcent" | "sukces" | "uwaga" | "blad"

export const GRUPY_KOLOROW: { id: GrupaKolorow; etykieta: string; opis: string }[] = [
  { id: "tlo", etykieta: "Tło aplikacji", opis: "Główne tło strony" },
  { id: "karty", etykieta: "Karty i panele", opis: "Tło kart, popoverów, list" },
  { id: "tekst", etykieta: "Tekst", opis: "Kolor tekstu na tle i kartach" },
  { id: "akcent", etykieta: "Akcent (przyciski, aktywne stany)", opis: "Kolor główny UI" },
  { id: "sukces", etykieta: "Werdykt 🟢 Zalecane", opis: "Bezpiecznie, z marginesem" },
  { id: "uwaga", etykieta: "Werdykt 🟡 Dopuszczalne", opis: "Blisko limitu" },
  { id: "blad", etykieta: "Werdykt 🔴 Zabronione", opis: "Ryzyko uszkodzenia/pożaru" },
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
}

const STORAGE_KEY = "offgrid.wyglad.v1"
const CHANGE_EVENT = "offgrid-wyglad-change"

const DOMYSLNY_STAN: WygladState = { kolory: {}, czcionka: "inter", waga: "normalna" }

function jestHeksem(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)
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

/** Luminancja względna (WCAG) z hex — do doboru czytelnego tekstu na kolorze akcentu. */
function luminancjaHex(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const kanal = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
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
        const jasny = luminancjaHex(wartosc) > 0.4
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

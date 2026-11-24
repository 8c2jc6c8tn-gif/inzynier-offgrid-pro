import type { Projekt, StanProjektow } from "@/lib/projekt/projekty"

/** The name shown for a project: its own name, or „Projekt N” (N = position on the list) in the UI language. */
export function nazwaProjektu(projekt: Projekt, lista: StanProjektow, t: (kod: string, p?: Record<string, string | number>) => string): string {
  return projekt.nazwa !== "" ? projekt.nazwa : t("UI-PRJ-DOMYSLNA-NAZWA", { n: lista.projekty.findIndex((p) => p.id === projekt.id) + 1 })
}

/**
 * What the AI assistant knows about the user's project (owner decision 24.11.2026, N7): the numbers saved in the open project and
 * the screen the user is on. The browser sends it; the server trusts nothing — only known quantities with finite numbers inside
 * their range and a screen that exists in the registry pass (no free text such as the project name reaches the model). The result
 * is a data block for the user turn, never part of the system prompt (9.4: data, not instructions).
 */
import { t } from "@/lib/i18n/t"
import { znajdzKafelIEkranPoHref } from "@/lib/pulpit/registry"
import { czyWielkosc, WIELKOSCI, wartoscDoZapisu } from "@/lib/projekt/wielkosci"

export type KontekstAsystenta = {
  /** Screen key (`app/kalkulatory/<key>`), when the assistant was opened on a calculator screen. */
  ekran?: string
  /** Project quantities: id → number as text. */
  wartosci?: Record<string, string>
}

const MAKS_WARTOSCI = 60

/** The data block for the model, or `null` when nothing valid was sent. */
export function opisKontekstu(kontekst: unknown): string | null {
  if (typeof kontekst !== "object" || kontekst === null) return null
  const { ekran, wartosci } = kontekst as Record<string, unknown>
  const linie: string[] = []
  if (typeof ekran === "string" && /^[a-z0-9-]{1,80}$/.test(ekran)) {
    const w = znajdzKafelIEkranPoHref(`/kalkulatory/${ekran}`)
    if (w) linie.push(`Ekran otwarty przez użytkownika: „${w.ekran.label}” (moduł „${w.kafel.nazwa}”).`)
  }
  if (typeof wartosci === "object" && wartosci !== null) {
    const pozycje: string[] = []
    for (const [id, v] of Object.entries(wartosci as Record<string, unknown>).slice(0, MAKS_WARTOSCI)) {
      if (!czyWielkosc(id) || (typeof v !== "string" && typeof v !== "number")) continue
      const liczba = wartoscDoZapisu(id, v)
      if (liczba === null) continue
      pozycje.push(`- ${t("pl", WIELKOSCI[id].etykieta)}: ${liczba} ${WIELKOSCI[id].jednostka}`.trimEnd())
    }
    if (pozycje.length > 0) linie.push("Liczby zapisane w projekcie użytkownika:", ...pozycje)
  }
  return linie.length > 0 ? linie.join("\n") : null
}

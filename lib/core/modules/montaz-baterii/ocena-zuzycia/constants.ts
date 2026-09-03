export type ChecklistItem = { id: string; element: string }

/** "Pomiary do wykonania" 1:1 ze źródła — bez podanych progów liczbowych, więc bez logiki
 * pass/fail (nie wymyślamy tolerancji, której źródło nie podaje). */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "grubosc-zmierzona", element: "Grubość ogniwa zmierzona i porównana z wymiarem fabrycznym" },
  { id: "napiecie-24h", element: "Napięcie zmierzone po 24h od demontażu (ocena samorozładowania)" },
  { id: "rezystancja-wewnetrzna", element: "Rezystancja wewnętrzna zmierzona" },
]

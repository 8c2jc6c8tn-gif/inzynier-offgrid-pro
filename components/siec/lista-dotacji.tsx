"use client"

import { useSyncExternalStore } from "react"
import { DOTACJE, type Dotacja, stanNaboru } from "@/lib/core/dane/dotacje"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"

const ETYKIETA_STANU = {
  trwa: "nabór trwa",
  zakonczony: "nabór zakończony",
  przyszly: "nabór jeszcze się nie zaczął",
  "bez-terminu": "bez terminu naboru",
} as const

const data = (iso: string) => iso.split("-").reverse().join(".")
const bezSubskrypcji = () => () => {}
const dzisKlient = () => new Date().toISOString().slice(0, 10)

/** Today on the client; on the static prerender the data file date (no hydration mismatch). */
function useDzis(stanNa: string): string {
  return useSyncExternalStore(bezSubskrypcji, dzisKlient, () => stanNa)
}

/** M14 — D13/F12 list of subsidies with date, confidence and automatic „nabór zakończony” (§9). */
export function ListaDotacji({ segment }: { segment: Segment }) {
  const dzis = useDzis(DOTACJE[0].stanNa)
  const pozycje = DOTACJE.filter((d) => d.dotyczy.includes(segment))
  return (
    <ul className="flex flex-col gap-3">
      {pozycje.map((d: Dotacja) => {
        const stan = stanNaboru(d, dzis)
        return (
          <li key={d.id} className="flex flex-col gap-2 rounded-lg border bg-card p-3">
            <p className="font-medium">
              {d.nazwa}{" "}
              <span className="text-caption text-muted-foreground">{d.pewnosc === "potwierdzone" ? "✅" : d.pewnosc}</span>
            </p>
            <p className={stan === "zakonczony" ? "text-small font-semibold text-muted-foreground" : "text-small font-semibold"}>
              {ETYKIETA_STANU[stan]}
            </p>
            <ul className="list-disc pl-5 text-small text-muted-foreground">
              {d.opis.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="text-caption text-muted-foreground">
              Stan na {data(d.stanNa)}.{" "}
              {d.regulamin ? (
                <a className="underline" href={d.regulamin} target="_blank" rel="noreferrer">
                  Regulamin
                </a>
              ) : (
                "Regulaminu jeszcze nie odczytaliśmy ze źródła — sprawdź go u operatora programu przed decyzją."
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

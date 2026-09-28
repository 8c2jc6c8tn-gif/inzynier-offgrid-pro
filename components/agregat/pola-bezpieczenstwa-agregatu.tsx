"use client"

import type {
  MiejsceAgregatu,
  PodlaczenieAgregatu,
} from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"
import { PoleSelect } from "@/components/ui/pole"

export type BezpieczenstwoAgregatuStan = {
  miejsceAgregatu: MiejsceAgregatu | ""
  podlaczenieAgregatu: PodlaczenieAgregatu | ""
}

type Props = BezpieczenstwoAgregatuStan & {
  onChange: (zmiana: Partial<BezpieczenstwoAgregatuStan>) => void
}

/** Generator safety questions (D45) shared by M2/E17 and M7/E8. */
export function PolaBezpieczenstwaAgregatu({ miejsceAgregatu, podlaczenieAgregatu, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small font-medium">Bezpieczeństwo agregatu</p>
      <PoleSelect
        label="Gdzie pracuje agregat"
        value={miejsceAgregatu ?? ""}
        onChange={(e) => onChange({ miejsceAgregatu: e.target.value as BezpieczenstwoAgregatuStan["miejsceAgregatu"] })}
        hint="Spaliny zawierają czad (CO) — bezwonny i śmiertelny."
      >
        <option value="">— wybierz —</option>
        <option value="na-zewnatrz">Na zewnątrz (wiata, pod zadaszeniem)</option>
        <option value="pomieszczenie-wydzielone">Wydzielone pomieszczenie techniczne z wydechem na zewnątrz</option>
        <option value="wewnatrz-budynku">W budynku (piwnica, garaż przy domu, kotłownia)</option>
      </PoleSelect>
      <PoleSelect
        label="Jak agregat zasila odbiorniki"
        value={podlaczenieAgregatu ?? ""}
        onChange={(e) =>
          onChange({ podlaczenieAgregatu: e.target.value as BezpieczenstwoAgregatuStan["podlaczenieAgregatu"] })
        }
      >
        <option value="">— wybierz —</option>
        <option value="przez-przelacznik">Do instalacji przez przełącznik I–0–II</option>
        <option value="bez-przelacznika">Do instalacji bez przełącznika (gniazdko, wtyczka)</option>
        <option value="wejscie-ac-falownika">Przez wejście AC falownika / ładowarki</option>
        <option value="tylko-odbiorniki">Tylko odbiorniki wpięte wprost w agregat</option>
      </PoleSelect>
    </div>
  )
}

/** Drafts saved before D45 lack these keys (undefined) — both "" and undefined map to null. */
export const naWejscieBezpieczenstwa = (stan: BezpieczenstwoAgregatuStan) => ({
  miejsceAgregatu: stan.miejsceAgregatu || null,
  podlaczenieAgregatu: stan.podlaczenieAgregatu || null,
})

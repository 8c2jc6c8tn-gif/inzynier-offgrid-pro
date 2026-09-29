"use client"

import Link from "next/link"
import type {
  MiejsceAgregatu,
  PodlaczenieAgregatu,
} from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"

export type BezpieczenstwoAgregatuStan = {
  miejsceAgregatu: MiejsceAgregatu | ""
  podlaczenieAgregatu: PodlaczenieAgregatu | ""
}

type Props = BezpieczenstwoAgregatuStan & {
  onChange: (zmiana: Partial<BezpieczenstwoAgregatuStan>) => void
}

/** Generator safety questions (D48) shared by M2/E17 and M7/E8. */
export function PolaBezpieczenstwaAgregatu({ miejsceAgregatu, podlaczenieAgregatu, onChange }: Props) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small font-medium">{t("UI-AGB-TYTUL")}</p>
      <PoleSelect
        label={t("UI-AGB-MIEJSCE")}
        value={miejsceAgregatu ?? ""}
        onChange={(e) => onChange({ miejsceAgregatu: e.target.value as BezpieczenstwoAgregatuStan["miejsceAgregatu"] })}
        pomoc={<PomocPola ekran="agregat-bezpieczenstwo" pole="miejsce" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        <option value="na-zewnatrz">{t("UI-AGB-M-ZEWNATRZ")}</option>
        <option value="pomieszczenie-wydzielone">{t("UI-AGB-M-WYDZIELONE")}</option>
        <option value="wewnatrz-budynku">{t("UI-AGB-M-BUDYNEK")}</option>
      </PoleSelect>
      <PoleSelect
        label={t("UI-AGB-PODLACZENIE")}
        value={podlaczenieAgregatu ?? ""}
        onChange={(e) =>
          onChange({ podlaczenieAgregatu: e.target.value as BezpieczenstwoAgregatuStan["podlaczenieAgregatu"] })
        }
        pomoc={<PomocPola ekran="agregat-bezpieczenstwo" pole="podlaczenie" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        <option value="przez-przelacznik">{t("UI-AGB-P-PRZELACZNIK")}</option>
        <option value="bez-przelacznika">{t("UI-AGB-P-BEZ")}</option>
        <option value="wejscie-ac-falownika">{t("UI-AGB-P-FALOWNIK")}</option>
        <option value="tylko-odbiorniki">{t("UI-AGB-P-ODBIORNIKI")}</option>
      </PoleSelect>
      <p className="text-caption text-muted-foreground">
        {t("UI-AGB-JAK-PRZELACZNIK")}{" "}
        <Link className="underline" href="/kalkulatory/przelacznik-siec-wyspa">
          {t("UI-AGB-L-PRZELACZNIK")}
        </Link>
      </p>
    </div>
  )
}

/** Drafts saved before D48 lack these keys (undefined) — both "" and undefined map to null. */
export const naWejscieBezpieczenstwa = (stan: BezpieczenstwoAgregatuStan) => ({
  miejsceAgregatu: stan.miejsceAgregatu || null,
  podlaczenieAgregatu: stan.podlaczenieAgregatu || null,
})

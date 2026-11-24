"use client"

/**
 * The quiet line under a field linked to the project (owner decision 23.11.2026): „from the project” when the field shows the
 * project value, or „own value, in the project: X” with ↺ when the user typed their own. Nothing is shown for an empty field or
 * for a value the project does not know yet (the save bar at the bottom lists those) — no pop-ups, nothing to dismiss.
 */
import type { StanPolaProjektu } from "@/lib/adapters/use-persisted-draft"
import { useFormatLiczby, useTranslate } from "@/lib/i18n/language-context"

export function ZnacznikPola({ projekt }: { projekt: StanPolaProjektu | undefined }) {
  const t = useTranslate()
  const f = useFormatLiczby()
  if (!projekt) return null
  const { status } = projekt
  if (status.rodzaj === "projekt") {
    return <span className="text-caption text-muted-foreground">{t("UI-PRJ-Z-PROJEKTU")}</span>
  }
  if (status.rodzaj === "wlasna") {
    return (
      <span className="flex flex-wrap items-center gap-x-2 text-caption text-muted-foreground">
        {t("UI-PRJ-WLASNA", { v: f(Number(status.wProjekcie), { maximumFractionDigits: 6 }), j: projekt.jednostka })}
        <button type="button" onClick={projekt.przywroc} className="min-h-8 rounded px-1 font-medium text-foreground underline-offset-2 hover:underline">
          ↺ {t("UI-PRJ-PRZYWROC")}
        </button>
      </span>
    )
  }
  return null
}

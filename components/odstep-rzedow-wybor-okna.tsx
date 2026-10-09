"use client"

import { Button } from "@/components/ui/button"
import { OKNA_TYPOWE } from "@/lib/core/modules/pv/odstep-rzedow/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

/**
 * Szybki wybór typowego okna „bez cienia” (9–15 albo 10–14) nad polami od/do; podświetla to okno, które zgadza się z polami.
 * `pusteToDomyslne` — w porównywarce puste pola oznaczają okno domyślne, więc pierwsze typowe okno jest wtedy podświetlone.
 */
export function WyborOknaTypowego(p: { od: string; doH: string; pusteToDomyslne?: boolean; onWybierz: (od: string, doH: string) => void }) {
  const t = useTranslate()
  const puste = p.od.trim() === "" && p.doH.trim() === ""
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("UI-ODRZ-OKNO-TYPOWE-ETYKIETA")}>
      <span className="text-small text-muted-foreground">{t("UI-ODRZ-OKNO-TYPOWE-ETYKIETA")}</span>
      {OKNA_TYPOWE.map((o, i) => {
        const aktywne = (liczba(p.od) === o.odH && liczba(p.doH) === o.doH) || (i === 0 && puste && p.pusteToDomyslne === true)
        return (
          <Button
            key={o.odH}
            type="button"
            variant={aktywne ? "default" : "outline"}
            aria-pressed={aktywne}
            className="min-h-11"
            onClick={() => p.onWybierz(String(o.odH), String(o.doH))}
          >
            {t("UI-ODRZ-OKNO-TYPOWE", { od: o.odH, do: o.doH })}
          </Button>
        )
      })}
    </div>
  )
}

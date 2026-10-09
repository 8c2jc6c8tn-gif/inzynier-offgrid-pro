"use client"

import { useState } from "react"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { etykietaMocy, mocSerii, producenciKatalogu, serieProducenta } from "@/lib/core/dane/katalog-paneli-pv/wybor"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Wybór panelu z katalogu krok po kroku (producent → seria/model → moc), jak w wyszukiwarce samochodowej. Wybór mocy wstawia dane panelu
 * (`onWybierz`). Producent i serię pamięta komponent; gdy panel już pochodzi z katalogu, pola startują od jego wartości.
 */
export function WyborZKatalogu(p: { katalogId: string; onWybierz: (idKatalogu: string) => void }) {
  const t = useTranslate()
  const obecny = znajdzPanelKatalogu(p.katalogId)
  // `null` = user has not touched the field yet: then it shows the value of the panel already taken from the catalogue.
  const [producentWybrany, setProducent] = useState<string | null>(null)
  const [serieWybrana, setSeria] = useState<string | null>(null)
  const producent = producentWybrany ?? obecny?.producent ?? ""
  const seria = serieWybrana ?? (producentWybrany === null ? obecny?.seria : undefined) ?? ""
  const serie = producent ? serieProducenta(producent) : []
  const moce = producent && seria ? mocSerii(producent, seria) : []
  return (
    <div className="flex flex-col gap-2">
      <p className="text-small font-medium">{t("UI-PORP-Z-KATALOGU")}</p>
      <div className="grid gap-3 sm:grid-cols-3">
      <PoleSelect
        label={t("UI-PORP-KAT-PRODUCENT")}
        value={producent}
        onChange={(e) => {
          setProducent(e.target.value)
          setSeria("")
        }}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="katalog" />}
      >
        <option value="">{t("UI-PORP-KATALOG-WYBIERZ")}</option>
        {producenciKatalogu().map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </PoleSelect>
      <PoleSelect
        label={t("UI-PORP-KAT-SERIA")}
        value={seria}
        disabled={producent === ""}
        onChange={(e) => setSeria(e.target.value)}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="katalogSeria" />}
      >
        <option value="">{t("UI-PORP-KATALOG-WYBIERZ")}</option>
        {serie.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </PoleSelect>
      <PoleSelect
        label={t("UI-PORP-KAT-MOC")}
        value={moce.some((x) => x.id === p.katalogId) ? p.katalogId : ""}
        disabled={moce.length === 0}
        onChange={(e) => e.target.value !== "" && p.onWybierz(e.target.value)}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="katalogMoc" />}
      >
        <option value="">{t("UI-PORP-KATALOG-WYBIERZ")}</option>
        {moce.map((x) => (
          <option key={x.id} value={x.id}>
            {etykietaMocy(x)}
          </option>
        ))}
      </PoleSelect>
      </div>
    </div>
  )
}

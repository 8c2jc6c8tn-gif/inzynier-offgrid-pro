"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { UlamekKataTarcia, wspolczynnikTarciaZKataGruntu, type RodzajPodstawy } from "@/lib/core/modules/pv/eurokod-7/przesuw"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

type Props = {
  /** Wpisuje policzone μ do pola μ ekranu. */
  onUzyj: (mu: number) => void
}

/**
 * Pomocnik: μ z kąta tarcia gruntu wg PN-EN 1997-1 p. 6.5.3 (10) — δ = 2/3·φ′_cv (gładki prefabrykat, np. bloczki) albo δ = φ′_cv
 * (beton formowany na gruncie). Kąt φ′_cv użytkownik bierze z dokumentacji geotechnicznej; nic tu nie jest podpowiadane z góry.
 * Jedno miejsce dla wszystkich kalkulatorów balastu (wiatr >30°, typ montażu, „Złoty środek”).
 */
export function PrzelicznikTarcia({ onUzyj }: Props) {
  const t = useTranslate()
  const { f1, f3 } = useFormaty()
  const [kat, setKat] = useState("")
  const [rodzaj, setRodzaj] = useState<RodzajPodstawy>("prefabrykat")
  const phi = kat.trim() === "" ? NaN : Number(kat)
  const mu = wspolczynnikTarciaZKataGruntu(phi, rodzaj)
  return (
    <details className="rounded-md border p-3 text-small">
      <summary className="cursor-pointer font-medium">{t("UI-TARCIE-PRZELICZNIK-TYTUL")}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-muted-foreground">{t("UI-TARCIE-UWAGA")}</p>
        <Pole
          label={t("UI-TARCIE-KAT")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={89}
          value={kat}
          onChange={(e) => setKat(e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="katTarciaGruntu" />}
        />
        <PoleSelect
          label={t("UI-TARCIE-RODZAJ")}
          value={rodzaj}
          onChange={(e) => setRodzaj(e.target.value as RodzajPodstawy)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="rodzajPodstawy" />}
        >
          <option value="prefabrykat">{t("UI-TARCIE-RODZAJ-PREFAB")}</option>
          <option value="wylewany">{t("UI-TARCIE-RODZAJ-WYLEWANY")}</option>
        </PoleSelect>
        {mu !== null && (
          <div className="flex flex-col gap-2">
            <p>{t("UI-TARCIE-WYNIK", { mu: f3(mu), delta: f1(UlamekKataTarcia[rodzaj] * phi) })}</p>
            <Button type="button" variant="outline" onClick={() => onUzyj(Math.round(mu * 1000) / 1000)}>
              {t("UI-TARCIE-UZYJ")}
            </Button>
          </div>
        )}
      </div>
    </details>
  )
}

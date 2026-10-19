"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { parsujListeLiczb, UlamekKataTarcia, wspolczynnikTarciaZKataGruntu, wspolczynnikTarciaZProby, type RodzajPodstawy } from "@/lib/core/modules/pv/eurokod-7/przesuw"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
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
  // Own on-site test: a block of known mass pulled over the real ground, force read at the moment it starts to move.
  const [masa, setMasa] = useState("")
  const [sily, setSily] = useState("")
  const [jednostka, setJednostka] = useState<"N" | "kgf">("N")
  const listaSil = parsujListeLiczb(sily)
  const silyN = listaSil === null ? [] : listaSil.map((x) => (jednostka === "kgf" ? x * PRZYSPIESZENIE_ZIEMSKIE_M_S2 : x))
  const proba = masa.trim() === "" ? null : wspolczynnikTarciaZProby(Number(masa.replace(",", ".")), silyN, PRZYSPIESZENIE_ZIEMSKIE_M_S2)
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
        <hr />
        <p className="font-medium">{t("UI-TARCIE-PROBA-TYTUL")}</p>
        <p className="text-muted-foreground">{t("UI-TARCIE-PROBA-OPIS")}</p>
        <Pole
          label={t("UI-TARCIE-PROBA-MASA")}
          unit="kg"
          type="text"
          inputMode="decimal"
          value={masa}
          onChange={(e) => setMasa(e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="probaMasa" />}
        />
        <PoleSelect
          label={t("UI-TARCIE-PROBA-JEDNOSTKA")}
          value={jednostka}
          onChange={(e) => setJednostka(e.target.value === "kgf" ? "kgf" : "N")}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="probaJednostka" />}
        >
          <option value="N">{t("UI-TARCIE-PROBA-JEDNOSTKA-N")}</option>
          <option value="kgf">{t("UI-TARCIE-PROBA-JEDNOSTKA-KGF")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-TARCIE-PROBA-SILY")}
          type="text"
          inputMode="decimal"
          value={sily}
          onChange={(e) => setSily(e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="probaSily" />}
        />
        {proba !== null && (
          <div className="flex flex-col gap-2">
            <p>
              {t("UI-TARCIE-PROBA-WYNIK", {
                n: proba.liczbaProb,
                min: f1(jednostka === "kgf" ? proba.najnizszaSilaN / PRZYSPIESZENIE_ZIEMSKIE_M_S2 : proba.najnizszaSilaN),
                jednostka: jednostka === "kgf" ? "kgf" : "N",
                mu: f3(proba.wspolczynnikTarcia),
              })}
            </p>
            <Button type="button" variant="outline" onClick={() => onUzyj(Math.round(proba.wspolczynnikTarcia * 1000) / 1000)}>
              {t("UI-TARCIE-UZYJ")}
            </Button>
          </div>
        )}
      </div>
    </details>
  )
}

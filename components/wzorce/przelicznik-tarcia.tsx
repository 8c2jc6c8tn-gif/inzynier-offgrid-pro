"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { katTarciaPhiU, type GrupaGruntuNiespoistego } from "@/lib/core/modules/pv/eurokod-7/grunty-pn-b-03020"
import { parsujListeLiczb, UlamekKataTarcia, wspolczynnikTarciaZKataGruntu, wspolczynnikTarciaZProby, type RodzajPodstawy } from "@/lib/core/modules/pv/eurokod-7/przesuw"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

type Props = {
  /** Wpisuje policzone μ do pola μ ekranu. */
  onUzyj: (mu: number) => void
}

/**
 * Pomocnik: μ z kąta tarcia gruntu wg PN-EN 1997-1 p. 6.5.3 (10) — δ = 2/3·φ′_cv (gładki prefabrykat, np. bloczki) albo δ = φ′_cv
 * (beton formowany na gruncie). Kąt φ′_cv użytkownik bierze z dokumentacji geotechnicznej; opcjonalna podpowiedź Φu z PN-B-03020 jest
 * tylko szacunkiem (nie φ′_cv) i trafia do pola wyłącznie po kliknięciu.
 * Jedno miejsce dla wszystkich kalkulatorów balastu (wiatr >30°, typ montażu, „Złoty środek”).
 */
export function PrzelicznikTarcia({ onUzyj }: Props) {
  const t = useTranslate()
  const { f1, f3 } = useFormaty()
  const [kat, setKat] = useState("")
  const [rodzaj, setRodzaj] = useState<RodzajPodstawy>("prefabrykat")
  const phi = kat.trim() === "" ? NaN : Number(kat)
  const mu = wspolczynnikTarciaZKataGruntu(phi, rodzaj)
  // Optional PN-B-03020 hint (non-cohesive soils): an estimate of Φu, never written to the field without the user's click.
  const [grupa, setGrupa] = useState<GrupaGruntuNiespoistego | "">("")
  const [id, setId] = useState("")
  const phiU = grupa === "" || id.trim() === "" ? null : katTarciaPhiU(grupa, Number(id.replace(",", ".")))
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
        <div className="flex flex-col gap-2 rounded-md bg-muted/40 p-2">
          <p className="font-medium">{t("UI-TARCIE-PHIU-TYTUL")}</p>
          <p className="text-muted-foreground">{t("UI-TARCIE-PHIU-OPIS")}</p>
          <PoleSelect
            label={t("UI-TARCIE-PHIU-GRUPA")}
            value={grupa}
            onChange={(e) => setGrupa(e.target.value as GrupaGruntuNiespoistego | "")}
            pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="grupaGruntuPhiU" />}
          >
            <option value="">{t("UI-TARCIE-PHIU-GRUPA-BRAK")}</option>
            <option value="zwir-pospolka">{t("UI-TARCIE-PHIU-GRUPA-ZWIR")}</option>
            <option value="pr-ps">{t("UI-TARCIE-PHIU-GRUPA-PR")}</option>
            <option value="pd-ppi">{t("UI-TARCIE-PHIU-GRUPA-PD")}</option>
          </PoleSelect>
          <Pole
            label={t("UI-TARCIE-PHIU-ID")}
            type="text"
            inputMode="decimal"
            value={id}
            onChange={(e) => setId(e.target.value)}
            pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="stopienZageszczeniaId" />}
          />
          {phiU !== null && (
            <div className="flex flex-col gap-2">
              <p>{t("UI-TARCIE-PHIU-WYNIK", { phi: f1(phiU) })}</p>
              <Button type="button" variant="outline" onClick={() => setKat(String(Math.round(phiU * 10) / 10))}>
                {t("UI-TARCIE-PHIU-UZYJ")}
              </Button>
            </div>
          )}
          {grupa !== "" && id.trim() !== "" && phiU === null && <p className="text-muted-foreground">{t("UI-TARCIE-PHIU-POZA")}</p>}
        </div>
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

"use client"

import { useMemo, useState } from "react"
import { calculateOchronaPrzepieciowaSpd } from "@/lib/core/modules/okablowanie/ochrona-przepieciowa-spd/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function OchronaPrzepieciowaSpdPage() {
  const [vocMaxStringuV, setVocMaxStringuV] = useState("")
  const [maInstalacjeOdgromowa, setMaInstalacjeOdgromowa] = useState(false)
  const [odlegloscOdZwoduM, setOdlegloscOdZwoduM] = useState("")
  const [maZainstalowanySpdTyp1, setMaZainstalowanySpdTyp1] = useState(false)
  const [ucSpdV, setUcSpdV] = useState("")
  const [uziemienieViaGsw, setUziemienieViaGsw] = useState(false)

  const result = useMemo(
    () =>
      calculateOchronaPrzepieciowaSpd({
        vocMaxStringuV: vocMaxStringuV === "" ? 0 : Number(vocMaxStringuV),
        maInstalacjeOdgromowa,
        odlegloscOdZwoduM: maInstalacjeOdgromowa && odlegloscOdZwoduM !== "" ? Number(odlegloscOdZwoduM) : null,
        maZainstalowanySpdTyp1,
        ucSpdV: ucSpdV === "" ? 0 : Number(ucSpdV),
        uziemienieViaGsw,
      }),
    [vocMaxStringuV, maInstalacjeOdgromowa, odlegloscOdZwoduM, maZainstalowanySpdTyp1, ucSpdV, uziemienieViaGsw],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij wszystkie pola",
    red: "Zabronione — ochrona przeciwprzepięciowa niekompletna",
    green: "SPD dobrany poprawnie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przepieciowa-spd" />
      <NaglowekEkranu tytul="Ochrona przeciwprzepięciowa (SPD)">
        Piorun nie musi trafić w panel — wystarczy, że uderzy w pobliżu, a w kablach indukuje się
        napięcie, które niszczy elektronikę. Moduł 5, Ekran 2.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie robocze stringu PV (Voc max, zimowe)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vocMaxStringuV}
          onChange={(e) => setVocMaxStringuV(e.target.value)}
          hint="Z ekranu Zimowy stress-test MPPT (Moduł 3), nie warunki STC."
        />
        <PoleCheckbox
          id="ma-instalacje-odgromowa"
          label="Budynek ma instalację odgromową"
          checked={maInstalacjeOdgromowa}
          onChange={(e) => setMaInstalacjeOdgromowa(e.target.checked)}
        />
        {maInstalacjeOdgromowa && (
          <>
            <Pole
              label="Odległość paneli od zwodu piorunochronu"
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              value={odlegloscOdZwoduM}
              onChange={(e) => setOdlegloscOdZwoduM(e.target.value)}
            />
            <PoleCheckbox
              id="ma-spd-typ1"
              label="Zainstalowany jest SPD Typu 1 na wejściu do budynku"
              checked={maZainstalowanySpdTyp1}
              onChange={(e) => setMaZainstalowanySpdTyp1(e.target.checked)}
            />
          </>
        )}
        <Pole
          label="Napięcie trwałej pracy (Uc) rozważanego SPD"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={ucSpdV}
          onChange={(e) => setUcSpdV(e.target.value)}
        />
        <PoleCheckbox
          id="uziemienie-gsw"
          label="SPD uziemiony przez wspólną Główną Szynę Wyrównawczą (GSW)"
          checked={uziemienieViaGsw}
          onChange={(e) => setUziemienieViaGsw(e.target.checked)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {result.value.typWymagany}, Uc ≥ {result.value.ucMinimalneV.toFixed(0)} V
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}

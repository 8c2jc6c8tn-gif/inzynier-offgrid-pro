"use client"

import { useMemo, useState } from "react"
import { calculateCopPompyCiepla } from "@/lib/core/modules/ogrzewanie/cop-pompy-ciepla/calculator"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function CopPompyCieplaPage() {
  const [mocCieplnaKw, setMocCieplnaKw] = useState("40")
  const [cop, setCop] = useState("2.8")

  const result = useMemo(
    () => calculateCopPompyCiepla({ mocCieplnaKw: Number(mocCieplnaKw), cop: Number(cop) }),
    [mocCieplnaKw, cop],
  )

  const poziom: WerdyktPoziom =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Pompa ciepła — COP w funkcji temperatury</h1>
        <p className="text-sm text-muted-foreground">
          COP to „mnożnik” — pompa ciepła nie produkuje ciepła z niczego, tylko przenosi je z
          zewnątrz, zużywając mniej prądu niż grzałka elektryczna. Moduł 6, Ekran 5.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Zapotrzebowanie na moc cieplną <span className="text-muted-foreground">[kW]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={mocCieplnaKw}
            onChange={(e) => setMocCieplnaKw(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            COP przy aktualnej temperaturze <span className="text-muted-foreground">[-]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={cop}
            onChange={(e) => setCop(e.target.value)}
          />
        </label>
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="mt-1 text-2xl font-semibold">{result.value.toFixed(2)} {result.unit}</p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-sm opacity-90">
            {result.assumptions.map((a) => (
              <li key={a}>Założenie: {a}</li>
            ))}
          </ul>
        )}

        {result.warnings.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {result.warnings.map((w) => (
              <li key={w.code}>{w.message}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-xs opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}

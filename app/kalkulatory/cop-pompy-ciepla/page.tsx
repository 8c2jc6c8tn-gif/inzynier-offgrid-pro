"use client"

import { useMemo, useState } from "react"
import { calculateCopPompyCiepla } from "@/lib/core/modules/ogrzewanie/cop-pompy-ciepla/calculator"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function CopPompyCieplaPage() {
  const [mocCieplnaKw, setMocCieplnaKw] = useState("40")
  const [cop, setCop] = useState("2.8")

  const result = useMemo(
    () => calculateCopPompyCiepla({ mocCieplnaKw: Number(mocCieplnaKw), cop: Number(cop) }),
    [mocCieplnaKw, cop],
  )

  const verdictColor =
    result.status === "INVALID_INPUT"
      ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
      : result.status === "VALID_WITH_WARNINGS"
        ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
        : "border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"

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

      <div className={cn("rounded-lg border-2 p-4", verdictColor)}>
        {result.status === "INVALID_INPUT" ? (
          <p className="font-medium">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="text-2xl font-semibold">{result.value.toFixed(2)} {result.unit}</p>
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
      </div>
    </main>
  )
}

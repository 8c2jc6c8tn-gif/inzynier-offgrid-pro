import { calculateAuditPozarowy } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/calculator"
import { SAMPLE_AUDIT_ITEMS } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/constants"
import { cn } from "@/lib/utils"

const STATUS_ICON = { ok: "🟢", warning: "🟡", critical: "🔴" } as const

export default function AudytPozarowyPage() {
  const result = calculateAuditPozarowy(SAMPLE_AUDIT_ITEMS)

  const gotowoscColor =
    result.value.liczbaKrytycznych > 0
      ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
      : result.value.liczbaOstrzezen > 0
        ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
        : "border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Autonomiczny audyt bezpieczeństwa pożarowego</h1>
        <p className="text-sm text-muted-foreground">
          AI regularnie sprawdza, czy w razie pożaru wszystko zadziała tak, jak powinno — żeby
          nie odkryć zepsutego czujnika dopiero w trakcie prawdziwego pożaru. Moduł 8, Ekran 11.
        </p>
      </div>

      <div className={cn("rounded-lg border-2 p-4", gotowoscColor)}>
        <p className="text-2xl font-semibold">{result.value.procentGotowosci}% gotowości</p>
        <p className="mt-1 text-sm">
          {result.value.liczbaOk} OK, {result.value.liczbaOstrzezen} do sprawdzenia,{" "}
          {result.value.liczbaKrytycznych} krytycznych — z {result.value.razem} elementów.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {SAMPLE_AUDIT_ITEMS.map((item) => (
          <li key={item.id} className="flex items-start gap-3 rounded-md border p-3 text-sm">
            <span>{STATUS_ICON[item.status]}</span>
            <div>
              <span className="block font-medium">
                {item.kategoria} — {item.element}
              </span>
              {item.opis && <span className="block text-muted-foreground">{item.opis}</span>}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        {result.assumptions.join(" ")} To ekran wyłącznie do odczytu — nie ma tu pól do
        wypełnienia, tylko wyniki innych systemów.
      </p>
    </main>
  )
}

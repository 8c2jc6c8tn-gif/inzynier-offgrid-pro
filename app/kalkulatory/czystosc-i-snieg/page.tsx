"use client"

import { useMemo, useState } from "react"
import {
  classifyKatSamooczyszczania,
  ocenHarmonogramCzyszczenia,
} from "@/lib/core/modules/pv/czystosc-i-snieg/calculator"
import { WerdyktPanel } from "@/components/werdykt"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

function AccordionSection({
  title,
  children,
  defaultOpen,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details className="rounded-lg border" open={defaultOpen}>
      <summary className="cursor-pointer select-none p-4 font-medium">{title}</summary>
      <div className="border-t p-4">{children}</div>
    </details>
  )
}

export default function CzystoscISniegPage() {
  const [katStopni, setKatStopni] = useState("20")
  const katResult = useMemo(
    () => classifyKatSamooczyszczania({ katStopni: Number(katStopni) }),
    [katStopni],
  )

  const [spadekProdukcjiPct, setSpadekProdukcjiPct] = useState("3")
  const [deszczWCiaguKilkuDni, setDeszczWCiaguKilkuDni] = useState(false)
  const harmonogramResult = useMemo(
    () =>
      ocenHarmonogramCzyszczenia({
        spadekProdukcjiPct: Number(spadekProdukcjiPct),
        deszczWCiaguKilkuDni,
      }),
    [spadekProdukcjiPct, deszczWCiaguKilkuDni],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Czystość i śnieg na panelach</h1>
        <p className="text-sm text-muted-foreground">
          Zasypany panel to martwy panel, a wiatr rozkłada śnieg jak piasek na pustyni —
          nierównomiernie. Trzy tematy poniżej uzupełniają się nawzajem. Moduł 3, Ekran 24.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <AccordionSection title="Kąt a samooczyszczanie" defaultOpen>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">
                Kąt pochylenia panelu <span className="text-muted-foreground">[°]</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className={inputClass}
                value={katStopni}
                onChange={(e) => setKatStopni(e.target.value)}
              />
            </label>
            {katResult.status === "INVALID_INPUT" ? (
              <p className="text-sm text-werdykt-blad">Kąt musi być z przedziału 0–90°.</p>
            ) : (
              <p
                className={cn(
                  "text-sm",
                  katResult.status === "VALID_WITH_WARNINGS" && "text-werdykt-uwaga",
                )}
              >
                {katResult.value.opis}
              </p>
            )}
          </div>
        </AccordionSection>

        <AccordionSection title="Śnieg i dostępność serwisowa">
          <p className="text-sm">
            W strefach z częstymi opadami śniegu &gt;10 cm panele dachowe bywają nieproduktywne
            przez dłuższy czas, a odśnieżanie dachu jest trudne i niebezpieczne. Rozważ 2–3
            panele naziemne jako łatwo dostępną rezerwę do odśnieżania w sezonie zimowym.
          </p>
        </AccordionSection>

        <AccordionSection title="Harmonogram czyszczenia — live">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">
                Spadek produkcji względem oczekiwanej{" "}
                <span className="text-muted-foreground">[%]</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                className={inputClass}
                value={spadekProdukcjiPct}
                onChange={(e) => setSpadekProdukcjiPct(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={deszczWCiaguKilkuDni}
                onChange={(e) => setDeszczWCiaguKilkuDni(e.target.checked)}
              />
              Deszcz prognozowany w ciągu najbliższych kilku dni
            </label>

            {harmonogramResult.status === "INVALID_INPUT" ? (
              <p className="text-sm text-werdykt-blad">Spadek musi być z przedziału 0–100%.</p>
            ) : (
              <WerdyktPanel
                poziom={harmonogramResult.value.rekomendacjaMycia ? "uwaga" : "ok"}
                etykieta={harmonogramResult.value.rekomendacjaMycia ? "Zalecane mycie paneli" : "Mycie niepotrzebne"}
                className="p-3 text-sm"
              >
                <p className="mt-1">{harmonogramResult.value.powod}</p>
                {harmonogramResult.assumptions.map((a) => (
                  <p key={a} className="mt-1 opacity-80">
                    Założenie: {a}
                  </p>
                ))}
              </WerdyktPanel>
            )}
          </div>
        </AccordionSection>
      </div>
    </main>
  )
}

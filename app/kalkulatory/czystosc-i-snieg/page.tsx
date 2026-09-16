"use client"

import { useMemo, useState } from "react"
import {
  classifyKatSamooczyszczania,
  ocenHarmonogramCzyszczenia,
} from "@/lib/core/modules/pv/czystosc-i-snieg/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { t } from "@/lib/i18n/t"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { cn } from "@/lib/utils"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

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
      <NawigacjaEkranu href="/kalkulatory/czystosc-i-snieg" />
      <NaglowekEkranu tytul="Czystość i śnieg na panelach">
        Zasypany panel to martwy panel, a wiatr rozkłada śnieg jak piasek na pustyni —
        nierównomiernie. Trzy tematy poniżej uzupełniają się nawzajem. Moduł 3, Ekran 24.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul="Kąt a samooczyszczanie" domyslnieOtwarta>
          <div className="flex flex-col gap-3">
            <Pole
              label="Kąt pochylenia panelu"
              unit="°"
              type="number"
              inputMode="decimal"
              value={katStopni}
              onChange={(e) => setKatStopni(e.target.value)}
            />
            {katResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">Kąt musi być z przedziału 0–90°.</p>
            ) : (
              <p
                className={cn(
                  "text-small",
                  katResult.status === "VALID_WITH_WARNINGS" && "text-werdykt-uwaga",
                )}
              >
                {katResult.value.opis}
              </p>
            )}
          </div>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Śnieg i dostępność serwisowa">
          <p className="text-small">
            W strefach z częstymi opadami śniegu &gt;10 cm panele dachowe bywają nieproduktywne
            przez dłuższy czas, a odśnieżanie dachu jest trudne i niebezpieczne. Rozważ 2–3
            panele naziemne jako łatwo dostępną rezerwę do odśnieżania w sezonie zimowym.
          </p>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Harmonogram czyszczenia — live">
          <div className="flex flex-col gap-3">
            <Pole
              label="Spadek produkcji względem oczekiwanej"
              unit="%"
              type="number"
              inputMode="decimal"
              value={spadekProdukcjiPct}
              onChange={(e) => setSpadekProdukcjiPct(e.target.value)}
            />
            <PoleCheckbox
              id="deszcz-prognozowany"
              label="Deszcz prognozowany w ciągu najbliższych kilku dni"
              checked={deszczWCiaguKilkuDni}
              onChange={(e) => setDeszczWCiaguKilkuDni(e.target.checked)}
            />

            {harmonogramResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">Spadek musi być z przedziału 0–100%.</p>
            ) : (
              <WerdyktPanel
                poziom={harmonogramResult.value.rekomendacjaMycia ? "uwaga" : "ok"}
                etykieta={harmonogramResult.value.rekomendacjaMycia ? "Zalecane mycie paneli" : "Mycie niepotrzebne"}
                className="p-3 text-small"
              >
                <p className="mt-1">{harmonogramResult.value.powod}</p>
                {harmonogramResult.assumptions.map((a, i) => (
                  <p key={typeof a === "string" ? a : a.kod + i} className="mt-1 opacity-80">
                    Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}
                  </p>
                ))}
              </WerdyktPanel>
            )}
          </div>
        </SekcjaAkordeon>
      </div>
    </main>
  )
}

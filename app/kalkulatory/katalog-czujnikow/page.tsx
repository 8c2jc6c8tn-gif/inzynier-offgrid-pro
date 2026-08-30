"use client"

import { useMemo, useState } from "react"
import { calculateKatalogCzujnikow } from "@/lib/core/modules/esp32/katalog-czujnikow/calculator"
import { MIGAWKA_KATALOGU, SENSOR_TYPES } from "@/lib/core/modules/esp32/katalog-czujnikow/constants"
import type { SensorInstance } from "@/lib/core/modules/esp32/katalog-czujnikow/input"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { BudowniczyListy, PrzyciskUsun } from "@/components/wzorce/budowniczy-listy"

let nextId = 1

export default function KatalogCzujnikowPage() {
  const [instances, setInstances] = useState<SensorInstance[]>([])
  const [typeId, setTypeId] = useState(SENSOR_TYPES[0].id)
  const [etykieta, setEtykieta] = useState("")
  const [lokalizacja, setLokalizacja] = useState("")

  const result = useMemo(() => calculateKatalogCzujnikow({ instances }), [instances])
  const selectedType = SENSOR_TYPES.find((t) => t.id === typeId)!

  function addInstance() {
    if (!etykieta.trim()) return
    setInstances((prev) => [
      ...prev,
      { id: String(nextId++), typeId, etykieta: etykieta.trim(), lokalizacja: lokalizacja.trim() },
    ])
    setEtykieta("")
    setLokalizacja("")
  }

  function removeInstance(id: string) {
    setInstances((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/katalog-czujnikow" />
      <NaglowekEkranu tytul="Katalog czujników">{MIGAWKA_KATALOGU} Moduł 9, Katalog 1.</NaglowekEkranu>

      <BudowniczyListy
        pozycje={instances}
        pustyTekst="Nie dodano jeszcze żadnego czujnika."
        podsumowanie={`Dodane: ${result.value.liczbaInstancji} (typów: ${result.value.liczbaTypowUzytych})`}
        formularz={
          <>
            <PoleSelect label="Typ czujnika" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
              {SENSOR_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.pozycja}
                </option>
              ))}
            </PoleSelect>
            <p className="text-caption text-muted-foreground">
              {selectedType.modelTechnologia} — {selectedType.kluczoweDaneDoboru}
            </p>

            <Pole
              label="Etykieta"
              value={etykieta}
              onChange={(e) => setEtykieta(e.target.value)}
              placeholder="np. Czujnik dymu — sypialnia"
            />
            <Pole
              label="Lokalizacja (opcjonalnie)"
              value={lokalizacja}
              onChange={(e) => setLokalizacja(e.target.value)}
            />

            <Button type="button" onClick={addInstance} disabled={!etykieta.trim()}>
              Dodaj czujnik
            </Button>
          </>
        }
        renderPozycja={(instance) => {
          const type = SENSOR_TYPES.find((t) => t.id === instance.typeId)!
          return (
            <div className="flex items-center justify-between gap-3 rounded-md border p-3 text-small">
              <div>
                <span className="block font-medium">{instance.etykieta}</span>
                <span className="block text-caption text-muted-foreground">
                  {type.pozycja}
                  {instance.lokalizacja && ` — ${instance.lokalizacja}`}
                </span>
              </div>
              <PrzyciskUsun onClick={() => removeInstance(instance.id)} />
            </div>
          )
        }}
      />
    </main>
  )
}

"use client"

import { useMemo, useState } from "react"
import { calculateKatalogCzujnikow } from "@/lib/core/modules/esp32/katalog-czujnikow/calculator"
import { MIGAWKA_KATALOGU, SENSOR_TYPES } from "@/lib/core/modules/esp32/katalog-czujnikow/constants"
import type { SensorInstance } from "@/lib/core/modules/esp32/katalog-czujnikow/input"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

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
      <div>
        <h1 className="text-xl font-semibold">Katalog czujników</h1>
        <p className="text-sm text-muted-foreground">{MIGAWKA_KATALOGU} Moduł 9, Katalog 1.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Typ czujnika</span>
          <select className={inputClass} value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            {SENSOR_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.pozycja}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted-foreground">
          {selectedType.modelTechnologia} — {selectedType.kluczoweDaneDoboru}
        </p>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Etykieta</span>
          <input
            className={inputClass}
            value={etykieta}
            onChange={(e) => setEtykieta(e.target.value)}
            placeholder="np. Czujnik dymu — sypialnia"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Lokalizacja (opcjonalnie)</span>
          <input
            className={inputClass}
            value={lokalizacja}
            onChange={(e) => setLokalizacja(e.target.value)}
          />
        </label>

        <button
          type="button"
          onClick={addInstance}
          disabled={!etykieta.trim()}
          className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Dodaj czujnik
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">
          Dodane: {result.value.liczbaInstancji} (typów: {result.value.liczbaTypowUzytych})
        </p>
        {result.status === "INCOMPLETE" ? (
          <p className="text-sm text-muted-foreground">Nie dodano jeszcze żadnego czujnika.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {instances.map((instance) => {
              const type = SENSOR_TYPES.find((t) => t.id === instance.typeId)!
              return (
                <li
                  key={instance.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                >
                  <div>
                    <span className="block font-medium">{instance.etykieta}</span>
                    <span className="block text-xs text-muted-foreground">
                      {type.pozycja}
                      {instance.lokalizacja && ` — ${instance.lokalizacja}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstance(instance.id)}
                    className="text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Usuń
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}

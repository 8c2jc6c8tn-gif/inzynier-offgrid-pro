"use client"

import { useMemo } from "react"
import { calculateKatalogCzujnikow } from "@/lib/core/modules/esp32/katalog-czujnikow/calculator"
import { MIGAWKA_KATALOGU, SENSOR_TYPES } from "@/lib/core/modules/esp32/katalog-czujnikow/constants"
import type { SensorInstance } from "@/lib/core/modules/esp32/katalog-czujnikow/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { BudowniczyListy, PrzyciskUsun } from "@/components/wzorce/budowniczy-listy"

let nextId = 1

type FormularzStan = {
  instances: SensorInstance[]
  typeId: string
  etykieta: string
  lokalizacja: string
}

const STAN_POCZATKOWY: FormularzStan = {
  instances: [],
  typeId: SENSOR_TYPES[0].id,
  etykieta: "",
  lokalizacja: "",
}

export default function KatalogCzujnikowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("katalog-czujnikow", STAN_POCZATKOWY)
  const { instances, typeId, etykieta, lokalizacja } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setInstances = (a: SensorInstance[] | ((p: SensorInstance[]) => SensorInstance[])) => setPole("instances", a)
  const setTypeId = (a: string | ((p: string) => string)) => setPole("typeId", a)
  const setEtykieta = (a: string | ((p: string) => string)) => setPole("etykieta", a)
  const setLokalizacja = (a: string | ((p: string) => string)) => setPole("lokalizacja", a)

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

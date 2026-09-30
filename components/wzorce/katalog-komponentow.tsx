"use client"

import { useMemo } from "react"
import { calculateKatalogKomponentow } from "@/lib/core/modules/esp32/katalog-komponentow/calculator"
import { KATALOGI_ESP32, type KatalogEsp32 } from "@/lib/core/modules/esp32/katalog-komponentow/constants"
import type { KomponentInstance } from "@/lib/core/modules/esp32/katalog-komponentow/input"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { BudowniczyListy, PrzyciskUsun } from "@/components/wzorce/budowniczy-listy"
import { useTranslate } from "@/lib/i18n/language-context"

export type KatalogKomponentowStan = {
  instances: KomponentInstance[]
  typeId: string
  etykieta: string
  lokalizacja: string
}

export function stanPoczatkowyKatalogu(katalog: KatalogEsp32): KatalogKomponentowStan {
  return { instances: [], typeId: KATALOGI_ESP32[katalog][0], etykieta: "", lokalizacja: "" }
}

/** Help screen id and the `UI-M9-K<n>-*` key prefix of each catalogue. */
const EKRAN = {
  aktuatory: { ekran: "katalog-aktuatorow", klucz: "UI-M9-K2" },
  protokoly: { ekran: "katalog-protokolow", klucz: "UI-M9-K3" },
  "interfejs-lokalny": { ekran: "katalog-interfejsu-lokalnego", klucz: "UI-M9-K4" },
} as const

/**
 * Wzorzec H for Module 9 catalogues 2–4: pick a type (technology, key data and the Bible's note shown below the
 * select), give it a label and a place, add as many instances as needed. State lives in the page (`usePersistedDraft`).
 */
export function KatalogKomponentow({
  katalog,
  stan,
  setStan,
}: {
  katalog: KatalogEsp32
  stan: KatalogKomponentowStan
  setStan: (aktualizuj: (prev: KatalogKomponentowStan) => KatalogKomponentowStan) => void
}) {
  const t = useTranslate()
  const { ekran, klucz } = EKRAN[katalog]
  const typy: readonly string[] = KATALOGI_ESP32[katalog]
  const typeId = typy.includes(stan.typeId) ? stan.typeId : typy[0]!
  const result = useMemo(() => calculateKatalogKomponentow({ instances: stan.instances }), [stan.instances])

  function dodaj() {
    const etykieta = stan.etykieta.trim()
    if (!etykieta) return
    // Ids survive reloads (persisted draft), so the next one is derived from the list, not a module counter.
    const id = String(Math.max(0, ...stan.instances.map((i) => Number(i.id) || 0)) + 1)
    setStan((prev) => ({
      ...prev,
      instances: [...prev.instances, { id, typeId, etykieta, lokalizacja: prev.lokalizacja.trim() }],
      etykieta: "",
      lokalizacja: "",
    }))
  }

  return (
    <BudowniczyListy
      pozycje={stan.instances}
      pustyTekst={t("UI-M9-K-PUSTY")}
      podsumowanie={t("UI-M9-K-PODSUMOWANIE", { n: result.value.liczbaInstancji, typy: result.value.liczbaTypowUzytych })}
      formularz={
        <>
          <PoleSelect
            label={t(`${klucz}-TYP`)}
            value={typeId}
            onChange={(e) => setStan((prev) => ({ ...prev, typeId: e.target.value }))}
            pomoc={<PomocPola ekran={ekran} pole="typ" />}
          >
            {typy.map((id) => (
              <option key={id} value={id}>
                {t(`UI-M9-${id}-N`)}
              </option>
            ))}
          </PoleSelect>
          <dl className="grid gap-1 text-caption text-muted-foreground">
            <dt className="font-medium text-foreground">{t(`${klucz}-KOL-T`)}</dt>
            <dd>{t(`UI-M9-${typeId}-T`)}</dd>
            <dt className="font-medium text-foreground">{t(`${klucz}-KOL-D`)}</dt>
            <dd>{t(`UI-M9-${typeId}-D`)}</dd>
            <dt className="font-medium text-foreground">{t("UI-M9-K-UWAGA")}</dt>
            <dd>{t(`UI-M9-${typeId}-U`)}</dd>
          </dl>
          <Pole
            label={t("UI-M9-K-ETYKIETA")}
            value={stan.etykieta}
            onChange={(e) => setStan((prev) => ({ ...prev, etykieta: e.target.value }))}
            placeholder={t(`${klucz}-PH`)}
            pomoc={<PomocPola ekran={ekran} pole="etykieta" />}
          />
          <Pole
            label={t("UI-M9-K-LOKALIZACJA")}
            value={stan.lokalizacja}
            onChange={(e) => setStan((prev) => ({ ...prev, lokalizacja: e.target.value }))}
            pomoc={<PomocPola ekran={ekran} pole="lokalizacja" />}
          />
          <Button type="button" onClick={dodaj} disabled={!stan.etykieta.trim()}>
            {t("UI-M9-K-DODAJ")}
          </Button>
        </>
      }
      renderPozycja={(instance) => (
        <div className="flex items-center justify-between gap-3 rounded-md border p-3 text-small">
          <div>
            <span className="block font-medium">{instance.etykieta}</span>
            <span className="block text-caption text-muted-foreground">
              {t(`UI-M9-${instance.typeId}-N`)}
              {instance.lokalizacja && ` — ${instance.lokalizacja}`}
            </span>
          </div>
          <PrzyciskUsun
            label={t("UI-M9-K-USUN")}
            onClick={() => setStan((prev) => ({ ...prev, instances: prev.instances.filter((i) => i.id !== instance.id) }))}
          />
        </div>
      )}
    />
  )
}

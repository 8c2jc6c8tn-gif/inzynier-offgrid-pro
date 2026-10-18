"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"
import { dzisiajLokalnie } from "@/lib/obiekt/terminarz-przegladow-draft"
import {
  czyPokazacPrzypomnienie,
  uprawnienieNotyfikacji,
  usePrzypomnieniaPrzegladow,
  zapiszPrzypomnienia,
  type UprawnienieNotyfikacji,
} from "@/lib/obiekt/przypomnienia-przegladow"

/**
 * Checkbox on the schedule screen: the browser reminder about overdue inspections. Asks for the notification permission only after the click.
 * The reminder is shown when the app is opened, not in the background (see `lib/obiekt/przypomnienia-przegladow.ts`) — the text says so.
 */
export function PrzypomnieniaPrzegladowWybor() {
  const t = useTranslate()
  const stan = usePrzypomnieniaPrzegladow()
  // The permission is read from the browser (nothing to subscribe to); after our own request the answer is kept in state until the next render reads it again.
  const odczytane = useSyncExternalStore(() => () => {}, uprawnienieNotyfikacji, (): UprawnienieNotyfikacji => "default")
  const [zadane, setZadane] = useState<UprawnienieNotyfikacji | null>(null)
  const uprawnienie = zadane ?? odczytane

  async function przelacz(wlacz: boolean) {
    if (!wlacz) return zapiszPrzypomnienia({ ...stan, wlaczone: false })
    let wynik = uprawnienieNotyfikacji()
    if (wynik === "default") {
      try {
        wynik = await Notification.requestPermission()
      } catch {
        wynik = uprawnienieNotyfikacji()
      }
    }
    setZadane(wynik)
    zapiszPrzypomnienia({ ...stan, wlaczone: wynik === "granted" })
  }

  const brakObslugi = uprawnienie === "brak-obslugi"
  return (
    <section className="flex flex-col gap-1 rounded-lg border p-3">
      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input type="checkbox" className="size-4 shrink-0" checked={stan.wlaczone} disabled={brakObslugi} onChange={(e) => void przelacz(e.target.checked)} />
        <span className="text-small font-medium">{t("UI-TPRZ-PRZYPOMNIENIA")}</span>
        <PomocPola ekran="terminarz-przegladow" pole="przypomnienia" />
      </label>
      <p className="text-caption text-muted-foreground">
        {brakObslugi ? t("UI-TPRZ-PRZYPOMNIENIA-BRAK-OBSLUGI") : uprawnienie === "denied" ? t("UI-TPRZ-PRZYPOMNIENIA-ZABLOKOWANE") : t("UI-TPRZ-PRZYPOMNIENIA-OPIS")}
      </p>
    </section>
  )
}

/** On the dashboard: shows the reminder once a day when it is enabled, allowed and something is overdue. Renders nothing. */
export function PrzypomnieniePrzegladowNaPulpicie({ poTerminie }: { poTerminie: number }) {
  const t = useTranslate()
  const stan = usePrzypomnieniaPrzegladow()
  useEffect(() => {
    const dzisiaj = dzisiajLokalnie()
    if (!czyPokazacPrzypomnienie({ stan, uprawnienie: uprawnienieNotyfikacji(), poTerminie, dzisiaj })) return
    try {
      new Notification(t("UI-PUL-PRZEGLADY-PO-TERMINIE", { n: poTerminie }), { tag: "offgrid-przeglady-po-terminie" })
      zapiszPrzypomnienia({ ...stan, ostatnioDzien: dzisiaj })
    } catch {
      // The browser refused to show it (e.g. Android requires a service worker registration): the bell on the dashboard still shows the count.
    }
  }, [stan, poTerminie, t])
  return null
}

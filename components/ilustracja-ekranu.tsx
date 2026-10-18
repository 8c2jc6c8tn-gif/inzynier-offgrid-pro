"use client"

import { useSyncExternalStore } from "react"
import { IKONA_3D_EKRANOW, type IkonaEkranu } from "@/lib/pulpit/maskotki"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/wyglad/storage"

/**
 * Small 3D icon next to a screen title (weather for the forecast screens, boiler for the hot-water boiler screen). Shown only when the 3D icons are chosen
 * in Settings → Module illustrations (D87); with the Bob mascot the screen header stays as it was. Decorative: the title carries the meaning.
 */
export function IlustracjaEkranu({ ikona }: { ikona: IkonaEkranu }) {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (stan.ikonyKafli !== "3d") return null
  return <img src={IKONA_3D_EKRANOW[ikona]} alt="" aria-hidden="true" width={56} height={56} draggable={false} className="size-14 shrink-0 object-contain" />
}

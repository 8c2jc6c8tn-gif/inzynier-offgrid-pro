"use client"

import { useSyncExternalStore } from "react"
import { BANER_MODULU_PO_ID_KAFLA, IKONA_3D_PO_ID_KAFLA, MASKOTKA_PO_ID_KAFLA } from "@/lib/pulpit/maskotki"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/wyglad/storage"

/**
 * Illustration of a module: the Bob mascot or the 3D icon (setting `ikonyKafli`, D87).
 * `kafel` is the square on the dashboard tile; `baner` the wide picture on a module page and in Settings.
 * Always decorative (`alt=""`, `aria-hidden`): the name next to it carries the meaning.
 */
export function IlustracjaKafla({ kafelId, wariant }: { kafelId: number; wariant: "kafel" | "baner" }) {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ikona3d = stan.ikonyKafli === "3d" ? IKONA_3D_PO_ID_KAFLA[kafelId] : undefined
  const src = ikona3d ?? (wariant === "baner" ? (BANER_MODULU_PO_ID_KAFLA[kafelId] ?? MASKOTKA_PO_ID_KAFLA[kafelId]) : MASKOTKA_PO_ID_KAFLA[kafelId])
  if (!src) return null

  const dopasowanie = ikona3d ? "object-contain" : "object-cover object-top"
  if (wariant === "kafel") {
    return (
      <span className="block aspect-square w-full max-w-(--ikona-kafel) overflow-hidden rounded-md" aria-hidden="true">
        <img src={src} alt="" className={`h-full w-full ${dopasowanie}`} />
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`mt-3 h-48 w-full rounded-lg ${dopasowanie}${ikona3d ? " bg-muted/50" : ""}`}
    />
  )
}

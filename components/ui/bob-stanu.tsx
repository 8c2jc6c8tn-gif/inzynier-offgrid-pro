"use client"

import { useSyncExternalStore } from "react"
import { BOB_STANY, type BobStan } from "@/lib/pulpit/maskotki"
import { cn } from "@/lib/utils"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/wyglad/storage"

/** True when the user chose the 3D icons instead of the Bob mascot (Settings → Module illustrations, D87). */
export function useBezBoba(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).ikonyKafli === "3d"
}

/**
 * Maskotka Bob jako ozdoba stanu interfejsu (D88). Zawsze dekoracyjna: znaczenie niesie tekst
 * i kolor werdyktu obok, więc obraz jest ukryty przed czytnikami ekranu (`alt=""`, `aria-hidden`).
 * Przy wyborze „Ikony 3D” (D87) nie renderuje nic: werdykt ma własny znak, pusty stan i 404 mają tekst.
 */
export function BobStanu({ stan, className }: { stan: BobStan; className?: string }) {
  const bezBoba = useBezBoba()
  if (bezBoba) return null
  return (
    <img
      src={BOB_STANY[stan]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={cn("object-contain", className)}
    />
  )
}

"use client"

import { useSyncExternalStore } from "react"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"
import type { IkonyKafli } from "@/lib/pulpit/maskotki"
import { cn } from "@/lib/utils"
import { getServerSnapshot, getSnapshot, subscribe, ustawIkonyKafli } from "@/lib/wyglad/storage"

const OPCJE: { id: IkonyKafli; nazwa: string; opis: string; podglad: string }[] = [
  { id: "bob", nazwa: "UI-WYGLAD-IKONY-BOB", opis: "UI-WYGLAD-IKONY-BOB-OPIS", podglad: "/maskotki-bob/modul-03.webp" },
  { id: "3d", nazwa: "UI-WYGLAD-IKONY-3D", opis: "UI-WYGLAD-IKONY-3D-OPIS", podglad: "/ikony-3d/ikona-03.webp" },
]

/** Choice between the Bob mascot and the 3D icon set on tiles and module pages (D87). Saved at once. */
export function IkonyKafliWybor() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const tr = useTranslate()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="flex items-center gap-2 text-small font-semibold">
        {tr("UI-WYGLAD-IKONY-TYTUL")}
        <PomocPola ekran="ustawienia-wyglad" pole="ikony" />
      </legend>
      <p className="text-caption text-muted-foreground">{tr("UI-WYGLAD-IKONY-OPIS")}</p>
      {OPCJE.map((o) => (
        <label
          key={o.id}
          className={cn(
            "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border p-3",
            stan.ikonyKafli === o.id && "border-primary bg-muted",
          )}
        >
          <input
            type="radio"
            name="ikony-kafli"
            className="size-4 shrink-0"
            checked={stan.ikonyKafli === o.id}
            onChange={() => ustawIkonyKafli(o.id)}
          />
          <img
            src={o.podglad}
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className={cn("size-12 shrink-0 rounded", o.id === "bob" ? "object-cover object-top" : "object-contain")}
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-small font-medium">{tr(o.nazwa)}</span>
            <span className="text-caption text-muted-foreground">{tr(o.opis)}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}

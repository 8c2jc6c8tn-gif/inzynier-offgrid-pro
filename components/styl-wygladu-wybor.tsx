"use client"

import { useSyncExternalStore } from "react"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  ustawPokazUkryteStyle,
  ustawStyl,
} from "@/lib/wyglad/storage"
import { GRUPY_STYLOW, STYLE_WYGLADU, znajdzStyl, type StylId, type StylWygladu } from "@/lib/wyglad/style"

/** Colour strip of a style: background, card, accent and the 🟢 colour — read from the style table. */
function Probka({ styl }: { styl: StylWygladu }) {
  const { tlo, karta, akcent } = styl.tokeny
  return (
    <span aria-hidden="true" className="flex h-8 w-16 shrink-0 overflow-hidden rounded border">
      {[tlo, karta, akcent, styl.werdykty.ok].map((kolor, i) => (
        <span key={i} className={i === 0 ? "flex-[2]" : "flex-1"} style={{ background: kolor }} />
      ))}
    </span>
  )
}

function Opcja({
  wartosc,
  zaznaczona,
  nazwa,
  opis,
  probka,
}: {
  wartosc: StylId | null
  zaznaczona: boolean
  nazwa: string
  opis: string
  probka?: StylWygladu
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border p-3",
        zaznaczona && "border-primary bg-muted",
      )}
    >
      <input
        type="radio"
        name="styl-wygladu"
        className="size-4 shrink-0"
        checked={zaznaczona}
        onChange={() => ustawStyl(wartosc)}
      />
      {probka ? <Probka styl={probka} /> : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-small font-medium">{nazwa}</span>
        <span className="text-caption text-muted-foreground">{opis}</span>
      </span>
    </label>
  )
}

/**
 * Style picker (D67): the default look first, then the four groups. A group without styles yet
 * says so (styles arrive in batches); „Ukryte i sezonowe” appears only after the toggle — or when
 * the chosen style belongs to it, so a chosen style is never invisible. The choice is saved at once
 * (`lib/wyglad/storage.ts`).
 */
export function StylWygladuWybor() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const tr = useTranslate()
  const aktywny = znajdzStyl(stan.styl)

  const grupy = GRUPY_STYLOW.filter(
    (g) => g.id !== "ukryte" || stan.pokazUkryteStyle || aktywny?.grupa === "ukryte",
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="flex items-center gap-2 text-small font-semibold">
          {tr("UI-WYGLAD-STYL-TYTUL")}
          <PomocPola ekran="ustawienia-wyglad" pole="styl" />
        </h3>
        <p className="mt-1 text-caption text-muted-foreground">{tr("UI-WYGLAD-STYL-OPIS")}</p>
      </div>

      <Opcja
        wartosc={null}
        zaznaczona={!aktywny}
        nazwa={tr("UI-WYGLAD-STYL-DOMYSLNY")}
        opis={tr("UI-WYGLAD-STYL-DOMYSLNY-OPIS")}
      />

      {grupy.map((grupa) => {
        const style = STYLE_WYGLADU.filter((s) => s.grupa === grupa.id)
        return (
          <fieldset key={grupa.id} className="flex flex-col gap-2">
            <legend className="mb-2 text-small font-semibold">
              {tr(grupa.nazwaKlucz)} <span className="font-normal text-muted-foreground">({style.length})</span>
            </legend>
            {style.length === 0 ? (
              <p className="text-caption text-muted-foreground">{tr("UI-WYGLAD-GRUPA-PUSTA")}</p>
            ) : (
              style.map((s) => (
                <Opcja
                  key={s.id}
                  wartosc={s.id}
                  zaznaczona={aktywny?.id === s.id}
                  nazwa={tr(s.nazwaKlucz)}
                  opis={tr(s.opisKlucz)}
                  probka={s}
                />
              ))
            )}
          </fieldset>
        )
      })}

      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="size-4 shrink-0"
          checked={stan.pokazUkryteStyle}
          onChange={(e) => ustawPokazUkryteStyle(e.target.checked)}
        />
        <span className="text-small">{tr("UI-WYGLAD-POKAZ-UKRYTE")}</span>
        <PomocPola ekran="ustawienia-wyglad" pole="ukryte" />
      </label>

      <p role="status" className="text-caption text-muted-foreground">
        {aktywny
          ? tr(aktywny.schemat === "ciemny" ? "UI-WYGLAD-SCHEMAT-CIEMNY" : "UI-WYGLAD-SCHEMAT-JASNY")
          : null}
      </p>
    </div>
  )
}

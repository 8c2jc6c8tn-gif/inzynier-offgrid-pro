"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWarunkiNadmorskiePyliste } from "@/lib/core/modules/pv/warunki-nadmorskie-pyliste/calculator"
import type { TypLokalizacji } from "@/lib/core/modules/pv/warunki-nadmorskie-pyliste/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  typLokalizacji: "" | TypLokalizacji
  wilgotnoscWysoka: boolean
  certyfikatIec61701: boolean
  ramaAnodowana: boolean
  zlaczkiMorskie: boolean
  certyfikatAntyPid: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  typLokalizacji: "",
  wilgotnoscWysoka: false,
  certyfikatIec61701: false,
  ramaAnodowana: false,
  zlaczkiMorskie: false,
  certyfikatAntyPid: false,
}

export default function WarunkiNadmorskiePylistePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("warunki-nadmorskie-pyliste", STAN_POCZATKOWY)
  const ustaw = <K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) =>
    setStan((prev) => ({ ...prev, [pole]: wartosc }))

  const result = useMemo(
    () => calculateWarunkiNadmorskiePyliste({ ...stan, typLokalizacji: stan.typLokalizacji === "" ? null : stan.typLokalizacji }),
    [stan],
  )

  const nadmorska = stan.typLokalizacji === "nadmorska"
  const pytajOAntyPid = nadmorska || stan.wilgotnoscWysoka
  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "warning" || w.level === "critical")
    ? "uwaga"
    : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/warunki-nadmorskie-pyliste" />
      <NaglowekEkranu tytul="Warunki nadmorskie i pyliste" ekran="warunki-nadmorskie-pyliste">
        Mgła solna koroduje ramki i połączenia, pył i piasek rysują szkło, a wysoka wilgotność podnosi ryzyko
        PID. Sprawdź, czy wybrane panele są do tego przystosowane. Moduł 3, Ekran 25.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <PoleSelect
          label="Typ lokalizacji"
          value={stan.typLokalizacji}
          onChange={(e) => ustaw("typLokalizacji", e.target.value as FormularzStan["typLokalizacji"])}
          pomoc={<PomocPola ekran="warunki-nadmorskie-pyliste" pole="typ" />}
        >
          <option value="">— wybierz —</option>
          <option value="nadmorska">Nadmorska</option>
          <option value="pylista">Pylista (piasek, pył)</option>
          <option value="standardowa">Standardowa</option>
        </PoleSelect>
        <PoleCheckbox
          id="wilgotnosc-wysoka"
          checked={stan.wilgotnoscWysoka}
          onChange={(e) => ustaw("wilgotnoscWysoka", e.target.checked)}
          label="Wysoka wilgotność w miejscu montażu"
        />
        {nadmorska && (
          <>
            <PoleCheckbox
              id="certyfikat-iec-61701"
              checked={stan.certyfikatIec61701}
              onChange={(e) => ustaw("certyfikatIec61701", e.target.checked)}
              label="Panel ma certyfikat IEC 61701 (mgła solna)"
            />
            <PoleCheckbox
              id="rama-anodowana"
              checked={stan.ramaAnodowana}
              onChange={(e) => ustaw("ramaAnodowana", e.target.checked)}
              label="Panel ma ramę anodowaną"
            />
            <PoleCheckbox
              id="zlaczki-morskie"
              checked={stan.zlaczkiMorskie}
              onChange={(e) => ustaw("zlaczkiMorskie", e.target.checked)}
              label="Złączki MC4 do warunków morskich"
            />
          </>
        )}
        {pytajOAntyPid && (
          <PoleCheckbox
            id="certyfikat-anty-pid"
            checked={stan.certyfikatAntyPid}
            onChange={(e) => ustaw("certyfikatAntyPid", e.target.checked)}
            label="Panel ma certyfikat anty-PID"
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz typ lokalizacji, żeby zobaczyć ocenę.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            result.value.niespelnioneReguly > 0
              ? `Do poprawy: ${result.value.niespelnioneReguly}`
              : "Panele przystosowane do warunków"
          }
        >
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <p className="mt-2 text-small text-muted-foreground">
            Powiązane:{" "}
            <Link href="/kalkulatory/ryzyko-pid" className="underline">
              ryzyko PID
            </Link>
            {" · "}
            <Link href="/kalkulatory/zlacza-mc4" className="underline">
              złącza MC4
            </Link>
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}

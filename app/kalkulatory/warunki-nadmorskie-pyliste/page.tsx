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
      <NaglowekEkranu tytul={t("UI-WARNADPYL-WARUNKI-NADMORSKIE-PYLISTE")} ekran="warunki-nadmorskie-pyliste">
        {t("UI-WARNADPYL-MGLA-SOLNA-KORODUJE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <PoleSelect
          label={t("UI-WARNADPYL-TYP-LOKALIZACJI")}
          value={stan.typLokalizacji}
          onChange={(e) => ustaw("typLokalizacji", e.target.value as FormularzStan["typLokalizacji"])}
          pomoc={<PomocPola ekran="warunki-nadmorskie-pyliste" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="nadmorska">{t("UI-WARNADPYL-NADMORSKA")}</option>
          <option value="pylista">{t("UI-WARNADPYL-PYLISTA-PIASEK-PYL")}</option>
          <option value="standardowa">{t("UI-WARNADPYL-STANDARDOWA")}</option>
        </PoleSelect>
        <PoleCheckbox
          id="wilgotnosc-wysoka"
          checked={stan.wilgotnoscWysoka}
          onChange={(e) => ustaw("wilgotnoscWysoka", e.target.checked)}
          label={t("UI-WARNADPYL-WYSOKA-WILGOTNOSC-MIEJSCU")}
        />
        {nadmorska && (
          <>
            <PoleCheckbox
              id="certyfikat-iec-61701"
              checked={stan.certyfikatIec61701}
              onChange={(e) => ustaw("certyfikatIec61701", e.target.checked)}
              label={t("UI-WARNADPYL-PANEL-CERTYFIKAT-IEC")}
            />
            <PoleCheckbox
              id="rama-anodowana"
              checked={stan.ramaAnodowana}
              onChange={(e) => ustaw("ramaAnodowana", e.target.checked)}
              label={t("UI-WARNADPYL-PANEL-RAME-ANODOWANA")}
            />
            <PoleCheckbox
              id="zlaczki-morskie"
              checked={stan.zlaczkiMorskie}
              onChange={(e) => ustaw("zlaczkiMorskie", e.target.checked)}
              label={t("UI-WARNADPYL-ZLACZKI-MC4-WARUNKOW")}
            />
          </>
        )}
        {pytajOAntyPid && (
          <PoleCheckbox
            id="certyfikat-anty-pid"
            checked={stan.certyfikatAntyPid}
            onChange={(e) => ustaw("certyfikatAntyPid", e.target.checked)}
            label={t("UI-WARNADPYL-PANEL-CERTYFIKAT-ANTY")}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-WARNADPYL-WYBIERZ-TYP-LOKALIZACJI")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            result.value.niespelnioneReguly > 0
              ? t("UI-WARNADPYL-POPRAWY", { niespelnioneReguly: result.value.niespelnioneReguly })
              : t("UI-WARNADPYL-PANELE-PRZYSTOSOWANE-WARUNKO")
          }
        >
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <p className="mt-2 text-small text-muted-foreground">
            {t("UI-WARNADPYL-POWIAZANE")}{" "}
            <Link href="/kalkulatory/ryzyko-pid" className="underline">
              {t("UI-WARNADPYL-RYZYKO-PID")}
            </Link>
            {" · "}
            <Link href="/kalkulatory/zlacza-mc4" className="underline">
              {t("UI-WARNADPYL-ZLACZA-MC4")}
            </Link>
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}

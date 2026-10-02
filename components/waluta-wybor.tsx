"use client"

/**
 * Display-currency picker (Settings) — lib/waluta/. Works in Poland too: any currency can be
 * chosen. Rates come from the ECB feed (cached for offline); a manual rate (e.g. copied from
 * Revolut) and a markup override them. Revolut itself has no public rates API.
 */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslate } from "@/lib/i18n/language-context"
import { odswiezKursy, zapiszPreferencje } from "@/lib/waluta/storage"
import { useWaluta } from "@/lib/waluta/use-waluta"
import { WALUTA_BAZOWA, WALUTY, czyKodWaluty } from "@/lib/waluta/waluty"

export function WalutaWybor() {
  const t = useTranslate()
  const { stan, brakKursu } = useWaluta()
  const [komunikat, setKomunikat] = useState<string | null>(null)
  const { kod, narzutProc, reczne } = stan.preferencja
  const automatyczny = WALUTY.find((w) => w.kod === kod)?.automatyczny ?? true

  async function odswiez() {
    setKomunikat((await odswiezKursy()) ? t("UI-WAL-ODSWIEZONO") : t("UI-WAL-ODSWIEZ-BLAD"))
  }

  function ustawReczny(tekst: string) {
    const nastepne = { ...reczne }
    const n = Number(tekst.replace(",", "."))
    if (tekst.trim() !== "" && Number.isFinite(n) && n > 0) nastepne[kod] = n
    else delete nastepne[kod]
    zapiszPreferencje({ ...stan.preferencja, reczne: nastepne })
  }

  return (
    <div className="flex flex-col gap-2 border-t pt-6">
      <h2 className="text-h2 font-semibold">{t("UI-WAL-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-WAL-OPIS")}</p>

      <label className="flex flex-col gap-1 text-small">
        {t("UI-WAL-WYBOR")}
        <select
          className="min-h-9 rounded-md border bg-background px-2"
          value={kod}
          onChange={(e) => czyKodWaluty(e.target.value) && zapiszPreferencje({ ...stan.preferencja, kod: e.target.value })}
        >
          {WALUTY.map((w) => (
            <option key={w.kod} value={w.kod}>
              {w.kod}
            </option>
          ))}
        </select>
      </label>

      {kod !== WALUTA_BAZOWA && (
        <>
          <label className="flex flex-col gap-1 text-small">
            {t("UI-WAL-KURS-RECZNY", { waluta: kod })}
            <input
              inputMode="decimal"
              className="min-h-9 rounded-md border bg-background px-2"
              defaultValue={reczne[kod] ?? ""}
              key={kod}
              onBlur={(e) => ustawReczny(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-small">
            {t("UI-WAL-NARZUT")}
            <input
              inputMode="decimal"
              className="min-h-9 rounded-md border bg-background px-2"
              defaultValue={narzutProc}
              onBlur={(e) => {
                const n = Number(e.target.value.replace(",", "."))
                zapiszPreferencje({ ...stan.preferencja, narzutProc: Number.isFinite(n) ? Math.min(20, Math.max(0, n)) : 0 })
              }}
            />
            <span className="text-muted-foreground">{t("UI-WAL-NARZUT-OPIS")}</span>
          </label>
          {!automatyczny && <p className="text-small">{t("UI-WAL-RECZNY-TYLKO", { waluta: kod })}</p>}
          {brakKursu && <p className="text-small text-destructive">{t("UI-WAL-BRAK-KURSU", { waluta: kod })}</p>}
          {stan.kursy && (
            <p className="text-small text-muted-foreground">
              {t("UI-WAL-STAN-KURSOW", { data: stan.kursy.dataEcb, pobrano: new Date(stan.kursy.pobranoMs).toLocaleString() })}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={odswiez}>
              {t("UI-WAL-ODSWIEZ")}
            </Button>
            {komunikat && <span className="text-small" role="status">{komunikat}</span>}
          </div>
        </>
      )}
      <p className="text-small text-muted-foreground">{t("UI-WAL-ZRODLO")}</p>
    </div>
  )
}

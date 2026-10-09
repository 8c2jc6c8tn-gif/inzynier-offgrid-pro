"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { LOGO_TYPY, przygotujLogo, type BladLogo } from "@/lib/firma/logo"
import type { ProfilFirmy } from "@/lib/firma/profil-firmy"
import { useTranslate } from "@/lib/i18n/language-context"

const KLUCZE_BLEDU: Record<BladLogo, string> = {
  typ: "UI-FIRMA-LOGO-BLAD-TYP",
  rozmiar: "UI-FIRMA-LOGO-BLAD-ROZMIAR",
  odczyt: "UI-FIRMA-LOGO-BLAD-ODCZYT",
}

const POLA = [
  ["nazwa", "UI-FIRMA-NAZWA", "firmaNazwa", "text"],
  ["adres", "UI-FIRMA-ADRES", "firmaAdres", "text"],
  ["nip", "UI-FIRMA-NIP", "firmaNip", "text"],
  ["telefon", "UI-FIRMA-TELEFON", "firmaTelefon", "tel"],
  ["email", "UI-FIRMA-EMAIL", "firmaEmail", "email"],
  ["www", "UI-FIRMA-WWW", "firmaWww", "text"],
] as const

/** Company details and logo for printouts; the data live in an autosaved draft owned by the caller (device only). */
export function EdytorProfiluFirmy({ firma, ustaw }: { firma: ProfilFirmy; ustaw: (zmiana: Partial<ProfilFirmy>) => void }) {
  const t = useTranslate()
  const wejscie = useRef<HTMLInputElement>(null)
  const [blad, setBlad] = useState<BladLogo | null>(null)

  async function wybierzLogo(plik: File | undefined) {
    if (!plik) return
    setBlad(null)
    try {
      ustaw({ logo: await przygotujLogo(plik) })
    } catch (e) {
      setBlad(e instanceof Error && (e.message === "typ" || e.message === "rozmiar") ? e.message : "odczyt")
    } finally {
      // The same file can then be chosen again after an error or a removal.
      if (wejscie.current) wejscie.current.value = ""
    }
  }

  return (
    <details className="rounded-lg border p-3">
      <summary className="cursor-pointer text-small font-medium">{t("UI-FIRMA-TYTUL")}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-caption text-muted-foreground">{t("UI-FIRMA-OPIS")}</p>
        {POLA.map(([pole, klucz, pomoc, typ]) => (
          <Pole key={pole} label={t(klucz)} type={typ} value={firma[pole]} onChange={(e) => ustaw({ [pole]: e.target.value })} pomoc={<PomocPola ekran="porownywarka-paneli" pole={pomoc} />} />
        ))}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-small font-medium">
            {t("UI-FIRMA-LOGO")}
            <PomocPola ekran="porownywarka-paneli" pole="firmaLogo" />
          </div>
          {firma.logo !== "" && (
            // eslint-disable-next-line @next/next/no-img-element -- a data URL kept on the device; next/image would add nothing
            <img src={firma.logo} alt={t("UI-FIRMA-LOGO-ALT")} className="max-h-24 max-w-full self-start rounded border bg-white object-contain p-1" />
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={wejscie} type="file" accept={LOGO_TYPY.join(",")} className="sr-only" id="firma-logo-plik" onChange={(e) => void wybierzLogo(e.target.files?.[0])} />
            <Button type="button" variant="outline" className="min-h-11" onClick={() => wejscie.current?.click()}>
              {t("UI-FIRMA-LOGO-WYBIERZ")}
            </Button>
            {firma.logo !== "" && (
              <Button type="button" variant="outline" className="min-h-11" onClick={() => ustaw({ logo: "" })}>
                {t("UI-FIRMA-LOGO-USUN")}
              </Button>
            )}
          </div>
          <p className="text-caption text-muted-foreground">{t("UI-FIRMA-LOGO-PODPIS")}</p>
          {blad && (
            <p role="alert" className="text-small text-werdykt-blad-foreground">
              {t(KLUCZE_BLEDU[blad])}
            </p>
          )}
        </div>
      </div>
    </details>
  )
}

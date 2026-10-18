"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  pobierzKlucze,
  rozpocznijRejestracjeKlucza,
  usunKlucz,
  zakonczRejestracjeKlucza,
  type KluczDostepu,
} from "@/lib/adapters/supabase/passkey-actions"
import {
  przegladarkaObslugujeKlucze,
  utworzKluczNaUrzadzeniu,
} from "@/lib/adapters/supabase/passkey-przegladarka"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"

/**
 * Klucze dostępu (passkey) zalogowanego konta — lista, dodanie nowego i usunięcie (D89).
 * Wyświetlana wewnątrz `KontoSekcja`, więc tylko dla zalogowanego użytkownika; w przeglądarce bez
 * obsługi WebAuthn nic nie pokazuje (zostaje logowanie linkiem e-mail albo Google/Apple).
 * Stan czytany i zmieniany przez Server Actions, nie klienta Supabase w przeglądarce (18.5).
 */
export function KontoPasskey() {
  const t = useTranslate()
  const jezyk = useLanguage()
  const [obslugiwane, setObslugiwane] = useState(false)
  const [klucze, setKlucze] = useState<KluczDostepu[]>([])
  const [zajete, setZajete] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const odswiez = useCallback(async () => {
    const wynik = await pobierzKlucze()
    if ("errorKey" in wynik) setBlad(wynik.errorKey)
    else setKlucze(wynik.klucze)
  }, [])

  useEffect(() => {
    const dostepne = przegladarkaObslugujeKlucze()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- wynik zależy od API przeglądarki, niedostępnego przy renderze serwerowym
    setObslugiwane(dostepne)
    if (dostepne) void odswiez()
  }, [odswiez])

  async function dodaj() {
    setZajete(true)
    setBlad(null)
    setInfo(null)
    try {
      const start = await rozpocznijRejestracjeKlucza()
      if ("errorKey" in start) return setBlad(start.errorKey)
      const ceremonia = await utworzKluczNaUrzadzeniu(start.options)
      if (!ceremonia.ok) return setBlad(ceremonia.errorKey)
      const wynik = await zakonczRejestracjeKlucza(start.challengeId, ceremonia.credential)
      if ("errorKey" in wynik) return setBlad(wynik.errorKey)
      setInfo("UI-KONPAS-DODANO")
      await odswiez()
    } finally {
      setZajete(false)
    }
  }

  async function usun(id: string) {
    if (!window.confirm(t("UI-KONPAS-POTWIERDZ-USUN"))) return
    setZajete(true)
    setBlad(null)
    setInfo(null)
    try {
      const wynik = await usunKlucz(id)
      if ("errorKey" in wynik) return setBlad(wynik.errorKey)
      await odswiez()
    } finally {
      setZajete(false)
    }
  }

  if (!obslugiwane) return null

  return (
    <div className="flex flex-col gap-3 border-t pt-3">
      <h3 className="text-small font-semibold">{t("UI-KONPAS-TYTUL")}</h3>
      <p className="text-caption text-muted-foreground">{t("UI-KONPAS-OPIS")}</p>
      {klucze.length === 0 ? (
        <p className="text-small text-muted-foreground">{t("UI-KONPAS-BRAK")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {klucze.map((k) => (
            <li key={k.id} className="flex items-center justify-between gap-3 rounded-md border p-2">
              <div className="flex flex-col">
                <span className="text-small">{k.nazwa ?? t("UI-KONPAS-BEZ-NAZWY")}</span>
                <span className="text-caption text-muted-foreground">
                  {t("UI-KONPAS-UTWORZONO", { data: new Date(k.utworzono).toLocaleDateString(jezyk) })}
                  {k.ostatnieUzycie &&
                    ` · ${t("UI-KONPAS-OSTATNIO", { data: new Date(k.ostatnieUzycie).toLocaleDateString(jezyk) })}`}
                </span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => usun(k.id)} disabled={zajete}>
                {t("UI-KONPAS-USUN")}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-1">
        <Button type="button" variant="outline" onClick={dodaj} disabled={zajete} className="self-start">
          {zajete ? t("UI-KONPAS-DODAWANIE") : t("UI-KONPAS-DODAJ")}
        </Button>
        {info && <p className="text-small" role="status">{t(info)}</p>}
        {blad && <p className="text-small text-destructive" role="alert">{t(blad)}</p>}
      </div>
    </div>
  )
}

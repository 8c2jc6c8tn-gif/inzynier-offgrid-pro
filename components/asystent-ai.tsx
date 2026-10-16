"use client"

/**
 * Asystent AI (docs/standards/09-ai-w-produkcie.md, 9.9 — "czat swobodny") — scentralizowane
 * pływające okno zamontowane raz w app/layout.tsx (nie per-ekran), dostępne na każdej stronie
 * aplikacji. Decyzja: rejestr narzędzi (`NARZEDZIA` w lib/ai/pytaj-asystenta.ts) rośnie z każdym
 * nowym kalkulatorem bez dotykania UI żadnego ekranu — jeden komponent do utrzymania, zamiast
 * osobnej integracji AI na każdym z 122 ekranów. Renderuje się na coś tylko, gdy `isAiAvailable()`
 * zwróci `true` (9.0 — bezpieczna degradacja w milczeniu, ten sam wzorzec co `KontoSekcja`/Supabase).
 * Pojedyncze pytanie-odpowiedź, bez pamięci rozmowy (9.7 — świadome uproszczenie pierwszego kroku,
 * nie pominięcie: brak dziś miejsca w stanie projektu, do którego decyzje z czatu miałyby trafić).
 */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { BobStanu, useBezBoba } from "@/components/ui/bob-stanu"
import { Ikona, IKONA } from "@/components/ui/ikona"
import { isAiAvailable } from "@/lib/ai/is-ai-available"
import { pytajAsystenta } from "@/lib/ai/pytaj-asystenta"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"

/** Assistant avatar: Bob, or a line „ai” icon when the 3D icons are chosen instead of the mascot (D87). */
function AwatarAsystenta({ className, ikona }: { className: string; ikona: string }) {
  if (useBezBoba()) {
    return (
      <span className={`${className} grid place-items-center bg-primary text-primary-foreground`} aria-hidden="true">
        <Ikona nazwa={IKONA.ai} className={ikona} />
      </span>
    )
  }
  return <BobStanu stan="asystent" className={`${className} object-cover object-top`} />
}

export function AsystentAi() {
  const t = useTranslate()
  const jezyk = useLanguage()
  const [dostepny, setDostepny] = useState(false)
  const [sprawdzono, setSprawdzono] = useState(false)
  const [otwarty, setOtwarty] = useState(false)
  const [pytanie, setPytanie] = useState("")
  const [wysylanie, setWysylanie] = useState(false)
  const [odpowiedz, setOdpowiedz] = useState<string | null>(null)
  const [zrodlo, setZrodlo] = useState<string | null>(null)
  const [blad, setBlad] = useState<string | null>(null)

  useEffect(() => {
    isAiAvailable()
      .then(setDostepny)
      // Offline the server action cannot be reached: the assistant needs the network anyway, so it
      // stays hidden (9.0 — degrade silently), instead of an unhandled rejection on every screen.
      .catch(() => setDostepny(false))
      .finally(() => setSprawdzono(true))
  }, [])

  if (!sprawdzono || !dostepny) return null

  async function wyslij() {
    setWysylanie(true)
    setBlad(null)
    setOdpowiedz(null)
    const wynik = await pytajAsystenta(pytanie, jezyk)
    setWysylanie(false)
    if ("bladKey" in wynik) {
      setBlad(wynik.bladKey)
      return
    }
    setOdpowiedz(wynik.odpowiedz)
    setZrodlo(wynik.zrodlo ?? null)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {otwarty && (
        <section className="flex w-[min(92vw,22rem)] flex-col gap-3 rounded-lg border bg-card p-4 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <AwatarAsystenta className="size-10 shrink-0 rounded-full bg-primary" ikona="size-6" />
            <div className="mr-auto">
              <h2 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">
                {t("UI-ASYAI-ZAPYTAJ-ASYSTENTA")}
              </h2>
              <p className="text-caption text-muted-foreground">
                {t("UI-ASYAI-ASYSTENT-LICZY-WYLACZNIE")}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("UI-ASYAI-ZAMKNIJ-ASYSTENTA")}
              onClick={() => setOtwarty(false)}
            >
              <Ikona nazwa={IKONA.x} />
            </Button>
          </div>
          <Pole
            label={t("UI-ASYAI-PYTANIE")}
            placeholder={t("UI-ASYAI-JAKI-PRAD-POPLYNIE")}
            value={pytanie}
            onChange={(e) => setPytanie(e.target.value)}
            disabled={wysylanie}
          />
          <Button type="button" onClick={wyslij} disabled={wysylanie || !pytanie.trim()}>
            {wysylanie ? t("UI-ASYAI-PYTAM") : t("UI-ASYAI-ZAPYTAJ")}
          </Button>
          {blad && (
            <p role="alert" className="text-small text-werdykt-blad-foreground">
              {t(blad)}
            </p>
          )}
          {odpowiedz && (
            <div className="flex flex-col gap-1 rounded-md bg-muted/60 p-3 text-small">
              <p>{odpowiedz}</p>
              {zrodlo && <p className="text-caption text-muted-foreground">{t("UI-ASYAI-ZRODLO-KALKULATOR", { zrodlo })}</p>}
            </div>
          )}
        </section>
      )}
      <Button
        type="button"
        size="icon-lg"
        className="size-14 rounded-full p-0 shadow-lg"
        aria-label={otwarty ? t("UI-ASYAI-ZWIN-ASYSTENTA") : t("UI-ASYAI-OTWORZ-ASYSTENTA")}
        aria-expanded={otwarty}
        onClick={() => setOtwarty((v) => !v)}
      >
        {otwarty ? <Ikona nazwa={IKONA.x} className="size-6" /> : <AwatarAsystenta className="size-full rounded-full" ikona="size-7" />}
      </Button>
    </div>
  )
}

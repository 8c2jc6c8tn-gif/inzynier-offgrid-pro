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
import { isAiAvailable } from "@/lib/ai/is-ai-available"
import { pytajAsystenta } from "@/lib/ai/pytaj-asystenta"

export function AsystentAi() {
  const [dostepny, setDostepny] = useState(false)
  const [sprawdzono, setSprawdzono] = useState(false)
  const [otwarty, setOtwarty] = useState(false)
  const [pytanie, setPytanie] = useState("")
  const [wysylanie, setWysylanie] = useState(false)
  const [odpowiedz, setOdpowiedz] = useState<string | null>(null)
  const [zrodlo, setZrodlo] = useState<string | null>(null)
  const [blad, setBlad] = useState<string | null>(null)

  useEffect(() => {
    isAiAvailable().then((wynik) => {
      setDostepny(wynik)
      setSprawdzono(true)
    })
  }, [])

  if (!sprawdzono || !dostepny) return null

  async function wyslij() {
    setWysylanie(true)
    setBlad(null)
    setOdpowiedz(null)
    const wynik = await pytajAsystenta(pytanie)
    setWysylanie(false)
    if ("blad" in wynik) {
      setBlad(wynik.blad)
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
            <div>
              <h2 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">
                Zapytaj asystenta
              </h2>
              <p className="text-caption text-muted-foreground">
                Asystent liczy wyłącznie przez prawdziwy kalkulator — nie zgaduje wartości.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Zamknij asystenta"
              onClick={() => setOtwarty(false)}
            >
              ✕
            </Button>
          </div>
          <Pole
            label="Pytanie"
            placeholder="np. Jaki prąd popłynie przy mocy 400W i napięciu 24V?"
            value={pytanie}
            onChange={(e) => setPytanie(e.target.value)}
            disabled={wysylanie}
          />
          <Button type="button" onClick={wyslij} disabled={wysylanie || !pytanie.trim()}>
            {wysylanie ? "Pytam…" : "Zapytaj"}
          </Button>
          {blad && (
            <p role="alert" className="text-small text-werdykt-blad-foreground">
              {blad}
            </p>
          )}
          {odpowiedz && (
            <div className="flex flex-col gap-1 rounded-md bg-muted/60 p-3 text-small">
              <p>{odpowiedz}</p>
              {zrodlo && <p className="text-caption text-muted-foreground">Źródło: kalkulator v{zrodlo}</p>}
            </div>
          )}
        </section>
      )}
      <Button
        type="button"
        size="icon-lg"
        className="rounded-full shadow-lg"
        aria-label={otwarty ? "Zwiń asystenta AI" : "Otwórz asystenta AI"}
        aria-expanded={otwarty}
        onClick={() => setOtwarty((v) => !v)}
      >
        {otwarty ? "✕" : "AI"}
      </Button>
    </div>
  )
}

/**
 * POST /api/odczyt-karty — odczyt karty katalogowej albo naklejki panelu ze zdjęcia/PDF (spec 33, Etap B, U22).
 *
 * Route handler zamiast akcji serwerowej: akcje mają domyślny limit ciała 1 MB, a zdjęcie karty bywa większe (multipart bez narzutu
 * base64). Plik opuszcza urządzenie dopiero tu, więc wymaga jawnej zgody użytkownika (standard 7, 9.6) — brak zgody odrzuca także
 * serwer, nie tylko przycisk. Klucz API zostaje po stronie serwera (18.5); limity — `lib/ai/odczyt-karty/limit.ts`.
 */
import { NextResponse, type NextRequest } from "next/server"
import { createAnthropicClient } from "@/lib/adapters/ai/client"
import { isAiConfigured } from "@/lib/adapters/ai/config"
import { utworzLimiterOdczytu } from "@/lib/ai/odczyt-karty/limit"
import { MAKS_BAJTOW_PLIKU, wykonajOdczytBezpiecznie, type BladOdczytu } from "@/lib/ai/odczyt-karty/wykonaj"

const limiter = utworzLimiterOdczytu()

type BladApi = BladOdczytu | "UI-PORP-OCR-BLAD-NIESKONFIGUROWANY" | "UI-PORP-OCR-BLAD-BRAK-ZGODY" | "UI-PORP-OCR-BLAD-LIMIT"

const STATUS: Record<BladApi, number> = {
  "UI-PORP-OCR-BLAD-PUSTY-PLIK": 400,
  "UI-PORP-OCR-BLAD-TYP": 415,
  "UI-PORP-OCR-BLAD-ZA-DUZY": 413,
  "UI-PORP-OCR-BLAD-ODMOWA": 422,
  "UI-PORP-OCR-BLAD-ZLY-ODCZYT": 502,
  "UI-PORP-OCR-BLAD-OGOLNY": 502,
  "UI-PORP-OCR-BLAD-NIESKONFIGUROWANY": 503,
  "UI-PORP-OCR-BLAD-BRAK-ZGODY": 403,
  "UI-PORP-OCR-BLAD-LIMIT": 429,
}

const blad = (bladKey: BladApi, extra?: { ponowZaSekund: number }) => NextResponse.json({ ok: false, bladKey, ...extra }, { status: STATUS[bladKey] })

export async function POST(request: NextRequest) {
  if (!isAiConfigured()) return blad("UI-PORP-OCR-BLAD-NIESKONFIGUROWANY")

  const deklarowana = Number(request.headers.get("content-length") ?? 0)
  if (deklarowana > MAKS_BAJTOW_PLIKU + 64 * 1024) return blad("UI-PORP-OCR-BLAD-ZA-DUZY")

  let forma: FormData
  try {
    forma = await request.formData()
  } catch {
    return blad("UI-PORP-OCR-BLAD-PUSTY-PLIK")
  }
  if (forma.get("zgoda") !== "tak") return blad("UI-PORP-OCR-BLAD-BRAK-ZGODY")
  const plik = forma.get("plik")
  if (!(plik instanceof File) || plik.size === 0) return blad("UI-PORP-OCR-BLAD-PUSTY-PLIK")
  if (plik.size > MAKS_BAJTOW_PLIKU) return blad("UI-PORP-OCR-BLAD-ZA-DUZY")

  const klucz = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "nieznany"
  const limit = limiter.sprobuj(klucz)
  if (!limit.ok) return blad("UI-PORP-OCR-BLAD-LIMIT", { ponowZaSekund: limit.ponowZaSekund })

  const wynik = await wykonajOdczytBezpiecznie(createAnthropicClient(), {
    mediaType: plik.type,
    daneBase64: Buffer.from(await plik.arrayBuffer()).toString("base64"),
    podpowiedz: String(forma.get("podpowiedz") ?? ""),
    jezyk: String(forma.get("jezyk") ?? ""),
  })
  return wynik.ok ? NextResponse.json(wynik) : blad(wynik.bladKey)
}

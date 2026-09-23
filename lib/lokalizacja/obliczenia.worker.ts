/**
 * Web Worker Modułu 1 — Ekran 3 (zacienienie: ~0,15 s na punkt, mapa cieplna to dziesiątki
 * punktów) i Ekran 4 (przeszukiwanie orientacji na 8760 h: ~2,5 s) liczone poza wątkiem UI
 * (rejestr-decyzji.md D22). Worker tylko woła czyste kalkulatory z `lib/core` — zero własnej logiki.
 */
import { calculateAnalizaZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import { calculateOrientacjaPowierzchni } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import type { ZadanieWorkera, WiadomoscWorkera } from "./obliczenia-typy"

// tsconfig ma typy DOM (window.postMessage wymaga targetOrigin), nie WebWorker — jawny typ zakresu workera.
const zakres = self as unknown as { postMessage(w: WiadomoscWorkera): void }
const wyslij = (w: WiadomoscWorkera) => zakres.postMessage(w)

addEventListener("message", (e: MessageEvent<ZadanieWorkera>) => {
  const z = e.data
  if (z.typ === "zacienienie") {
    const wyniki = z.wejscia.map((wejscie, i) => {
      const w = calculateAnalizaZacienienia(wejscie)
      wyslij({ id: z.id, typ: "postep", gotowe: i + 1, wszystkie: z.wejscia.length })
      return w
    })
    wyslij({ id: z.id, typ: "zacienienie", wyniki })
  } else {
    wyslij({ id: z.id, typ: "orientacja", wynik: calculateOrientacjaPowierzchni(z.wejscie) })
  }
})

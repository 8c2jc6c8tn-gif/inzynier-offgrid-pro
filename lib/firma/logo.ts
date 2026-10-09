/**
 * Logo upload for printouts: the picture is read in the browser, scaled down to fit the box below and re-encoded as a PNG data URL
 * (a few tens of kB), so it can live in the autosaved draft and prints sharply without storing the original file.
 */
export const LOGO_MAKS_SZEROKOSC_PX = 480
export const LOGO_MAKS_WYSOKOSC_PX = 240
/** Source files above this size are refused before decoding (a phone photo is not a logo). */
export const LOGO_MAKS_PLIK_BAJTOW = 3 * 1024 * 1024
export const LOGO_TYPY = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"] as const

export type BladLogo = "typ" | "rozmiar" | "odczyt"

/** Size that fits the box with the aspect ratio kept; never enlarges a small logo. */
export function wymiaryLogo(szer: number, wys: number, maksSzer = LOGO_MAKS_SZEROKOSC_PX, maksWys = LOGO_MAKS_WYSOKOSC_PX): { szer: number; wys: number } {
  if (!(szer > 0) || !(wys > 0)) return { szer: 0, wys: 0 }
  const skala = Math.min(1, maksSzer / szer, maksWys / wys)
  return { szer: Math.max(1, Math.round(szer * skala)), wys: Math.max(1, Math.round(wys * skala)) }
}

/** Rejects a file by type or size without reading it; `null` = acceptable. */
export function sprawdzPlikLogo(plik: { type: string; size: number }): BladLogo | null {
  if (!(LOGO_TYPY as readonly string[]).includes(plik.type)) return "typ"
  return plik.size > LOGO_MAKS_PLIK_BAJTOW ? "rozmiar" : null
}

function wczytajObraz(plik: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(plik)
    const obraz = new Image()
    obraz.onload = () => {
      URL.revokeObjectURL(url)
      resolve(obraz)
    }
    obraz.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("odczyt"))
    }
    obraz.src = url
  })
}

/** Browser only. Resolves with the PNG data URL; rejects with a `BladLogo` code. */
export async function przygotujLogo(plik: File): Promise<string> {
  const blad = sprawdzPlikLogo(plik)
  if (blad) throw new Error(blad)
  const obraz = await wczytajObraz(plik).catch(() => {
    throw new Error("odczyt")
  })
  // An SVG without width/height decodes to 0×0 in some browsers; the fallback box keeps it drawable.
  const { szer, wys } = wymiaryLogo(obraz.naturalWidth || LOGO_MAKS_SZEROKOSC_PX, obraz.naturalHeight || LOGO_MAKS_WYSOKOSC_PX)
  const plotno = document.createElement("canvas")
  plotno.width = szer
  plotno.height = wys
  const kontekst = plotno.getContext("2d")
  if (!kontekst) throw new Error("odczyt")
  kontekst.drawImage(obraz, 0, 0, szer, wys)
  return plotno.toDataURL("image/png")
}

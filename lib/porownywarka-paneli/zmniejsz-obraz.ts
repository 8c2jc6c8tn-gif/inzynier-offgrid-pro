/**
 * Zdjęcie z telefonu bywa większe niż limit odczytu karty (spec 33). Przed wysłaniem zmniejszamy je w przeglądarce do rozmiaru,
 * przy którym cyfry na naklejce nadal są czytelne; jeśli coś pójdzie nie tak, wysyłamy oryginał (a serwer sam odrzuci za duży plik).
 */

/** Dłuższy bok po zmniejszeniu [px] — nadal czytelne cyfry z naklejki i tabeli karty, ok. 0,5–1 MB w JPEG. */
export const MAKS_BOK_PX = 2400
/** Pliki mniejsze niż ten próg wysyłamy bez zmian. */
export const PROG_ZMNIEJSZANIA_BAJTOW = 1.5 * 1024 * 1024

export function wymiaryPoZmniejszeniu(szerokosc: number, wysokosc: number, maksBok: number = MAKS_BOK_PX): { szerokosc: number; wysokosc: number } {
  const dluzszy = Math.max(szerokosc, wysokosc)
  if (dluzszy <= maksBok) return { szerokosc, wysokosc }
  const skala = maksBok / dluzszy
  return { szerokosc: Math.round(szerokosc * skala), wysokosc: Math.round(wysokosc * skala) }
}

/** Zmniejsza obraz (nie PDF) większy niż próg; przy każdym błędzie zwraca oryginał. */
export async function zmniejszObrazJesliTrzeba(plik: File): Promise<File> {
  if (!plik.type.startsWith("image/") || plik.type === "image/gif" || plik.size <= PROG_ZMNIEJSZANIA_BAJTOW) return plik
  try {
    const bitmapa = await createImageBitmap(plik)
    const { szerokosc, wysokosc } = wymiaryPoZmniejszeniu(bitmapa.width, bitmapa.height)
    const plotno = document.createElement("canvas")
    plotno.width = szerokosc
    plotno.height = wysokosc
    const ctx = plotno.getContext("2d")
    if (!ctx) return plik
    ctx.drawImage(bitmapa, 0, 0, szerokosc, wysokosc)
    bitmapa.close()
    const blob = await new Promise<Blob | null>((resolve) => plotno.toBlob(resolve, "image/jpeg", 0.9))
    if (!blob || blob.size >= plik.size) return plik
    return new File([blob], plik.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" })
  } catch {
    return plik
  }
}

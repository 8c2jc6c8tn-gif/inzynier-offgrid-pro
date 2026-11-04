/**
 * Minimal EXIF reader for JPEG (no dependencies, runs offline in the browser): picks only what the
 * horizon needs — time, GPS position and the focal length. Anything missing or malformed is simply
 * absent from the result; the reader never throws on bad input.
 */
import type { CzasLokalnyZdjecia } from "./czas"

export type ExifZdjecia = {
  czasLokalny?: CzasLokalnyZdjecia
  /** UTC offset of the local time from OffsetTimeOriginal [min]; absent on older cameras. */
  przesuniecieMin?: number
  ogniskowa35mmMm?: number
  ogniskowaMm?: number
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
}

const TAG_EXIF_IFD = 0x8769
const TAG_GPS_IFD = 0x8825
const TAG_DATA_CZAS_ORYGINAL = 0x9003
const TAG_PRZESUNIECIE_ORYGINAL = 0x9011
const TAG_OGNISKOWA = 0x920a
const TAG_OGNISKOWA_35MM = 0xa405
const TAG_GPS_SZEROKOSC_REF = 1
const TAG_GPS_SZEROKOSC = 2
const TAG_GPS_DLUGOSC_REF = 3
const TAG_GPS_DLUGOSC = 4

const TYP_ASCII = 2
const TYP_SHORT = 3
const TYP_LONG = 4
const TYP_RATIONAL = 5
const TYP_SRATIONAL = 10
const ROZMIAR_TYPU: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

type Wpis = { typ: number; liczba: number; offsetWartosci: number }

function odczytajTiff(dv: DataView, start: number): ExifZdjecia {
  if (start + 8 > dv.byteLength) return {}
  const little = dv.getUint16(start) === 0x4949
  if (!little && dv.getUint16(start) !== 0x4d4d) return {}
  if (dv.getUint16(start + 2, little) !== 42) return {}

  const wInternalnym = (o: number, n: number) => o >= 0 && o + n <= dv.byteLength
  function wpisy(ifdOffset: number): Map<number, Wpis> {
    const mapa = new Map<number, Wpis>()
    const abs = start + ifdOffset
    if (!wInternalnym(abs, 2)) return mapa
    const n = dv.getUint16(abs, little)
    for (let i = 0; i < n; i++) {
      const e = abs + 2 + i * 12
      if (!wInternalnym(e, 12)) break
      const typ = dv.getUint16(e + 2, little)
      const liczba = dv.getUint32(e + 4, little)
      const rozmiar = (ROZMIAR_TYPU[typ] ?? 0) * liczba
      const offsetWartosci = rozmiar <= 4 ? e + 8 : start + dv.getUint32(e + 8, little)
      if (rozmiar > 0 && wInternalnym(offsetWartosci, rozmiar)) mapa.set(dv.getUint16(e, little), { typ, liczba, offsetWartosci })
    }
    return mapa
  }
  const liczbaWpisu = (w: Wpis | undefined, indeks = 0): number | undefined => {
    if (!w || indeks >= w.liczba) return undefined
    const o = w.offsetWartosci
    switch (w.typ) {
      case TYP_SHORT: return dv.getUint16(o + indeks * 2, little)
      case TYP_LONG: return dv.getUint32(o + indeks * 4, little)
      case TYP_RATIONAL: {
        const mianownik = dv.getUint32(o + indeks * 8 + 4, little)
        return mianownik === 0 ? undefined : dv.getUint32(o + indeks * 8, little) / mianownik
      }
      case TYP_SRATIONAL: {
        const mianownik = dv.getInt32(o + indeks * 8 + 4, little)
        return mianownik === 0 ? undefined : dv.getInt32(o + indeks * 8, little) / mianownik
      }
      default: return undefined
    }
  }
  const tekst = (w: Wpis | undefined): string | undefined => {
    if (!w || w.typ !== TYP_ASCII) return undefined
    let s = ""
    for (let i = 0; i < w.liczba; i++) {
      const c = dv.getUint8(w.offsetWartosci + i)
      if (c === 0) break
      s += String.fromCharCode(c)
    }
    return s
  }

  const wynik: ExifZdjecia = {}
  const ifd0 = wpisy(dv.getUint32(start + 4, little))

  const exifOffset = liczbaWpisu(ifd0.get(TAG_EXIF_IFD))
  if (exifOffset !== undefined) {
    const exif = wpisy(exifOffset)
    const data = tekst(exif.get(TAG_DATA_CZAS_ORYGINAL))?.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
    if (data) {
      const [rok, miesiac, dzien, godzina, minuta, sekunda] = data.slice(1).map(Number) as [number, number, number, number, number, number]
      wynik.czasLokalny = { rok, miesiac, dzien, godzina, minuta, sekunda }
    }
    const przesuniecie = tekst(exif.get(TAG_PRZESUNIECIE_ORYGINAL))?.match(/^([+-])(\d{2}):(\d{2})/)
    if (przesuniecie) wynik.przesuniecieMin = (przesuniecie[1] === "-" ? -1 : 1) * (Number(przesuniecie[2]) * 60 + Number(przesuniecie[3]))
    const f = liczbaWpisu(exif.get(TAG_OGNISKOWA))
    if (f !== undefined && f > 0) wynik.ogniskowaMm = f
    const f35 = liczbaWpisu(exif.get(TAG_OGNISKOWA_35MM))
    if (f35 !== undefined && f35 > 0) wynik.ogniskowa35mmMm = f35
  }

  const gpsOffset = liczbaWpisu(ifd0.get(TAG_GPS_IFD))
  if (gpsOffset !== undefined) {
    const gps = wpisy(gpsOffset)
    const wspolrzedna = (tag: number, refTag: number, ujemne: string): number | undefined => {
      const w = gps.get(tag)
      const ref = tekst(gps.get(refTag))
      const st = liczbaWpisu(w, 0)
      const min = liczbaWpisu(w, 1)
      const sek = liczbaWpisu(w, 2)
      if (st === undefined || min === undefined || sek === undefined) return undefined
      const wartosc = st + min / 60 + sek / 3600
      return ref?.startsWith(ujemne) ? -wartosc : wartosc
    }
    const lat = wspolrzedna(TAG_GPS_SZEROKOSC, TAG_GPS_SZEROKOSC_REF, "S")
    const lon = wspolrzedna(TAG_GPS_DLUGOSC, TAG_GPS_DLUGOSC_REF, "W")
    if (lat !== undefined && lon !== undefined && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      wynik.szerokoscGeograficzna = lat
      wynik.dlugoscGeograficzna = lon
    }
  }
  return wynik
}

/** Reads the EXIF block of a JPEG file; `{}` for anything that is not a JPEG with EXIF. */
export function odczytajExif(bufor: ArrayBuffer): ExifZdjecia {
  try {
    const dv = new DataView(bufor)
    if (dv.byteLength < 4 || dv.getUint16(0) !== 0xffd8) return {}
    let o = 2
    while (o + 4 <= dv.byteLength) {
      if (dv.getUint8(o) !== 0xff) return {}
      const marker = dv.getUint8(o + 1)
      if (marker === 0xda || marker === 0xd9) return {}
      const dlugosc = dv.getUint16(o + 2)
      if (marker === 0xe1 && o + 10 <= dv.byteLength && dv.getUint32(o + 4) === 0x45786966 && dv.getUint16(o + 8) === 0) {
        return odczytajTiff(dv, o + 10)
      }
      o += 2 + dlugosc
    }
  } catch {
    return {}
  }
  return {}
}

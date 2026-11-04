/**
 * "Horizon from a photo" (stage 2 of docs/tor-slonca-ar-ocena.md): a photo taken with a phone becomes
 * a horizon profile — the elevation angle of the skyline for every azimuth (1° steps). Pixel
 * coordinates: x to the right, y downwards, origin in the top-left corner of the decoded image.
 */

export type PunktPiksela = { x: number; y: number }

export type HoryzontZeZdjeciaInput = {
  szerokoscPx: number | null
  wysokoscPx: number | null
  /** Horizontal field of view [°]; takes precedence over the focal length. */
  hfovDeg: number | null
  /** 35 mm-equivalent focal length from EXIF [mm] (diagonal definition). */
  ogniskowa35mmMm: number | null
  /** Where the photo was taken (decimal degrees) — for the sun position. */
  szerokoscGeograficzna: number | null
  dlugoscGeograficzna: number | null
  /** Moment of the photo [ms since the Unix epoch, UTC]. */
  czasUtcMs: number | null
  /** Where the user clicked the centre of the sun disc — calibrates both direction and tilt. */
  slonce: PunktPiksela | null
  /** Alternative to the sun click: azimuth of the image centre (compass) and camera tilt (up +). */
  orientacjaReczna: { azymutSrodkaDeg: number; nachylenieKameryDeg: number } | null
  /**
   * Skyline as polylines in pixels (from automatic detection or drawn by hand). Several polylines
   * mean "not connected": the stretch between them is not bridged (no data is invented there).
   */
  liniaHoryzontu: PunktPiksela[][]
}

export const PUSTE_WEJSCIE: HoryzontZeZdjeciaInput = {
  szerokoscPx: null,
  wysokoscPx: null,
  hfovDeg: null,
  ogniskowa35mmMm: null,
  szerokoscGeograficzna: null,
  dlugoscGeograficzna: null,
  czasUtcMs: null,
  slonce: null,
  orientacjaReczna: null,
  liniaHoryzontu: [],
}

import { describe, expect, it } from "vitest"
import { pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { calculateHoryzontZeZdjecia } from "../calculator"
import { czasUtcZLokalnego } from "../czas"
import { odczytajExif } from "../exif"
import { PUSTE_WEJSCIE, type HoryzontZeZdjeciaInput } from "../input"
import { hfovDeg, kalibrujPoSlonca, kierunekPiksela, ogniskowaZ35mm, ogniskowaZHfov, type Kamera } from "../kamera"
import { czyNiebo, wykryjLinieHoryzontu } from "../niebo"
import { pokrycieProc, profilZLinii, PUSTY_PROFIL, scalProfil, wysokoscHoryzontuDeg } from "../profil"

const W = 4000
const H = 3000
const F = ogniskowaZHfov(W, 70)
const kamera = (az: number, nach: number): Kamera => ({ szerokoscPx: W, wysokoscPx: H, ogniskowaPx: F, azymutSrodkaDeg: az, nachylenieDeg: nach })

describe("camera geometry", () => {
  it("the centre pixel looks along the camera axis", () => {
    const k = kierunekPiksela(kamera(200, 15), W / 2, H / 2)
    expect(k.azymutDeg).toBeCloseTo(200, 6)
    expect(k.wysokoscDeg).toBeCloseTo(15, 6)
  })

  it("the right edge at zero tilt is hfov/2 to the right of the axis", () => {
    const k = kierunekPiksela(kamera(180, 0), W, H / 2)
    expect(k.azymutDeg).toBeCloseTo(180 + 35, 6)
    expect(k.wysokoscDeg).toBeCloseTo(0, 6)
  })

  it("horizontal FOV round-trips through the focal length", () => {
    expect(hfovDeg(W, ogniskowaZHfov(W, 70))).toBeCloseTo(70, 9)
  })

  it("35 mm-equivalent focal length 26 mm on a 4:3 sensor gives about 69° horizontally", () => {
    // diagonal FOV of 26 mm equivalent = 2·atan(43.27/2/26) ≈ 79.5°; the 4:3 width is 0.8 of the diagonal
    const hfov = hfovDeg(W, ogniskowaZ35mm(W, H, 26))
    expect(hfov).toBeGreaterThan(66)
    expect(hfov).toBeLessThan(71)
  })

  it("sun calibration reproduces the sun direction at the clicked pixel", () => {
    const sun = { azymutDeg: 215, wysokoscDeg: 32 }
    const x = 2600
    const y = 900
    const c = kalibrujPoSlonca(W, H, F, x, y, sun)!
    const k = kierunekPiksela({ szerokoscPx: W, wysokoscPx: H, ogniskowaPx: F, ...c }, x, y)
    expect(k.azymutDeg).toBeCloseTo(215, 6)
    expect(k.wysokoscDeg).toBeCloseTo(32, 6)
  })

  it("sun at the image centre gives yaw = sun azimuth and tilt = sun elevation", () => {
    const c = kalibrujPoSlonca(W, H, F, W / 2, H / 2, { azymutDeg: 140, wysokoscDeg: 25 })!
    expect(c.azymutSrodkaDeg).toBeCloseTo(140, 6)
    expect(c.nachylenieDeg).toBeCloseTo(25, 6)
  })

  it("calibration works for sun clicked below the centre (camera tilted up more than the sun)", () => {
    const c = kalibrujPoSlonca(W, H, F, W / 2, H * 0.8, { azymutDeg: 90, wysokoscDeg: 10 })!
    expect(c.nachylenieDeg).toBeGreaterThan(10)
  })
})

describe("horizon profile", () => {
  it("a flat skyline through the image centre at zero tilt gives a 0° horizon over the covered azimuths", () => {
    const profil = profilZLinii(kamera(180, 0), [[{ x: 0, y: H / 2 }, { x: W, y: H / 2 }]])
    expect(profil[180]).toBeCloseTo(0, 6)
    expect(profil[150]).toBeCloseTo(0, 6)
    expect(profil[0]).toBeNull()
    expect(pokrycieProc(profil)).toBeGreaterThan(15)
    expect(pokrycieProc(profil)).toBeLessThan(25)
  })

  it("a skyline above the centre gives a positive elevation, equal to the geometry", () => {
    const y = H / 2 - F * Math.tan((10 * Math.PI) / 180)
    const profil = profilZLinii(kamera(180, 0), [[{ x: W / 2 - 10, y }, { x: W / 2 + 10, y }]])
    expect(profil[180]).toBeGreaterThan(9.5)
    expect(profil[180]).toBeLessThan(10.01)
  })

  it("keeps the highest skyline of a bin and never produces negative angles", () => {
    const profil = profilZLinii(kamera(180, -20), [[{ x: 0, y: H }, { x: W, y: H }]])
    expect(profil.every((v) => v === null || v >= 0)).toBe(true)
  })

  it("does not bridge the stretch between two separate polylines", () => {
    const profil = profilZLinii(kamera(180, 0), [
      [{ x: 0, y: H / 2 }, { x: 100, y: H / 2 }],
      [{ x: 3000, y: H / 2 }, { x: 3100, y: H / 2 }],
    ])
    expect(profil[180]).toBeNull()
    expect(profil[146]).not.toBeNull()
  })

  it("merging replaces only the covered bins", () => {
    const baza = PUSTY_PROFIL.map((_, i) => (i < 10 ? 5 : null))
    const nowy = PUSTY_PROFIL.map((_, i) => (i === 3 || i === 200 ? 12 : null))
    const m = scalProfil(baza, nowy)
    expect(m[3]).toBe(12)
    expect(m[4]).toBe(5)
    expect(m[200]).toBe(12)
    expect(m[100]).toBeNull()
  })

  it("interpolates between whole degrees and returns null where unknown", () => {
    const p = PUSTY_PROFIL.map((_, i) => (i === 10 ? 4 : i === 11 ? 8 : null))
    expect(wysokoscHoryzontuDeg(p, 10.5)).toBeCloseTo(6, 9)
    expect(wysokoscHoryzontuDeg(p, 50)).toBeNull()
  })
})

describe("sky detection", () => {
  function obraz(w: number, h: number, liniaY: (x: number) => number): Uint8ClampedArray {
    const d = new Uint8ClampedArray(w * h * 4)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4
        const niebo = y < liniaY(x)
        d[i] = niebo ? 90 : 30
        d[i + 1] = niebo ? 140 : 70
        d[i + 2] = niebo ? 230 : 25
        d[i + 3] = 255
      }
    }
    return d
  }

  it("classifies blue and bright grey as sky, dark green and brown as not", () => {
    expect(czyNiebo(90, 140, 230)).toBe(true)
    expect(czyNiebo(210, 210, 215)).toBe(true)
    expect(czyNiebo(30, 70, 25)).toBe(false)
    expect(czyNiebo(90, 60, 40)).toBe(false)
  })

  it("finds a flat skyline", () => {
    const l = wykryjLinieHoryzontu(obraz(800, 600, () => 250), 800, 600)
    const punkty = l.linie.flat()
    expect(l.linie.length).toBe(1)
    expect(punkty.length).toBeGreaterThan(100)
    for (const p of punkty) expect(Math.abs(p.y - 250)).toBeLessThanOrEqual(1)
    expect(l.kolumnPrzyGorzeKadru).toBe(0)
  })

  it("follows a sloping skyline", () => {
    const l = wykryjLinieHoryzontu(obraz(800, 600, (x) => 400 - x / 4), 800, 600)
    const punkty = l.linie.flat()
    const pierwszy = punkty[0]!
    const ostatni = punkty[punkty.length - 1]!
    expect(pierwszy.y).toBeGreaterThan(380)
    expect(ostatni.y).toBeLessThan(220)
  })

  it("ignores a thin wire (a short run of non-sky pixels)", () => {
    const d = obraz(800, 600, () => 400)
    for (let x = 0; x < 800; x++) {
      for (let y = 100; y < 102; y++) {
        const i = (y * 800 + x) * 4
        d[i] = 20
        d[i + 1] = 20
        d[i + 2] = 20
      }
    }
    const l = wykryjLinieHoryzontu(d, 800, 600)
    for (const p of l.linie.flat()) expect(p.y).toBeGreaterThan(390)
  })

  it("counts columns covered up to the top edge and columns of pure sky", () => {
    const g = wykryjLinieHoryzontu(obraz(400, 300, () => 0), 400, 300)
    expect(g.kolumnPrzyGorzeKadru).toBeGreaterThan(0)
    const n = wykryjLinieHoryzontu(obraz(400, 300, () => 300), 400, 300)
    expect(n.linie.length).toBe(0)
    expect(n.kolumnSameNiebo).toBeGreaterThan(0)
  })
})

describe("photo time", () => {
  it("uses the EXIF offset when present", () => {
    const t = czasUtcZLokalnego({ rok: 2026, miesiac: 6, dzien: 21, godzina: 14, minuta: 0, sekunda: 0 }, 120)
    expect(new Date(t.utcMs).toISOString()).toBe("2026-06-21T12:00:00.000Z")
    expect(t.zalozonoCzasPolski).toBe(false)
  })

  it("assumes Polish time otherwise: UTC+2 in summer, UTC+1 in winter", () => {
    const lato = czasUtcZLokalnego({ rok: 2026, miesiac: 6, dzien: 21, godzina: 14, minuta: 0, sekunda: 0 }, null)
    expect(new Date(lato.utcMs).toISOString()).toBe("2026-06-21T12:00:00.000Z")
    expect(lato.zalozonoCzasPolski).toBe(true)
    const zima = czasUtcZLokalnego({ rok: 2026, miesiac: 12, dzien: 21, godzina: 14, minuta: 0, sekunda: 0 }, null)
    expect(new Date(zima.utcMs).toISOString()).toBe("2026-12-21T13:00:00.000Z")
  })
})

describe("EXIF reader", () => {
  /** Builds a minimal little-endian JPEG with an Exif APP1 block: DateTimeOriginal, offset, focal length and GPS. */
  function jpegZExif(): ArrayBuffer {
    const bajty: number[] = []
    const u16 = (v: number) => bajty.push(v & 255, (v >> 8) & 255)
    const u32 = (v: number) => bajty.push(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >> 24) & 255)
    // TIFF layout is assembled with absolute offsets computed up front.
    const data = "2026:06:21 14:05:09\0"
    const offs = "+02:00\0"
    const refN = "N\0"
    const refE = "E\0"
    // IFD0: 2 entries (ExifIFD pointer, GPS pointer) at offset 8
    const ifd0 = 8
    const exifIfd = ifd0 + 2 + 2 * 12 + 4 // 38
    const exifEntries = 4
    const gpsIfd = exifIfd + 2 + exifEntries * 12 + 4 // 92
    const gpsEntries = 4
    const dane = gpsIfd + 2 + gpsEntries * 12 + 4 // 146
    const oData = dane
    const oLat = oData + data.length
    const oLon = oLat + 24
    const oOffs = oLon + 24
    const oFocal = oOffs + offs.length
    const tiff: number[] = []
    const znaki = (t: string) => [...t].map((c) => c.charCodeAt(0))
    bajty.length = 0
    bajty.push(0x49, 0x49)
    u16(42)
    u32(8)
    u16(2)
    u16(0x8769); u16(4); u32(1); u32(exifIfd)
    u16(0x8825); u16(4); u32(1); u32(gpsIfd)
    u32(0)
    u16(exifEntries)
    u16(0x9003); u16(2); u32(data.length); u32(oData)
    u16(0x9011); u16(2); u32(offs.length); u32(oOffs)
    u16(0x920a); u16(5); u32(1); u32(oFocal)
    u16(0xa405); u16(3); u32(1); u16(26); u16(0)
    u32(0)
    u16(gpsEntries)
    u16(1); u16(2); u32(2); bajty.push(...znaki(refN), 0, 0)
    u16(2); u16(5); u32(3); u32(oLat)
    u16(3); u16(2); u32(2); bajty.push(...znaki(refE), 0, 0)
    u16(4); u16(5); u32(3); u32(oLon)
    u32(0)
    bajty.push(...znaki(data))
    for (const [x, y] of [[52, 1], [13, 1], [30, 1]]) { u32(x!); u32(y!) }
    for (const [x, y] of [[21, 1], [0, 1], [36, 1]]) { u32(x!); u32(y!) }
    bajty.push(...znaki(offs))
    u32(60); u32(10)
    tiff.push(...bajty)
    const lenApp1 = 2 + 6 + tiff.length
    const wszystko = [0xff, 0xd8, 0xff, 0xe1, (lenApp1 >> 8) & 255, lenApp1 & 255, 0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff, 0xff, 0xd9]
    return new Uint8Array(wszystko).buffer
  }

  it("reads time, offset, focal lengths and GPS", () => {
    const e = odczytajExif(jpegZExif())
    expect(e.czasLokalny).toEqual({ rok: 2026, miesiac: 6, dzien: 21, godzina: 14, minuta: 5, sekunda: 9 })
    expect(e.przesuniecieMin).toBe(120)
    expect(e.ogniskowa35mmMm).toBe(26)
    expect(e.ogniskowaMm).toBe(6)
    expect(e.szerokoscGeograficzna).toBeCloseTo(52 + 13 / 60 + 30 / 3600, 9)
    expect(e.dlugoscGeograficzna).toBeCloseTo(21 + 36 / 3600, 9)
  })

  it("returns an empty object for non-JPEG and truncated data", () => {
    expect(odczytajExif(new Uint8Array([1, 2, 3, 4, 5]).buffer)).toEqual({})
    expect(odczytajExif(jpegZExif().slice(0, 40))).toBeDefined()
    expect(odczytajExif(new ArrayBuffer(0))).toEqual({})
  })
})

describe("calculateHoryzontZeZdjecia", () => {
  const lat = 52.2
  const lon = 21
  const czas = Date.UTC(2026, 5, 21, 17, 0, 0) // evening, sun in the west at about 20° elevation
  const sun = pozycjaSlonca(lat, lon, czas)
  /** The real camera looks 10° to the right of the sun and 8° below it, so the sun is inside the frame. */
  const AZ0 = (sun.azymutDeg - 10 + 360) % 360
  const NACH0 = sun.wysokoscDeg - 8
  const prawdziwa = kamera(AZ0, NACH0)
  function pikselSlonca(): { x: number; y: number } {
    // brute-force search over the pixel grid for the ray closest to the sun
    let najlepszy = { x: 0, y: 0, d: Infinity }
    for (let x = 0; x < W; x += 4) {
      for (let y = 0; y < H; y += 4) {
        const k = kierunekPiksela(prawdziwa, x, y)
        const d = Math.hypot(k.azymutDeg - sun.azymutDeg, k.wysokoscDeg - sun.wysokoscDeg)
        if (d < najlepszy.d) najlepszy = { x, y, d }
      }
    }
    return najlepszy
  }
  const baza: HoryzontZeZdjeciaInput = {
    ...PUSTE_WEJSCIE,
    szerokoscPx: W,
    wysokoscPx: H,
    hfovDeg: 70,
    szerokoscGeograficzna: lat,
    dlugoscGeograficzna: lon,
    czasUtcMs: czas,
    liniaHoryzontu: [[{ x: 0, y: 2000 }, { x: W, y: 2000 }]],
  }

  it("is INCOMPLETE without calibration, FOV or a skyline", () => {
    expect(calculateHoryzontZeZdjecia(baza).status).toBe("INCOMPLETE")
    expect(calculateHoryzontZeZdjecia({ ...baza, hfovDeg: null, slonce: { x: 10, y: 10 } }).status).toBe("INCOMPLETE")
    expect(calculateHoryzontZeZdjecia({ ...baza, slonce: { x: 10, y: 10 }, liniaHoryzontu: [[]] }).status).toBe("INCOMPLETE")
  })

  it("recovers the true skyline when the camera is calibrated by the sun click", () => {
    const s = pikselSlonca()
    // A tree line 6° high, as seen by the true camera, drawn as pixels.
    const yDrzew = (x: number) => {
      // pixel row where the ray of column x has elevation 6° (search along y)
      let a = 0
      let b = H
      for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2
        if (kierunekPiksela(prawdziwa, x, m).wysokoscDeg > 6) a = m
        else b = m
      }
      return (a + b) / 2
    }
    const linia = [Array.from({ length: 41 }, (_, i) => ({ x: i * 100, y: yDrzew(i * 100) }))]
    const r = calculateHoryzontZeZdjecia({ ...baza, slonce: { x: s.x, y: s.y }, liniaHoryzontu: linia })
    expect(r.status === "VALID" || r.status === "VALID_WITH_WARNINGS").toBe(true)
    const v = r.value!
    expect(Math.abs(v.kamera.azymutSrodkaDeg - AZ0)).toBeLessThan(0.3)
    expect(Math.abs(v.kamera.nachylenieDeg - NACH0)).toBeLessThan(0.3)
    const w = wysokoscHoryzontuDeg(v.profilDeg, AZ0)!
    expect(w).toBeGreaterThan(5.6)
    expect(w).toBeLessThan(6.4)
    expect(v.maksWysokoscDeg).toBeLessThan(7)
    expect(r.assumptions.some((a) => typeof a !== "string" && a.kod === "HORZ-ZAL-KALIBRACJA-SLONCE")).toBe(true)
  })

  it("error budget: a 15 px miss of the sun click moves the calibration by less than 0.5°", () => {
    const s = pikselSlonca()
    const r = calculateHoryzontZeZdjecia({ ...baza, slonce: { x: s.x + 15, y: s.y - 15 } })
    const k = r.value!.kamera
    const dAz = Math.min(Math.abs(k.azymutSrodkaDeg - AZ0), 360 - Math.abs(k.azymutSrodkaDeg - AZ0))
    expect(dAz).toBeLessThan(0.5)
    expect(Math.abs(k.nachylenieDeg - NACH0)).toBeLessThan(0.5)
  })

  it("error budget: a wrong photo clock (10 min) shifts the calibration by the sun's motion (azimuth ≈ 2–3°, tilt < 2°)", () => {
    // The photo was really taken at `czas`, but the camera clock said 10 minutes later: the sun is
    // assumed further along its path, so the calibration is off by about the sun's motion in 10 min
    // (≈ 2.5° of azimuth and ≈ 1.4° of elevation at this latitude, evening). This documents why the screen shows the photo time.
    const s = pikselSlonca()
    const r = calculateHoryzontZeZdjecia({ ...baza, czasUtcMs: czas + 10 * 60_000, slonce: { x: s.x, y: s.y } })
    const k = r.value!.kamera
    const dAz = Math.min(Math.abs(k.azymutSrodkaDeg - AZ0), 360 - Math.abs(k.azymutSrodkaDeg - AZ0))
    expect(dAz).toBeGreaterThan(1.5)
    expect(dAz).toBeLessThan(3.5)
    expect(Math.abs(k.nachylenieDeg - NACH0)).toBeLessThan(2)
  })

  it("manual orientation needs no sun", () => {
    const r = calculateHoryzontZeZdjecia({ ...baza, orientacjaReczna: { azymutSrodkaDeg: 180, nachylenieKameryDeg: 0 } })
    expect(r.value?.slonce).toBeNull()
    expect(r.value?.pokrycieAzymutuProc).toBeGreaterThan(15)
  })

  it("rejects the sun below the horizon at the photo time", () => {
    const r = calculateHoryzontZeZdjecia({ ...baza, czasUtcMs: Date.UTC(2026, 5, 21, 0, 0), slonce: { x: 100, y: 100 } })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]?.code).toBe("HORZ-SLONCE-POD-HORYZONTEM")
  })

  it("rejects a sun click outside the photo and values out of range", () => {
    expect(calculateHoryzontZeZdjecia({ ...baza, slonce: { x: -5, y: 10 } }).warnings[0]?.code).toBe("HORZ-SLONCE-POZA-KADREM")
    expect(calculateHoryzontZeZdjecia({ ...baza, hfovDeg: 5 }).warnings[0]?.code).toBe("HORZ-FOV-POZA-ZAKRESEM")
    expect(calculateHoryzontZeZdjecia({ ...baza, szerokoscGeograficzna: 99 }).warnings[0]?.code).toBe("HORZ-SZEROKOSC-POZA-ZAKRESEM")
    expect(calculateHoryzontZeZdjecia({ ...baza, orientacjaReczna: { azymutSrodkaDeg: 400, nachylenieKameryDeg: 0 } }).warnings[0]?.code).toBe("HORZ-AZYMUT-POZA-ZAKRESEM")
  })

  it("warns about a wide-angle lens, a strong tilt and obstacles reaching the top edge", () => {
    const r = calculateHoryzontZeZdjecia(
      { ...baza, hfovDeg: 110, orientacjaReczna: { azymutSrodkaDeg: 180, nachylenieKameryDeg: 60 } },
      12,
    )
    const kody = r.warnings.map((x) => x.code)
    expect(kody).toContain("HORZ-SZEROKI-KAT")
    expect(kody).toContain("HORZ-DUZE-NACHYLENIE")
    expect(kody).toContain("HORZ-ZASLONIETE-PRZY-GORZE")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("uses the 35 mm focal length when no FOV is given", () => {
    const r = calculateHoryzontZeZdjecia({ ...baza, hfovDeg: null, ogniskowa35mmMm: 26, orientacjaReczna: { azymutSrodkaDeg: 180, nachylenieKameryDeg: 0 } })
    expect(r.value?.kamera.hfovDeg).toBeGreaterThan(66)
    expect(r.value?.kamera.hfovDeg).toBeLessThan(71)
  })
})

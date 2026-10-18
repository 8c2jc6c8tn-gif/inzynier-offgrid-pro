import { describe, expect, it } from "vitest"
import { cpeDachuDlaPaneluRownoleglego } from "../wiatr-dachy"

describe("cpe of roofs for panels parallel to the pitch (Tables 7.3a/b, 7.4a/b, checked against the scan 18.10.2026)", () => {
  it("mono-pitch 15°: edge suction is the worst of 7.3a/b (Fup −2.9, F θ180 −2.8), pressure +0.2", () => {
    const r = cpeDachuDlaPaneluRownoleglego("jednospadowy", 15)!
    expect(r.odrywanieKrawedz).toBeCloseTo(2.9, 10)
    expect(r.dociskKrawedz).toBeCloseTo(0.2, 10)
    // Central fields H (θ0/180: −1.2) and H, I (θ90: −1.2): worst −1.2
    expect(r.odrywanieSrodek).toBeCloseTo(1.2, 10)
    expect(r.dociskSrodek).toBeCloseTo(0.2, 10)
  })

  it("mono-pitch 30°: pressure +0.7 (F, G θ0), suction Fup −2.9", () => {
    const r = cpeDachuDlaPaneluRownoleglego("jednospadowy", 30)!
    expect(r.dociskKrawedz).toBeCloseTo(0.7, 10)
    expect(r.dociskSrodek).toBeCloseTo(0.4, 10)
    expect(r.odrywanieKrawedz).toBeCloseTo(2.9, 10)
  })

  it("duo-pitch 15°: suction J −1.5 and F −2.0 (θ0), F −2.0 (θ90); central H, I −1.2", () => {
    const r = cpeDachuDlaPaneluRownoleglego("dwuspadowy", 15)!
    expect(r.odrywanieKrawedz).toBeCloseTo(2.0, 10)
    expect(r.odrywanieSrodek).toBeCloseTo(1.2, 10)
    expect(r.dociskKrawedz).toBeCloseTo(0.2, 10)
  })

  it("duo-pitch 5° reads J pressure +0.2 and the F/G/H zeros from the scan", () => {
    const r = cpeDachuDlaPaneluRownoleglego("dwuspadowy", 5)!
    expect(r.dociskKrawedz).toBeCloseTo(0.2, 10)
    expect(r.dociskSrodek).toBe(0)
    expect(r.odrywanieKrawedz).toBeCloseTo(2.5, 10)
  })

  it("interpolates linearly between table angles (22.5° between 15° and 30°)", () => {
    const a = cpeDachuDlaPaneluRownoleglego("jednospadowy", 15)!
    const b = cpeDachuDlaPaneluRownoleglego("jednospadowy", 30)!
    const mid = cpeDachuDlaPaneluRownoleglego("jednospadowy", 22.5)!
    expect(mid.dociskKrawedz).toBeCloseTo((a.dociskKrawedz + b.dociskKrawedz) / 2, 10)
  })

  it("steep roof 60–75°: pressure +0.7/+0.8 only (the scan gives no suction on the windward slope), suction from the other fields", () => {
    const r = cpeDachuDlaPaneluRownoleglego("dwuspadowy", 75)!
    expect(r.dociskKrawedz).toBeCloseTo(0.8, 10)
    expect(r.odrywanieKrawedz).toBeGreaterThan(0)
  })

  it("returns null below 5° and above 75° (outside the tables), and for non-finite angles", () => {
    expect(cpeDachuDlaPaneluRownoleglego("jednospadowy", 4.9)).toBeNull()
    expect(cpeDachuDlaPaneluRownoleglego("dwuspadowy", 75.1)).toBeNull()
    expect(cpeDachuDlaPaneluRownoleglego("dwuspadowy", Number.NaN)).toBeNull()
  })

  it("edge is never milder than the centre", () => {
    for (const typ of ["jednospadowy", "dwuspadowy"] as const) {
      for (let kat = 5; kat <= 75; kat += 2.5) {
        const r = cpeDachuDlaPaneluRownoleglego(typ, kat)!
        expect(r.odrywanieKrawedz).toBeGreaterThanOrEqual(r.odrywanieSrodek)
        expect(r.dociskKrawedz).toBeGreaterThanOrEqual(r.dociskSrodek)
      }
    }
  })
})

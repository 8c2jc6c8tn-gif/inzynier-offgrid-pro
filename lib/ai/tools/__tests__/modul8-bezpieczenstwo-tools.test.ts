import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { zamkiDrzwiEwakuacyjnychTool } from "../zamki-drzwi-ewakuacyjnych-tool"
import { modulGasniczyTool } from "../modul-gasniczy-tool"
import { awaryjneZrodloCieplaTool } from "../awaryjne-zrodlo-ciepla-tool"
import { centralaSspTool } from "../centrala-ssp-tool"
import { oswietlenieAwaryjneTool } from "../oswietlenie-awaryjne-tool"
import { klapyPozaroweTool } from "../klapy-pozarowe-tool"
import { powiadomieniaAlarmoweTool } from "../powiadomienia-alarmowe-tool"
import { upsKrytycznyTool } from "../ups-krytyczny-tool"

describe("zamkiDrzwiEwakuacyjnychTool (M8/E3, dawne 11.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(zamkiDrzwiEwakuacyjnychTool.operationType).toBe("read")
    expect(zamkiDrzwiEwakuacyjnychTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(zamkiDrzwiEwakuacyjnychTool)).not.toThrow()
  })

  it("zamek blokujący bez zasilania awaryjnego → twardy stop PL", async () => {
    const w = await zamkiDrzwiEwakuacyjnychTool.handler({
      typZamka: "elektrozaczep",
      zachowaniePrzyZanikuZasilania: "blokuje",
      maZasilanieAwaryjne: false,
      maPrzyciskEwakuacyjny: true,
      zwalnianiePoAlarmiePozarowym: true,
      maKontaktron: true,
    })
    expect(w.failSafe).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO"))
  })
})

describe("modulGasniczyTool (M8/E4, dawne 11.52 + 12.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(modulGasniczyTool.operationType).toBe("read")
    expect(modulGasniczyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(modulGasniczyTool)).not.toThrow()
  })

  it("CO2 w strefie LiFePO4 → twardy stop PL", async () => {
    const w = await modulGasniczyTool.handler({
      srodek: "co2",
      magazynWStrefie: "lifepo4",
      liczbaCzujnikowPotwierdzenia: 2,
      odcinaWentylacjeIKlapy: true,
      stanModulu: "sprawny",
    })
    expect(w.srodekWlasciwyDlaLifepo4).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4"))
  })
})

describe("awaryjneZrodloCieplaTool (M8/E1, dawne 6.19)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(awaryjneZrodloCieplaTool.operationType).toBe("read")
    expect(awaryjneZrodloCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(awaryjneZrodloCieplaTool)).not.toThrow()
  })

  it("płaszcz 8 kW × 6 h przy 80 kWh/dobę → 60%, 20 kg drewna", async () => {
    const w = await awaryjneZrodloCieplaTool.handler({
      typZrodla: "kominek",
      mocKw: 10,
      plaszczWodny: true,
      mocDoWodyKw: 8,
      godzinyPaleniaNaDobe: 6,
      zapotrzebowanieCieplaKwhDoba: 80,
      sprawnoscProc: 75,
      wartoscOpalowaKwhKg: 4,
    })
    expect(w.pokrycieProc).toBeCloseTo(60, 12)
    expect(w.paliwoKgDoba).toBeCloseTo(20, 12)
    expect(w.ostrzezenia).toContain(t("pl", "ZRODLO-NIE-POKRYWA", { pokrycie: 60 }))
  })
})

describe("narzędzia M8 blok 2 — kontrakt 9.3 ('read', bez potwierdzenia)", () => {
  it.each([centralaSspTool, oswietlenieAwaryjneTool, klapyPozaroweTool, powiadomieniaAlarmoweTool])("$name", (tool) => {
    expect(tool.operationType).toBe("read")
    expect(tool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(tool)).not.toThrow()
  })
})

describe("centralaSspTool (M8/E5, dawne 11.53)", () => {
  it("awaria centrali → twardy stop PL", async () => {
    const w = await centralaSspTool.handler({
      interfejs: "rs485",
      stanCentrali: "awaria",
      odbieraAlarm: true,
      odbieraAwarie: true,
      odbieraRozbrojenie: true,
      logujeZdarzenia: true,
    })
    expect(w.ostrzezenia).toEqual([t("pl", "SSP-AWARIA-CENTRALI")])
  })
})

describe("oswietlenieAwaryjneTool (M8/E7, dawne 11.55)", () => {
  it("lampa #3 niesprawna → twardy stop PL z nazwą", async () => {
    const w = await oswietlenieAwaryjneTool.handler({
      zasilanie: "ups",
      lampy: [{ nazwa: "#3", stan: "niesprawna" }],
      oswietlenieZewnetrzne: true,
    })
    expect(w.niesprawne).toBe(1)
    expect(w.ostrzezenia).toEqual([t("pl", "OSW-LAMPA-NIESPRAWNA", { nazwa: "#3" })])
  })
})

describe("klapyPozaroweTool (M8/E8, dawne 11.56 + 12.56)", () => {
  it("rekuperacja nie wyłączana przy pożarze → ostrzeżenie PL", async () => {
    const w = await klapyPozaroweTool.handler({
      wentylacja: "mechaniczna",
      wentylacjaWylaczanaPrzyPozarze: false,
      klapyZamykanePrzyPozarze: true,
      sygnalizacjaStanuKlap: true,
      maOddymianie: true,
    })
    expect(w.ostrzezenia).toEqual([t("pl", "KLAPY-WENTYLACJA-NIE-WYLACZANA")])
  })
})

describe("powiadomieniaAlarmoweTool (M8/E10, dawne 12.55)", () => {
  it("auto-wezwanie bez zgody → nieaktywne + twardy stop PL", async () => {
    const w = await powiadomieniaAlarmoweTool.handler({
      maSyrene: true,
      liczbaKontaktow: 1,
      maKamery: true,
      autoWezwanieSluzb: true,
      zgodaNaWezwanieSluzb: false,
    })
    expect(w.autoWezwanieAktywne).toBe(false)
    expect(w.ostrzezenia).toEqual([t("pl", "ALARM-WEZWANIE-BEZ-ZGODY")])
  })
})

describe("upsKrytycznyTool (M8/E6, dawne 11.54 + 12.54)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(upsKrytycznyTool.operationType).toBe("read")
    expect(upsKrytycznyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(upsKrytycznyTool)).not.toThrow()
  })

  it("plan odcinania z domyślnej kolejności źródła + 🔴 słaby akumulator jako tekst PL", async () => {
    const w = await upsKrytycznyTool.handler({
      urzadzenia: [
        { id: "centrala-pozarowa", label: "Centrala", powerW: 10, selected: true },
        { id: "router", label: "Router", powerW: 10, selected: true },
        { id: "silowniki", label: "Siłowniki", powerW: 20, selected: true },
      ],
      pojemnoscAh: 10,
      napiecieV: 12,
      efficiency: 1,
      progOdcieciaMin: 10,
      akumulatorSlaby: true,
    })
    expect(w.planOdciecia!.map((e) => e.mocW)).toEqual([40, 20, 10])
    expect(w.czasPriorytetu1H!).toBeGreaterThan(w.czasPodtrzymaniaH)
    expect(w.ostrzezenia[0]).toBe(t("pl", "UPS-AKUMULATOR-SLABY"))
  })
})

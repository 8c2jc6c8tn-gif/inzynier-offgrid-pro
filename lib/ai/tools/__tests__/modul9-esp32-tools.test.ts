import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { zasilanieEsp32Tool } from "../zasilanie-esp32-tool"
import { architekturaKomunikacjiTool } from "../architektura-komunikacji-tool"
import { przydzialPinowTool } from "../przydzial-pinow-tool"
import { niezawodnoscEsp32Tool } from "../niezawodnosc-esp32-tool"
import { wyborPlytkiEsp32Tool } from "../wybor-plytki-esp32-tool"
import { montazObudowaEsp32Tool } from "../montaz-obudowa-esp32-tool"
import { katalogKomponentowEsp32Tool } from "../katalog-komponentow-esp32-tool"

describe("narzędzia M9 — kontrakt 9.3 ('read', bez potwierdzenia)", () => {
  it.each([
    zasilanieEsp32Tool,
    architekturaKomunikacjiTool,
    przydzialPinowTool,
    niezawodnoscEsp32Tool,
    wyborPlytkiEsp32Tool,
    montazObudowaEsp32Tool,
    katalogKomponentowEsp32Tool,
  ])("$name", (tool) => {
    expect(tool.operationType).toBe("read")
    expect(tool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(tool)).not.toThrow()
  })
})

describe("zasilanieEsp32Tool (M9/E2, dawne 11.2)", () => {
  it("ESP32 bezpośrednio na magistrali → twardy stop PL", async () => {
    const w = await zasilanieEsp32Tool.handler({
      sposob: "bezposrednio",
      napiecieMagistraliV: 12,
      napiecieMagistraliMaxV: null,
      poborMocyW: null,
      napiecieWyjscioweV: null,
      napiecieWejscioweMaxV: null,
      pradWyjsciowyMaxA: null,
      sprawnoscPct: null,
    })
    expect(w.ostrzezenia).toEqual([t("pl", "ESP-BEZ-PRZETWORNICY")])
  })
})

describe("architekturaKomunikacjiTool (M9/E4, dawne 11.4)", () => {
  it("RS485 bez transceivera → twardy stop PL", async () => {
    const w = await architekturaKomunikacjiTool.handler({
      polaczenia: [{ nazwa: "Falownik", protokol: "rs485", maTransceiver: false, adres: 1, predkoscBps: 9600 }],
    })
    expect(w.ostrzezenia).toEqual([t("pl", "KOM-RS485-BEZ-TRANSCEIVERA", { nazwa: "Falownik" })])
  })
})

describe("przydzialPinowTool (M9/E5, dawne 11.5)", () => {
  it("konflikt GPIO16 → twardy stop PL", async () => {
    const w = await przydzialPinowTool.handler({
      piny: [
        { gpio: 16, funkcja: "uart-tx", opis: "" },
        { gpio: 16, funkcja: "adc", opis: "" },
      ],
      wifiAktywne: false,
    })
    expect(w.liczbaKonfliktow).toBe(1)
    expect(w.ostrzezenia).toEqual([t("pl", "PIN-KONFLIKT", { gpio: 16, opisy: "uart-tx, adc" })])
  })
})

describe("niezawodnoscEsp32Tool (M9/E6)", () => {
  it("OTA bez podpisu → twardy stop PL na pierwszym miejscu", async () => {
    const w = await niezawodnoscEsp32Tool.handler({
      kartaSd: false,
      rtc: false,
      podtrzymanieZasilania: false,
      watchdog: false,
      izolacjaGalwaniczna: false,
      ochronaPrzepieciowa: false,
      ota: true,
      redundancjaMasterSlave: false,
      otaPodpis: false,
      otaSumaKontrolna: true,
      otaRollback: true,
    })
    expect(w.ostrzezenia).toEqual([t("pl", "OTA-BEZ-PODPISU")])
  })
})

describe("wyborPlytkiEsp32Tool (M9/E1)", () => {
  it("praca na baterii → C3", async () => {
    const w = await wyborPlytkiEsp32Tool.handler({ zasilanie: "bateria", duzoGpio: false, antenaZewnetrzna: false, mocObliczeniowa: false, szybkieAdc: false })
    expect(w.rekomendacja).toEqual(["c3"])
  })
})

describe("montazObudowaEsp32Tool (M9/E3)", () => {
  it("wilgotne miejsce z IP20 → twardy stop PL (echo M4/E10)", async () => {
    const w = await montazObudowaEsp32Tool.handler({
      miejsce: "wilgotne",
      ipKod: 20,
      montaz: "din",
      odstepOdSzynCm: 2,
      wentylacja: true,
      izolacjaOdCzesciPodNapieciem: true,
    })
    expect(w.ostrzezenia).toEqual([t("pl", "IP-PONIZEJ-WYMAGANEGO", { ip: 20, min: 55 })])
  })
})

describe("katalogKomponentowEsp32Tool (M9/K2–K4)", () => {
  it("liczy instancje i typy; odrzuca typ spoza katalogu", async () => {
    const w = await katalogKomponentowEsp32Tool.handler({
      katalog: "aktuatory",
      instances: [
        { id: "1", typeId: "ssr", etykieta: "Bojler", lokalizacja: "" },
        { id: "2", typeId: "ssr", etykieta: "Grzałka", lokalizacja: "" },
      ],
    })
    expect(w).toMatchObject({ status: "VALID", liczbaInstancji: 2, liczbaTypowUzytych: 1 })
    expect(
      katalogKomponentowEsp32Tool.inputSchema.safeParse({ katalog: "protokoly", instances: [{ id: "1", typeId: "ssr", etykieta: "x", lokalizacja: "" }] }).success,
    ).toBe(false)
  })
})

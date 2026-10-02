import { parsujKoperte, skladajLinie } from "@/lib/core/telemetria/koperta-esp32"
import type { ProbkaTelemetrii } from "@/lib/core/telemetria/probka"
import { generujDemo, type ScenariuszSymulatora } from "@/lib/core/telemetria/symulator"
import type { KonfiguracjaZrodla, StatusPolaczenia, TelemetrySource, ZdarzeniaZrodla } from "@/lib/core/telemetria/zrodlo"

/** Shared plumbing: status, last-sample time, feeding parsed text to listeners. */
abstract class ZrodloBazowe implements TelemetrySource {
  protected _status: StatusPolaczenia = "rozlaczone"
  protected _ostatnia: number | null = null
  protected zd: ZdarzeniaZrodla | null = null
  constructor(readonly konfiguracja: KonfiguracjaZrodla) {}
  status() {
    return this._status
  }
  ostatniaProbka() {
    return this._ostatnia
  }
  protected ustawStatus(s: StatusPolaczenia, szczegol?: string) {
    this._status = s
    this.zd?.naStatus(s, szczegol)
  }
  protected przyjmij(probki: ProbkaTelemetrii[]) {
    if (probki.length === 0) return
    this._ostatnia = Math.max(...probki.map((p) => p.czas))
    this.zd?.naProbki(probki)
  }
  /** One envelope of text → samples; malformed input is reported via status detail, never swallowed. */
  protected przyjmijTekst(tekst: string) {
    const r = parsujKoperte(tekst, this.konfiguracja.id)
    if (!r.ok) {
      this.zd?.naStatus(this._status, r.blad)
      return
    }
    this.przyjmij(r.wynik.probki)
  }
  abstract polacz(zd: ZdarzeniaZrodla): Promise<void>
  abstract rozlacz(): Promise<void>
}

/** Demo source: replays simulator output at real pace — same port as a real device. */
export class ZrodloSymulator extends ZrodloBazowe {
  private timer: ReturnType<typeof setInterval> | null = null
  async polacz(zd: ZdarzeniaZrodla) {
    this.zd = zd
    const scen = (this.konfiguracja.ustawienia.scenariusz as ScenariuszSymulatora) ?? "normalna-praca"
    const krok = Number(this.konfiguracja.ustawienia.krokMs ?? 1000)
    this.ustawStatus("polaczone")
    this.timer = setInterval(() => {
      const t = Date.now()
      this.przyjmij(generujDemo({ zrodloId: this.konfiguracja.id, scenariusz: scen, start: t, krokMs: krok, liczbaKrokow: 1 }))
    }, krok)
  }
  async rozlacz() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    this.ustawStatus("rozlaczone")
  }
}

/** HTTP polling of an ESP32 endpoint returning the v1 envelope. Needs CORS enabled in firmware; HTTPS pages cannot call plain-http LAN hosts. */
export class ZrodloHttp extends ZrodloBazowe {
  private timer: ReturnType<typeof setInterval> | null = null
  async polacz(zd: ZdarzeniaZrodla) {
    this.zd = zd
    const url = String(this.konfiguracja.ustawienia.url ?? "")
    const co = Number(this.konfiguracja.ustawienia.coMs ?? 5000)
    if (!url) {
      this.ustawStatus("blad", "brak-url")
      return
    }
    this.ustawStatus("laczenie")
    const odpytaj = async () => {
      try {
        const r = await fetch(url, { cache: "no-store" })
        if (!r.ok) throw new Error(`http-${r.status}`)
        this.przyjmijTekst(await r.text())
        if (this._status !== "polaczone") this.ustawStatus("polaczone")
      } catch (e) {
        this.ustawStatus("blad", e instanceof Error ? e.message : "blad")
      }
    }
    await odpytaj()
    this.timer = setInterval(odpytaj, co)
  }
  async rozlacz() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    this.ustawStatus("rozlaczone")
  }
}

// Minimal structural types: Web Serial / Web Bluetooth are Chromium-only and absent from lib.dom.
interface PortSzeregowy {
  open(o: { baudRate: number }): Promise<void>
  close(): Promise<void>
  readable: ReadableStream<Uint8Array> | null
}
interface CharakterystykaBle {
  startNotifications(): Promise<CharakterystykaBle>
  stopNotifications(): Promise<CharakterystykaBle>
  addEventListener(t: "characteristicvaluechanged", l: (e: { target: { value?: DataView } }) => void): void
  removeEventListener(t: "characteristicvaluechanged", l: (e: { target: { value?: DataView } }) => void): void
}
interface UrzadzenieBle {
  gatt?: { connect(): Promise<{ getPrimaryService(u: string): Promise<{ getCharacteristic(u: string): Promise<CharakterystykaBle> }> }>; disconnect(): void }
}

/** USB serial (NDJSON, one envelope per line). Chromium desktop/Android only. */
export class ZrodloWebSerial extends ZrodloBazowe {
  private port: PortSzeregowy | null = null
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  private stop = false
  static dostepne(): boolean {
    return typeof navigator !== "undefined" && "serial" in navigator
  }
  async polacz(zd: ZdarzeniaZrodla) {
    this.zd = zd
    if (!ZrodloWebSerial.dostepne()) {
      this.ustawStatus("blad", "przegladarka-nie-wspiera")
      return
    }
    try {
      this.ustawStatus("laczenie")
      const serial = (navigator as unknown as { serial: { requestPort(): Promise<PortSzeregowy> } }).serial
      this.port = await serial.requestPort()
      await this.port.open({ baudRate: Number(this.konfiguracja.ustawienia.baud ?? 115200) })
      this.stop = false
      this.ustawStatus("polaczone")
      void this.czytaj()
    } catch (e) {
      this.ustawStatus("blad", e instanceof Error ? e.message : "blad")
    }
  }
  private async czytaj() {
    if (!this.port?.readable) return
    this.reader = this.port.readable.getReader()
    const dek = new TextDecoder()
    let reszta = ""
    try {
      while (!this.stop) {
        const { value, done } = await this.reader.read()
        if (done) break
        const s = skladajLinie(reszta, dek.decode(value, { stream: true }))
        reszta = s.reszta
        s.linie.forEach((l) => this.przyjmijTekst(l))
      }
    } catch (e) {
      this.ustawStatus("blad", e instanceof Error ? e.message : "blad")
    }
  }
  async rozlacz() {
    this.stop = true
    try {
      await this.reader?.cancel()
      this.reader?.releaseLock()
      await this.port?.close()
    } catch {
      /* port may already be gone */
    }
    this.ustawStatus("rozlaczone")
  }
}

/** BLE notifications carrying NDJSON fragments (UUIDs come from the contract / settings). Chromium only, not iOS Safari. */
export class ZrodloWebBluetooth extends ZrodloBazowe {
  private urz: UrzadzenieBle | null = null
  private char: CharakterystykaBle | null = null
  private reszta = ""
  private dek = new TextDecoder()
  private sluchacz = (e: { target: { value?: DataView } }) => {
    const v = e.target.value
    if (!v) return
    const s = skladajLinie(this.reszta, this.dek.decode(v, { stream: true }))
    this.reszta = s.reszta
    s.linie.forEach((l) => this.przyjmijTekst(l))
  }
  static dostepne(): boolean {
    return typeof navigator !== "undefined" && "bluetooth" in navigator
  }
  async polacz(zd: ZdarzeniaZrodla) {
    this.zd = zd
    const usluga = String(this.konfiguracja.ustawienia.uuidUslugi ?? "")
    const znak = String(this.konfiguracja.ustawienia.uuidCharakterystyki ?? "")
    if (!ZrodloWebBluetooth.dostepne()) return this.ustawStatus("blad", "przegladarka-nie-wspiera")
    if (!usluga || !znak) return this.ustawStatus("blad", "brak-uuid")
    try {
      this.ustawStatus("laczenie")
      const bt = (navigator as unknown as { bluetooth: { requestDevice(o: unknown): Promise<UrzadzenieBle> } }).bluetooth
      this.urz = await bt.requestDevice({ filters: [{ services: [usluga] }] })
      const serwer = await this.urz.gatt!.connect()
      this.char = await (await serwer.getPrimaryService(usluga)).getCharacteristic(znak)
      this.char.addEventListener("characteristicvaluechanged", this.sluchacz)
      await this.char.startNotifications()
      this.ustawStatus("polaczone")
    } catch (e) {
      this.ustawStatus("blad", e instanceof Error ? e.message : "blad")
    }
  }
  async rozlacz() {
    try {
      this.char?.removeEventListener("characteristicvaluechanged", this.sluchacz)
      await this.char?.stopNotifications()
      this.urz?.gatt?.disconnect()
    } catch {
      /* already disconnected */
    }
    this.ustawStatus("rozlaczone")
  }
}

/** Registry factory: one place that maps a stored config to an adapter (MQTT-WS joins here later). */
export function utworzZrodlo(k: KonfiguracjaZrodla): TelemetrySource | null {
  switch (k.typ) {
    case "symulator":
      return new ZrodloSymulator(k)
    case "http":
      return new ZrodloHttp(k)
    case "web-serial":
      return new ZrodloWebSerial(k)
    case "web-bluetooth":
      return new ZrodloWebBluetooth(k)
    default:
      return null // csv is import-based (lib/core/telemetria/csv.ts); mqtt-ws not built yet
  }
}

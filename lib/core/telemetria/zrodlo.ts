import type { ProbkaTelemetrii } from "./probka"

/** Transport kinds. Which of them ships in hardware is undecided — all sit behind one port. */
export type TypZrodla = "csv" | "symulator" | "http" | "web-serial" | "web-bluetooth" | "mqtt-ws"

export type StatusPolaczenia = "rozlaczone" | "laczenie" | "polaczone" | "blad"

/** Registry entry: what the user configured for one source. */
export interface KonfiguracjaZrodla {
  id: string
  nazwa: string
  typ: TypZrodla
  /** Transport-specific settings (URL, poll interval, baud rate…); validated by the adapter. */
  ustawienia: Record<string, string | number | boolean>
  /** True for simulated/demo data — the UI must label it. */
  demo: boolean
}

export interface ZdarzeniaZrodla {
  naProbki: (probki: ProbkaTelemetrii[]) => void
  naStatus: (status: StatusPolaczenia, szczegol?: string) => void
}

/** Port: a live source of samples. Adapters implement it; domain and screens depend only on this. */
export interface TelemetrySource {
  readonly konfiguracja: KonfiguracjaZrodla
  status(): StatusPolaczenia
  /** Time of the last received sample (epoch ms) or null when none yet. */
  ostatniaProbka(): number | null
  polacz(zdarzenia: ZdarzeniaZrodla): Promise<void>
  rozlacz(): Promise<void>
}

/** Registry-side type for sources that read from storage rather than a link. */
export type FabrykaZrodla = (k: KonfiguracjaZrodla) => TelemetrySource

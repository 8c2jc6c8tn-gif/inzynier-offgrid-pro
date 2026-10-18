/**
 * Narzędzie AI (9.3) dla Katalogów 2–4, Moduł 9 "Elektronika / ESP32" — aktuatory, protokoły komunikacji, interfejs
 * lokalny (Wzorzec H). `operationType: 'read'`. Podsumowuje stan katalogu (instancje, typy) — bez oceny doboru.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateKatalogKomponentow } from "@/lib/core/modules/esp32/katalog-komponentow/calculator"
import { KATALOGI_ESP32, NAZWY_KATALOGOW_ESP32, type KatalogEsp32 } from "@/lib/core/modules/esp32/katalog-komponentow/constants"
import type { AiToolDefinition } from "../types"

export const KatalogKomponentowEsp32ToolInput = z
  .object({
    katalog: z.enum(NAZWY_KATALOGOW_ESP32 as [KatalogEsp32, ...KatalogEsp32[]]),
    instances: z.array(
      z.object({
        id: z.string(),
        typeId: z.string().describe("Id pozycji katalogu, np. 'ssr', 'rs485-modbus', 'buzzer'"),
        etykieta: z.string(),
        lokalizacja: z.string(),
      }),
    ),
  })
  .refine((v) => v.instances.every((i) => (KATALOGI_ESP32[v.katalog] as readonly string[]).includes(i.typeId)), {
    message: "typeId spoza wybranego katalogu",
  })
export type KatalogKomponentowEsp32ToolInputT = z.infer<typeof KatalogKomponentowEsp32ToolInput>

export const KatalogKomponentowEsp32ToolOutput = z.object({
  status: z.enum(STATUSY),
  liczbaInstancji: z.number(),
  liczbaTypowUzytych: z.number(),
  dostepneTypy: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KatalogKomponentowEsp32ToolOutputT = z.infer<typeof KatalogKomponentowEsp32ToolOutput>

export const katalogKomponentowEsp32Tool: AiToolDefinition<
  KatalogKomponentowEsp32ToolInputT,
  KatalogKomponentowEsp32ToolOutputT
> = {
  name: "podsumuj_katalog_komponentow_esp32",
  description:
    "Podsumowuje katalog komponentów sterownika ESP32: aktuatory (przekaźniki, MOSFET, PWM, SSR, styczniki, e-Fuse), protokoły " +
    "(RS485/Modbus, CAN, Wi-Fi/BT, LoRa, Ethernet, MQTT z TLS) albo interfejs lokalny (wyświetlacz, dioda RGB, przyciski, buzzer) — " +
    "ile instancji i typów dodano (Moduł 9, Katalogi 2–4). Użyj, gdy user pyta, jakie wyjścia, łącza albo elementy obsługi " +
    "ma jego sterownik ESP32 lub jakie pozycje oferuje katalog.",
  inputSchema: KatalogKomponentowEsp32ToolInput,
  outputSchema: KatalogKomponentowEsp32ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/katalog-komponentow",
  handler: async ({ katalog, instances }) => {
    const wynik = calculateKatalogKomponentow({ instances })
    return {
      status: wynik.status,
      ...wynik.value,
      dostepneTypy: [...KATALOGI_ESP32[katalog]],
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}

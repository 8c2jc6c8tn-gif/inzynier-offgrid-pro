/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 9 "Elektronika / ESP32" — "Konfiguracja GPIO" (dawne 11.5).
 * `operationType: 'read'`. Sprawdza konflikty przydziału pinów podanego przez usera; niczego nie przydziela sam.
 */
import { z } from "zod"
import { calculatePrzydzialPinow } from "@/lib/core/modules/esp32/przydzial-pinow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzydzialPinowToolInput = z.object({
  piny: z.array(
    z.object({
      gpio: z.number().nullable(),
      funkcja: z.enum([
        "i2c-sda",
        "i2c-scl",
        "spi-mosi",
        "spi-miso",
        "spi-sck",
        "spi-cs",
        "uart-tx",
        "uart-rx",
        "adc",
        "1-wire",
        "pwm",
        "wejscie",
        "wyjscie",
      ]),
      opis: z.string(),
    }),
  ),
  wifiAktywne: z.boolean(),
})
export type PrzydzialPinowToolInputT = z.infer<typeof PrzydzialPinowToolInput>

export const PrzydzialPinowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaPrzypisan: z.number(),
  liczbaKonfliktow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzydzialPinowToolOutputT = z.infer<typeof PrzydzialPinowToolOutput>

export const przydzialPinowTool: AiToolDefinition<PrzydzialPinowToolInputT, PrzydzialPinowToolOutputT> = {
  name: "sprawdz_przydzial_pinow_esp32",
  description:
    "Sprawdza mapę pinów ESP32: konflikt dwóch funkcji na jednym GPIO to twardy stop (linie wspólnej magistrali I2C/1-Wire/SPI " +
    "wolno dzielić); przypomina o ograniczeniu ADC2 przy aktywnym Wi-Fi (Moduł 9, Ekran 5). Użyj, gdy user pyta, które piny ESP32 przydzielić czujnikom i wyjściom albo czy jego mapa pinów ma konflikty.",
  inputSchema: PrzydzialPinowToolInput,
  outputSchema: PrzydzialPinowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/przydzial-pinow",
  handler: async (input) => {
    const wynik = calculatePrzydzialPinow(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}

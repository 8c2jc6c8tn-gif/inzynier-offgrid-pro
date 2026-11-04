// Russian texts of ./meta.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./meta"

export const ru: Record<keyof typeof pl, string> = {
  "UI-META-NAZWA": "Инженер Offgrid Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Инженерный калькулятор и консультант для автономных фотоэлектрических систем (панели, накопители энергии, отопление, безопасность).",
}

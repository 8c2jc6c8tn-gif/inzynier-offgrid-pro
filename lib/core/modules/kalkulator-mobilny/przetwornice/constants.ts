/** Nominal USB (USB-A / USB-C without Power Delivery) bus voltage — USB specification, 5 V. */
export const USB_NAPIECIE_V = 5

export type TrybPrzetwornicy = "usb" | "dcdc" | "falownik"

export const TRYBY_PRZETWORNICY: TrybPrzetwornicy[] = ["usb", "dcdc", "falownik"]

/** Biblia §12.29: "Dobiera przetwornicę o mocy 1,5–2× większej niż suma obciążeń" — shown as a hint only. */
export const ZAPAS_MOCY_BIBLIA = { min: 1.5, max: 2 } as const

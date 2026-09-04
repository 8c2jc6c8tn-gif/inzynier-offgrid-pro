/**
 * Katalog protokołów komunikacji BMS↔falownik — dane 1:1 ze źródła (Ekran 20, Sekcja A/C:
 * CAN, RS485, Modbus, wymieniony przykładowo protokół producenta "Pylontech").
 */

export type ProtokolKomunikacji = { id: string; label: string }

export const PROTOKOLY: ProtokolKomunikacji[] = [
  { id: "can", label: "CAN" },
  { id: "rs485", label: "RS485" },
  { id: "modbus", label: "Modbus" },
  { id: "pylontech", label: "Pylontech (protokół producenta)" },
  { id: "inny", label: "Inny / nieznany" },
]

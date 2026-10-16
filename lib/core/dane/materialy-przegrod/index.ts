/**
 * Library of building materials and ready partition templates for the "U from layers" input (M6/E1, spec 37.7).
 *
 * Source: the sibling app inzynier-szkieletowy-pro, `lib/warstwy-przegrod.ts` (`MATERIALY_WG_TYPU`, default partitions) — the owner's
 * decision of 10.10.2026 is to take the method and the material list from there, not to invent our own. Most λ values there are
 * labelled "przykładowe" (to be verified against product datasheets / the standard); we carry that status over and show it in the
 * UI (`status`), we do not present any of them as certain. Only two kinds are better founded in the source:
 * - `karta-producenta`: Knauf Unifit ECOSE glass wool λD from the manufacturer's data sheets (Oct 2021),
 * - `norma`: EPDM λ 0.25 from ISO 10456:2007 Table 3.
 * Everything else is `orientacyjne`. The user can always overwrite λ (typing it removes the library status in the draft).
 * Membranes, air gaps and foils have no λ in the source and are left out of the templates (as in the source's resistance sum).
 */
import type { KierunekStrumienia } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/u-z-warstw"

export type StatusLambda = "karta-producenta" | "norma" | "orientacyjne"
export type KategoriaMaterialu = "izolacja" | "konstrukcja" | "wykonczenie" | "pokrycie"

export type MaterialPrzegrody = {
  id: string
  /** UI text key of the display name (PL/EN/RU in lib/i18n/ui/m06f-materialy-przegrod.ts). */
  nazwaKey: string
  kategoria: KategoriaMaterialu
  /** Conductivity λ [W/(m·K)]. */
  lambdaWmK: number
  /** Typical thickness [mm] proposed when the material is picked into an empty layer. */
  gruboscDomyslnaMm: number
  status: StatusLambda
}

const o = "orientacyjne" as const

export const MATERIALY_PRZEGROD: readonly MaterialPrzegrody[] = [
  { id: "welna-035", nazwaKey: "UI-MAT-WELNA-035", kategoria: "izolacja", lambdaWmK: 0.035, gruboscDomyslnaMm: 145, status: o },
  { id: "welna-038", nazwaKey: "UI-MAT-WELNA-038", kategoria: "izolacja", lambdaWmK: 0.038, gruboscDomyslnaMm: 145, status: o },
  { id: "welna-040", nazwaKey: "UI-MAT-WELNA-040", kategoria: "izolacja", lambdaWmK: 0.04, gruboscDomyslnaMm: 145, status: o },
  { id: "knauf-unifit-032", nazwaKey: "UI-MAT-KNAUF-UNIFIT-032", kategoria: "izolacja", lambdaWmK: 0.032, gruboscDomyslnaMm: 145, status: "karta-producenta" },
  { id: "knauf-unifit-033", nazwaKey: "UI-MAT-KNAUF-UNIFIT-033", kategoria: "izolacja", lambdaWmK: 0.033, gruboscDomyslnaMm: 145, status: "karta-producenta" },
  { id: "knauf-unifit-035", nazwaKey: "UI-MAT-KNAUF-UNIFIT-035", kategoria: "izolacja", lambdaWmK: 0.035, gruboscDomyslnaMm: 145, status: "karta-producenta" },
  { id: "knauf-unifit-037", nazwaKey: "UI-MAT-KNAUF-UNIFIT-037", kategoria: "izolacja", lambdaWmK: 0.037, gruboscDomyslnaMm: 145, status: "karta-producenta" },
  { id: "eps-038", nazwaKey: "UI-MAT-EPS-038", kategoria: "izolacja", lambdaWmK: 0.038, gruboscDomyslnaMm: 145, status: o },
  { id: "pir-023", nazwaKey: "UI-MAT-PIR-023", kategoria: "izolacja", lambdaWmK: 0.023, gruboscDomyslnaMm: 100, status: o },
  { id: "osb-3", nazwaKey: "UI-MAT-OSB-3", kategoria: "konstrukcja", lambdaWmK: 0.13, gruboscDomyslnaMm: 12, status: o },
  { id: "plyta-gk", nazwaKey: "UI-MAT-PLYTA-GK", kategoria: "wykonczenie", lambdaWmK: 0.25, gruboscDomyslnaMm: 12.5, status: o },
  { id: "deska-elewacyjna", nazwaKey: "UI-MAT-DESKA-ELEWACYJNA", kategoria: "wykonczenie", lambdaWmK: 0.14, gruboscDomyslnaMm: 19, status: o },
  { id: "tynk-cienkowarstwowy", nazwaKey: "UI-MAT-TYNK-CIENKOWARSTWOWY", kategoria: "wykonczenie", lambdaWmK: 0.8, gruboscDomyslnaMm: 5, status: o },
  { id: "panel-podlogowy", nazwaKey: "UI-MAT-PANEL-PODLOGOWY", kategoria: "wykonczenie", lambdaWmK: 0.17, gruboscDomyslnaMm: 8, status: o },
  { id: "blachodachowka", nazwaKey: "UI-MAT-BLACHODACHOWKA", kategoria: "pokrycie", lambdaWmK: 50, gruboscDomyslnaMm: 0.5, status: o },
  { id: "dachowka-ceramiczna", nazwaKey: "UI-MAT-DACHOWKA-CERAMICZNA", kategoria: "pokrycie", lambdaWmK: 1.0, gruboscDomyslnaMm: 15, status: o },
  { id: "gont-bitumiczny", nazwaKey: "UI-MAT-GONT-BITUMICZNY", kategoria: "pokrycie", lambdaWmK: 0.23, gruboscDomyslnaMm: 3, status: o },
  { id: "blacha-na-rabek", nazwaKey: "UI-MAT-BLACHA-NA-RABEK", kategoria: "pokrycie", lambdaWmK: 50, gruboscDomyslnaMm: 0.6, status: o },
  { id: "papa-sbs", nazwaKey: "UI-MAT-PAPA-SBS", kategoria: "pokrycie", lambdaWmK: 0.17, gruboscDomyslnaMm: 8, status: o },
  { id: "membrana-epdm", nazwaKey: "UI-MAT-MEMBRANA-EPDM", kategoria: "pokrycie", lambdaWmK: 0.25, gruboscDomyslnaMm: 1.5, status: "norma" },
]

export function znajdzMaterial(id: string): MaterialPrzegrody | null {
  return MATERIALY_PRZEGROD.find((m) => m.id === id) ?? null
}

export type WarstwaSzablonu = { materialId: string; gruboscMm: number }

/** A ready partition (outside → inside): layers that have a conductivity, the direction of the heat flow it is meant for. */
export type SzablonPrzegrody = {
  id: string
  nazwaKey: string
  kierunek: KierunekStrumienia
  warstwy: readonly WarstwaSzablonu[]
}

/** The default framed partitions of the source (wall 45×145, roof 45×145, floor 45×195), without membranes/foils/air gaps. */
export const SZABLONY_PRZEGROD: readonly SzablonPrzegrody[] = [
  { id: "sciana-szkieletowa", nazwaKey: "UI-SZABLON-SCIANA-SZKIELETOWA", kierunek: "poziomo", warstwy: [{ materialId: "osb-3", gruboscMm: 12 }, { materialId: "welna-038", gruboscMm: 145 }, { materialId: "plyta-gk", gruboscMm: 12.5 }] },
  { id: "dach-krokwie", nazwaKey: "UI-SZABLON-DACH-KROKWIE", kierunek: "w-gore", warstwy: [{ materialId: "osb-3", gruboscMm: 15 }, { materialId: "welna-038", gruboscMm: 145 }] },
  { id: "podloga-legary", nazwaKey: "UI-SZABLON-PODLOGA-LEGARY", kierunek: "w-dol", warstwy: [{ materialId: "osb-3", gruboscMm: 12 }, { materialId: "welna-038", gruboscMm: 195 }, { materialId: "osb-3", gruboscMm: 24 }] },
]

export function znajdzSzablon(id: string): SzablonPrzegrody | null {
  return SZABLONY_PRZEGROD.find((s) => s.id === id) ?? null
}

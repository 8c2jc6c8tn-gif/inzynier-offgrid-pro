import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { BilansMiesiecznyInput } from "./input"
import { validateInput } from "./validation"
import { modelMiesieczny, niedoborPozaZima, niedoborZimowy } from "./warnings"
import { DNI_MIESIACA, MIESIACE_ZIMOWE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MiesiacBilansu = {
  zuzycieKwh: number
  produkcjaKwh: number
  /** PV used directly, min(η·E_PV, E_zuż). */
  bezposrednioKwh: number
  /** Energy delivered from storage ΔE_mag. */
  zMagazynuKwh: number
  /** Consumption not covered locally — grid ("siec") or generator ("wyspa"). */
  niedoborKwh: number
  /** Production neither used nor stored — exported ("siec") or lost ("wyspa"). */
  nadwyzkaKwh: number
}

export type BilansMiesiecznyResult = {
  miesiace: MiesiacBilansu[]
  zuzycieRokKwh: number
  produkcjaRokKwh: number
  niedoborRokKwh: number
  nadwyzkaRokKwh: number
  /** Share of consumption covered by PV and storage [0–1]. */
  pokrycieWlasne: number
  /** Month with the largest shortfall (0 = January); null when there is no shortfall. */
  najgorszyMiesiac: number | null
  /** Shortfall in December + January [kWh] (winter condition of scenario D). */
  niedoborZimaKwh: number
}

const FORMULA =
  "E_{bezp} = \\min(\\eta E_{PV}, E_{zuż}); \\ \\Delta E_{mag} = \\min(E_{zuż} - E_{bezp},\\ (E_{PV} - E_{bezp})\\eta_{mag},\\ C \\cdot dni \\cdot \\eta_{mag}); \\ " +
  "E_{sieć} = E_{zuż} - E_{bezp} - \\Delta E_{mag}"

const NAZWY = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

/**
 * One month of the balance (pure arithmetic; `03_M14` §4, opracowanie §4.2).
 * 🔎 TD23 (`dlug-techniczny.md`): monthly model with a user self-consumption factor (no W4 hourly
 * profiles) — not a substitute for the M7 stress test.
 */
export function bilansMiesiaca(
  zuzycieKwh: number,
  produkcjaKwh: number,
  autokonsumpcja: number,
  pojemnoscKwh: number,
  sprawnosc: number,
  dni: number,
): MiesiacBilansu {
  const bezposrednioKwh = Math.min(autokonsumpcja * produkcjaKwh, zuzycieKwh)
  const potrzeba = zuzycieKwh - bezposrednioKwh
  const nadmiar = produkcjaKwh - bezposrednioKwh
  const zMagazynuKwh = pojemnoscKwh > 0 ? Math.min(potrzeba, nadmiar * sprawnosc, pojemnoscKwh * dni * sprawnosc) : 0
  return {
    zuzycieKwh,
    produkcjaKwh,
    bezposrednioKwh,
    zMagazynuKwh,
    niedoborKwh: potrzeba - zMagazynuKwh,
    nadwyzkaKwh: nadmiar - (pojemnoscKwh > 0 ? zMagazynuKwh / sprawnosc : 0),
  }
}

export function calculateBilansMiesieczny(input: BilansMiesiecznyInput): CalcResult<BilansMiesiecznyResult | null> {
  const inputs = { mocPvKwp: input.mocPvKwp, pojemnoscMagazynuKwh: input.pojemnoscMagazynuKwh }
  const base = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-SIEC-BILANS-MIESIECZNY", inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: null, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const zuzycieRokKwh = input.zuzycieMiesieczneKwh.reduce((s, v) => s + v, 0)
  const brakMagazynu = input.pojemnoscMagazynuKwh > 0 && input.sprawnoscMagazynu === null
  const brakPv = input.mocPvKwp > 0 && input.autokonsumpcjaBezposrednia === null
  if (zuzycieRokKwh === 0 || brakMagazynu || brakPv) {
    return { ...base, value: null, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const a = input.autokonsumpcjaBezposrednia ?? 1
  const eta = input.sprawnoscMagazynu ?? 1
  const miesiace = input.zuzycieMiesieczneKwh.map((z, m) =>
    bilansMiesiaca(z, input.uzyskMiesiecznyKwhNaKwp[m] * input.mocPvKwp, a, input.pojemnoscMagazynuKwh, eta, DNI_MIESIACA[m]),
  )
  const suma = (k: keyof MiesiacBilansu) => miesiace.reduce((s, x) => s + x[k], 0)
  const niedoborRokKwh = suma("niedoborKwh")
  let najgorszyMiesiac: number | null = null
  miesiace.forEach((x, m) => {
    if (x.niedoborKwh > 1e-9 && (najgorszyMiesiac === null || x.niedoborKwh > miesiace[najgorszyMiesiac].niedoborKwh)) {
      najgorszyMiesiac = m
    }
  })
  const niedoborZimaKwh = MIESIACE_ZIMOWE.reduce<number>((s, m) => s + miesiace[m].niedoborKwh, 0)

  const warnings: Warning[] = [modelMiesieczny()]
  if (input.tryb === "wyspa") {
    const zima = MIESIACE_ZIMOWE.filter((m) => miesiace[m].niedoborKwh > 1e-9)
    if (zima.length > 0) warnings.push(niedoborZimowy(niedoborZimaKwh, zima.map((m) => NAZWY[m]).join(", ")))
    const inne = miesiace
      .map((x, m) => (x.niedoborKwh > 1e-9 && !(MIESIACE_ZIMOWE as readonly number[]).includes(m) ? NAZWY[m] : null))
      .filter((x) => x !== null)
    if (inne.length > 0) warnings.push(niedoborPozaZima(inne.join(", ")))
  }

  const assumptions: Assumption[] = [{ kod: "SIEC-BILANS-ZALOZENIE-PVGIS" }]
  if (input.mocPvKwp > 0) {
    assumptions.push({ kod: "SIEC-BILANS-ZALOZENIE-AUTOKONSUMPCJA", params: { procent: Math.round(a * 100) } })
  }
  if (input.pojemnoscMagazynuKwh > 0) {
    assumptions.push({ kod: "SIEC-BILANS-ZALOZENIE-CYKL", params: { sprawnosc: Math.round(eta * 100) } })
  }

  return {
    ...base,
    value: {
      miesiace,
      zuzycieRokKwh,
      produkcjaRokKwh: suma("produkcjaKwh"),
      niedoborRokKwh,
      nadwyzkaRokKwh: suma("nadwyzkaKwh"),
      pokrycieWlasne: 1 - niedoborRokKwh / zuzycieRokKwh,
      najgorszyMiesiac,
      niedoborZimaKwh,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}

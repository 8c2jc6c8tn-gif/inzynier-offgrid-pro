"use client"

import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { CF_TABLICA_PIONOWA, cfOdrywaniaWiaty } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { KAT_MAX_DEG, KAT_NORMOWY_MAX_DEG } from "@/lib/core/modules/pv/wiatr-powyzej-30/constants"
import { cfSzacunekPozaNorma, METODY_CF, type MetodaCf } from "@/lib/core/modules/pv/wiatr-powyzej-30/sila-i-balast"

const ETYKIETA_METODY: Record<MetodaCf, string> = {
  liniowa: "UI-CF-METODA-LINIOWA",
  trend: "UI-CF-METODA-TREND",
}

const PHI_KOLUMNY = [0, 0.5, 1] as const
const KATY_TABELI = Array.from({ length: KAT_MAX_DEG / 5 + 1 }, (_, i) => i * 5)

/** |cf| dla kąta: norma do 30°, szacunek wybraną metodą powyżej, 1,80 przy 90° (7.4.3). */
function cfDlaKata(kat: number, phi: number, metoda: MetodaCf): number | null {
  if (kat <= KAT_NORMOWY_MAX_DEG) return cfOdrywaniaWiaty(kat, phi)
  if (kat >= KAT_MAX_DEG) return CF_TABLICA_PIONOWA
  return cfSzacunekPozaNorma(kat, phi, metoda)
}

type Props = {
  metoda: MetodaCf
  onChange: (metoda: MetodaCf) => void
  t: (kod: string, params?: Record<string, string | number>) => string
  /** Liczba → tekst (dwa miejsca po przecinku, wg języka UI). */
  f: (x: number) => string
}

/** Wybór metody szacunku współczynnika siły cf powyżej 30° (D101) i tabela danych obu metod — wspólna dla kalkulatorów zmiany kąta. */
export function WyborMetodyCf({ metoda, onChange, t, f }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <PoleSelect
        label={t("UI-CF-METODA-ETYKIETA")}
        value={metoda}
        onChange={(e) => onChange(e.target.value === "trend" ? "trend" : "liniowa")}
        pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="metodaCf" params={{ maxKat: KAT_NORMOWY_MAX_DEG }} />}
      >
        {METODY_CF.map((m) => (
          <option key={m} value={m}>
            {t(ETYKIETA_METODY[m])}
          </option>
        ))}
      </PoleSelect>
      <details className="text-small">
        <summary className="cursor-pointer">{t("UI-CF-TABELA-TYTUL")}</summary>
        <p className="mt-2 text-muted-foreground">{t("UI-CF-TABELA-OPIS")}</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr>
                <th className="text-left" rowSpan={2}>{t("UI-CF-TABELA-KAT")}</th>
                <th colSpan={3}>{t("UI-CF-TABELA-LINIOWA")}</th>
                <th colSpan={3}>{t("UI-CF-TABELA-TREND")}</th>
              </tr>
              <tr>
                {[...PHI_KOLUMNY, ...PHI_KOLUMNY].map((phi, i) => (
                  <th key={i} className="font-normal">φ = {f(phi)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KATY_TABELI.map((kat) => (
                <tr key={kat} className={kat > KAT_NORMOWY_MAX_DEG && kat < KAT_MAX_DEG ? "bg-muted/40" : undefined}>
                  <td className="text-left">
                    {kat}° {kat > KAT_NORMOWY_MAX_DEG && kat < KAT_MAX_DEG ? "🔎" : ""}
                  </td>
                  {(["liniowa", "trend"] as const).flatMap((m) =>
                    PHI_KOLUMNY.map((phi) => {
                      const cf = cfDlaKata(kat, phi, m)
                      return <td key={`${m}-${phi}`}>{cf === null ? "—" : f(cf)}</td>
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

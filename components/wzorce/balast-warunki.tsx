import type { WarunekBalastu } from "@/lib/core/modules/pv/wiatr-powyzej-30/sila-i-balast"

/** Etykiety warunków (klucze UI) — wspólne dla wszystkich kalkulatorów balastu, żeby żaden nie nazywał ich inaczej. */
export const ETYKIETA_WARUNKU: Record<WarunekBalastu, string> = {
  oderwanie: "UI-BALAST-WARUNEK-ODERWANIE",
  przesuw: "UI-BALAST-WARUNEK-PRZESUW",
  przewracanie: "UI-BALAST-WARUNEK-PRZEWRACANIE",
}

const KOLEJNOSC: WarunekBalastu[] = ["oderwanie", "przesuw", "przewracanie"]

type Props = {
  /** Balast wg każdego warunku [kg]; `null` = niesprawdzony (brak danych) albo nie dotyczy. */
  warunki: Record<WarunekBalastu, number | null>
  /** Najcięższy ze sprawdzonych — wyznacza balast; wyróżniony. */
  rozstrzyga: WarunekBalastu | null
  t: (kod: string, params?: Record<string, string | number>) => string
  /** Liczba → tekst (zaokrąglenie wg języka UI). */
  f: (x: number) => string
  /** Dla 90° oderwanie nie dotyczy (siła pozioma) — pokazujemy to zamiast „nie sprawdzono”. */
  oderwanieNieDotyczy?: boolean
}

/**
 * Balast wg KAŻDEGO z trzech warunków (oderwanie, przesuw, przewracanie) z wyróżnionym najcięższym, który wyznacza wynik.
 * Jedyne miejsce, które to rysuje: wiatr powyżej 30°, typ montażu i „Złoty środek” pokazują to samo i tak samo.
 */
export function BalastWarunki({ warunki, rozstrzyga, t, f, oderwanieNieDotyczy = false }: Props) {
  return (
    <div className="text-small">
      <p>{t("UI-BALAST-WARUNKI-NAGLOWEK")}</p>
      <ul className="mt-1 space-y-0.5">
        {KOLEJNOSC.map((w) => {
          const kg = warunki[w]
          const gora = rozstrzyga === w
          return (
            <li key={w} className={gora ? "font-semibold" : kg === null ? "text-muted-foreground" : ""}>
              {t(ETYKIETA_WARUNKU[w])}:{" "}
              {kg !== null
                ? `${f(Math.ceil(kg))} kg`
                : w === "oderwanie" && oderwanieNieDotyczy
                  ? t("UI-BALAST-WARUNEK-NIE-DOTYCZY")
                  : t("UI-BALAST-WARUNEK-NIESPRAWDZONY")}
              {gora && ` ← ${t("UI-BALAST-WARUNEK-ROZSTRZYGA")}`}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { calculatePorownanieMetod, wybierzMetodeDlaKategorii } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/calculator"
import type { EtykietaRekomendacji } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/calculator"
import { KATEGORIE_URZADZEN, METODY_ODLACZANIA } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/constants"
import type { DoborMetodyInput, KategoriaUrzadzeniaId, MetodaOdlaczaniaId, PorownanieMetodInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/input"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"

const ETYKIETA_REKOMENDACJI: Record<EtykietaRekomendacji, string> = {
  "listwa-z-wylacznikiem": "Listwa z wyłącznikiem",
  "gniazdo-wifi": "Gniazdo Wi-Fi",
  "gniazdo-z-timerem": "Gniazdo z timerem",
  "obwod-w-rozdzielni-ze-stycznikiem": "Obwód w rozdzielni ze stycznikiem",
}

export function RekomendacjeTab({
  porownanie,
  dobor,
  onChangePorownanie,
  onChangeDobor,
}: {
  porownanie: PorownanieMetodInput
  dobor: DoborMetodyInput
  onChangePorownanie: (v: PorownanieMetodInput) => void
  onChangeDobor: (v: DoborMetodyInput) => void
}) {
  const wynikPorownanie = useMemo(() => calculatePorownanieMetod(porownanie), [porownanie])
  const wynikDobor = useMemo(() => wybierzMetodeDlaKategorii(dobor), [dobor])

  function dodajMetode(id: MetodaOdlaczaniaId) {
    if (porownanie.metody.some((m) => m.id === id)) return
    onChangePorownanie({ metody: [...porownanie.metody, { id, kosztZakupuZl: 0, rocznaOszczednoscZl: 0 }] })
  }

  function usunMetode(id: MetodaOdlaczaniaId) {
    onChangePorownanie({ metody: porownanie.metody.filter((m) => m.id !== id) })
  }

  function aktualizujMetode(id: MetodaOdlaczaniaId, patch: Partial<{ kosztZakupuZl: number; rocznaOszczednoscZl: number }>) {
    onChangePorownanie({ metody: porownanie.metody.map((m) => (m.id === id ? { ...m, ...patch } : m)) })
  }

  const dostepneMetody = METODY_ODLACZANIA.filter((m) => !porownanie.metody.some((wybrana) => wybrana.id === m.id))

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-small font-semibold">Porównanie metod odłączania — koszt vs. zysk</h2>
        <p className="text-caption text-muted-foreground">
          Wpisz koszt zakupu/montażu i szacowaną roczną oszczędność dla metod, które rozważasz — źródło daje te
          liczby tylko jako przykład, nie jako normę cenową.
        </p>

        <ul className="flex flex-col gap-2">
          {porownanie.metody.map((m) => {
            const def = METODY_ODLACZANIA.find((d) => d.id === m.id)
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-small">
                <span className="min-w-24 flex-1 font-medium">{def?.label ?? m.id}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="koszt zł"
                  value={m.kosztZakupuZl || ""}
                  onChange={(e) => aktualizujMetode(m.id, { kosztZakupuZl: Number(e.target.value) })}
                  className="min-h-10 w-24 rounded-md border border-input bg-background px-2"
                  aria-label={`Koszt zakupu — ${def?.label ?? m.id}`}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="oszcz. zł/rok"
                  value={m.rocznaOszczednoscZl || ""}
                  onChange={(e) => aktualizujMetode(m.id, { rocznaOszczednoscZl: Number(e.target.value) })}
                  className="min-h-10 w-28 rounded-md border border-input bg-background px-2"
                  aria-label={`Roczna oszczędność — ${def?.label ?? m.id}`}
                />
                <button
                  type="button"
                  onClick={() => usunMetode(m.id)}
                  className="text-caption text-muted-foreground underline"
                  aria-label={`Usuń ${def?.label ?? m.id}`}
                >
                  Usuń
                </button>
              </li>
            )
          })}
        </ul>

        {dostepneMetody.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dostepneMetody.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => dodajMetode(m.id)}
                className="rounded-full border px-3 py-1 text-caption hover:bg-muted"
              >
                + {m.label}
              </button>
            ))}
          </div>
        )}

        {wynikPorownanie.status === "INCOMPLETE" ? (
          <StanPusty tytul="Dodaj przynajmniej jedną metodę i wpisz koszt lub oszczędność." />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikPorownanie.status)}>
            <ul className="flex flex-col gap-1 text-small">
              {wynikPorownanie.value.metody.map((m) => {
                const def = METODY_ODLACZANIA.find((d) => d.id === m.id)
                return (
                  <li key={m.id}>
                    <span className="font-medium">{def?.label ?? m.id}</span>:{" "}
                    {m.okresZwrotuMiesiecy === null ? "koszt się nie zwróci" : `zwrot po ${m.okresZwrotuMiesiecy.toFixed(1)} mies.`}
                  </li>
                )
              })}
            </ul>
            <WynikSzczegoly assumptions={wynikPorownanie.assumptions} warnings={wynikPorownanie.warnings} formula={wynikPorownanie.formula} />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">Dobór metody per kategoria urządzenia</h2>
        <PoleSelect
          label="Kategoria urządzenia"
          value={dobor.kategoria}
          onChange={(e) => onChangeDobor({ kategoria: e.target.value as KategoriaUrzadzeniaId })}
        >
          {KATEGORIE_URZADZEN.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </PoleSelect>

        <WerdyktPanel poziom="ok" etykieta="Rekomendowana metoda">
          <p className="mt-1 text-h1 font-semibold">{ETYKIETA_REKOMENDACJI[wynikDobor.metoda]}</p>
        </WerdyktPanel>
      </section>
    </div>
  )
}

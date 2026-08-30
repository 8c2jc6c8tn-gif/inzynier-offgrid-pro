import { calculatePrognozy } from "@/lib/core/modules/ai/prognozy/calculator"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

export default function PrognozyPage() {
  const result = calculatePrognozy(SAMPLE_PROGNOZA_24H)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/prognozy" />
      <div>
        <h1 className="text-xl font-semibold">Prognozy</h1>
        <p className="text-sm text-muted-foreground">
          To jest „pogoda” Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile
          będziesz mieć prądu, ile zużyjesz, i kiedy będzie ciasno. Moduł 10, Ekran 1.
        </p>
      </div>

      <WerdyktPanel poziom="ok">
        <p className="mt-1 text-2xl font-semibold">
          Bilans dobowy: {result.value.bilansKwh.toFixed(1)} kWh
        </p>
        <p className="mt-1 text-sm">
          Produkcja {result.value.produkcjaLacznaKwh.toFixed(1)} kWh, zużycie{" "}
          {result.value.zuzycieLaczneKwh.toFixed(1)} kWh. Szczyt zużycia o godz.{" "}
          {result.value.godzinaSzczytuZuzycia}:00.
        </p>
      </WerdyktPanel>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-2 font-medium">Godzina</th>
              <th className="p-2 font-medium">Produkcja [kW]</th>
              <th className="p-2 font-medium">Zużycie [kW]</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PROGNOZA_24H.map((p) => (
              <tr key={p.godzina} className="border-b last:border-0">
                <td className="p-2">{p.godzina}:00</td>
                <td className="p-2">{p.produkcjaKw.toFixed(1)}</td>
                <td className="p-2">{p.zuzycieKw.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="text-xs text-muted-foreground">
        {result.assumptions.map((a) => (
          <li key={a}>Założenie: {a}</li>
        ))}
      </ul>
    </main>
  )
}

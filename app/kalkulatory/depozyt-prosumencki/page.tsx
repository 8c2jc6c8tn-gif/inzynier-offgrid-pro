"use client"

import { useMemo } from "react"
import { calculateDepozyt } from "@/lib/core/modules/siec/depozyt-prosumencki/calculator"
import type { SystemCeny } from "@/lib/core/modules/siec/depozyt-prosumencki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, zl } from "@/components/siec/wspolne"

type Stan = {
  miesiac: string
  energia: string
  cena: string
  system: SystemCeny
  wykorzystano: string
  pelnyKoszt: string
}

const POCZATKOWY: Stan = { miesiac: "2026-06", energia: "", cena: "", system: "rce", wykorzystano: "", pelnyKoszt: "" }

export default function DepozytProsumenckiPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-depozyt-prosumencki", POCZATKOWY)
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateDepozyt({
        dataMiesiaca: /^\d{4}-\d{2}$/.test(stan.miesiac) ? `${stan.miesiac}-15` : "0000-01-01",
        energiaOddanaKwh: liczba(stan.energia),
        cenaRynkowaZlMwh: liczba(stan.cena),
        systemCeny: stan.system,
        wykorzystanoZl: liczbaLubNull(stan.wykorzystano),
        pelnyKosztKwhBruttoZl: liczbaLubNull(stan.pelnyKoszt),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/depozyt-prosumencki" />
      <NaglowekEkranu
        tytul="Net-metering, net-billing, depozyt — co tracę, odchodząc"
        ekran="depozyt-prosumencki"
        wynik={result}
      >
        Jak rozliczana jest energia oddana do sieci i co dzieje się z depozytem, gdy rezygnujesz z umowy. M14 „Dom – sieć”,
        ekran D8.
      </NaglowekEkranu>

      <SekcjaAkordeon tytul="Dwa systemy rozliczeń">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>
            <strong>Net-metering (opusty)</strong> — mikroinstalacje z wnioskami sprzed 1.04.2022. Za 1 kWh oddaną odbierasz
            0,8 kWh (do 10 kW) albo 0,7 kWh (powyżej 10 kW), rozliczenie roczne. Te liczby są tu opisem (zgodne źródła
            wtórne), nie wartością do obliczeń.
          </li>
          <li>
            <strong>Net-billing</strong> — mikroinstalacje do 50 kW od 1.04.2022. Wartość nadwyżki (cena RCEm albo RCE)
            trafia na depozyt ważny 12 miesięcy, powiększony o współczynnik 1,23 (ustawa o OZE, art. 4c ust. 4, od
            1.02.2025 — dla każdego prosumenta, także firmy).
          </li>
          <li>
            Niewykorzystany depozyt: zwrot najwyżej 20% wartości energii z danego miesiąca przy RCEm, 30% przy RCE (art. 4
            ust. 11a); reszta przepada po 12 miesiącach (art. 4c ust. 6). Godziny z ujemną RCE liczą się jako 0.
          </li>
        </ul>
      </SekcjaAkordeon>
      <SekcjaAkordeon tytul="Decyzje jednokierunkowe i odejście z sieci">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>Przejście z RCEm na RCE i z net-meteringu na net-billing jest nieodwracalne (art. 4b ust. 2b, art. 4d ust. 1).</li>
          <li>Rozwiązanie umowy kończy rozliczenia — najpierw wykorzystaj saldo.</li>
          <li>
            Stary prosument w net-meteringu zwykle najlepiej wychodzi, zostając przy sieci z PV (scenariusz A) — aplikacja
            powie to uczciwie w porównaniu scenariuszy.
          </li>
          <li>
            Dotacja na magazyn a odłączenie w okresie trwałości projektu może oznaczać zwrot dotacji — sprawdź regulamin
            programu.
          </li>
        </ul>
      </SekcjaAkordeon>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">Policz depozyt z jednego miesiąca (net-billing)</h2>
        <Pole
          label="Miesiąc wprowadzenia energii"
          type="month"
          value={stan.miesiac}
          onChange={(e) => ustaw("miesiac", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="miesiac" />}
        />
        <Pole
          label="Energia oddana do sieci w tym miesiącu"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.energia}
          onChange={(e) => ustaw("energia", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="energia" />}
        />
        <PoleSelect
          label="Cena rozliczenia"
          value={stan.system}
          onChange={(e) => ustaw("system", e.target.value as SystemCeny)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="cena" />}
        >
          <option value="rce">RCE — cena godzinowa</option>
          <option value="rcem">RCEm — cena miesięczna</option>
        </PoleSelect>
        <Pole
          label="Średnia cena tej energii"
          unit="zł/MWh"
          type="number"
          inputMode="decimal"
          value={stan.cena}
          onChange={(e) => ustaw("cena", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="sredniaCena" />}
        />
        <Pole
          label="Ile z tego depozytu wykorzystasz w 12 miesięcy (opcjonalnie)"
          unit="zł"
          type="number"
          inputMode="decimal"
          value={stan.wykorzystano}
          onChange={(e) => ustaw("wykorzystano", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="wykorzystanie" />}
        />
        <Pole
          label="Pełny koszt 1 kWh pobranej, brutto (opcjonalnie)"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={stan.pelnyKoszt}
          onChange={(e) => ustaw("pelnyKoszt", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="pelnyKoszt" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz energię i cenę, żeby zobaczyć depozyt.</p>
      ) : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta="Depozyt prosumencki z tego miesiąca">
          <WynikGlowny>{zl(v.depozytZl, 2)}</WynikGlowny>
          <p className="mt-1 text-small">
            Wartość energii {zl(v.wartoscEnergiiZl, 2)} × 1,23. Zwrot niewykorzystanej części najwyżej {zl(v.maksZwrotZl, 2)}.
          </p>
          {v.niewykorzystanoZl !== null && (
            <p className="mt-1 text-small">
              Niewykorzystane {zl(v.niewykorzystanoZl, 2)}: zwrot {zl(v.zwrotZl ?? 0, 2)}, przepada {zl(v.umorzenieZl ?? 0, 2)}.
            </p>
          )}
          {v.wspolczynnikBilansowania !== null && (
            <p className="mt-1 text-small">
              1 kWh oddana jest wart {(v.wspolczynnikBilansowania * 100).toLocaleString("pl-PL", { maximumFractionDigits: 0 })}% 1 kWh
              pobranej (współczynnik bilansowania).
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

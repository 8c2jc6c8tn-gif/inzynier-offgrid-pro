"use client"

import { useMemo, useState } from "react"
import { calculateProfilAstronomiczny } from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function ProfilAstronomicznyPage() {
  const [szerokoscGeograficzna, setSzerokoscGeograficzna] = useState("")
  const [dzienRoku, setDzienRoku] = useState("")
  const [mocOdbiornikaNocnegoW, setMocOdbiornikaNocnegoW] = useState("")

  const result = useMemo(
    () =>
      calculateProfilAstronomiczny({
        szerokoscGeograficzna: szerokoscGeograficzna === "" ? null : Number(szerokoscGeograficzna),
        dzienRoku: dzienRoku === "" ? 0 : Number(dzienRoku),
        mocOdbiornikaNocnegoW: mocOdbiornikaNocnegoW === "" ? 0 : Number(mocOdbiornikaNocnegoW),
      }),
    [szerokoscGeograficzna, dzienRoku, mocOdbiornikaNocnegoW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/profil-astronomiczny" />
      <NaglowekEkranu tytul="Profil dobowy + astronomiczny dzień/noc">
        Profil dobowy to nie tylko „kiedy używasz najwięcej prądu” — to też kiedy jest ciemno, bo
        od tego zależy, jak długo pracują urządzenia świecące, a to zmienia się drastycznie między
        latem a zimą. Moduł 2, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Szerokość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          min={-90}
          max={90}
          value={szerokoscGeograficzna}
          onChange={(e) => setSzerokoscGeograficzna(e.target.value)}
          hint="Docelowo automatycznie z Modułu 1 (lokalizacja) — na razie wpisz ręcznie."
        />
        <Pole
          label="Dzień roku"
          unit="1-365"
          type="number"
          inputMode="numeric"
          min={1}
          max={365}
          value={dzienRoku}
          onChange={(e) => setDzienRoku(e.target.value)}
          hint="Np. 21 grudnia = 355, 21 czerwca = 172."
        />
        <Pole
          label="Moc odbiornika działającego tylko w ciemności (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocOdbiornikaNocnegoW}
          onChange={(e) => setMocOdbiornikaNocnegoW(e.target.value)}
          hint="Np. oświetlenie zewnętrzne — do podglądu wpływu długości nocy na jego zużycie."
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij szerokość geograficzną i dzień roku.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Długość dnia i nocy">
          <WynikGlowny>
            {result.value.dlugoscDniaH.toFixed(1)} h dnia / {result.value.dlugoscNocyH.toFixed(1)} h nocy
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}

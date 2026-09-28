"use client"

import Link from "next/link"
import { useMemo } from "react"
import { OPCJE_IP } from "@/lib/core/modules/baterie/ochrona-wilgoc/constants"
import { calculateWilgocMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/calculator"
import type { ZalecenieWilgoc } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/constants"
import type { MiejsceMalejInstalacji } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  miejsce: MiejsceMalejInstalacji | ""
  narazone: "" | "tak" | "nie"
  ipKod: number
}

const STAN_POCZATKOWY: FormularzStan = { miejsce: "", narazone: "", ipKod: 0 }

const MIEJSCA: { id: MiejsceMalejInstalacji; label: string }[] = [
  { id: "garaz", label: "Garaż" },
  { id: "piwnica", label: "Piwnica" },
  { id: "namiot", label: "Namiot" },
  { id: "jacht", label: "Jacht / łódź" },
]

/** Lista osłon — brzmienie z Biblii §12.34. */
const OPIS_ZALECENIA: Record<ZalecenieWilgoc, string> = {
  "obudowy-ip": "Obudowy urządzeń o odpowiednim stopniu IP",
  "puszki-z-uszczelka": "Puszki i złącza z uszczelką",
  "przewody-w-peszlu": "Przewody prowadzone w peszlu",
  "osuszacz-pochlaniacz": "Osuszacz albo pochłaniacz wilgoci w pomieszczeniu",
}

export default function WilgocMaleInstalacjePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wilgoc-male-instalacje", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateWilgocMaleInstalacje({
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        narazoneNaWilgoc: stan.narazone === "" ? null : stan.narazone === "tak",
        ipKod: stan.ipKod,
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const { minimalneIp, zalecenia } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wilgoc-male-instalacje" />
      <NaglowekEkranu tytul="Zabezpieczenia przeciwwilgociowe — mała instalacja">
        Garaż, piwnica, namiot albo jacht: sprawdza, czy obudowa ma wystarczający stopień ochrony IP, i podaje, jakie osłony
        zastosować. Moduł 12, Ekran 23 (uproszczona wersja Modułu 4, Ekran 10).
      </NaglowekEkranu>
      <MigawkaBox>O co chodzi? Woda i prąd to nie jest dobra para. Trzeba je rozdzielić.</MigawkaBox>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Gdzie stoi instalacja"
          value={stan.miejsce}
          onChange={(e) => setStan((prev) => ({ ...prev, miejsce: e.target.value as FormularzStan["miejsce"] }))}
          pomoc={
            <>
              <strong>Miejsce instalacji</strong> — pomieszczenie albo miejsce, w którym stoją akumulator, regulator i
              przetwornica. Ekran sprawdza, czy obudowy tych urządzeń wytrzymają wilgoć, jaka tam bywa, i podpowiada osłony.
              Dla wilgotnego garażu podaje dodatkowo zalecenie ze źródła aplikacji (obudowy IP65).
            </>
          }
        >
          <option value="">— wybierz —</option>
          {MIEJSCA.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label="Czy to miejsce jest narażone na wilgoć?"
          value={stan.narazone}
          onChange={(e) => setStan((prev) => ({ ...prev, narazone: e.target.value as FormularzStan["narazone"] }))}
          pomoc={
            <>
              <strong>Narażenie na wilgoć</strong> — odpowiedz „tak”, jeśli bywa tam para wodna, skropliny na ścianach,
              zacieki, bryzgi albo woda z butów i samochodu. Wilgoć powoduje korozję styków, zwarcia i uszkodzenia
              elektroniki. Przy „tak” obudowa musi mieć co najmniej IP55 (ten sam próg co w Module 4); przy „nie” próg nie
              dotyczy. Nie wiesz? Wybierz „tak” — to strona bezpieczna.
            </>
          }
        >
          <option value="">— wybierz —</option>
          <option value="tak">Tak</option>
          <option value="nie">Nie, jest sucho</option>
        </PoleSelect>
        <PoleSelect
          label="Stopień ochrony obudowy (IP)"
          value={stan.ipKod}
          onChange={(e) => setStan((prev) => ({ ...prev, ipKod: Number(e.target.value) }))}
          pomoc={
            <>
              <strong>Stopień ochrony IP</strong> — dwie cyfry: pierwsza mówi, jak obudowa chroni przed pyłem, druga — przed
              wodą (im wyższa, tym lepiej). Znajdziesz go na tabliczce znamionowej albo w karcie katalogowej urządzenia
              (np. „IP65”). Wybierz najniższy stopień spośród urządzeń stojących w tym miejscu — to ono pierwsze ulegnie
              wilgoci.
            </>
          }
        >
          <option value={0}>— wybierz —</option>
          {OPCJE_IP.map((o) => (
            <option key={o.kod} value={o.kod}>
              {o.label}
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz miejsce, odpowiedz na pytanie o wilgoć i wybierz stopień IP.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? "Obudowa za słaba na wilgoć" : minimalneIp === null ? "Miejsce suche" : "Obudowa wystarczająca"}
        >
          <WynikGlowny>{minimalneIp === null ? "próg IP nie dotyczy" : `minimum IP${minimalneIp}`}</WynikGlowny>
          {zalecenia.length > 0 && (
            <>
              <p className="mt-2 text-small font-medium">Zalecane osłony:</p>
              <ul className="list-disc pl-5 text-small">
                {zalecenia.map((z) => (
                  <li key={z}>{OPIS_ZALECENIA[z]}</li>
                ))}
              </ul>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-small text-muted-foreground">
        Czy na obudowie będzie się skraplać woda (punkt rosy)? Policz to w pełnym kalkulatorze:{" "}
        <Link href="/kalkulatory/ochrona-wilgoc" className="underline">
          Moduł 4 — Ochrona przed wilgocią i kondensacją
        </Link>
        .
      </p>
    </main>
  )
}

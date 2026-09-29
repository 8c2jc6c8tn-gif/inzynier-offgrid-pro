"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateUziemienieMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/calculator"
import { MIEJSCA_Z_ZASILANIEM_ZEWNETRZNYM } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/constants"
import type {
  MiejsceUziemienia,
  OdpowiedzKontrolna,
  RodzajMalejInstalacji,
} from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

/**
 * Pętla zwarcia w wyspie z falownika (D54, decyzja właściciela 29.09.2026): ochrona nie potrzebuje ziemi, tylko zamkniętej
 * drogi obudowa → PE → punkt N–PE w falowniku → falownik; RCD 30 mA za tym punktem. Źródło (Biblia §12.53): obudowa
 * falownika i styk ochronny gniazd podłączone do uziemienia pojazdu — tu jako wspólna szyna PE z podwoziem.
 */
function SchematPetliZwarcia() {
  return (
    <svg
      viewBox="0 0 400 262"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label="Schemat pętli zwarcia: falownik z połączeniem N–PE, wyłącznik RCD 30 mA, gniazdo z urządzeniem, przewód ochronny PE łączący obudowę urządzenia, podwozie i punkt N–PE w falowniku"
    >
      <rect x="15" y="20" width="120" height="110" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="75" y="40" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        Falownik 230 V
      </text>
      <text x="120" y="64" textAnchor="end" className="fill-current text-[9px]">
        L
      </text>
      <text x="120" y="94" textAnchor="end" className="fill-current text-[9px]">
        N
      </text>
      {/* N–PE bond inside the inverter */}
      <line x1="75" y1="90" x2="75" y2="130" className="stroke-current" strokeWidth="2" />
      <line x1="75" y1="90" x2="135" y2="90" className="stroke-current" strokeWidth="2" />
      <circle cx="75" cy="118" r="4" className="fill-current" />
      <text x="70" y="114" textAnchor="end" className="fill-current text-[9px] font-semibold">
        N–PE
      </text>

      <rect x="165" y="45" width="60" height="60" rx="4" className="fill-sky-400/50 stroke-current" />
      <text x="195" y="72" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        RCD
      </text>
      <text x="195" y="86" textAnchor="middle" className="fill-current text-[9px]">
        30 mA
      </text>
      <line x1="135" y1="60" x2="165" y2="60" className="stroke-current" strokeWidth="2" />
      <line x1="225" y1="60" x2="265" y2="60" className="stroke-current" strokeWidth="2" />
      <line x1="225" y1="90" x2="265" y2="90" className="stroke-current" strokeWidth="2" />
      <line x1="135" y1="90" x2="165" y2="90" className="stroke-current" strokeWidth="2" />

      <rect x="265" y="30" width="120" height="100" rx="4" className="fill-amber-400/70 stroke-current" />
      <text x="325" y="50" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        Odbiornik
      </text>
      <text x="325" y="63" textAnchor="middle" className="fill-current text-[9px]">
        (gniazdo + urządzenie)
      </text>
      {/* insulation fault L → enclosure */}
      <polyline points="290,72 300,84 310,76 320,94 330,88 340,104" className="fill-none stroke-red-600" strokeWidth="2" />
      <text x="325" y="120" textAnchor="middle" className="fill-red-600 text-[9px] font-semibold">
        zwarcie na obudowę
      </text>

      {/* protective conductor PE (green-yellow): enclosure, chassis, N–PE point */}
      {[
        [325, 130, 325, 180],
        [75, 130, 75, 180],
        [200, 180, 200, 205],
        [75, 180, 325, 180],
      ].map(([x1, y1, x2, y2]) => (
        <g key={`${x1}-${y1}-${x2}-${y2}`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-green-600" strokeWidth="4" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-yellow-400" strokeWidth="4" strokeDasharray="6 6" />
        </g>
      ))}
      <text x="250" y="174" textAnchor="middle" className="fill-current text-[9px] font-semibold">
        przewód ochronny PE
      </text>
      <rect x="140" y="205" width="120" height="18" rx="4" className="fill-green-600/30 stroke-current" />
      <text x="200" y="218" textAnchor="middle" className="fill-current text-[9px] font-semibold">
        podwozie / masa pojazdu
      </text>

      <text x="200" y="240" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Prąd zwarcia: obudowa → PE → N–PE → falownik.
      </text>
      <text x="200" y="254" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Duży prąd — bezpiecznik albo RCD wyłącza obwód.
      </text>
    </svg>
  )
}

type FormularzStan = {
  rodzaj: RodzajMalejInstalacji | ""
  miejsce: MiejsceUziemienia | ""
  obudowa: OdpowiedzKontrolna | ""
  gniazda: OdpowiedzKontrolna | ""
  npe: OdpowiedzKontrolna | ""
  rcd: OdpowiedzKontrolna | ""
  zasilanie: "tak" | "nie" | ""
  npeRozlaczane: OdpowiedzKontrolna | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  rodzaj: "",
  miejsce: "",
  obudowa: "",
  gniazda: "",
  npe: "",
  rcd: "",
  zasilanie: "",
  npeRozlaczane: "",
}

type PoleOdpowiedzi = "obudowa" | "gniazda" | "npe" | "rcd" | "npeRozlaczane"

const MIEJSCA: { id: MiejsceUziemienia; label: string }[] = [
  { id: "garaz", label: "Garaż" },
  { id: "kamper", label: "Kamper / przyczepa" },
  { id: "jacht", label: "Jacht / łódź" },
  { id: "zewnatrz", label: "Na zewnątrz" },
  { id: "namiot", label: "Namiot" },
]

const ODPOWIEDZI: { id: OdpowiedzKontrolna; label: string }[] = [
  { id: "tak", label: "Tak" },
  { id: "nie", label: "Nie" },
  { id: "nie-wiem", label: "Nie wiem" },
]

const doOdpowiedzi = (v: OdpowiedzKontrolna | "") => (v === "" ? null : v)

export default function UziemienieMaleInstalacjePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("uziemienie-male-instalacje", STAN_POCZATKOWY)
  // Drafts saved before D54 (29.09.2026) have no `npe`/`rcd` — treat as empty (INCOMPLETE, never "OK").
  const npe = stan.npe ?? ""
  const rcd = stan.rcd ?? ""
  // Same for `zasilanie`/`npeRozlaczane` before D55.
  const zasilanie = stan.zasilanie ?? ""
  const npeRozlaczane = stan.npeRozlaczane ?? ""
  const odpowiedzi: Record<PoleOdpowiedzi, OdpowiedzKontrolna | ""> = {
    obudowa: stan.obudowa,
    gniazda: stan.gniazda,
    npe,
    rcd,
    npeRozlaczane,
  }

  const result = useMemo(
    () =>
      calculateUziemienieMaleInstalacje({
        rodzaj: stan.rodzaj === "" ? null : stan.rodzaj,
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        obudowaFalownikaUziemiona: doOdpowiedzi(stan.obudowa),
        gniazdaZeStykiemOchronnym: doOdpowiedzi(stan.gniazda),
        polaczenieNPE: doOdpowiedzi(npe),
        rcd30mA: doOdpowiedzi(rcd),
        zasilanieZewnetrzne: zasilanie === "" ? null : zasilanie,
        npeRozlaczanePrzyZasilaniuZewnetrznym: doOdpowiedzi(npeRozlaczane),
      }),
    [stan, npe, rcd, zasilanie, npeRozlaczane],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const kody = new Set(result.warnings.map((w) => w.code))
  const gniazdaBezStyku = kody.has("UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO")
  const { wymaganeUziemienieOchronne, zalecaneZeWzgleduNaWilgoc } = result.value
  const ac230 = stan.rodzaj === "ac230"
  const namiot = stan.miejsce === "namiot"
  const pytajOZasilanie = stan.miejsce !== "" && MIEJSCA_Z_ZASILANIEM_ZEWNETRZNYM.includes(stan.miejsce)
  // Tent (D55): the N–PE question comes first; enclosure, sockets and RCD only apply to an output with an N–PE bond.
  const namiotPlywajace = namiot && npe !== "tak"
  const zeSlupka = pytajOZasilanie && zasilanie === "tak"

  const pytanie = (pole: PoleOdpowiedzi, label: string) => (
    <PoleSelect
      label={label}
      value={odpowiedzi[pole]}
      onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value as OdpowiedzKontrolna | "" }))}
      pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole={pole} />}
    >
      <option value="">— wybierz —</option>
      {ODPOWIEDZI.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </PoleSelect>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/uziemienie-male-instalacje" />
      <NaglowekEkranu tytul="Uziemienie małej instalacji" ekran="uziemienie-male-instalacje" wzor={result.formula}>
        Kamper, jacht, garaż albo zestaw na zewnątrz: sprawdza, czy instalacja wymaga uziemienia ochronnego i czy falownik
        oraz gniazda 230 V są poprawnie podłączone. Moduł 12, Ekran 38 (uproszczona wersja Modułu 5, Ekrany 9 i 11).
      </NaglowekEkranu>
      

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Rodzaj instalacji"
          value={stan.rodzaj}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzaj: e.target.value as FormularzStan["rodzaj"] }))}
          pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="rodzaj" />}
        >
          <option value="">— wybierz —</option>
          <option value="dc">Tylko 12/24 V DC</option>
          <option value="ac230">230 V z falownika</option>
        </PoleSelect>
        <PoleSelect
          label="Gdzie jest instalacja"
          value={stan.miejsce}
          onChange={(e) => setStan((prev) => ({ ...prev, miejsce: e.target.value as FormularzStan["miejsce"] }))}
          pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="miejsce" />}
        >
          <option value="">— wybierz —</option>
          {MIEJSCA.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </PoleSelect>
        {ac230 && pytajOZasilanie && (
          <PoleSelect
            label={stan.miejsce === "jacht" ? "Czy jacht bywa zasilany z kei?" : "Czy kamper bywa zasilany ze słupka (kemping)?"}
            value={zasilanie}
            onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as FormularzStan["zasilanie"] }))}
            pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="zasilanie" />}
          >
            <option value="">— wybierz —</option>
            <option value="tak">Tak</option>
            <option value="nie">Nie</option>
          </PoleSelect>
        )}
        {ac230 && namiot && pytanie("npe", "Czy wyjście 230 V stacji albo falownika ma połączenie N–PE (wg instrukcji)?")}
        {ac230 && !namiotPlywajace && (
          <>
            {pytanie("obudowa", "Czy obudowa falownika jest uziemiona?")}
            {pytanie("gniazda", "Czy gniazda 230 V mają podłączony styk ochronny?")}
            {!namiot && pytanie("npe", "Czy falownik ma połączenie N–PE (fabryczne, przekaźnik albo wg instrukcji)?")}
            {zeSlupka &&
              npe === "tak" &&
              pytanie("npeRozlaczane", "Czy to połączenie N–PE jest rozłączane przy zasilaniu z zewnątrz?")}
            {pytanie("rcd", "Czy za falownikiem jest wyłącznik różnicowoprądowy (RCD) 30 mA?")}
          </>
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wybierz rodzaj instalacji i miejsce{ac230 ? ", a potem odpowiedz na wszystkie pytania, które się pojawią" : ""}.
        </p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={
            kody.has("UMI-PODWOJNE-POLACZENIE-N-PE")
              ? "Podwójne połączenie N–PE przy zasilaniu z zewnątrz"
              : kody.has("UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA")
                ? "Obudowa falownika nieuziemiona — ryzyko porażenia"
                : kody.has("UMI-BRAK-POLACZENIA-N-PE")
                  ? "Brak połączenia N–PE — zabezpieczenie nie wyłączy zwarcia"
                  : kody.has("UMI-BRAK-RCD-30MA")
                    ? "Brak RCD 30 mA — ryzyko porażenia"
                    : kody.has("UMI-NAMIOT-WYJSCIE-PLYWAJACE")
                      ? "Namiot, wyjście pływające — stosuj zasady poniżej"
                      : gniazdaBezStyku
                        ? "Gniazda bez styku ochronnego — przeczytaj, czym to grozi"
                        : wymaganeUziemienieOchronne
                          ? "Pętla zwarcia zamknięta — ochrona kompletna"
                          : zalecaneZeWzgleduNaWilgoc
                            ? "Uziemienie niewymagane — zalecane przy wilgoci"
                            : "Uziemienie ochronne zwykle niewymagane"
          }
        >
          <WynikGlowny>
            {wymaganeUziemienieOchronne
              ? "uziemienie ochronne wymagane"
              : namiotPlywajace && ac230
                ? "wyjście pływające — nie uziemiaj na własną rękę"
                : "uziemienie ochronne zwykle niewymagane"}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      {ac230 && namiotPlywajace && (
        <section className="flex flex-col gap-2">
          <h2 className="text-small font-semibold">Namiot — stacja zasilania albo mały falownik</h2>
          <p className="text-small text-muted-foreground">
            W namiocie nie ma podwozia, więc strategia jest inna. Zobacz w instrukcji, jakie wyjście ma stacja. Większość
            przenośnych stacji ma wyjście 230 V „pływające”, czyli bez połączenia z ziemią. Pojedyncza usterka (np. dotknięcie
            jednego przewodu) nie grozi wtedy porażeniem, bo prąd nie ma drogi powrotnej. Niebezpieczna jest druga usterka naraz.
          </p>
          <ul className="list-disc pl-5 text-small text-muted-foreground">
            <li>Takiego wyjścia nie uziemiaj na własną rękę, jeśli producent tego nie przewiduje.</li>
            <li>
              Najbezpieczniej: jedno urządzenie na jedno wyjście. Norma zna taki środek ochrony pod nazwą „separacja
              elektryczna”.
            </li>
            <li>Wybieraj urządzenia z podwójną izolacją (symbol podwójnego kwadratu, płaska wtyczka).</li>
            <li>
              Użyj przenośnego RCD 30 mA (PRCD) między stacją a przedłużaczem. Uwaga: przy wyjściu pływającym RCD może nie
              zadziałać, zależnie od konstrukcji stacji — sprawdź to w instrukcji, to nie jest pewnik.
            </li>
            <li>
              Sprzęt trzymaj nad podłogą, nie na mokrym tropiku, a złącza w obudowach IP —{" "}
              <Link href="/kalkulatory/wilgoc-male-instalacje" className="underline">
                zabezpieczenia przeciwwilgociowe (IP65/IP67)
              </Link>
              .
            </li>
            <li>
              Szpilka namiotowa jako uziom działa tylko wtedy, gdy instrukcja stacji przewiduje zacisk uziemienia. Poza tym daje
              głównie fałszywe poczucie bezpieczeństwa, tak jak wiszący przewód.
            </li>
          </ul>
        </section>
      )}

      {ac230 && !namiotPlywajace && (
        <section className="flex flex-col gap-2">
          <h2 className="text-small font-semibold">Jak działa ochrona na falowniku</h2>
          <p className="text-small text-muted-foreground">
            Ochrona nie potrzebuje ziemi — potrzebuje zamkniętej pętli zwarcia do źródła. Przy zwarciu na obudowę prąd płynie:
            obudowa → przewód ochronny (PE) → punkt połączenia N z PE w falowniku → z powrotem do falownika. Płynie wtedy duży
            prąd, więc bezpiecznik albo wyłącznik różnicowoprądowy (RCD) wyłącza obwód. Warunki są trzy:
          </p>
          <ul className="list-disc pl-5 text-small text-muted-foreground">
            <li>
              wszystkie obudowy, styki ochronne gniazd i podwozie połączone jednym przewodem PE (połączenie wyrównawcze);
            </li>
            <li>
              falownik ma połączenie N–PE, ale tylko jeśli producent na to pozwala — wiele falowników z przełącznikiem sieci
              robi to automatycznie przekaźnikiem, gdy nie ma zasilania z zewnątrz;
            </li>
            <li>za tym połączeniem jest RCD 30 mA.</li>
          </ul>
          <p className="text-small text-muted-foreground">
            Pręt wbity w ziemię ani przewód czy łańcuch wiszący spod kampera nie zastąpią tej pętli.
          </p>
          {zeSlupka && (
            <>
              <p className="text-small text-muted-foreground">
                <strong>Przy zasilaniu {stan.miejsce === "jacht" ? "z kei" : "ze słupka"}</strong> przewód ochronny przychodzi z
                sieci. Połączenie N–PE {stan.miejsce === "jacht" ? "na jachcie" : "w kamperze"} musi być wtedy rozłączone, inaczej
                powstaje podwójne połączenie N–PE.
              </p>
              <p className="text-small text-muted-foreground">
                {stan.miejsce === "jacht" ? "Na kei" : "Na słupku"} N i PE przychodzą już rozdzielone, bo rozdzielenie jest po
                stronie sieci. Połączenie N–PE {stan.miejsce === "jacht" ? "na jachcie" : "w kamperze"} to ponowne połączenie N z
                częścią uziemioną. Norma PN-HD 60364-5-54 (punkt 543.4.3) nazywa to „niedopuszczalnym”, nie „zalecanym”. Co się
                wtedy dzieje:
              </p>
              <ol className="list-decimal pl-5 text-small text-muted-foreground">
                <li>
                  <strong>Prąd roboczy płynie przewodem ochronnym.</strong> Powrót z odbiorników dzieli się na N i PE razem z
                  {stan.miejsce === "jacht" ? " kadłubem" : " podwoziem"}. Na obudowach pojawia się napięcie względem ziemi, równe
                  spadkowi napięcia na PE i przyłączu. Przewód ochronny przestaje być „czysty”.
                </li>
                <li>
                  <strong>Najczęstszy objaw: wybija RCD na {stan.miejsce === "jacht" ? "kei" : "słupku"}.</strong> Część prądu
                  wraca przez PE, z pominięciem RCD, więc RCD widzi różnicę i wyłącza. To wyłączenie jest bezpieczne, ale mylące:
                  łatwo obwinić {stan.miejsce === "jacht" ? "keję" : "słupek"} i szukać obejścia. Nie szukaj — rozłącz N–PE.
                </li>
                <li>
                  <strong>Groźny przypadek: stare przyłącze bez RCD.</strong> Nic nie wybija, a PE stale niesie prąd. Jeśli w
                  sieci przerwie się przewód PEN, cały prąd powrotny szuka drogi przez PE i{" "}
                  {stan.miejsce === "jacht" ? "kadłub" : "podwozie"}. Na {stan.miejsce === "jacht" ? "metalowych częściach jachtu" : "karoserii"}{" "}
                  może pojawić się niebezpieczne napięcie. Porażony zostaje ktoś, kto {stan.miejsce === "jacht" ? "ich" : "jej"} dotyka, stojąc na{" "}
                  {stan.miejsce === "jacht" ? "pomoście" : "trawie"}.
                </li>
                {stan.miejsce === "jacht" && (
                  <li>
                    <strong>Na jachcie jest gorzej.</strong> Prąd płynący przewodem ochronnym przez wodę powoduje korozję części
                    podwodnych. W marinie prąd w wodzie grozi też porażeniem pływających w pobliżu. Dlatego przepisy jachtowe są tu
                    szczególnie ostre.
                  </li>
                )}
              </ol>
              <p className="text-small text-muted-foreground">
                Ta usterka nie zabija od razu, tak jak brak N–PE na samym falowniku. Łamie jednak podstawową regułę układu i przy
                drugiej usterce — przerwanym PEN — robi się groźna. Dlatego aplikacja pokazuje ją na czerwono, tak jak
                nieuziemioną obudowę.
              </p>
            </>
          )}
          {stan.miejsce === "kamper" && (
            <p className="text-small text-muted-foreground">
              <strong>Przy dłuższym postoju</strong> szpilka uziemiająca wbita w grunt ma sens jako dodatek. Nie zastępuje
              połączenia wyrównawczego ani RCD.
            </p>
          )}
          <SchematPetliZwarcia />
        </section>
      )}

      <p className="text-small text-muted-foreground">
        Uziemienie w domu, z uziomem w ziemi i pomiarem rezystancji — pełne kalkulatory:{" "}
        <Link href="/kalkulatory/projekt-uziemienia" className="underline">
          Moduł 5 — Projekt uziemienia
        </Link>{" "}
        oraz{" "}
        <Link href="/kalkulatory/uziemienie-funkcjonalne-ochronne" className="underline">
          Moduł 5 — Uziemienie funkcjonalne vs ochronne
        </Link>
        .
      </p>
    </main>
  )
}

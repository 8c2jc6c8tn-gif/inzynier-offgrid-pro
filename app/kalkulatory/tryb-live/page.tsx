import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { StanPusty } from "@/components/ui/stany"

export default function TrybLivePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tryb-live" />
      <NaglowekEkranu tytul="Tryb Live">
        Przełącznik między trybem „Projektowanie” (Kafle 1–12) a trybem „Live” (monitoring
        bieżący). Moduł 13, Ekran 1.
      </NaglowekEkranu>

      <StanPusty tytul="⚪ Brak połączenia z telemetrią">
        <p>
          Tryb Live czerpie dane z falownika/BMS na żywo przez Modbus lub MQTT — to połączenie
          nie jest jeszcze skonfigurowane. Po podłączeniu ten ekran stanie się bramką do
          biblioteki widżetów (Ekran 2: dashboard z wybieranymi widżetami — moc PV, SoC baterii,
          alarmy i inne, docs/domena/Tresc_Modul_13_Live_Ekrany.md).
        </p>
      </StanPusty>

      <p className="text-small text-muted-foreground">
        Do czasu podłączenia telemetrii korzystaj z pozostałych modułów w trybie projektowania —
        liczą na podstawie danych, które wpisujesz ręcznie, nie na żywo.
      </p>
    </main>
  )
}

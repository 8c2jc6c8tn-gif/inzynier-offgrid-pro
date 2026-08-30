import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

export default function TrybLivePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tryb-live" />
      <div>
        <h1 className="text-xl font-semibold">Tryb Live</h1>
        <p className="text-sm text-muted-foreground">
          Przełącznik między trybem „Projektowanie” (Kafle 1–12) a trybem „Live” (monitoring
          bieżący). Moduł 13, Ekran 1.
        </p>
      </div>

      <div className="rounded-lg border-2 border-muted-foreground/30 bg-muted p-4 text-muted-foreground">
        <p className="font-medium">⚪ Brak połączenia z telemetrią</p>
        <p className="mt-2 text-sm">
          Tryb Live czerpie dane z falownika/BMS na żywo przez Modbus lub MQTT — to połączenie nie
          jest jeszcze skonfigurowane. Po podłączeniu ten ekran stanie się bramką do biblioteki
          widżetów (Ekran 2: dashboard z wybieranymi widżetami — moc PV, SoC baterii, alarmy i
          inne, docs/domena/Tresc_Modul_13_Live_Ekrany.md).
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Do czasu podłączenia telemetrii korzystaj z pozostałych modułów w trybie projektowania —
        liczą na podstawie danych, które wpisujesz ręcznie, nie na żywo.
      </p>
    </main>
  )
}

# 07 — Bezpieczeństwo i prywatność

Powiązane: [06 API i sieć](06-api-i-siec.md) · [09 Zasady i granice AI](09-ai-w-produkcie.md) · [11 CI/Deployment](11-ci-deployment.md)

---

## 7.1. Reguła bazowa

Żaden sekret, klucz API ani logika płatności nie trafia do kodu klienta. Walidacja i sanityzacja każdego wejścia, na każdej warstwie, która je przyjmuje (patrz 4.5).

## 7.2. Mapowanie zabezpieczeń natywnych → web (gdy projekt startuje jako PWA/web z myślą o mobile)

| Wymóg natywny | Odpowiednik web/PWA |
|---|---|
| Android Keystore / iOS Keychain | WebCrypto + sekrety wyłącznie po stronie serwera; tokeny w HttpOnly cookies |
| Obfuskacja (ProGuard/DexGuard/iXGuard) | minifikacja bundla; świadomość, że brak sekretów w kliencie jest jedyną realną ochroną |
| Root/jailbreak/SSL pinning | poza zakresem web; nagłówki bezpieczeństwa + wymuszone HTTPS |
| Restore purchases (App/Play Store) | odpowiednik płatności webowych (rozdział 12), natywne restore dopiero w wersji mobile |

## 7.3. Nagłówki bezpieczeństwa

`X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` (ograniczaj do faktycznie używanych uprawnień, np. geolokalizacja `=(self)`).

## 7.4. Checklist bezpieczeństwa kodu (definicja ukończenia — patrz też 10.4, 14.6)

- Brak sekretów w repozytorium (konfiguracja wyłącznie przez zmienne środowiskowe).
- Walidacja ścieżek plików (zapobieganie path traversal) przy każdej operacji na systemie plików sterowanej danymi użytkownika.
- Ograniczenie rozmiaru i kontrola formatu uploadów (zdjęcia, dokumenty).
- Zakaz wykonywania kodu dostarczonego przez użytkownika.
- Zakaz budowania komend powłoki przez konkatenację tekstu (parametryzowane wywołania zawsze).

## 7.5. Prywatność lokalna-domyślna

**Reguła.** Dane wrażliwe (zdjęcia, lokalizacja, dane osobowe) pozostają domyślnie lokalnie na urządzeniu. Wysłanie ich do chmury (backup, przetwarzanie przez model AI, funkcje społecznościowe) wymaga:
- jawnej, świadomej zgody (opt-in, nigdy opt-out jako domyślny stan),
- jasnej informacji, co dokładnie zostanie wysłane,
- możliwości anonimizacji przed wysyłką,
- możliwości późniejszego usunięcia wysłanych danych.

**Uzasadnienie.** To rozszerza zasadę offline-first (rozdział 05) o wymiar prywatności, nie tylko dostępności — "działa bez internetu" i "nic nie wycieka bez zgody" to dwie osobne, równie ważne właściwości.

**Konsekwencja przy funkcjach lokalizacyjnych/społecznościowych.** Jeśli aplikacja udostępnia przybliżoną lokalizację innym użytkownikom (np. do porównań regionalnych), pozycja jest zaokrąglana do siatki/gminy, **nigdy** dokładny punkt GPS — to nie jest tylko kwestia prywatności w sensie ogólnym, ujawnienie dokładnej lokalizacji instalacji o wysokiej wartości (np. duży magazyn energii) to realne ryzyko włamania. Rozdzielczość ma to uwzględniać od pierwszej wersji, nie jako poprawkę po fakcie.

## 7.6. Bezpieczeństwo płatności i freemium

Egzekwowanie limitów tier'u freemium wyłącznie po stronie serwera, nigdy tylko w UI klienta (rozdział 12) — UI-only ograniczenie jest trywialne do obejścia i nie jest zabezpieczeniem.

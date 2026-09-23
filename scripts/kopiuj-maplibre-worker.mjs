/**
 * Kopiuje worker MapLibre GL (i jego wspólny moduł) z zainstalowanej paczki do `public/maplibre/`.
 *
 * MapLibre GL 6 szuka workera jako pliku OBOK własnego modułu (`new URL("./maplibre-gl-worker.mjs",
 * import.meta.url)`); po zbundlowaniu przez Next ten plik nie istnieje ("Worker failed to load",
 * 24.09.2026). Mapa wskazuje kopię przez `setWorkerUrl` (components/lokalizacja/mapa-dzialki.tsx).
 * Uruchamiane przed `dev` i `build`, więc kopia zawsze pasuje do wersji z pnpm-lock.yaml; katalog
 * docelowy jest w .gitignore — w repo nie ma skopiowanego kodu biblioteki.
 */
import { copyFileSync, mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"

const require = createRequire(import.meta.url)
const zrodlo = dirname(require.resolve("maplibre-gl/dist/maplibre-gl.mjs"))
const cel = join(import.meta.dirname, "..", "public", "maplibre")
mkdirSync(cel, { recursive: true })
for (const plik of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(join(zrodlo, plik), join(cel, plik))
console.log(`maplibre-gl: worker skopiowany do ${cel}`)

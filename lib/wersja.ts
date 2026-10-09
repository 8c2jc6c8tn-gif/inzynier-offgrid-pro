/**
 * Version of the running app, stamped at build time by `next.config.mjs` (package.json version + short commit hash). Printouts show it
 * next to the version of the calculation engine, so a saved result can be told apart from one computed under later rules or data.
 */
export const WERSJA_APLIKACJI = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"
/** Short commit hash of the build; empty when the build had no git information. */
export const KOMPILACJA = process.env.NEXT_PUBLIC_BUILD_ID ?? ""

/** "0.1.0 (a1b2c3d)" or just "0.1.0" without a build id. */
export const wersjaZeZnacznikiem = (): string => (KOMPILACJA === "" ? WERSJA_APLIKACJI : `${WERSJA_APLIKACJI} (${KOMPILACJA})`)

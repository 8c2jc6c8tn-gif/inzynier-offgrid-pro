/**
 * The user's own company data for printouts (offer sheet of the panel comparison, later other documents): name, contact lines and a
 * logo. Stored on the device only (an autosaved draft under its own key, so it is typed once for every screen); never sent anywhere.
 * Every field is optional — an empty field simply does not appear on the printout.
 */
export type ProfilFirmy = {
  nazwa: string
  adres: string
  nip: string
  telefon: string
  email: string
  www: string
  /** Logo as a PNG data URL already scaled down by `przygotujLogo`; empty = no logo. */
  logo: string
}

export const PROFIL_FIRMY_PUSTY: ProfilFirmy = { nazwa: "", adres: "", nip: "", telefon: "", email: "", www: "", logo: "" }

/** Contact lines in the order they are printed, empty ones dropped (the company name and the logo are printed separately). */
export function linieKontaktuFirmy(f: ProfilFirmy, etykietaNip: string): string[] {
  return [f.adres, f.nip.trim() === "" ? "" : `${etykietaNip} ${f.nip.trim()}`, f.telefon, f.email, f.www].map((x) => x.trim()).filter((x) => x !== "")
}

export const maDaneFirmy = (f: ProfilFirmy): boolean => f.logo !== "" || [f.nazwa, f.adres, f.nip, f.telefon, f.email, f.www].some((x) => x.trim() !== "")

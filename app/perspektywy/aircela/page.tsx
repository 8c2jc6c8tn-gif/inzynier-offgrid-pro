import { notFound } from "next/navigation"
import { WpisPerspektywyArtykul } from "@/components/perspektywy/wpis-perspektywy"
import { znajdzWpisPerspektywy } from "@/lib/perspektywy/wpisy"

export default function AircelaPage() {
  const wpis = znajdzWpisPerspektywy("aircela")
  if (!wpis) notFound()
  return <WpisPerspektywyArtykul wpis={wpis} />
}

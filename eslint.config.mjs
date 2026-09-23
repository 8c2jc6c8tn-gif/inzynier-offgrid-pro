import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["lib/**/*.test.ts", "lib/**/__tests__/**", "public/maplibre/**"],
  },
]

export default eslintConfig

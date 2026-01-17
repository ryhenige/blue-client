import * as structureVariants from "constants/styles/structure"

export default function Structure({ variant = 'card', ...props }) {
  const toUpperCase = variant.charAt(0).toUpperCase() + variant.slice(1)
  const StructureComponent = structureVariants[toUpperCase]
  return <StructureComponent {...props} />
}

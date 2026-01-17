import * as inputVariants from "constants/styles/inputs"

export default function Input({ variant = 'primary', ...props }) {
  const toUpperCase = variant.charAt(0).toUpperCase() + variant.slice(1)
  const InputComponent = inputVariants[toUpperCase]
  return <InputComponent {...props} />
}

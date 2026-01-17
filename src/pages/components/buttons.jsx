import * as buttonVariants from "constants/styles/buttons"

export default function Button({ theme = 'primary', ...props }) {
  const toUpperCase = theme.charAt(0).toUpperCase() + theme.slice(1)
  const ButtonComponent = buttonVariants[toUpperCase]
  return <ButtonComponent {...props} />
}
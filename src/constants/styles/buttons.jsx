import styled, { css} from "styled-components"
import { COLORS } from "ui/colors"
import { SIZES } from "ui/sizes"

const Base = css`
  background: ${COLORS.primary.base};
  border: 1px solid ${COLORS.primary.base};
  color: ${COLORS.white};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 5px;
  
  ${props => props.scale ? 'width: 100%;' : 'width: max-content;'}
  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}
  
  &:hover {
    background: ${COLORS.primary.hover};
    border-color: ${COLORS.primary.hover};
    box-shadow: 0 4px 12px ${COLORS.primary.base}33;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.danger {
    &:hover {
      background: ${COLORS.error.base};
      border-color: ${COLORS.error.base};
      color: ${COLORS.white};
    }
  }
`

const Primary = styled.button`
  ${Base}
`

const Secondary = styled.button`
  ${Base}
  background: ${COLORS.white};
  border: 2px solid ${COLORS.primary.base};
  color: ${COLORS.primary.base};
  padding: ${SIZES.button.padding};
  font-size: 1rem;
  
  &:hover {
    background: ${COLORS.primary.base};
    color: ${COLORS.white};
  }
`

const Action = styled.button`
  ${Base}
  background: ${COLORS.white};
  border: 1px solid ${COLORS.quaternary.base};
  color: ${COLORS.quaternary.base};
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 400;
  
  &:hover {
    background: ${COLORS.quaternary.base};
    border-color: ${COLORS.quaternary.base};
    color: ${COLORS.white};
  }
  
  &.storybook {
    width: auto;
    max-width: 150px;
  }
`

const Back = styled.button`
  ${Base}
  background: ${COLORS.white};
  border: 1px solid ${COLORS.secondary.base};
  color: ${COLORS.secondary.base};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  
  &:hover {
    background: ${COLORS.secondary.base};
    border-color: ${COLORS.secondary.base};
    color: ${COLORS.white};
    box-shadow: 0 2px 8px ${COLORS.secondary.base}33;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.storybook {
    position: static;
    top: unset;
    right: unset;
    width: auto;
    max-width: 160px;
  }
`

export { Primary, Secondary, Action, Back }
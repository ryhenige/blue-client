import styled, { css } from "styled-components"
import { COLORS } from "ui/colors"

const Base = css`
  background: ${COLORS.background.card};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid ${COLORS.background.glass};
  box-shadow: 0 8px 32px ${COLORS.background.overlay};
`

const Card = styled.div`
  ${Base}
  padding: 2rem;
`

const GlassCard = styled.div`
  ${Base}
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`

const CompactCard = styled.div`
  ${Base}
  padding: 1rem;
  border-radius: 12px;
`

const ElevatedCard = styled.div`
  ${Base}
  box-shadow: 0 12px 48px ${COLORS.background.overlay};
  border: 2px solid ${COLORS.background.glass};
`

const Modal = styled.div`
  ${Base}
  padding: 2.5rem;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
`

const Panel = styled.div`
  ${Base}
  padding: 1.5rem;
  border-radius: 16px;
  border: 2px solid ${COLORS.background.glass};
`

export { Card, GlassCard, CompactCard, ElevatedCard, Modal, Panel }

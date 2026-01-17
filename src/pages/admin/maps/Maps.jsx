import React from 'react'
import SideSelector from "pages/admin/components/SideSelector"

const MAP_REGISTRY = {
  
}

export default function Maps() {
  return (
    <SideSelector
      title="Maps"
      descriptiveTitle="map"
      registry={MAP_REGISTRY}
    />
  )
}
import React from 'react'
import { Riple,OrbitProgress } from 'react-loading-indicators';
function Loding() {
  return (
    <div>
      {/* <Riple color="#000000" size="medium" text="" textColor="" /> */}
      <OrbitProgress variant="spokes" color="#FF7426" size="medium" text="" textColor="" />
    </div>
  )
}

export default Loding

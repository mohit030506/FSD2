import React, { useRef, useEffect } from 'react'

export default function RenderCountBadge() {
  const renderCount = useRef(0)
  renderCount.current += 1

  const badgeRef = useRef(null)

  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.classList.remove('flash-render')
      // Trigger a reflow to restart the flash animation
      void badgeRef.current.offsetWidth
      badgeRef.current.classList.add('flash-render')
    }
  })

  return (
    <span 
      ref={badgeRef} 
      className="render-badge" 
      data-testid="render-badge"
    >
      R: {renderCount.current}
    </span>
  )
}

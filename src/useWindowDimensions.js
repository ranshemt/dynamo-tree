/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import throttle from 'lodash/throttle'
export default function useWindowDimensions() {
  let isIOS = false
  if (
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    isIOS = true
  }
  if (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    isIOS = true
  }
  const [height, setHeight] = React.useState(isIOS ? window.screen.height : window.innerHeight)
  const [width, setWidth] = React.useState(isIOS ? window.screen.width : window.innerWidth)
  React.useLayoutEffect(() => {
    function handleResize() {
      setHeight(isIOS ? window.screen.height : window.innerHeight)
      setWidth(isIOS ? window.screen.width : window.innerWidth)
    }
    handleResize()
    const tHandler = throttle(handleResize, 10)
    window.addEventListener('resize', tHandler)
    return () => window.removeEventListener('resize', tHandler)
  }, [])
  return [height, width]
}

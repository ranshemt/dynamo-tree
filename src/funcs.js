export const getWindowDimensions = () => {
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
  const height = isIOS ? window.screen.height : window.innerHeight
  const width = isIOS ? window.screen.width : window.innerWidth
  return { height, width }
}

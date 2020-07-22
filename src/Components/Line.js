import React from 'react'

const Line = (props) => {
  const makeStyleObj = (x1, y1, x2, y2) => {
    const a = x1 - x2
    const b = y1 - y2
    const c = Math.sqrt(a * a + b * b)
    const sx = (x1 + x2) / 2
    const sy = (y1 + y2) / 2
    const x = sx - c / 2
    const y = sy
    const alpha = Math.PI - Math.atan2(-b, a)

    return {
      zIndex: 1,
      border: '1px solid black',
      width: c,
      position: 'absolute',
      top: y,
      left: x,
      transform: `rotate(${alpha}rad)`,
    }
  }

  return <div style={makeStyleObj(props.x, props.y, props.parentX, props.parentY)} />
}

export default Line

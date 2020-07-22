import React from 'react'
import { Typography } from '@material-ui/core'
import User from './User'
const Line = (props) => {
  const makeLineStyle = (x1, y1, x2, y2) => {
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
  return <div style={makeLineStyle(props.x, props.y, props.parentX, props.parentY)} />
}
const Tree = (props) => {
  const hasChildren = (user) => {
    return user.children && user.children.length
  }
  const level = props.level || 0
  //
  //
  //
  const userRef = React.useRef(null)
  // const { members, levelll, parentX, parentY, parentName } = props
  // React.useLayoutEffect(() => {
  //   console.log('tree renders because props.members change')
  // }, [members])
  // React.useLayoutEffect(() => {
  //   console.log('tree renders because props.levelll change')
  // }, [levelll])
  // React.useLayoutEffect(() => {
  //   console.log('tree renders because props.parentX change')
  // }, [parentX])
  // React.useLayoutEffect(() => {
  //   console.log('tree renders because props.parentY change')
  // }, [parentY])
  // React.useLayoutEffect(() => {
  //   console.log('tree renders because props.parentName change')
  // }, [parentName])
  //
  //
  //
  return (
    <React.Fragment>
      {props.members.length ? (
        <div level={level}>
          {props.members.map((user, i) => (
            <div key={`level-${level}-${i}`}>
              <User ref={userRef} {...user} />
              {level > 0 && (
                <Line x={user.x} y={user.y} parentX={props.parentX} parentY={props.parentY} />
              )}
              {/*level > 0 && console.log(`id = ${user.id} ref = ${userRef.current}`)*/}
              {hasChildren(user) ? (
                <Tree
                  members={user.children}
                  level={level + 1}
                  parentX={user.x}
                  parentY={user.y}
                  parentName={user.name}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="h2">no children</Typography>
      )}
    </React.Fragment>
  )
}
export default Tree

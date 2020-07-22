import React from 'react'

import { Typography } from '@material-ui/core'

import User from './User'
import Line from './Line'

const Tree = (props) => {
  const hasChildren = (user) => {
    return user.children && user.children.length
  }

  const level = props.level || 0

  return (
    <React.Fragment>
      {props.members.length ? (
        <div level={level}>
          {props.members.map((user, i) => (
            <div key={`level-${level}-${i}`}>
              <User id={user.id} {...user} />

              {level > 0 && (
                <Line x={user.x} y={user.y} parentX={props.parentX} parentY={props.parentY} />
              )}

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

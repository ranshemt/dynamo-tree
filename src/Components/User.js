import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import PersonIcon from '@material-ui/icons/Person'
import GroupAddIcon from '@material-ui/icons/GroupAdd'

import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
} from '@material-ui/core'

import { store } from '../App/store'

import { UserStyles } from '../styles'

const useStyles = makeStyles(UserStyles)

const User = (props) => {
  const myStore = React.useContext(store)
  const state = myStore.state
  const dispatch = myStore.dispatch

  const classes = useStyles()

  const [name, setName] = React.useState(props.name)
  const [totalSales, setTotalSales] = React.useState(props.totalSales)

  const addChild = (e) => {
    e.stopPropagation()

    if (state.parentID === props.id) {
      dispatch({ type: 'addUserMode' }) //exit add user mode

      dispatch({ type: 'forgetParent' }) //forget parent
    } else {
      dispatch({ type: 'rememberParent', payload: props.id }) //remember parent

      dispatch({ type: 'addUserMode' }) //enter add user mode
    }
  }

  const startEdit = (e) => {
    e.stopPropagation()

    dispatch({ type: 'editingUserStart', payload: props.id })
  }

  const finishEdit = (e) => {
    e.stopPropagation()

    if (name == null || name === '') {
      dispatch({
        type: 'error',
        payload: 'name empty',
      })
      return
    }

    if (totalSales == null || !Number.isInteger(Number(totalSales)) || totalSales < 0) {
      dispatch({
        type: 'error',
        payload: 'total sales must be a positive integer number',
      })
      return
    }

    dispatch({ type: 'updateUser', payload: { id: props.id, name, totalSales } })

    dispatch({ type: 'editingUserFinish' })
  }

  const isEditing = () => props.id === state.editedUserID

  const isAddingChild = () => state.parentID && state.parentID === props.id

  const formatSum = (sum) => sum.toLocaleString(undefined, { maximumFraction: 4 })

  return (
    <Card
      className={clsx(classes.root, (isAddingChild() || isEditing()) && classes.focused)}
      style={{ top: props.y, left: props.x }}
      elevation={isAddingChild() ? 10 : 5}
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="user-avatar" className={classes.avatar}>
            {props.name.charAt(0) || name.charAt(0) || <PersonIcon />}
          </Avatar>
        }
        title={
          isEditing() ? (
            <TextField
              label="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Typography variant="h6">{props.name}</Typography>
          )
        }
      />

      <CardContent>
        {isEditing() ? (
          <TextField
            label="כמות מכירות"
            value={totalSales || ''}
            onChange={(e) => setTotalSales(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <Typography variant="h6">כמות מכירות: {props.totalSales}</Typography>

            <Typography variant="body1" style={{ marginTop: 8 }}>
              הכנסה ישירה: {formatSum(props.total)} ₪
            </Typography>

            <Typography variant="body1" style={{ marginTop: 8 }}>
              סה"כ עמלות: {formatSum(props.fees)} ₪
            </Typography>

            <Typography variant="body1" style={{ marginTop: 8, fontWeight: 'bold' }}>
              סה"כ: {formatSum(props.TOTAL)} ₪
            </Typography>
          </>
        )}
      </CardContent>

      <CardActions>
        {/** add child, enabled if marked as parentID or no other user is edited */}
        <IconButton
          aria-label="add-child"
          onClick={addChild}
          disabled={Boolean(state.editedUserID) || (state.addUserMode && !isAddingChild())}
        >
          <GroupAddIcon />
        </IconButton>

        {/** edit user, enabled if currently being edited or no other is edited */}
        <IconButton
          aria-label="edit"
          disabled={(state.editedUserID && !isEditing()) || state.addUserMode}
          onClick={isEditing() ? finishEdit : startEdit}
        >
          {isEditing() ? <DoneIcon /> : <EditIcon />}
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default User

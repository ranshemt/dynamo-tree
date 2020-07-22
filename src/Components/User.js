import React from 'react'
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
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import PanToolIcon from '@material-ui/icons/PanTool'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import PersonIcon from '@material-ui/icons/Person'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import { store } from '../App/store'
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    minWidth: 200,
    maxWidth: '70%',
    cursor: 'default',
    zIndex: 10,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  focused: {
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
  },
}))
//
const User = (props) => {
  const classes = useStyles()
  const myStore = React.useContext(store)
  const state = myStore.state
  const dispatch = myStore.dispatch
  const [name, setName] = React.useState(props.name)
  const [totalSales, setTotalSales] = React.useState(props.totalSales)
  //
  const changePos = (e) => {
    e.stopPropagation()
  }
  const addChild = (e) => {
    e.stopPropagation()
    if (state.parentID === props.id) {
      //exit add user mode
      dispatch({ type: 'addUserMode' })
      //forget parent
      dispatch({ type: 'forgetParent' })
    } else {
      //remember parent
      dispatch({ type: 'rememberParent', payload: props.id })
      //enter add user mode
      dispatch({ type: 'addUserMode' })
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
  //
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
        {/** move child, enabled if currently being edited or no other is edited  */}
        <IconButton
          aria-label="move"
          disabled={(state.editedUserID && !isEditing()) || state.addUserMode}
          onClick={changePos}
        >
          <PanToolIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
export default User

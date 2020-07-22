import React from 'react'
import { Paper, Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import NightsStayOutlinedIcon from '@material-ui/icons/NightsStayOutlined'
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined'
import { store } from '../App/store'
//
const useStyles = makeStyles((theme) => ({
  menuContainer: {
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '40%',
    maxWidth: '90%',
    margin: theme.spacing(2, 0, 0, 2),
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1, 2),
    color: theme.palette.primary.contrastText,
    cursor: 'default',
  },
  menuIcon: {
    fontSize: '2rem',
    color: theme.palette.primary.contrastText,
  },
  addUserActivated: {
    color: '#121212',
  },
}))
//
const Menu = () => {
  const myStore = React.useContext(store)
  const state = myStore.state
  const dispatch = myStore.dispatch
  const classes = useStyles()

  const onClickStopPropagation = (e) => e.stopPropagation()
  //
  return (
    <Paper className={classes.menuContainer} onClick={(e) => e.stopPropagation()}>
      <Typography variant="h4" component="h1">
        Dynamo
      </Typography>
      <div style={{ flexGrow: 100 }} />
      <IconButton
        aria-label="add-person"
        disabled={Boolean(state.editedUserID)}
        //toggle add user mode
        // onClick={(e) => onClickStopPropagation(e, dispatch({ type: 'addUserMode' }))}
        onClick={(e) => {
          e.stopPropagation()
          dispatch({ type: 'addUserMode' })
          //if entered add user mode from node and toggling now -> forget parent
          if (state.parentID) {
            dispatch({ type: 'forgetParent' })
          }
        }}
      >
        <PersonAddIcon
          className={clsx(classes.menuIcon, state.addUserMode && classes.addUserActivated)}
        />
      </IconButton>
      <IconButton
        aria-label="export-csv"
        disabled={Boolean(state.editedUserID) || state.addUserMode}
        onClick={(e) => onClickStopPropagation(e, dispatch({ type: 'exportCSV' }))}
      >
        <TableChartOutlinedIcon className={classes.menuIcon} />
      </IconButton>
      <IconButton
        aria-label="change-theme"
        onClick={(e) => onClickStopPropagation(e, dispatch({ type: 'changeTheme' }))}
      >
        {state.theme === 'light' ? (
          <NightsStayOutlinedIcon className={classes.menuIcon} />
        ) : (
          <Brightness5OutlinedIcon className={classes.menuIcon} />
        )}
      </IconButton>
    </Paper>
  )
}
export default Menu

import React from 'react'
//
import {
  MuiThemeProvider,
  createMuiTheme,
  StylesProvider,
  jssPreset,
  responsiveFontSizes,
  makeStyles,
} from '@material-ui/core/styles'
import clsx from 'clsx'
import { create } from 'jss'
import rtl from 'jss-rtl'
import lightGreen from '@material-ui/core/colors/lightGreen'
import green from '@material-ui/core/colors/green'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { Paper, IconButton, Snackbar } from '@material-ui/core'
//
import { store } from './store'
import Menu from '../Components/Menu'
import Tree from '../Components/Tree'
import useWindowDimensions from '../Hooks/useWindowDimensions'
//
const jss = create({ plugins: [...jssPreset().plugins, rtl()] })
const defaultTheme = {
  root: {
    flexGrow: 1,
  },
  direction: 'ltr',
  palette: {
    type: 'light',
    primary: { ...lightGreen, main: lightGreen[700] },
    secondary: green,
  },
}
//
const useStyles = makeStyles((theme) => ({
  scrollNode: {
    position: 'absolute',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    boxSizing: 'border-box',
    overflow: 'auto',
    //new standard (firefox)
    scrollbarWidth: 'thin',
    scrollbarColor: '#689f38 rgba(0, 0, 0, 0)',
    //webkit browsers
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '10px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(255,255,255,0)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#689f38',
      outline: '1px solid rgba(255, 255, 255, 0)',
      borderRadius: 100,
    },
  },
  appContainer: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    boxSizing: 'border-box',
  },
  defaultCursor: {
    cursor: 'default',
  },
  addUserCursor: {
    cursor: 'crosshair',
  },
  arrowIcon: {
    fontSize: '3rem',
    '&:hover': {
      fontSize: '5rem',
    },
  },
  extendLeft: {
    zIndex: 100,
    position: 'fixed',
    left: 0,
    top: '50%',
    bottom: '50%',
    marginLeft: theme.spacing(0.5),
  },
  extendRight: {
    zIndex: 100,
    position: 'fixed',
    right: 0,
    top: '50%',
    bottom: '50%',
    marginRight: theme.spacing(0.5),
    transform: 'rotate(180deg)',
  },
  extendBottom: {
    zIndex: 100,
    position: 'fixed',
    bottom: 0,
    right: '50%',
    left: '50%',
    marginBottom: theme.spacing(1.5),
    transform: 'rotate(270deg)',
  },
  rightZero: {
    right: 0,
  },
  leftZero: {
    left: 0,
  },
}))
//
const App = () => {
  const scrollNodeRef = React.useRef(null)
  const mainCanvasRef = React.useRef(null)
  const myStore = React.useContext(store)
  const state = myStore.state
  const dispatch = myStore.dispatch
  const classes = useStyles()
  const [screenHeight, screenWidth] = useWindowDimensions()
  //
  const getDimensions = () => ({
    height: state.customDimensions ? Math.max(screenHeight, state.height) : screenHeight,
    width: state.customDimensions ? Math.max(screenWidth, state.width) : screenWidth,
  })
  const onPaperClick = (e) => {
    if (state.editedUserID) {
      dispatch({
        type: 'error',
        payload: 'you must first edit the new user',
      })
      return
    }
    if (!state.addUserMode) {
      dispatch({
        type: 'error',
        payload: 'If you want to add new user click on the button in the top menu',
      })
      return
    }
    //
    const { left, top } = e.target.getBoundingClientRect()
    const { pageX, pageY } = e
    const x = pageX - left
    const y = pageY - top
    // console.log(`adding user at: (${x}, ${y})`)
    //create new user
    dispatch({ type: 'createUser', payload: { x, y } })
    //exit addUserMode
    dispatch({ type: 'addUserMode' })
  }
  const onClickStopPropagation = (e) => e.stopPropagation()
  //
  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider
        theme={responsiveFontSizes(
          createMuiTheme({
            ...defaultTheme,
            direction: state.direction,
            palette: {
              ...defaultTheme.palette,
              type: state.theme,
              background: {
                paper: state.theme === 'light' ? '#f2f2f2' : '#121212',
              },
            },
          })
        )}
      >
        <div
          id="scrollNode"
          ref={scrollNodeRef}
          dir={state.direction}
          className={clsx(
            classes.scrollNode,
            state.direction === 'ltr' ? classes.leftZero : classes.rightZero
          )}
          style={{ height: screenHeight, width: screenWidth }}
        >
          <Paper
            id="mainCanvas"
            ref={mainCanvasRef}
            square
            elevation={0}
            className={clsx(
              classes.appContainer,
              state.addUserMode ? classes.addUserCursor : classes.defaultCursor,
              state.direction === 'ltr' ? classes.leftZero : classes.rightZero
            )}
            style={getDimensions()}
            onClick={onPaperClick}
          >
            <Menu />
            <IconButton
              aria-label="extend-left"
              className={classes.extendLeft}
              onClick={(e) =>
                onClickStopPropagation(e, dispatch({ type: 'extend', payload: 'width' }))
              }
            >
              <ArrowBackIosIcon className={classes.arrowIcon} />
            </IconButton>
            <IconButton
              aria-label="extend-right"
              className={classes.extendRight}
              onClick={(e) =>
                onClickStopPropagation(e, dispatch({ type: 'extend', payload: 'width' }))
              }
            >
              <ArrowBackIosIcon className={classes.arrowIcon} />
            </IconButton>
            <IconButton
              aria-label="extend-bottom"
              className={classes.extendBottom}
              onClick={(e) =>
                onClickStopPropagation(e, dispatch({ type: 'extend', payload: 'height' }))
              }
            >
              <ArrowBackIosIcon className={classes.arrowIcon} />
            </IconButton>
            <Tree members={state.tree} />
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={Boolean(state.error)}
              onClose={() => dispatch({ type: 'errorDismiss' })}
              autoHideDuration={3500}
              message={state.error}
            />
          </Paper>
        </div>
      </MuiThemeProvider>
    </StylesProvider>
  )
}
export default App

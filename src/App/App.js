import React from 'react'

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

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import { Paper, IconButton, Snackbar } from '@material-ui/core'

import { store } from './store'
import Menu from '../Components/Menu'
import Tree from '../Components/Tree'
import useWindowDimensions from '../useWindowDimensions'

import { defaultTheme, AppStyles } from '../styles'

const jss = create({ plugins: [...jssPreset().plugins, rtl()] })
const useStyles = makeStyles(AppStyles)

const App = () => {
  const myStore = React.useContext(store)
  const state = myStore.state
  const dispatch = myStore.dispatch

  const classes = useStyles()

  const scrollNodeRef = React.useRef(null)
  const mainCanvasRef = React.useRef(null)

  const [screenHeight, screenWidth] = useWindowDimensions()

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

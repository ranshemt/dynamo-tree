import React from 'react'
//
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
//
import lightGreen from '@material-ui/core/colors/lightGreen'
import green from '@material-ui/core/colors/green'
import {
  MuiThemeProvider,
  createMuiTheme,
  StylesProvider,
  jssPreset,
  responsiveFontSizes,
  makeStyles,
} from '@material-ui/core/styles'
import { create } from 'jss'
import rtl from 'jss-rtl'
//
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
const jss = create({ plugins: [...jssPreset().plugins, rtl()] })
const useStyles = makeStyles((theme) => ({
  containerPadding: {
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
  },
  flexContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: lightGreen[700],
  },
  header: {
    color: theme.palette.primary.contrastText,
  },
  loader: {
    marginTop: 50,
    color: theme.palette.primary.contrastText,
  },
}))
//
const LoadingScreen = () => {
  //
  const classes = useStyles()
  //
  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={responsiveFontSizes(createMuiTheme(defaultTheme))}>
        <div dir={defaultTheme.direction}>
          <Container maxWidth="xl" className={classes.containerPadding}>
            <Paper className={classes.flexContainer}>
              <Typography variant="h2" className={classes.header}>
                Loading
              </Typography>
              <CircularProgress className={classes.loader} size="5rem" />
            </Paper>
          </Container>
        </div>
      </MuiThemeProvider>
    </StylesProvider>
  )
}
//
export default LoadingScreen

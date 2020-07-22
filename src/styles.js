import lightGreen from '@material-ui/core/colors/lightGreen'
import green from '@material-ui/core/colors/green'

export const defaultTheme = {
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

export const AppStyles = (theme) => ({
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
})

export const MenuStyles = (theme) => ({
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
})

export const UserStyles = (theme) => ({
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
})

import React from 'react'

import { CircularProgress } from '@material-ui/core'

import { StateProvider } from './store.js'
import App from './App'

const AppLoader = () => {
  const [isLoadingApp, setIsLoadingApp] = React.useState(true)
  const [storedData, setStoredData] = React.useState(null)

  React.useEffect(() => {
    setIsLoadingApp(true)

    let parsedStoredApp = null
    try {
      const storedStringApp = localStorage.getItem('@appKey')
      if (storedStringApp) {
        parsedStoredApp = JSON.parse(storedStringApp)
      } else {
        parsedStoredApp = {}
      }
    } catch (e) {
      console.log('error parsing or getting stored app data')
      parsedStoredApp = {}
    }

    let parsedStoredTree = null
    try {
      const storedStringTree = localStorage.getItem('@treeKey')
      if (storedStringTree) {
        parsedStoredTree = JSON.parse(storedStringTree)
      } else {
        parsedStoredTree = []
      }
    } catch (e) {
      console.log('error parsing or getting stored tree data')
      parsedStoredTree = []
    }

    const windowDimensions = getWindowDimensions()

    setStoredData({
      tree: parsedStoredTree,

      error: null,
      addUserMode: false,
      parentID: null,
      editedUserID: parsedStoredApp.hasOwnProperty('editedUserID')
        ? parsedStoredApp.editedUserID
        : null,
      customDimensions: parsedStoredApp.hasOwnProperty('customDimensions')
        ? parsedStoredApp.customDimensions
        : false,
      height: parsedStoredApp.height || windowDimensions.height,
      width: parsedStoredApp.width || windowDimensions.width,
      theme: parsedStoredApp.theme || 'light',
      direction: parsedStoredApp.direction || 'rtl',
    })

    setIsLoadingApp(false)
  }, [])

  return isLoadingApp ? (
    <CircularProgress />
  ) : (
    <StateProvider storedData={storedData}>
      <App />
    </StateProvider>
  )
}

function getWindowDimensions() {
  let isIOS = false
  if (
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    isIOS = true
  }
  if (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  ) {
    isIOS = true
  }
  const height = isIOS ? window.screen.height : window.innerHeight
  const width = isIOS ? window.screen.width : window.innerWidth
  return { height, width }
}

export default AppLoader

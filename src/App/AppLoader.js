import React from 'react'
//
import { LS } from '../Assets/consts'
import App from './App'
import LoadingScreen from './LoadingScreen'
import { StateProvider } from './store.js'
import { getWindowDimensions } from '../funcs'
//
const AppLoader = () => {
  const [isLoadingApp, setIsLoadingApp] = React.useState(true)
  const [storedData, setStoredData] = React.useState(null)
  React.useEffect(() => {
    setIsLoadingApp(true)
    //
    let parsedStoredApp = null
    try {
      const storedStringApp = localStorage.getItem(LS.app)
      if (storedStringApp) {
        parsedStoredApp = JSON.parse(storedStringApp)
      } else {
        parsedStoredApp = {}
      }
    } catch (e) {
      console.log('error parsing or getting stored app data')
      parsedStoredApp = {}
    }
    //
    let parsedStoredTree = null
    try {
      const storedStringTree = localStorage.getItem(LS.tree)
      if (storedStringTree) {
        parsedStoredTree = JSON.parse(storedStringTree)
      } else {
        parsedStoredTree = []
      }
    } catch (e) {
      console.log('error parsing or getting stored tree data')
      parsedStoredTree = []
    }
    //
    const windowDimensions = getWindowDimensions()
    //
    setStoredData({
      tree: parsedStoredTree,
      //
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
    <LoadingScreen />
  ) : (
    <StateProvider storedData={storedData}>
      <App />
    </StateProvider>
  )
}
export default AppLoader

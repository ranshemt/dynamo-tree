import React from 'react'

import { v4 as uuidv4 } from 'uuid'

const store = React.createContext({})
const { Provider } = store

const ticketPrice = 100

const StateProvider = (props) => {
  const extendSize = 250

  const updateAppLS = (newState) => {
    localStorage.setItem(
      '@appKey',
      JSON.stringify({
        ...newState,
        tree: null,
        error: null,
      })
    )
  }

  const updateTreeLS = ({ tree }) => {
    localStorage.setItem('@treeKey', JSON.stringify(tree))
  }

  const getNodeById = (id, node) => {
    let reduce = [].reduce

    function runner(result, node) {
      if (result || !node) return result
      return (
        (node.id === id && node) ||
        runner(null, node.children) ||
        reduce.call(Object(node), runner, result)
      )
    }

    return runner(null, node)
  }

  const sumAll = (tree) => {
    function sumChildren(node) {
      let sum = 0
      for (let i = 0; i < node.children.length; i++) {
        sum += sumChildren(node.children[i])
      }
      node.fees = sum
      node.TOTAL = node.total + node.fees
      return node.TOTAL ? node.TOTAL * 0.2 : sum
    }

    for (let i = 0; i < tree.length; i++) {
      sumChildren(tree[i])
    }
  }

  const JSON2CSV = (tree) => {
    let csv = ''

    function createCsvLineFromNode(node) {
      let csvLine = ''
      csvLine += '"' + node.name + '",'
      // csvLine += node.id + ','
      csvLine += node.totalSales + ','
      csvLine += node.total + ','
      csvLine += node.fees + ','
      csvLine += node.TOTAL + ','
      csvLine += '\r\n'
      return csvLine
    }

    function traverseTree(node) {
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].totalSales === null) continue
        csv += createCsvLineFromNode(node.children[i])
        traverseTree(node.children[i])
      }
    }

    const header =
      'שם,כמות המכירות,סה"כ כסף ממכירות,סה"כ כסף מעמלות של חבריו,סה"כ כסף ממכירות + עמלות של חבריו'
    csv = header + '\r\n'

    for (let i = 0; i < tree.length; i++) {
      if (tree[i].totalSales === null) continue
      csv += createCsvLineFromNode(tree[i])

      traverseTree(tree[i])
    }

    return csv
  }

  const memoizedReducer = React.useCallback((prevState, action) => {
    const newState = { ...prevState }

    switch (action.type) {
      //error & feedback to user
      case 'error':
        newState.error = action.payload
        return newState

      case 'errorDismiss':
        newState.error = null
        return newState

      //user operations
      case 'createUser':
        const newUserID = uuidv4()
        const newUser = {
          id: newUserID,
          x: action.payload.x,
          y: action.payload.y,
          name: '',
          totalSales: null,
          children: [],
          fees: 0,
          total: 0,
          TOTAL: 0,
        }

        if (Boolean(newState.parentID)) {
          const parent = getNodeById(newState.parentID, newState.tree)
          parent.children = [...parent.children, newUser]
          newState.parentID = null
        } else {
          newState.tree = [...newState.tree, newUser]
        }

        updateTreeLS(newState)

        newState.editedUserID = newUserID
        newState.customDimensions = true
        updateAppLS(newState)
        return newState

      case 'rememberParent':
        newState.parentID = action.payload
        return newState

      case 'forgetParent':
        newState.parentID = null
        return newState

      case 'updateUser':
        const { id, name, totalSales } = action.payload
        const child = getNodeById(id, newState.tree)

        child.name = name
        child.totalSales = totalSales
        child.total = totalSales * ticketPrice

        sumAll(newState.tree)
        updateAppLS(newState)
        updateTreeLS(newState)
        return newState

      case 'editingUserStart':
        newState.editedUserID = action.payload
        updateAppLS(newState)
        return newState

      case 'editingUserFinish':
        newState.editedUserID = null
        updateAppLS(newState)
        return newState

      //menu
      case 'exportCSV':
        const csv = JSON2CSV(newState.tree)
        const blob = new Blob(['\ufeff', csv])
        const url = URL.createObjectURL(blob)

        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = 'DynamoTree.csv'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        return newState

      case 'addUserMode':
        newState.addUserMode = !newState.addUserMode
        return newState

      case 'changeTheme':
        newState.theme = newState.theme === 'light' ? 'dark' : 'light'
        updateAppLS(newState)
        return newState

      case 'extend':
        newState.customDimensions = true
        newState[action.payload] += extendSize
        updateAppLS(newState)
        return newState

      default:
        console.log(`unknown action type! ${action.type}`)
        return newState
    }
  }, [])

  const [state, dispatch] = React.useReducer(memoizedReducer, props.storedData)

  return <Provider value={{ state, dispatch }}>{props.children}</Provider>
}

export { store, StateProvider }

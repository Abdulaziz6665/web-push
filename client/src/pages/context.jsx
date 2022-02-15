import React, { createContext, useContext, useState } from 'react'
const Context = createContext()

const DataProvider = ({ children }) => {

  const [newUser, setNewUser] = useState()

  const value = {
    newUser,
    setNewUser
  }

  return (
     <Context.Provider value={value}>
        <Context.Consumer>
           {
              () => children
           }
        </Context.Consumer>
     </Context.Provider>
  )
}

const useNewUser = (setterOnly) => {
  const { newUser, setNewUser } = useContext(Context)
  return setterOnly ? [setNewUser] : [newUser, setNewUser]
}

export {
  DataProvider,
  useNewUser
}
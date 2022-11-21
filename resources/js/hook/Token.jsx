import { createContext, useContext, useState } from "react";

export const globalToken = createContext()

export const useToken = () => {
  return useContext(globalToken)
}

const TokenContext = ({children}) => {
  const [token, setToken] = useState('ini token awal');
  const [exp, setExp] = useState(0);
  return (<globalToken.Provider value={{ token, setToken, exp, setExp }}>
    {children}
  </globalToken.Provider>)
}

export default TokenContext

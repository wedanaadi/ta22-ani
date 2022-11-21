import { createContext, useContext, useReducer } from "react";

// store
const localAuth = localStorage.getItem('isLogin')
const act = localAuth === null ? false : true;
const initState = { auth: act };

const authContext = createContext(initState);

export function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { auth: true };
    case "logout":
      return { auth: false };
    default:
      throw new Error();
  }
}

export function AuthProvider({ children }) {

  const [authed, dispatch] = useReducer(reducer, initState)

  return <authContext.Provider value={[authed, dispatch]}>{children}</authContext.Provider>
};

export default function AuthConsumer() {
  return useContext(authContext);
}

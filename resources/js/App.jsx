import React from "react";
import TokenContext from "./hook/Token";
import Routes from './Routes'

const App = () => {
  return (
    <TokenContext>
      <Routes/>
    </TokenContext>
  );
};

export default App;

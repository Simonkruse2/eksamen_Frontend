import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { HashRouter as Router } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <div>
    <Router>
      <App />
    </Router>
    </div>
  );
};

ReactDOM.render(<AppWithRouter />, document.getElementById("root"));

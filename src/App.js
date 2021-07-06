import React, { Component } from "react";
import UIShell from "./ui-patterns/ui-shell/UIShell";
import "./App.scss";

import "react-sliding-pane/dist/react-sliding-pane.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <UIShell />
      </div>
    );
  }
}

export default App;

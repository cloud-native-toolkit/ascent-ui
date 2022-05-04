import React, { Component } from "react";
import "./App.scss";

import UIShell from './components/ui-shell/UIShell'


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
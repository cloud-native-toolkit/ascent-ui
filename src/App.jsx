import React, { Component } from "react";
import "./App.scss";

import ReactGA from 'react-ga';

import UIShell from './components/ui-shell/UIShell'


class App extends Component {
  
  componentDidMount() {
    ReactGA.initialize('G-MPMLVG3TKT');
  }

  render() {
    return (
      <div className="App">
        <UIShell />
      </div>
    );
  }
}

export default App;
import React, { Component } from "react";
import "./App.scss";

import ReactGA from 'react-ga4';

import UIShell from './components/ui-shell/UIShell';


class App extends Component {

  initReactGA = () => {
    ReactGA.initialize('G-W6ZB5XVKKE', { testMode: process.env.NODE_ENV === 'test' });
  };
  
  componentDidMount() {
    this.initReactGA();
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
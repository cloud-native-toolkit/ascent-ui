import React, { Component } from "react";
import "./patterns.scss";

class Header extends Component {
  render() {
    const { title, subtitle } = this.props;
    return (
      <div className="bx--row pattern-description">
        <div className="bx--col-xs-12">
          <h1 className="pattern-title">{title}</h1>
        </div>
      </div>
    );
  }
}

export default Header;

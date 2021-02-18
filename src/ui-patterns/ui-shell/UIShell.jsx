import React, { Component } from "react";
import {
  Content,
  Header,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink
} from 'carbon-components-react/lib/components/UIShell/';
import UIShellBody from "./UIShellBody";

const Fade20 = () => (
  <svg icon width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12
        12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86
        23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14
        14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59
        10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59
        10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
  </svg>
);

class UIShell extends Component {
  header = "Architecture Builder";
  menuItems = [
    "Overview",
    "Builder",
    "Compliance"
  ]
  builderMenuItems = [
    "Architecture",
    "Services",
    "Autmation",
    "Provisioner"
  ]
  complianceMenuItems = [
    "Controls",
    "Mapping",
    "Service",
    "Nist-800"
  ]


  constructor(props) {
    super(props);
    this.state = {
      patternName: "Overview"
    };
  }

  onPatternSelection = label => {
    this.setState({ patternName: label });
  };

  renderbuilderSideNavItems = () => {
    return this.builderMenuItems.map(label => this.renderbuilderSideNavItem(label));
  };

  renderbuilderSideNavItem = label => {
    return (
      <SideNavMenuItem href="# " isActive={label === this.state.patternName ? true : false} onClick={e => this.onPatternSelection(label)}>{label}</SideNavMenuItem>
    );
  };


  rendercomplianceSideNavItems = () => {
    return this.complianceMenuItems.map(label => this.rendercomplianceSideNavItem(label));
  };

  rendercomplianceSideNavItem = label => {
    return (
      <SideNavMenuItem href="# " isActive={label === this.state.patternName ? true : false} onClick={e => this.onPatternSelection(label)}>{label}</SideNavMenuItem>
    );
  };

  render() {
    return (
      <div>
        <Header aria-label="IBM Platform Name">
          <SkipToContent />
          <HeaderName href="#" prefix="IBM">
            {this.header}
          </HeaderName>
        </Header>

        <SideNav aria-label="Side navigation">
          <SideNavItems>
            <SideNavLink href="javascript:void(0)">OverView</SideNavLink>
            <SideNavMenu title="Builder">
              {this.renderbuilderSideNavItems()}
            </SideNavMenu>
            <SideNavMenu title="Compliance" >
              {this.rendercomplianceSideNavItems()}
            </SideNavMenu>
          </SideNavItems>
        </SideNav>

        <Content id="main-content"><UIShellBody patternName={this.state.patternName} /></Content>
      </div>
    );
  }
}

export default UIShell;

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
import Routes from "./router";


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
        <SideNav
          aria-label="Side navigation">
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
        <Routes />
        <Content id="main-content">
          <UIShellBody patternName={this.state.patternName} />
        </Content>
      </div>
    );
  }
}

export default UIShell;

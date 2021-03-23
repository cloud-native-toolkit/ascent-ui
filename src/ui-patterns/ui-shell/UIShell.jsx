import React, { Component } from "react";


import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderMenuItem,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  HeaderContainer,
  Link as LinkComponent
} from 'carbon-components-react/lib/components/UIShell/';

import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
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


  render() {


    return (

      <div>
        <Router>
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <Header aria-label="IBM FS Cloud Architectures">
                <SkipToContent />
                <HeaderMenuButton
                  aria-label="Open menu"
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <HeaderName href="#" prefix="IBM">
                  FS Cloud Architectures
                </HeaderName>
                <HeaderNavigation aria-label="IBM FS Cloud Architectures">
                </HeaderNavigation>
                <HeaderGlobalBar>
                  <HeaderMenuItem href="/ibm/cloud/appid/logout"><strong>Logout</strong></HeaderMenuItem>
                </HeaderGlobalBar>
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>

                  <SideNavItems>

                    <Link to="/">
                      <SideNavMenuItem>Overview</SideNavMenuItem>
                    </Link>

                    <SideNavMenu title="Builder">
                      <Link to="/architectures">
                        <SideNavMenuItem>Architectures</SideNavMenuItem>
                      </Link>

                      <Link to="/services">
                        <SideNavMenuItem>Services</SideNavMenuItem>
                      </Link>

                    </SideNavMenu>
                    <SideNavMenu title="Compliance" >

                      <Link to="/controls">
                        <SideNavMenuItem>Controls</SideNavMenuItem>
                      </Link>

                      <Link to="/mapping">
                        <SideNavMenuItem>Mapping</SideNavMenuItem>
                      </Link>

                      <Link to="/nists">
                        <SideNavMenuItem>NIST 800-53</SideNavMenuItem>
                      </Link>

                    </SideNavMenu>

                  </SideNavItems>
                </SideNav>
              </Header>
            )}
          />
          <Content>

            <Routes />

          </Content>
        </Router>
      </div>


    );
  }
}

export default UIShell;

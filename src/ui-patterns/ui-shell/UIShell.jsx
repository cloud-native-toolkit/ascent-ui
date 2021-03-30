import React, { Component } from "react";


import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderSideNavItems,
  HeaderPanel, Switcher, SwitcherItem, SwitcherDivider,
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
import BuilderHeader from "../../components/BuilderHeader/BuilderHeader";
import {HeaderGlobalAction} from "carbon-components-react/lib/components/UIShell";
import {
  Fade16,
  UserAvatar20,
  ArrowRight16 as ArrowRight
} from '@carbon/icons-react';

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
      patternName: "Overview",
      profileExpanded: false
    };
  }

  render() {

    return (

      <div>
        <Router>
          <BuilderHeader/>
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <Header aria-label="IBM FS Cloud Architectures" onClick={
                isSideNavExpanded === true ? onClickSideNavExpand : null
              }>
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
                  <HeaderGlobalAction
                    aria-label="App Switcher"
                    isActive={this.state.profileExpanded}
                    onClick={() => this.setState({profileExpanded: !this.state.profileExpanded})}
                    tooltipAlignment="end">
                    <UserAvatar20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
                <HeaderPanel aria-label="Header Panel" expanded={this.state.profileExpanded} style={{'bottom': 'auto', 'padding-bottom': '1rem'}}>
                  <strong style={{padding: '0.375rem 1rem'}}>Username</strong>
                  <Switcher aria-label="Switcher Container">
                      <SwitcherDivider />
                      <SwitcherItem aria-label="Logout" href="/ibm/cloud/appid/logout">
                        <span>Logout</span>
                        <ArrowRight style={{'margin-left': '10px'}}/>
                      </SwitcherItem>
                    </Switcher>
                </HeaderPanel>
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>

                  <SideNavItems>

                    <Link to="/">
                      <SideNavMenuItem>Overview</SideNavMenuItem>
                    </Link>

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

                    <SideNavMenu title="Solution Builder">
                      <Link to="/architectures">
                        <SideNavMenuItem>Architectures</SideNavMenuItem>
                      </Link>

                      <Link to="/services">
                        <SideNavMenuItem>Services</SideNavMenuItem>
                      </Link>
                    </SideNavMenu>

                    <Link to="/docs">
                      <SideNavMenuItem>Documentation</SideNavMenuItem>
                    </Link>


                  </SideNavItems>
                </SideNav>
              </Header>
            )}
          />
          <Content className="content">

            <Routes />

          </Content>
        </Router>
      </div>


    );
  }
}

export default UIShell;

import React, { Component } from "react";


import {
  Tag,
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
} from 'carbon-components-react';

import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import Routes from "./router";
import BuilderHeader from "../../components/BuilderHeader/BuilderHeader";
import {HeaderGlobalAction} from "carbon-components-react/lib/components/UIShell";
import {
  Fade16,
  Launch16,
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
      user: undefined,
      patternName: "Overview",
      profileExpanded: false
    };
  }

  async componentDidMount() {
    fetch('/userDetails')
    .then(res => res.json())
    .then(user => {
      setTimeout(() => {
        // Session expired, redirecting to login
        window.location.reload(false);
      }, (new Date(user?.sessionExpire)).getTime()-Date.now());
      this.setState({ user: user || undefined });
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {

    return (

      <div>
        <Router>
          <BuilderHeader/>
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <Header aria-label="IBM GSI Labs" onClick={
                isSideNavExpanded === true ? onClickSideNavExpand : null
              }>
                <SkipToContent />
                <HeaderMenuButton
                  aria-label="Open menu"
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <HeaderName href="#" prefix="IBM">
                  GSI Labs
                </HeaderName>
                <HeaderNavigation aria-label="GSI Labs">
                </HeaderNavigation>

                <HeaderGlobalBar>
                  <HeaderGlobalAction
                    aria-label="Profile"
                    isActive={this.state.profileExpanded}
                    onClick={() => this.setState({profileExpanded: !this.state.profileExpanded})}
                    tooltipAlignment="end">
                    <UserAvatar20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
                <HeaderPanel aria-label="Header Panel" expanded={this.state.profileExpanded} style={{'bottom': 'auto', 'padding-bottom': '1rem', 'list-style-type': 'none'}}>
                  <li class="bx--switcher__item" style={{display: 'flex'}}>
                    <strong style={{'margin': '0 1rem', 'font-size': '1.3rem'}}>{(this.state.user && this.state.user.name) || "Username"}</strong>
                    <Tag style={{'margin-left': 'auto', 'margin-top': '0px', 'margin-bottom': '8px'}}>{(this.state.user?.role) || "role"}</Tag>
                  </li>
                  <li class="bx--switcher__item"><strong style={{'margin': '0 1rem'}}>{(this.state.user && this.state.user.email) || "example@ibm.com"}</strong></li>
                  <Switcher aria-label="Switcher Container">
                      <SwitcherDivider />
                      <SwitcherItem aria-label="Logout" href="/ibm/cloud/appid/logout" style={{display: 'flex'}}>
                        <span>Logout</span>
                        <ArrowRight style={{'margin-left': 'auto'}}/>
                      </SwitcherItem>
                    </Switcher>
                </HeaderPanel>
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>

                  <SideNavItems>

                    <Link to="/">
                      <SideNavMenuItem>Overview</SideNavMenuItem>
                    </Link>

                    <SideNavMenu title="Solution Builder">

                      <Link to="/solutions">
                        <SideNavMenuItem>Solutions</SideNavMenuItem>
                      </Link>

                      {this.state.user?.roles?.includes("editor") ? <Link to={`/myarchitectures`}>
                        <SideNavMenuItem>Your Architectures</SideNavMenuItem>
                      </Link> : <></>}

                      <Link to="/architectures">
                        <SideNavMenuItem>Architectures</SideNavMenuItem>
                      </Link>

                      <Link to="/services">
                        <SideNavMenuItem>Services</SideNavMenuItem>
                      </Link>
                    </SideNavMenu>

                    <SideNavMenu title="Compliance" >

                      {this.state.user?.roles?.includes("fs-viewer") ? <Link to="/controls">
                        <SideNavMenuItem>Controls</SideNavMenuItem>
                      </Link> : <></>}

                      <Link to="/mapping">
                        <SideNavMenuItem>Mapping</SideNavMenuItem>
                      </Link>

                      <Link to="/nists">
                        <SideNavMenuItem>NIST 800-53</SideNavMenuItem>
                      </Link>

                    </SideNavMenu>

                    <SideNavMenu title="Documentation">

                      <Link to="/docs">
                        <SideNavMenuItem>Overview</SideNavMenuItem>
                      </Link>

                      <a target="_blank" href="https://github.com/cloud-native-toolkit/garage-terraform-modules/blob/main/MODULES.md" >
                        <SideNavMenuItem >
                          Terraform Modules
                          <Launch16 style={{"margin-left": "10px"}} />
                        </SideNavMenuItem>
                      </a>
                      <a target="_blank" href="https://github.com/cloud-native-toolkit/iascable" >
                        <SideNavMenuItem>
                          CLI
                          <Launch16 style={{"margin-left": "10px"}} />
                        </SideNavMenuItem>
                      </a>

                    </SideNavMenu>

                  </SideNavItems>
                </SideNav>
              </Header>
            )}
          />
          <Content className="content" onClick={() => this.setState({profileExpanded: false})}>

            <Routes />

          </Content>
        </Router>
      </div>


    );
  }
}

export default UIShell;

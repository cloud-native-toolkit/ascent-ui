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
  Launch16,
  UserAvatar20,
  Login20,
  Locked16,
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

  async redirectToLogin() {
    window.location.href = "/login";
  }

  async componentDidMount() {
    fetch('/userDetails')
    .then(res => res.json())
    .then(user => {
      if (user.name) {
        setTimeout(() => {
          // Session expired, redirecting to login
          window.location.reload(false);
        }, (new Date(user?.sessionExpire)).getTime()-Date.now());
        this.setState({ user: user || undefined });
      } else {
        console.log(user);
      }
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
              <Header aria-label="IBM Ecosystem Labs" onClick={
                isSideNavExpanded === true ? onClickSideNavExpand : null
              }>
                <SkipToContent />
                <HeaderMenuButton
                  aria-label="Open menu"
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <Link to="/">
                  <HeaderName prefix="IBM">
                    Ecosystem Labs - ASCENT
                  </HeaderName>
                </Link>
                
                <HeaderNavigation aria-label="Ecosystem Labs">
                </HeaderNavigation>

                <HeaderGlobalBar>
                  {this.state.user ? 
                    <HeaderGlobalAction
                      aria-label="Profile"
                      isActive={this.state.profileExpanded}
                      onClick={() => this.setState({profileExpanded: !this.state.profileExpanded})}
                      tooltipAlignment="end">
                      <UserAvatar20 />
                    </HeaderGlobalAction>
                  :
                    <HeaderGlobalAction
                      aria-label="Login / Register"
                      onClick={this.redirectToLogin}
                      tooltipAlignment="end">
                      <Login20 />
                    </HeaderGlobalAction>
                  }
                </HeaderGlobalBar>
                <HeaderPanel aria-label="Header Panel" expanded={this.state.profileExpanded} style={{'bottom': 'auto', 'padding-bottom': '1rem', 'list-style-type': 'none'}}>
                  <li class="bx--switcher__item" style={{display: 'flex'}}>
                    <strong style={{'margin': '0 1rem', 'font-size': '1.3rem'}}>{(this.state.user && this.state.user.name) || "Username"}</strong>
                    <Tag style={{'margin-left': 'auto', 'margin-top': '0px', 'margin-bottom': '8px'}}>{(this.state.user?.role) || "role"}</Tag>
                  </li>
                  <li class="bx--switcher__item"><strong style={{'margin': '0 1rem'}}>{(this.state.user && this.state.user.email) || "example@ibm.com"}</strong></li>
                  <Switcher aria-label="Switcher Container">
                      <SwitcherDivider />
                      <SwitcherItem aria-label="Logout" href="/logout" style={{display: 'flex'}}>
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

                      {this.state.user ?
                        <Link to="/solutions">
                          <SideNavMenuItem>Solutions</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem onClick={this.redirectToLogin} >
                          Solutions
                          <Locked16 style={{ marginLeft: "auto" }}  />
                        </SideNavMenuItem>
                      }

                      {this.state.user?.roles?.includes("editor") ? <Link to={`/myarchitectures`}>
                        <SideNavMenuItem>Your Architectures</SideNavMenuItem>
                      </Link> : <></>}

                      {this.state.user ?
                        <Link to="/architectures">
                          <SideNavMenuItem>Architectures</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem onClick={this.redirectToLogin} >
                          Architectures
                          <Locked16 style={{ marginLeft: "auto" }}  />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <Link to="/services">
                          <SideNavMenuItem>Services</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem onClick={this.redirectToLogin} >
                          Services
                          <Locked16 style={{ marginLeft: "auto" }}  />
                        </SideNavMenuItem>
                      }
                    </SideNavMenu>

                    <SideNavMenu title="Compliance" >

                      {this.state.user?.roles?.includes("fs-viewer") ? <Link to="/onboarding">
                        <SideNavMenuItem>On Boarding</SideNavMenuItem>
                      </Link> : <></>}

                      {this.state.user?.roles?.includes("fs-viewer") ? <Link to="/controls">
                        <SideNavMenuItem>Controls</SideNavMenuItem>
                      </Link> : <></>}

                      {this.state.user ?
                        <Link to="/mapping">
                          <SideNavMenuItem>Mapping</SideNavMenuItem>
                        </Link>
                        :
                          <SideNavMenuItem onClick={this.redirectToLogin} >
                            Mapping
                            <Locked16 style={{ marginLeft: "auto" }}  />
                          </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <Link to="/nists">
                          <SideNavMenuItem>NIST 800-53</SideNavMenuItem>
                        </Link>
                        :
                          <SideNavMenuItem onClick={this.redirectToLogin} >
                            NIST 800-53
                            <Locked16 style={{ marginLeft: "auto" }}  />
                          </SideNavMenuItem>
                      }

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

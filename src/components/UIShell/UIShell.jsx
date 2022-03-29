import React, { Component } from "react";

import {
  Tag, Content, Header, HeaderMenuButton, HeaderName, HeaderNavigation,
  HeaderGlobalBar, HeaderPanel, SwitcherItem, SwitcherDivider,
  SkipToContent, SideNav, SideNavItems, SideNavMenu, SideNavMenuItem,
  HeaderContainer, Toggle
} from 'carbon-components-react';

import {
  BrowserRouter,
  Link,
} from "react-router-dom";

import ErrorBoundary from "../ErrorBoundary";
import AppRoutes from "./AppRoutes";

import { HeaderGlobalAction } from "carbon-components-react/lib/components/UIShell";
import {
  Launch16,
  UserAvatar20,
  Login20,
  Locked16,
  Logout20 as Logout
} from '@carbon/icons-react';

const ibmCloudDefaultConfig = {
  complianceFeatures: true,
  builderFeatures: false,
  ibmContent: true,
  azureContent: false,
  awsContent: false,
}
const defaultConfig = {
  complianceFeatures: false,
  builderFeatures: true,
  ibmContent: true,
  azureContent: true,
  awsContent: true,
}

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
      profileExpanded: false,
      content: defaultConfig
    };
  }

  async redirectToLogin() {
    window.location.href = "/login";
  }

  async setContent(content) {
    if (this.state?.user?.email) {
      fetch(`/api/users/${this.state.user.email}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ config: content })
      })
        .then(res => res.json())
        .then(user => { if (user.email) this.setState({ content: user.config, user: { ...this.state.user, config: user.config } }) })
        .catch(console.error)
    }
  }

  async componentDidMount() {
    fetch('/userDetails')
      .then(res => res.json())
      .then(user => {
        if (user.email) {
          setTimeout(() => {
            // Session expired, redirecting to login
            window.location.reload(false);
          }, (new Date(user?.sessionExpire)).getTime() - Date.now());
          this.setState({ user: user || undefined });
          fetch(`/api/users/${this.state.user.email}`)
            .then(res => res.json())
            .then(userInfo => {
              if (userInfo.config) this.setState({ content: userInfo.config, user: { ...user, config: userInfo.config } });
              else if (user.roles?.includes('ibm-cloud')) {
                this.setState({ user: { ...user, config: ibmCloudDefaultConfig } });
                this.setContent(ibmCloudDefaultConfig);
              }
              else {
                this.setState({ user: { ...user, config: defaultConfig } });
                this.setContent(defaultConfig);
              }
            })
            .catch(console.error);
        } else {
          console.log(user);
        }
      })
      .catch(console.error);
  }

  render() {

    return (
      <BrowserRouter>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <Header aria-label="IBM Ecosystem Labs">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName prefix='Software Everywhere - '>
                ASCENT
              </HeaderName>
              <HeaderNavigation aria-label="Ascent header navigation">
              </HeaderNavigation>
              <HeaderGlobalBar>
                {this.state.user ?
                  <HeaderGlobalAction
                    aria-label="Profile"
                    isActive={this.state.profileExpanded}
                    onClick={() => this.setState({ profileExpanded: !this.state.profileExpanded })}
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
              <HeaderPanel aria-label="Header Panel" className="user-profile" expanded={this.state.profileExpanded} style={{ bottom: 'auto', paddingBottom: '1rem', listStyleType: 'none' }}>
                <li className="bx--switcher__item title">
                  <strong>{(this.state.user && this.state.user.name) || "Username"}</strong>
                  <Tag>{(this.state.user?.role) || "role"}</Tag>
                </li>
                <li className="bx--switcher__item"><strong>{(this.state.user?.email) || "example@ibm.com"}</strong></li>
                <SwitcherDivider />
                <li className="bx--switcher__item">
                  <Toggle labelText="Compliance features" size="md" id='compliance-toggle' toggled={this.state.content.complianceFeatures} onToggle={(checked) => this.setContent({ ...this.state.content, complianceFeatures: checked })} />
                </li>
                <li className="bx--switcher__item">
                  <Toggle labelText="Solution Builder features" size="md" id='builder-toggle' toggled={this.state.content.builderFeatures} onToggle={(checked) => this.setContent({ ...this.state.content, builderFeatures: checked })} />
                </li>
                {this.state.content.builderFeatures ? <>
                  <li className="bx--switcher__item">
                    <Toggle labelText="Azure content" size="sm" id='azure-toggle' toggled={this.state.content.azureContent} onToggle={(checked) => this.setContent({ ...this.state.content, azureContent: checked })} />
                  </li>
                  <li className="bx--switcher__item">
                    <Toggle labelText="AWS content" size="sm" id='aws-toggle' toggled={this.state.content.awsContent} onToggle={(checked) => this.setContent({ ...this.state.content, awsContent: checked })} />
                  </li>
                </> : <></>}
                <SwitcherDivider />
                <SwitcherItem aria-label="Logout" className="logout" href="/logout">
                  <span>Logout</span>
                  <Logout />
                </SwitcherItem>
              </HeaderPanel>
              <ErrorBoundary>
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>

                  <SideNavItems>

                    <Link to="/">
                      <SideNavMenuItem element={'div'}>Overview</SideNavMenuItem>
                    </Link>

                    {this.state.content.builderFeatures ? <SideNavMenu title="Solution Builder">

                      {this.state.user ?
                        <Link to="/solutions">
                          <SideNavMenuItem element={'div'}>Solutions</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem href='/solutions'>
                          Solutions
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <Link to="/boms">
                          <SideNavMenuItem element={'div'}>Bill of Materials</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem href='/boms'>
                          Bill of Materials
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <Link to="/services">
                          <SideNavMenuItem element={'div'}>Modules</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem href='/services'>
                          Modules
                          <Locked16 />
                        </SideNavMenuItem>
                      }
                    </SideNavMenu> : <></>}

                    {this.state.content.complianceFeatures ? <SideNavMenu title="Compliance" >

                      {this.state.user?.roles?.includes("fs-viewer") ? <Link to="/onboarding">
                        <SideNavMenuItem element={'div'}>On Boarding</SideNavMenuItem>
                      </Link> : <></>}

                      {this.state.user?.roles?.includes("fs-viewer") ? <Link to="/controls">
                        <SideNavMenuItem element={'div'}>Controls</SideNavMenuItem>
                      </Link> : <></>}

                      {this.state.user ?
                        <Link to="/mapping">
                          <SideNavMenuItem element={'div'}>Mapping</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem href='/mapping'>
                          Mapping
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <Link to="/nists">
                          <SideNavMenuItem element={'div'}>NIST 800-53</SideNavMenuItem>
                        </Link>
                        :
                        <SideNavMenuItem href='/nists'>
                          NIST 800-53
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                    </SideNavMenu> : <></>}

                    {this.state?.user?.email?.endsWith('ibm.com') ? <Link to="/docs">
                      <SideNavMenuItem element={'div'}>About</SideNavMenuItem>
                    </Link> : <></>}
                    <SideNavMenuItem href="https://modules.cloudnativetoolkit.dev" target="_blank" rel="noopener noreferrer">
                      Software Everywhere Catalog
                      <Launch16 />
                    </SideNavMenuItem>
                    <SideNavMenuItem href="https://landscape.cncf.io/" target="_blank" rel="noopener noreferrer">
                      Cloud-Native Landscape
                      <Launch16 />
                    </SideNavMenuItem>
                    {this.state?.user?.email?.endsWith('ibm.com') ? <SideNavMenuItem href="https://pages.github.ibm.com/Ondrej-Svec2/ibm-software-map" target="_blank" rel="noopener noreferrer">
                      IBM Software Map
                      <Launch16 />
                    </SideNavMenuItem> : <></>}
                    <SideNavMenuItem href="https://github.com/cloud-native-toolkit/iascable" target="_blank" rel="noopener noreferrer">
                      CLI
                      <Launch16 />
                    </SideNavMenuItem>

                  </SideNavItems>
                </SideNav>
              </ErrorBoundary>
            </Header>
          )}
        />
        <Content onClick={() => {
          if (this.state.profileExpanded) this.setState({ profileExpanded: false })
        }}>

          <AppRoutes user={this.state.user} />

        </Content>
      </BrowserRouter>
    );
  }
}

export default UIShell;

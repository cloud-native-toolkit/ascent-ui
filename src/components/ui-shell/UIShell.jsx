import React, { Component } from "react";

import {
  Tag, Content, Header, HeaderMenuButton, HeaderName, HeaderNavigation,
  HeaderGlobalBar, HeaderPanel, SwitcherItem, SwitcherDivider,
  SkipToContent, SideNav, SideNavItems, SideNavMenu, SideNavMenuItem,
  HeaderContainer, Toggle, ToastNotification,
} from 'carbon-components-react';

import {
  BrowserRouter, Link,
} from "react-router-dom";

import ErrorBoundary from "../ErrorBoundary";
import AppRoutes from "../AppRoutes";

import { HeaderGlobalAction } from "carbon-components-react/lib/components/UIShell";
import {
  Launch16, UserAvatar20, Login20, Locked16, Logout20 as Logout,
  TaskComplete20, Copy20
} from '@carbon/icons-react';

import { defaultHeaderName, defaultHeaderPrefix } from '../default-labels';
import b64 from "../../utils/b64";
import ApplicationMode from "../../utils/application-mode";

const defaultConfig = {
  complianceFeatures: false,
  builderFeatures: true,
  ibmContent: true,
  azureContent: true,
  awsContent: true,
}

class UIShell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      copyTokenIcon: <Copy20 />,
      user: undefined,
      activeItem: `/${window.location.pathname.split('/')[1] ?? ''}`,
      builderExpended: true,
      complianceExpended: true,
      docsExpended: false,
      patternName: "Overview",
      profileExpanded: false,
      content: defaultConfig,
      notifications: [],
      headerPrefix: defaultHeaderPrefix,
      headerName: defaultHeaderName
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

  addNotification(type, message, detail) {
    this.setState(prevState => ({
      notifications: [
        ...prevState.notifications,
        {
          message: message || "Notification",
          detail: detail || "Notification text",
          severity: type || "info"
        }
      ]
    }));
  }

  renderNotifications() {
    return this.state.notifications.map(notification => {
      return (
        <ToastNotification
          title={notification.message}
          subtitle={notification.detail}
          kind={notification.severity}
          timeout={10000}
          caption={false}
        />
      );
    });
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

    fetch('/config')
      .then(res => res.json())
      .then(config => {
        if (config.headerPrefix !== undefined) this.setState({ headerPrefix: config.headerPrefix });
        if (config.headerName !== undefined) this.setState({ headerName: config.headerName });
      })
      .catch(console.error);
  }

  fetchToken() {
    fetch('/api/token')
      .then(res => res.json())
      .then(res => {
        if (!res.error) {
          navigator.clipboard.writeText(b64.decode(res.token));
          this.setState({ copyTokenIcon: <TaskComplete20 /> });
          setTimeout(() => {
            this.setState({ copyTokenIcon: <Copy20 /> });
          }, 2000);
        }
      })
      .catch(console.error);
  }

  render() {
    return (
      <BrowserRouter>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (


            <Header aria-label="CNTK">

              <SkipToContent />

              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />

              <HeaderName prefix={this.state.headerPrefix}>
                {this.state.headerName}
              </HeaderName>

              <HeaderNavigation aria-label="navigation">
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
                {this.state.user?.role === 'admin' ? <li className="bx--switcher__item">
                  <strong>region:</strong>
                  <Tag style={{ marginLeft: '.5rem' }}>{this.state.user?.region}</Tag>
                </li> : <></>}
                {ApplicationMode.isBuilderMode() ? <div>
                  <SwitcherDivider />
                  <SwitcherItem aria-label="API token" onClick={this.fetchToken.bind(this)}>
                    <span>API token</span>{this.state.copyTokenIcon}
                  </SwitcherItem>
                </div>

                    : <></>}



                {ApplicationMode.isBuilderMode() && this.state.user?.role === 'admin' ?

                  <div>
                  <SwitcherDivider />

                    <li className="bx--switcher__item">
                    <Toggle labelText="Compliance features" size="md" id='compliance-toggle' toggled={this.state.content.complianceFeatures} onToggle={(checked) => this.setContent({ ...this.state.content, complianceFeatures: checked })} />
                  </li>
                  <li className="bx--switcher__item">
                    <Toggle labelText="Solution Builder features" size="md" id='builder-toggle' toggled={this.state.content.builderFeatures} onToggle={(checked) => this.setContent({ ...this.state.content, builderFeatures: checked })} />
                  </li>
                  </div>  : <></>}


                {ApplicationMode.isBuilderMode() && this.state.user?.role === 'admin' ? <>
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
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} >

                  <SideNavItems>

                    <SideNavMenuItem element={Link} to='/'
                      isActive={this.state.activeItem === '/'}
                      onClick={() => {
                        this.setState({ activeItem: '/' })
                      }}>
                      {ApplicationMode.isFsControlsMode() ? 'Controls Catalog' : 'Overview'}
                    </SideNavMenuItem>

                    {ApplicationMode.isBuilderMode() ? <SideNavMenu defaultExpanded title="Solutions">

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/solutions/user'
                          isActive={this.state.activeItem === '/solutions/user'}
                          onClick={() => { this.setState({ activeItem: '/solutions/user' }) }}>Created Solutions</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/solutions/user'>
                          Created Solutions
                          <Locked16 style={{ marginLeft: "auto" }} />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/solutions'
                          isActive={this.state.activeItem === '/solutions'}
                          onClick={() => { this.setState({ activeItem: '/solutions' }) }}>Public Solutions</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/solutions'>
                          Solutions
                          <Locked16 style={{ marginLeft: "auto" }} />
                        </SideNavMenuItem>
                      }

                    </SideNavMenu> : <></>}

                    {ApplicationMode.isBuilderMode() ? <SideNavMenu title="Reference Architectures" defaultExpanded
                      isActive={['/solutions', '/boms', '/services'].includes(this.state.activeItem)}>

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/boms/infrastructure'
                          isActive={this.state.activeItem === '/boms/infrastructure'}
                          onClick={() => { this.setState({ activeItem: '/boms/infrastructure' }) }}>Infrastructure</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/boms/infrastructure'>
                          Infrastructure
                          <Locked16 style={{ marginLeft: "auto" }} />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/boms/software'
                          isActive={this.state.activeItem === '/boms/software'}
                          onClick={() => { this.setState({ activeItem: '/boms/software' }) }}>Software</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/boms/software'>
                          Software
                          <Locked16 style={{ marginLeft: "auto" }} />
                        </SideNavMenuItem>
                      }


                    </SideNavMenu> : <></>}

                    <SideNavMenu title="Compliance" defaultExpanded
                      isActive={['/onboarding', '/controls', '/mapping', '/nists'].includes(this.state.activeItem)} >

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/controls'
                          isActive={this.state.activeItem === '/controls'}
                          onClick={() => { this.setState({ activeItem: '/controls' }) }}>Controls</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/controls'>
                          Controls
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/mapping'
                          isActive={this.state.activeItem === '/mapping'}
                          onClick={() => { this.setState({ activeItem: '/mapping' }) }}>Mapping</SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/mapping'>
                          Mapping
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                      {this.state.user ?
                        <SideNavMenuItem element={Link} to='/nists'
                          isActive={this.state.activeItem === '/nists'}
                          onClick={() => { this.setState({ activeItem: '/nists' }) }}>
                          NIST 800-53
                        </SideNavMenuItem>
                        :
                        <SideNavMenuItem href='/nists'>
                          NIST 800-53
                          <Locked16 />
                        </SideNavMenuItem>
                      }

                    </SideNavMenu>

                    {ApplicationMode.isBuilderMode() ? <SideNavMenu title="Automation Catalog">

                      {this.state?.user?.email?.endsWith('ibm.com') ? <SideNavMenuItem
                        href="https://pages.github.ibm.com/Ondrej-Svec2/ibm-software-map"
                        target="_blank" rel="noopener noreferrer">
                        IBM Software Portfolio
                        <Launch16 />
                      </SideNavMenuItem> : <></>}

                      <SideNavMenuItem href="https://modules.techzone.ibm.com"
                        target="_blank" rel="noopener noreferrer">
                        Automation Modules
                        <Launch16 />
                      </SideNavMenuItem>

                      <SideNavMenuItem href="https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=seansund&labels=new_module&template=new-module.md&title=Request+new+module%3A+%7Bname%7D"
                        target="_blank" rel="noopener noreferrer">
                        Create a Module
                        <Launch16 />
                      </SideNavMenuItem>

                    </SideNavMenu> : <></>}


                    {ApplicationMode.isBuilderMode() ? <SideNavMenu title="Documentation"
                      isSideNavExpanded={isSideNavExpanded}
                      defaultExpanded={['/docs'].includes(this.state.activeItem)}
                      isActive={['/docs'].includes(this.state.activeItem)} >
                      {this.state?.user?.email?.endsWith('ibm.com') ?
                        <SideNavMenuItem element={Link} to='/docs'
                          isActive={this.state.activeItem === '/docs'}
                          onClick={() => { this.setState({ activeItem: '/docs', docsExpended: true }) }}>About</SideNavMenuItem>
                        : <></>}
                      <SideNavMenuItem href="https://www.ibm.com/training/cloud/jobroles"
                        target="_blank" rel="noopener noreferrer">
                        Free IBM Cloud Training
                        <Launch16 />
                      </SideNavMenuItem>
                      <SideNavMenuItem href="https://landscape.cncf.io/"
                        target="_blank" rel="noopener noreferrer">
                        Cloud-Native Landscape
                        <Launch16 />
                      </SideNavMenuItem>
                      <SideNavMenuItem href="https://cloudnativetoolkit.dev/"
                        target="_blank" rel="noopener noreferrer">
                        Cloud-Native Toolkit
                        <Launch16 />
                      </SideNavMenuItem>
                      <SideNavMenuItem
                        href="https://github.com/cloud-native-toolkit/iascable"
                        target="_blank" rel="noopener noreferrer">
                        Builder CLI
                        <Launch16 />
                      </SideNavMenuItem>

                      <SideNavMenuItem href="https://modules.techzone.ibm.com/#/how-to/gitops"
                        target="_blank" rel="noopener noreferrer">
                        Create a GitOps Module
                        <Launch16 />
                      </SideNavMenuItem>

                      <SideNavMenuItem href="https://modules.techzone.ibm.com/#/how-to/terraform"
                        target="_blank" rel="noopener noreferrer">
                        Create a Terraform Module
                        <Launch16 />
                      </SideNavMenuItem>

                    </SideNavMenu>  : <></>}

                    {ApplicationMode.isBuilderMode() ? <SideNavMenu title="Join Us" >
                      <SideNavMenuItem
                        href="https://github.com/cloud-native-toolkit"
                        target="_blank" rel="noopener noreferrer">
                        Git Organization
                        <Launch16 />
                      </SideNavMenuItem>

                      <SideNavMenuItem
                        href="https://discord.gg/7sSY9W2cZf"
                        target="_blank" rel="noopener noreferrer">
                        Discord Community
                        <Launch16 />
                      </SideNavMenuItem>

                      <SideNavMenuItem
                        href="https://www.youtube.com/c/CloudNativeToolkit"
                        target="_blank" rel="noopener noreferrer">
                        Youtube Channel
                        <Launch16 />
                      </SideNavMenuItem>
                    </SideNavMenu>  : <></>}

                    {ApplicationMode.isBuilderMode() ?

                    <SideNavMenuItem
                      href="https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=NoeSamaille&labels=ascent&template=issue-bug-report-on-ascent-tool.md&title=Issue+on+Ascent%3A+%7Bissue%7D"
                      target="_blank" rel="noopener noreferrer">
                      An Issue?
                      <Launch16 />
                    </SideNavMenuItem> :

                    <SideNavMenuItem
                        href="https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=NoeSamaille&labels=controls&template=controls-issue.md&title=Issue+on+Controls%3A+%7Bissue%7D"
                        target="_blank" rel="noopener noreferrer">
                      An Issue?
                      <Launch16 />
                    </SideNavMenuItem> }

                  </SideNavItems>
                </SideNav>
              </ErrorBoundary>
            </Header>
          )}
        />
        <Content onClick={() => {
          if (this.state.profileExpanded) this.setState({ profileExpanded: false })
        }}>

          <div className='notif'>
            {this.state.notifications.length !== 0 && this.renderNotifications()}
          </div>

          <AppRoutes user={this.state.user} addNotification={this.addNotification.bind(this)} />

        </Content>
      </BrowserRouter>
    );
  }
}

export default UIShell;

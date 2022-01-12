import React from 'react';
import ResourceCard from '../ResourceCard';
import ArticleCard from '../ArticleCard';
import CodePatternCard from '../CodePatternCard';

import _ from 'lodash';

import {
  Tabs,
  Tab,
  CodeSnippet,
  AccordionItem,
} from 'carbon-components-react';

const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
  multiline: () => ({
    showMoreText:
      'Text for "show more" button (showMoreText)',
    showLessText:
      'Text for "show less" button (showLessText)',
    onClick: 'onClick',
  }),

};

export default class LandingPage extends React.Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
          links: [],
          componentUrls: [],
          cluster: {},
          tools: {}
        };
    }


    // Load the Data into the Project
    componentDidMount() {

      fetch("/urls")
        .then(response => response.json())
        .then(data => {
          console.log('urls', data);
          this.setState(Object.assign(
            {},
            this.state,
            {componentUrls: data},
          ));
        });
      fetch("/activation/links")
          .then(response => response.json())
          .then(data => {
            console.log('activation links: ', data);
            this.setState(Object.assign(
                {},
                this.state,
                {links: data},
            ));
          });
      fetch("/cluster")
          .then(response => response.json())
          .then(data => {
            console.log('cluster info: ', data);
            this.setState(Object.assign(
                {},
                this.state,
                {cluster: data},
            ));
          });
      fetch("/tools")
          .then(response => response.json())
          .then(data => {
            console.log('tools  info: ', data);
            this.setState(Object.assign(
                {},
                this.state,
                {tools: data},
            ));
          });
    }

render() {

  function getArticles(data,className) {

    if (_.isUndefined(data))
      return [];

    if (_.isUndefined(className)){
      className = "";
    }

    let articles = [];

    // Outer loop to create parent
    data.forEach(function(article,index){

      var subtitle = article.subtitle ? article.subtitle : "";

      //Create the parent and add the children
      articles.push(

        <div className="bx--no-gutter-md--left bx--col-lg-4 bx--col-md-4">
            <ArticleCard
              className={className}
              title={article.title}
              author={article.author}
              subTitle = {subtitle}
              href={article.href}
              color={article.color}
              actionIcon="arrowRight"
              >
          </ArticleCard>
        </div>
      );
    });

    return articles;

  }

  function getTools(tools,urls,incluster) {

    if (_.isUndefined(tools) && _.isUndefined(urls))
      return [];

    var installedTools = []
    for(var i=0;i<tools.length;i++) {
      const tool = tools[i];
      if (isComponentAvailable(tool.reference)) {
        const url = urls[tool.reference];
        if(tool.incluster === incluster) {
          installedTools.push(
              <div className="bx--column bx--col-md-4  bx--no-gutter-sm">
                <ResourceCard
                    subTitle={tool.subTitle}
                    title={tool.title}
                    aspectRatio="2:1"
                    href={buildUrl(tool.reference)}
                >
                  <img
                      className="resource-img"
                      src={tool.iconBase64}
                      alt={tool.alt}
                  />
                </ResourceCard>
              </div>
          );
        }
      }
    }

    return installedTools;

  }

  function getCodePatterns(data) {

    if (_.isUndefined(data))
      return [];

    let _codepatterns = []

    data.forEach(function(pattern,index){
      _codepatterns.push(
        <div className="bx--no-gutter-md--left bx--col-lg-4 bx--col-md-4">
            <CodePatternCard
                title={pattern.title}
                subTitle={pattern.subtitle}
                language={pattern.language}
                href={pattern.href}
                color={pattern.color}
                actionIcon="launch"
            >
          </CodePatternCard>
        </div>
      );
    });

    return _codepatterns;

  }

  function getRedHatActivation(_clusterType,_links) {

      if ( _clusterType !== "openshift" ) {
        return;
      }

      return (
          <>
            <h2 className="landing-page__subheading">
              RedHat Interactive Learning
            </h2>
            <br></br>
            <p>
              To help understand OpenShift in more detail work through these KataKoda self paced learning modules offered by
              RedHat
            </p>
            <br></br>
            <div className="bx--row">
              {getArticles(_links,"bx--article-card--redhat")}
            </div>
          </>
      );
  }

  const multilineProps = props.multiline();

  const { links, isLoading, error, componentUrls, tools = {} } = this.state;

  function buildUrl(val) {
    const host = window.location.hostname;
    const protocol = window.location.protocol || "http:";

    return componentUrls[val] || protocol + "//" + host.replace("dashboard", val);
  }

  function isComponentAvailable(val) {
    return !!componentUrls[val];
  }

  if (error) {
        return <p>{error.message}</p>;
  }

  if (isLoading) {
        return <p>Loading ...</p>;
  }

  var clusterType = this.state.cluster.CLUSTER_TYPE;

  return <div className="bx--grid bx--grid--full-width landing-page">
    <div className="bx--row landing-page__banner">
      <div className="bx--col-lg-12">

         <div class="clusterInfo">
            <AccordionItem
            title="Developer Dashboard" >
                <div>
                    <ul style={{"padding": "5px 10px"}}>
                    <li style={{"padding": "5px 0"}}><strong>CLUSTER_TYPE:</strong> {_.capitalize(this.state.cluster.CLUSTER_TYPE)}
                        </li>
                        <li style={{"padding": "5px 0"}}><strong>CLUSTER_VERSION:</strong> {this.state.cluster.CLUSTER_VERSION}
                        </li>
                        <li style={{"padding": "5px 0"}}>WEB_CONSOLE: <a class="consoleLink"
                        href={this.state.cluster.SERVER_URL + "/console"}>{this.state.cluster.SERVER_URL}/console</a>
                        </li>
                        <li style={{"padding": "5px 0"}}>REGION: {this.state.cluster.REGION}</li>
                        <li style={{"padding": "5px 0"}}>RESOURCE_GROUP: {this.state.cluster.RESOURCE_GROUP}</li>
                        <li style={{"padding": "5px 0"}}>IMAGE_REGISTRY: {this.state.cluster.REGISTRY_URL + "/" + this.state.cluster.REGISTRY_NAMESPACE}</li>
                    </ul>
                </div>
            </AccordionItem>
        </div>
      </div>

    </div>
    <div className="bx--row landing-page__r2">
      <div className="bx--col bx--no-gutter">
        <Tabs className="top" {...props.tabs} aria-label="Tab navigation">
          <Tab {...props.tab} label="Tools">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">

                <div className="bx--row">
                    <div className="bx--col-lg-12">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Tools
                        </h2>
                        <br></br>
                        <p>
                            The following tools have been been configured in your dashboard
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-8 bx--col-lg-8">
                      <div className="bx--row resource-card-group">
                        {getTools(this.state.tools, this.state.componentUrls, true)}
                      </div>
                  </div>
                  <div className="bx--col-md-8  bx--col-lg-8">
                      <div className="bx--row resource-card-group">
                        {getTools(this.state.tools, this.state.componentUrls, false)}
                      </div>
                  </div>
              </div>
            </div>
          </Tab>
          <Tab {...props.tab} label="Activation">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-lg-12">

                  <h2 className="landing-page__subheading">
                    Containers and Kubernetes
                  </h2>
                  <br></br>
                  <p>
                    Containers are the modern way of building and deploying software and Kubernetes has become the de-facto standard for managing Container orchestration. Use these Katacodas to walk through some simple self paced exercises.
                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getArticles(links.kubernetes, "bx--article-card--ibm")}
                  </div>

                  {getRedHatActivation(this.state.cluster.CLUSTER_TYPE,links.openshift)}

                  <h2 className="landing-page__subheading">
                    Cloud-native Deployment
                  </h2>
                  <br></br>
                  <p>
                    Use the following links to help you deep dive in Cloud Native Deployment
                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getArticles(links.cndp)}
                  </div>

                  <h2 className="landing-page__subheading">
                    Cloud-native Development
                  </h2>
                  <br></br>
                  <p>
                    Use the following links to help you deep dive in Cloud Native Development
                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getArticles(links.cnd)}
                  </div>

                  <h2 className="landing-page__subheading">
                    Garage Method Development
                  </h2>
                  <br></br>
                  <p>
                    Use the following links to help you deep dive in IBM Cloud Garage development best practices
                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getArticles(links.gmd)}
                  </div>

                </div>
              </div>
            </div>
          </Tab>
          <Tab {...props.tab} label="Starter Kits">
            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
              <div className="bx--row landing-page__tab-content">
                <div className="bx--col-lg-12">

                  <h2 className="landing-page__subheading">
                    Starter Kit Git Repositories
                  </h2>

                  <div>
                    <p>
                      Follow the commands below to install the Cloud-Native Toolkit CLI tools. Login to the IBM Cloud account and configure your
                      command line for access to either {_.capitalize(clusterType)} Cluster.
                    </p>
                    <br></br>
                    <p>
                      To use the Starter Kit Code Repositories, click on the link and generate a template into your own
                      git organization, Then follow instructions below.
                    </p>

                    <br></br>

                    <CodeSnippet type="multi" {...multilineProps}
                                 style={{display: this.state.cluster.CLUSTER_TYPE === "kubernetes" ? "block" : "none"}}>
                      {
                        `ibmcloud login -r ${this.state.cluster.REGION} -g ${this.state.cluster.RESOURCE_GROUP}
kubectl get pods
npm install -g @ibmgaragecloud/cloud-native-toolkit-cli
git clone <code pattern> | cd <code pattern>
kubectl sync <namespace> --dev
kubectl pipeline`}
                    </CodeSnippet>
                    <CodeSnippet type="multi" {...multilineProps}
                                 style={{display: this.state.cluster.CLUSTER_TYPE === "openshift" ? "block" : "none"}}>
                      {
                        `oc login
oc get pods
npm install -g @ibmgaragecloud/cloud-native-toolkit-cli
git clone <code pattern> | cd <code pattern>
oc sync <project> --dev
oc pipeline 
`}
                    </CodeSnippet>
                  </div>

                  <p className="new-line">
                    Use the following starter kits to create your own git repos. This will help you to accelerate the
                    start of your project
                    <br></br>
                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getCodePatterns(links.codepatterns)}
                  </div>

                  <p className="new-line">
                    The following starter kits templates can be used for demos and sample code, use the enable command to a helm chart to the base code
                    <br></br>

                      <CodeSnippet type="multi" {...multilineProps}
                                   style={{display: this.state.cluster.CLUSTER_TYPE === "kubernetes" ? "block" : "none"}}>
                          {
`kubectl enable | git add . | git commit -m "Update"" | git push
kubectl pipeline`}
                      </CodeSnippet>
                      <CodeSnippet type="multi" {...multilineProps}
                                   style={{display: this.state.cluster.CLUSTER_TYPE === "openshift" ? "block" : "none"}}>
                          {
`oc enable | git add . | git commit -m "Update"" | git push
oc pipeline`}
                      </CodeSnippet>

                  </p>
                  <br></br>
                  <div className="bx--row">
                    {getCodePatterns(links.ibmgit)}
                  </div>
                  <h2 className="landing-page__subheading">
                    Other Useful Repositories
                  </h2>
                  <br></br>
                  <p>
                    Use the following templates to configure GitOps and integrate cloud services into your
                    applications
                  </p>
                  <br></br>

                  <div className="bx--row">
                    {getCodePatterns(links.argocd)}
                  </div>

                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
    <div className="bx--row landing-page__r3">
      <div className="bx--col-md-4 bx--col-lg-4">
        <h3 className="landing-page__label">IBM Garage Links</h3>
      </div>
      <div className="bx--col-md-4 bx--col-lg-4"><a
          href="https://ibm-garage-cloud.github.io/ibm-garage-developer-guide/contributing" rel="noopener noreferrer"
          target="_blank">Contribution</a></div>
      <div className="bx--col-md-4 bx--col-lg-4"><a href="https://www.ibm.com/cloud/garage/practices/overview"
                                                    rel="noopener noreferrer" target="_blank">Garage Method</a></div>
    </div>
  </div>;
}};


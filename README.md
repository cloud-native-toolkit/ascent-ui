<p align="center">
    <a href="http://kitura.io/">
        <img src="https://landscape.cncf.io/logos/ibm-member.svg" height="100" alt="IBM Cloud">
    </a>
</p>

<p align="center">
    <a href="https://cloud.ibm.com">
    <img src="https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg" alt="IBM Cloud">
    </a>
    <img src="https://img.shields.io/badge/platform-node-lightgrey.svg?style=flat" alt="platform">
    <img src="https://img.shields.io/badge/license-Apache2-blue.svg?style=flat" alt="Apache 2">
</p>

# React UI Patterns with Node.js

React is a popular framework for creating user interfaces in modular components. In this sample application, you will create a web application using Express, TypeScript and React to serve web pages in Node.js, complete with standard best practices, including a health check and application metric monitoring.

This code pattern contains 12 popular UI patterns that make it very easy to construct a dashboard application.

This app contains an opinionated set of components for modern web development, including:

* [React](https://facebook.github.io/react/)
* [TypeScript](https://www.typescriptlang.org/)
* [Webpack](https://webpack.github.io/)
* [Sass](http://sass-lang.com/) 
* [gulp](http://gulpjs.com/)
* [Carbon](https://www.carbondesignsystem.com/)

### Deploying 

After you have created a new git repo from this git template, remember to rename the project.
Edit `package.json` and change the default name to the name you used to create the template.

Make sure you are logged into the IBM Cloud using the IBM Cloud CLI and have access 
to you development cluster. If you are using OpenShift make sure you have logged into OpenShift CLI on the command line.

```$bash
npm install -g @ibmgaragecloud/cloud-native-toolkit-cli
```

Use the IBM Garage for Cloud CLI to register the GIT Repo with Tekton or Jenkins 

```$bash
oc sync <project> --dev
oc pipeline
```

Ensure you have the Cloud-Native Toolkit installed in your cluster to make this method of pipeline registry quick and easy [Cloud-Native Toolkit](https://cloudnativetoolkit.dev/)

### Native Application Development

Install the latest [Node.js](https://nodejs.org/en/download/) 6+ LTS version.

Once the Node toolchain has been installed, you can download the project dependencies with:

```bash
npm install
```

Modern web applications require a compilation step to prepare your ES2015 JavaScript or Sass stylesheets into compressed Javascript ready for a browser. Webpack is used for bundling your JavaScript sources and styles into a `bundle.js` file that your `index.html` file can import. 

***Webpack***

For development mode, use `webpack -d` to leave the sources uncompress and with the symbols intact.

For production mode, use `webpack -p` to compress and obfuscate your sources for development usage.

***Gulp***

Gulp is a task runner for JavaScript. You can run the above Webpack commands in by running:
```bash
gulp
```

### Run the application locally

***Production like build***

First you need to specify the configuration environment variables for AppId:
```bash
export APPID_CONFIG='{"apikey":...,"version":4}'
export APP_URI="http://localhost:3000"
```

A script has been provided to set these values automatically. Follow these steps to set up the environment:

1. Log into the IBM Cloud account using the cli
   
    ```shell
    ibmcloud login
    ```

2. Get the name of the AppId instance that will be used with the UI

    ```shell
    ibmcloud resource service-instances
    ```

3. Source the `scripts/setup-environment.sh` file with the name of the App Id instance

    ```shell
    source ./scripts/setup-environment.sh "${APPID_NAME}"
    ```

To run your application locally:
```bash
npm run build
npm run start
```

***Local development***

To run your application dev mode:
```bash
npm run start:dev
```

Your application will be running at `http://localhost:3000`.  You can access the `/health` and `/appmetrics-dash` endpoints at the host.

***How to remove the one of the design from code patterns***

If you want to remove the one of the design from the code pattern. Please follow the below procedure.

The React code pattern having segregated folder structure. Each design pattern having separate folder for Components, Models, Service,View(UI-patterns).

- Remove the design files from Components, Models, Service,View(UI-patterns).
- Every Design files having the reference in UI-Shell folder which contains UIShell and  UIShellBody files. So need to remove respective reference.

### Authentication

### App ID

Authentication to this application defaults to AppId, you therefore need to set the `$APPID_CONFIG` environment variable, with the following format (create a new application on AppID and copy/paste the configuration):
```json
{
    "clientId": "<clientId>",
    "tenantId": "<tenantId>",
    "secret": "<secret>",
    "name": "<name>",
    "oauthServerUrl": "<oauthServerUrl>",
    "profilesUrl": "<profilesUrl>",
    "discoveryEndpoint": "<discoveryEndpoint>",
    "type": "<type>",
    "scopes": "<scopes>"
} 
```

### OpenShift OAuth

If running on OpenShift you can also create your own OpenShift `OAuthClient` and use that to log in to ascent, you'll need to set the `$OCP_OAUTH_CONFIG` environment variable, with the following format:
```json
{
    "authorization_endpoint": "<authorization_endpoint>",
    "token_endpoint": "<token_endpoint>",
    "clientID": "<clientID>",
    "clientSecret": "<clientSecret>",
    "api_endpoint": "<api_endpoint>"
} 
```

This option will allow you to use OpenShift RBAC and OpenShift users and groups to define roles for your users:

```sh
oc adm groups new ascent-admins
oc adm groups new ascent-editors
oc adm groups new ascent-fs-viewers
oc adm groups add-users <GROUP_NAME> <USER_NAME>
...
```

##### Session Store

You may see this warning when running `ibmcloud dev run`:
```
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
```

When deploying to production, it is best practice to configure sessions to be stored in an external persistence service.

## Next Steps

* Learn more about augmenting your Node.js applications on IBM Cloud with the [Node Programming Guide](https://cloud.ibm.com/docs/node?topic=nodejs-getting-started).
* Explore other [sample applications](https://cloud.ibm.com/developer/appservice/starter-kits) on IBM Cloud.

## License

This sample application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)




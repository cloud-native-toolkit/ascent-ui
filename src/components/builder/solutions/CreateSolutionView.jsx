import React, { Component } from 'react';
import {
    Navigate
} from "react-router-dom";
import {
    TextInput, Column, Grid, Row, Tag, Form, TextArea, Select, SelectItem,
    Button, ProgressIndicator, ProgressStep
} from 'carbon-components-react';
import {
    ContainerSoftware32, Close32 as Close
} from '@carbon/icons-react';

import StatefulTileCatalog from './TileCatalog/StatefulTileCatalog';
import { catalogFilters } from '../../../data/data';

import { v4 as uuidv4 } from 'uuid';

import openshiftImg from '../../../images/openshift.png'

import archQuickstartImg from '../../../images/arch/quick-start.png'
import archStandardImg from '../../../images/arch/standard.png'
import archAdvancedImg from '../../../images/arch/advanced.png'

import storagePortworxImg from '../../../images/storage/portworx.png'
import storageOdfImg from '../../../images/storage/odf.png'

import byoInfra from '../../../images/platforms/cloud-infra-center-byo-infra.svg';

import softwareApiConnectImg from '../../../images/software/apiconnect.svg'
import softwareDataFabricImg from '../../../images/software/datafabric.svg'
import softwareDataFoundationImg from '../../../images/software/datafoundation.svg'
import softwareDB2Img from '../../../images/software/db2.svg'
import softwareDB2WarehouseImg from '../../../images/software/DB2BigSQL.svg'
import softwareEventStreamsImg from '../../../images/software/eventstreams.svg'
import softwareIntegrationImg from '../../../images/software/integration.svg'
import softwareMASImg from '../../../images/software/mas.svg'
import softwareMASIoTImg from '../../../images/software/mas-iot.svg'
import softwareMASManageImg from '../../../images/software/mas-manage.svg'
import softwareMASMonitorImg from '../../../images/software/mas-monitor.svg'
import softwareMQImg from '../../../images/software/mq.svg'
import softwareSecurityImg from '../../../images/software/security.svg'
import softwareTurbonomicImg from '../../../images/software/turbonomic-short.png'

import StacksImg from '../../../images/stacks.png'

const STEP_OVERWIEW = 0;
const STEP_USECASE = 1;
const STEP_INFRASTRUCTURE = 2;
const STEP_SOFTWARE = 3;
const STEP_DETAILS = 4;
const STEP_SUMMARY = 5;

const STEP_INFRA_PLATFORM = 0;
const STEP_INFRA_FLAVOR = 1;
const STEP_INFRA_STORAGE = 2;

const CatalogContent = ({ logo, icon, title, displayName, status, type, description }) => (
    <div className={`iot--sample-tile`}>
        {logo ? <div className={`iot--sample-tile-icon`}><img className="software-logo" loading="lazy" src={logo} alt="software logo" /></div> : icon ? <div className={`iot--sample-tile-icon`}>{icon}</div> : null}
        <div className={`iot--sample-tile-contents`}>
            <div className={`iot--sample-tile-title`}>
                <span title={title}>{displayName}</span>
                {(type === 'terraform' || type === 'gitops') && <Tag
                    style={{ marginLeft: '.5rem' }}
                    type='gray' >
                    {catalogFilters.moduleTypeValues.find(v => v.value === type)?.text}
                </Tag>}
                {(status === 'beta' || status === 'pending') && <Tag
                    style={{ marginLeft: '.5rem' }}
                    type={status === 'beta' ? 'teal' : 'magenta'} >
                    {catalogFilters.statusValues.find(v => v.value === status)?.text}
                </Tag>}
            </div>
            <div className={`iot--sample-tile-description`}>{description ? `${description?.slice(0, 95)}${description?.length > 95 ? '...' : ''}` : title}</div>
        </div>
    </div>
);
const tileRenderFunction = ({ values }) => <CatalogContent {...values} icon={<ContainerSoftware32 />} />;

class CreateSolutionview extends Component {
    constructor(props) {

        var guid = uuidv4();
        super(props);
        this.state = {
            curStep: "overview",
            curStepIx: STEP_OVERWIEW,
            infraStepIx: STEP_INFRA_PLATFORM,
            persona: undefined,
            platform: undefined,
            architecture: undefined,
            storage: undefined,
            software: [],
            fields: {
                id: guid,
                name: "",
                short_desc: "",
                long_desc: "",
                public: false,
                techzone: false,
                platform: "",
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    componentDidMount() {
        fetch('/api/architectures')
            .then(res => res.json())
            .then(boms => {
                this.setState({ boms: boms });
            })
            .catch(console.error);
        fetch('/api/automation/catalog/boms')
            .then(res => res.json())
            .then(catalog => {
                this.setState({ catalog: catalog });
            })
            .catch(console.error);
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        if (field === "yaml") {
            fields[field] = e;
        } else if (field === "service_id") {
            fields["yaml"] = "";
            fields[field] = e.target.value;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    nextDisabled = () => {
        switch (this.state.curStepIx) {
            case STEP_OVERWIEW:
                return false;
            case STEP_USECASE:
                return this.state.persona === undefined;
            case STEP_INFRASTRUCTURE:
                switch (this.state.infraStepIx) {
                    case STEP_INFRA_PLATFORM:
                        return this.state.platform === undefined
                    case STEP_INFRA_FLAVOR:
                        return this.state.architecture === undefined
                    case STEP_INFRA_STORAGE:
                        return this.state.storage === undefined
                    default:
                        return true;
                }
            case STEP_SOFTWARE:
                return this.state.software?.length === 0;
            case STEP_DETAILS:
                return this.state.fields.name === "";
            case STEP_SUMMARY:
                return false;
            default:
                return true;
        }
    }

    handleClose = (event) => {
        console.log(JSON.stringify(event));
    }

    handleNext() {
        if (this.state.curStepIx === STEP_INFRASTRUCTURE && this.state.platform !== 'byo-infra' && this.state.infraStepIx !== STEP_INFRA_STORAGE) {
            this.setState({ infraStepIx: this.state.infraStepIx + 1 });
        } else {
            if (this.state.curStepIx + 1 === STEP_SOFTWARE) this.setState({ software: [] });
            this.setState({ curStepIx: this.state.curStepIx + 1 });
        }
    }

    handleBack = (newStep) => {
        if (this.state.curStepIx === STEP_INFRASTRUCTURE && this.state.infraStepIx !== STEP_INFRA_PLATFORM) {
            this.setState({ infraStepIx: this.state.infraStepIx - 1 });
        } else {
            if (newStep === "software") this.setState({ software: [] });
            this.setState({ curStepIx: this.state.curStepIx > 0 ? this.state.curStepIx - 1 : 0 });
        }
    }

    handleSubmit = () => {
        // Get infrastructure layers
        const platform = this.solution_wizard.platforms.find(p => p.id === this.state.platform);
        const boms = new Set(platform.boms[this.state.architecture]);
        // Get storage layers
        const storage = this.solution_wizard.storage_providers.find(s => s.id === this.state.storage);
        for (const bom of storage.boms[this.state.platform]) boms.add(bom);
        // Get software layers
        const software = this.state.software.map(swId => (this.solution_wizard.software.find(sw => sw.id === swId)));
        for (const sw of software) for (const bom of sw.boms) boms.add(bom);
        // Create solution
        const body = {
            solution: this.state.fields,
            architectures: Array.from(boms).map(bom => ({ arch_id: bom })),
            platform: this.state.platform
        };
        console.log(body);
        this.props.addNotification("info", "Creating", `Creating solution ${body.solution.id}...`);
        fetch('/api/solutions', { method: 'POST', body: JSON.stringify(body), headers: { "Content-type": "application/json" } })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    this.props.addNotification("error", "Error", res.error.message ?? `Error creating solution`);
                    console.error(res.error);
                }
                else {
                    this.props.addNotification("success", "OK", `Solution ${res.id} has been created!`)
                    this.setState({ navigate: `/solutions/${res.id}` });
                }
            })
            .catch(console.error);
    }

    solution_wizard = {
        architectures: [
            {
                id: "quickstart",
                title: "Quick-Start",
                desc: "A simple architecture to quickly get an OpenShift cluster provisioned ideal for Demos",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#quickstart",
                image: archQuickstartImg
            },
            {
                id: "standard",
                title: "Standard",
                desc: "A standard production deployment environment with typical security protections, private endpoints, VPN server, key management encryption, ideal for POC/POT/MVP",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#standard",
                image: archStandardImg
            },
            {
                id: "advanced",
                title: "Advanced",
                desc: "A more advanced deployment that employs network isolation to securely route traffic between the different layers, prepare environment for production deployed IBM Software",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#advanced",
                image: archAdvancedImg
            }
        ],
        software: [
            {
                id: "custom-software",
                title: "custom-software",
                displayName: "Custom Software",
                status: "Released",
                type: "",
                description: "Bring your own custom software components into your solution.",
                boms: []

            },
            {
                id: "turbo",
                title: "turbo",
                displayName: "Turbonomic",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareTurbonomicImg,
                description: "Assure application performance with smarter resource management.",
                boms: [
                    "200-openshift-gitops",
                    "202-turbonomic-ibmcloud-storage-class",
                    "250-turbonomic-multicloud"
                ]

            },
            {
                id: "maximo-",
                title: "maximo",
                displayName: "Maximo Core",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareMASImg,
                description: "Intelligent asset management, monitoring, predictive maintenance and reliability in a single platform.",
                boms: [
                    "200-openshift-gitops",
                    "400-mas-core-multicloud",
                ]
            },
            {
                id: "maximo-manage",
                title: "maximo-manage",
                displayName: "Maximo Manage",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareMASManageImg,
                description: "Maximo Application Suite - Manage Application",
                boms: [
                    "200-openshift-gitops",
                    "400-mas-core-multicloud",
                    "405-mas-manage"
                ]
            },
            {
                id: "maximo-iot",
                title: "maximo-iot",
                displayName: "Maximo IoT",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareMASIoTImg,
                description: " Maximo Application Suite - IoT Application",
                boms: [
                    "200-openshift-gitops",
                    "400-mas-core-multicloud",
                    "405-mas-iot"
                ]
            },

            {
                id: "maximo-monitor",
                title: "maximo-monitor",
                displayName: "Maximo Monitor",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareMASMonitorImg,
                description: " Maximo Application Suite - Monitor",
                boms: [
                    "200-openshift-gitops",
                    "400-mas-core-multicloud",
                    "405-mas-monitor"
                ]
            },

            {
                id: "data-foundation",
                title: "data-foundation",
                displayName: "Data Foundation",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareDataFoundationImg,
                description: "Base layer of components required to support different use cases with cloud pak for data",
                boms: [
                    "300-cloud-pak-for-data-entitlement",
                    "305-cloud-pak-for-data-foundation",
                    "310-cloud-pak-for-data-db2wh"
                ]
            },

            {
                id: "data-fabric",
                title: "data-fabric",
                displayName: "Data Fabric",
                status: "Released",
                type: "",
                icon: true,
                logo: softwareDataFabricImg,
                description: "Use the right data architecture so employees can access quality data, wherever and whenever it’s needed.",
                boms: [

                    "300-cloud-pak-for-data-entitlement",
                    "305-cloud-pak-for-data-foundation",
                    "600-datafabric-services",
                    "610-datafabric-demo"
                ]
            },
            {
                id: "integration",
                title: "integration",
                displayName: "Integration Tools",
                status: "Released",
                type: "Cloud Pak",
                description: "Set of Integration tools that enable application connectivity ideal to compliment your solution",
                icon: true,
                logo: softwareIntegrationImg,
                boms: [
                    "280-integration-platform-multicloud"
                ]
            },
            {
                id: "app-connect",
                title: "app-connect",
                displayName: "App Connect",
                status: "Released",
                type: "Cloud Pak",
                description: "Unlocks the value of your systems and your data by connecting business applications, integrating data, building APIs and acting on events.",
                icon: true,
                logo: softwareApiConnectImg,
                boms: [
                    "240-integration-ace"
                ]
            },
            {
                id: "api-connect",
                title: "api-connect",
                displayName: "API Connect",
                status: "Released",
                type: "Cloud Pak",
                description: "Complete, intuitive and scalable API platform that lets you create, expose, manage and monetize APIs across clouds.",
                icon: true,
                logo: softwareApiConnectImg,
                boms: [
                    "220-integration-apiconnect"
                ]
            },
            {
                id: "event-streams",
                title: "event-streams",
                displayName: "Event Streams",
                status: "Released",
                type: "Cloud Pak",
                description: "Event-streaming platform that helps you build smart apps that can react to events as they happen.",
                icon: true,
                logo: softwareEventStreamsImg,
                boms: [
                    "250-integration-eventstreams"
                ]
            },
            {
                id: "mq",
                title: "mq",
                displayName: "MQ",
                status: "Released",
                type: "Cloud Pak",
                description: "Proven messaging for hybrid and multi-cloud that’s high-performance and security-rich.",
                icon: true,
                logo: softwareMQImg,
                boms: [
                    "230-integration-mq",
                    "260-integration-mq-uniform-cluster"
                ]
            },
            {
                id: "security",
                title: "security",
                displayName: "Security",
                status: "Beta",
                type: "",
                icon: true,
                logo: softwareSecurityImg,
                description: "Work smarter with an open security platform to advance your zero trust strategy.",
                boms: [
                    "200-openshift-gitops",
                    "700-cp4s-multicloud"
                ]
            },
            {
                id: "db2",
                title: "db2",
                displayName: "Db2",
                status: "Release",
                type: "",
                icon: true,
                logo: softwareDB2Img,
                description: "Trusted SQL database",
                boms: [
                    "200-openshift-gitops",
                    "300-cloud-pak-for-data-entitlement",
                    "305-cloud-pak-for-data-foundation",
                    "310-cloud-pak-for-data-db2uoperator",
                    "320-cloud-pak-for-data-db2oltp"
                ]
            },
            {
                id: "db2w",
                title: "db2w",
                displayName: "Db2 Warehouse",
                status: "Release",
                type: "",
                icon: true,
                logo: softwareDB2WarehouseImg,
                description: "Trusted SQL database for building a Data Warehouse",
                boms: [
                    "200-openshift-gitops",
                    "300-cloud-pak-for-data-entitlement",
                    "305-cloud-pak-for-data-foundation",
                    "310-cloud-pak-for-data-db2uoperator",
                    "315-cloud-pak-for-data-db2wh"
                ]
            }

        ],

        storage_providers: [
            {
                id: "portworx",
                title: "Portworx Enterprise",
                desc: "Portworx Enterprise is the Kubernetes storage platform trusted in production by the leading enterprises",
                docs: "https://portworx.com/",
                image: storagePortworxImg,
                boms: {
                    ibm: [
                        "210-ibm-portworx-storage",
                    ],
                    aws: [
                        "210-aws-portworx-storage",
                    ],
                    azure: [
                        "210-azure-portworx-storage",
                    ]
                }
            },
            {
                id: "odf",
                title: "OpenShift Data Foundation",
                desc: "(ODF) is a software-defined, container-native storage solution that's integrated with the OpenShift Container Platform",
                docs: "https://www.redhat.com/en/technologies/cloud-computing/openshift-data-foundation",
                image: storageOdfImg,
                boms: {
                    ibm: [
                        "210-ibm-portworx-storage",
                    ],
                    aws: [
                    ],
                    azure: [
                    ]
                }
            }]

    };

    render() {
        console.log(this.state.curStepIx)
        const persona = this.state.catalog?.metadata?.useCases?.find(p => p.name === this.state.persona);
        const platform = this.state.catalog?.metadata?.cloudProviders?.find(p => p.name === this.state.platform);
        const arch = this.state.catalog?.metadata?.flavors?.find(p => p.name === this.state.architecture);
        const storage = this.solution_wizard.storage_providers.find(a => a.id === this.state.storage);
        const software = this.state.software.map(swId => (this.solution_wizard.software.find(sw => sw.id === swId)));
        const storage_providers = this.solution_wizard.storage_providers.map(s => ({
            ...s,
            enabled: s.boms[this.state.platform]?.length > 0
        }));
        const defaultShortDesc = this.state.fields.short_desc === "" && this.state.curStep === "details" ? `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.title ?? sw.id}`)).join(', ')} on ${platform?.title}.` : '';
        const defaultLongDesc = this.state.fields.long_desc === "" && this.state.curStep === "details" ? `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.title ?? sw.id}`)).join(', ')} in ${arch?.title} reference architecture deployed on ${platform?.title} with ${storage?.title} as storage option.` : '';
        if (defaultShortDesc || defaultLongDesc) this.setState({
            fields: {
                ...this.state.fields,
                short_desc: defaultShortDesc,
                long_desc: defaultLongDesc
            }
        });

        return (
            <Grid className='create-solution'>
                {this.state.navigate ? <Navigate to={this.state.navigate} /> : <></>}
                <Row>
                    <Column lg={{ span: 12 }}>
                        <h2>
                            Create Solution
                            <Button
                                kind='secondary'
                                renderIcon={Close}
                                onClick={() => this.setState({ navigate: '/solutions/user' })}>
                                Cancel
                            </Button>
                        </h2>
                        <br></br>
                    </Column>
                </Row>

                <Row className="modal-wizard">
                    <Column lg={{ span: 2 }}>

                        <ProgressIndicator vertical currentIndex={this.state.curStepIx}>
                            <ProgressStep label="Overview" />
                            <ProgressStep label="Use Case" />
                            <ProgressStep label="Infrastructure" />
                            <ProgressStep label="Software" />
                            <ProgressStep label="Solution Details" />
                            <ProgressStep label="Summary" />
                        </ProgressIndicator>
                    </Column>
                    <Column lg={{ span: 10 }}>
                        {
                            this.state.curStepIx === STEP_OVERWIEW ?
                                <Grid className='wizard-overview'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>Welcome to the Solution Wizard</h3>
                                            <br />
                                        </Column>
                                    </Row>
                                    <Row>
                                        <Column lg={{ span: 6 }} md={{ span: 12 }}>
                                            <div className='overview-text'>
                                                <p>
                                                    You are about to create a composite solution using the co-creation wizard.
                                                </p>
                                                <br />
                                                <p>
                                                    To do that, you will have to specify if you want to create a solution for Demos, building an MVP, a Production environment or support development.
                                                    You will then select the platform on which you wish to deploy your solution (Azure, AWS, IBM Cloud or bring your own OpenShift),
                                                    the architecture pattern you which to deploy depending on your use case and the cluster storage you want to use.
                                                </p>
                                                <br />
                                                <p>
                                                    Then, you will have to pick the IBM Software cartridges you need as part of your solution, from individual components of IBM Cloud Paks,
                                                    Sustainability Software, or bringing your own custom Software tiles. Once you have completed all these steps you will be redirected to
                                                    your new solution and can download the automation to support the provisioning into your own environment.
                                                </p>
                                            </div>
                                        </Column>
                                        <Column lg={{ span: 6 }} md={{ span: 12 }}>
                                            <div className="overview-image">
                                                <img loading="lazy" src={StacksImg} alt="Diagram representing a solution stack" />
                                            </div>
                                        </Column>
                                    </Row>
                                </Grid>
                            : this.state.curStepIx === STEP_USECASE ?
                                <Grid className='wizard-overview'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>Step 1: What are you trying to achieve ?</h3>
                                            <div className="selection-set">
                                                <form className="plans">
                                                    <div className="title">To help guide your solution creation, the first
                                                        step is to select the use case you are trying to support.
                                                        this will help the solution wizard to guide you to the best outcome
                                                        for your automation
                                                    </div>
                                                    {
                                                        this.state.catalog?.metadata?.useCases?.length ?
                                                            this.state.catalog.metadata.useCases.map((useCase) => (
                                                                <label className='plan complete-plan' htmlFor={useCase.name} key={useCase.name}>
                                                                    <input type="radio" className={this.state.persona === useCase.name ? 'checked' : ''} name={useCase.name} id={useCase.name} onClick={() => this.setState({ persona: useCase.name })} />
                                                                    <div className="plan-content">
                                                                        <img loading="lazy" src={useCase.iconUrl} alt="" />
                                                                        <div className="plan-details">
                                                                            <span>{useCase.displayName ?? useCase.name}</span>
                                                                            <p>{useCase.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            )) : <p>No Personas</p>
                                                    }
                                                </form>
                                            </div>
                                        </Column>
                                    </Row>
                                </Grid>
                            : this.state.curStepIx === STEP_INFRASTRUCTURE ?
                                <Grid className='wizard-overview'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>
                                                Step 2: Select your infrastructure
                                            </h3>
                                            <br />
                                            <ProgressIndicator currentIndex={this.state.infraStepIx}>
                                                <ProgressStep label="Platform" />
                                                <ProgressStep label="Architecture" />
                                                <ProgressStep label="Storage" />
                                            </ProgressIndicator>
                                            <br />
                                            { this.state.infraStepIx === STEP_INFRA_PLATFORM ? 
                                                <div>
                                                    <div className="selection-set">
                                                        <form className="plans platform">

                                                            <div className="title">Now you have selected an outcome aligned with your use case. You now want to
                                                                select the platform you want to target. This will be the compute layer of your solution
                                                            </div>

                                                            {
                                                                this.state.catalog?.metadata?.cloudProviders?.length ?
                                                                    this.state.catalog.metadata.cloudProviders.map((cloudProvider) => (
                                                                        <label className="plan complete-plan" htmlFor={cloudProvider.name} key={cloudProvider.name}>
                                                                            <input
                                                                                type="radio"
                                                                                name={cloudProvider.name}
                                                                                id={cloudProvider.name}
                                                                                className={this.state.platform === cloudProvider.name ? 'checked' : ''}
                                                                                onClick={() => { this.setState({ platform: cloudProvider.name }) }} />
                                                                            <div className="plan-content">
                                                                                <img loading="lazy" src={cloudProvider.iconUrl} alt="" />
                                                                                <div className="plan-details">
                                                                                    <span>{cloudProvider.displayName ?? cloudProvider.name}</span>
                                                                                    <p>{cloudProvider.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        </label>

                                                                    )) : <p>No Platforms</p>
                                                            }
                                                            <label className="plan complete-plan" htmlFor='byo-infra' key='byo-infra'>
                                                                <input
                                                                    type="radio"
                                                                    name='byo-infra'
                                                                    id='byo-infra'
                                                                    className={this.state.platform === 'byo-infra' ? 'checked' : ''}
                                                                    onClick={() => { this.setState({ platform: 'byo-infra' }) }} />
                                                                <div className="plan-content">
                                                                    <img loading="lazy" src={byoInfra} alt="" />
                                                                    <div className="plan-details">
                                                                        <span>Bring Your Own</span>
                                                                        <p>Bring your own OpenShift infrastructure. Select only the software you want to deploy for your solution</p>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </form>
                                                    </div>
                                                </div>
                                            : this.state.infraStepIx === STEP_INFRA_FLAVOR ? 
                                                <div>
                                                    <div className="selection-set">
                                                        <form className="plans">
                                                            {/* <div className="title">Now you have selected your use case and the platform you want to target. Let's select the architecture pattern you want to use</div> */}
                                                            <div className="arch">
                                                                <p>You want to <strong>{persona?.displayName ?? persona?.name}</strong> <img loading="lazy" src={persona?.iconUrl} alt={persona?.displayName ?? ""} /></p>
                                                                <p>on the platform <img loading="lazy" src={platform?.iconUrl} alt="platform" align={"top"} /></p>
                                                                <p>We recommend you use the <strong>{persona?.flavor}</strong> reference architecture</p>
                                                            </div>
                                                            {
                                                                this.state.catalog?.metadata?.flavors?.length ?
                                                                    this.state.catalog?.metadata?.flavors.map((flavor) => (
                                                                        <label className="plan complete-plan" htmlFor={flavor.name} key={flavor.name}>
                                                                            <input type="radio" name={flavor.name} id={flavor.name}
                                                                                disabled={!flavor.enabled}
                                                                                className={this.state.architecture === flavor.name ? 'checked' : ''}
                                                                                onClick={() => { if (flavor.enabled) this.setState({ architecture: flavor.name }) }} />
                                                                            <div className={`plan-content${flavor.enabled ? '' : ' coming-soon'}`}>
                                                                                <img loading="lazy" src={flavor.iconUrl} alt="" />

                                                                                <div className="plan-details">
                                                                                    <span>{flavor.displayName ?? flavor.name}
                                                                                        {!flavor.enabled && <i><b><h6>Coming Soon !</h6></b></i>}
                                                                                    </span>
                                                                                    <p>{flavor.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    )) : <p>No Architecture Pattern</p>
                                                            }
                                                        </form>
                                                    </div>
                                                </div>
                                            :  this.state.infraStepIx === STEP_INFRA_STORAGE ? 
                                                <div>
                                                    <div className="selection-set">
                                                        <form className="plans">

                                                            <div className="title">Now you have selected your reference architecture you will require some file storage for your IBM Software
                                                            </div>

                                                            {
                                                                this.solution_wizard.storage_providers?.length ?
                                                                    storage_providers.map((storage) => (

                                                                        <label className="plan complete-plan" htmlFor={storage.id} key={storage.id}>
                                                                            <input type="radio" name={storage.id} id={storage.id}
                                                                                disabled={!storage.enabled}
                                                                                className={this.state.storage === storage.id ? 'checked' : ''}
                                                                                onClick={() => { if (storage.enabled) this.setState({ storage: storage.id }) }} />
                                                                            <div className={`plan-content${storage.enabled ? '' : ' coming-soon'}`}>
                                                                                <img loading="lazy" src={storage.image} alt="" />

                                                                                <div className="plan-details">
                                                                                    <span>{storage.title}
                                                                                        {!storage.enabled && <i><b><h6>Coming Soon !</h6></b></i>}

                                                                                    </span>
                                                                                    <p>{storage.desc}</p>
                                                                                </div>
                                                                            </div>
                                                                        </label>

                                                                    )) : <p>No Storage options</p>
                                                            }

                                                        </form>
                                                    </div>
                                                </div>
                                            : <></>}
                                        </Column>
                                    </Row>
                                </Grid>
                            : <></>
                        }
                        <br />
                        <Button kind='secondary'
                            style={{ marginRight: '1rem', display: this.state.curStepIx <= 0 ? 'none' : 'unset' }}
                            onClick={this.handleBack}>Back</Button>
                        <Button onClick={this.handleNext}
                            disabled={this.nextDisabled()}>Next</Button>
                        {/* 
                        
                            
                            <PageWizardStep id="software" key="software" label="Software">
                                <PageWizardStepTitle>Step 5: Select the Software</PageWizardStepTitle>


                                <div className="title">We are getting close to create your custom solution for your client or partner, we need a few more details
                                    like the solution name and description. Dont worry you can edit you solution once its created to refine it so you client or partner is completely happy
                                </div>

                                <br></br>

                                <Grid>
                                    <Row>

                                        <Column lg={{ span: 10 }} md={{ span: 6 }} sm={{ span: 4 }}>
                                            <StatefulTileCatalog
                                                title='Software Bundles'
                                                id='software-bundles'
                                                isMultiSelect
                                                tiles={
                                                    this.solution_wizard.software.map((software) => (
                                                        {
                                                            id: software.id,
                                                            values: {
                                                                title: software.id,
                                                                logo: software.logo,
                                                                displayName: software.displayName,
                                                                description: software.description,
                                                            },
                                                            renderContent: tileRenderFunction,
                                                        }
                                                    ))
                                                }
                                                pagination={{ pageSize: 9 }}
                                                isSelectedByDefault={false}
                                                selectedTileIds={this.state.software}
                                                onSelection={(val) => {
                                                    const sw = Array.from(this.state.software);
                                                    console.log(sw)
                                                    const swIx = this.state.software.indexOf(val);
                                                    if (swIx >= 0) sw.splice(swIx, 1);
                                                    else sw.push(val);
                                                    console.log(sw)
                                                    this.setState({ software: sw });
                                                }} />
                                        </Column>
                                    </Row>
                                </Grid>

                            </PageWizardStep>
                            <PageWizardStep id="details" key="details" label="Solution Details">
                                <PageWizardStepTitle>Step 6: What do you want to call your solution ?</PageWizardStepTitle>



                                <div className="title">We need a few more details before we can create your solution. We need the solution name
                                    and description so we can identify it later
                                </div>
                                <br></br>

                                <Form name="solutionform" onSubmit={this.handleSubmit.bind(this)}>
                                    <TextInput
                                        data-modal-primary-focus
                                        id="id"
                                        name="id"
                                        required
                                        disabled
                                        invalidText="Please Enter The Value"
                                        onChange={this.handleChange.bind(this, "id")}
                                        value={this.state.fields.id}
                                        labelText={this.props.data ? "" : "Solution ID"}
                                        placeholder="e.g. fs-cloud-szr-ocp"
                                        style={{ marginBottom: '1rem' }}
                                    />
                                    <TextInput
                                        data-modal-primary-focus
                                        id="name"
                                        name="name"
                                        required
                                        invalidText="Please Enter The Value"
                                        onChange={this.handleChange.bind(this, "name")}
                                        value={this.state.fields.name}
                                        labelText="Solution Name"
                                        placeholder="e.g. OpenShift"
                                        style={{ marginBottom: '1rem' }}
                                    />
                                    {!this.props.isDuplicate && <TextInput
                                        data-modal-primary-focus
                                        id="short_desc"
                                        name="short_desc"
                                        required
                                        invalidText="Please Enter The Value"
                                        onChange={this.handleChange.bind(this, "short_desc")}
                                        defaultValue={defaultShortDesc}
                                        labelText="Short Description"
                                        placeholder="e.g. FS Cloud single zone environment with OpenShift cluster and SRE tools."
                                        style={{ marginBottom: '1rem' }}
                                    />}
                                    {!this.props.isDuplicate && <TextArea
                                        required
                                        // cols={50}
                                        id="long_desc"
                                        name="long_desc"
                                        defaultValue={defaultLongDesc}
                                        onChange={this.handleChange.bind(this, "long_desc")}
                                        invalidText="A valid value is required"
                                        labelText="Long Description"
                                        placeholder="Solution long description"
                                        rows={2}
                                        style={{ marginBottom: '1rem' }}
                                    />}
                                    {!this.props.isDuplicate && this.props.user?.roles?.includes('admin') && <Select id="public" name="public"
                                        labelText="Public"
                                        required
                                        defaultValue={this.state.fields.public}
                                        invalidText="A valid value is required"
                                        onChange={this.handleChange.bind(this, "public")}
                                        style={{ marginBottom: '1rem' }}>
                                        <SelectItem value={false} text="False" />
                                        <SelectItem value={true} text="True" />
                                    </Select>}
                                    {!this.props.isDuplicate && this.props.user?.roles?.includes('admin') && <Select id="techzone" name="techzone"
                                        labelText="Deploy to TechZone"
                                        required
                                        defaultValue={this.state.fields.techzone}
                                        invalidText="A valid value is required"
                                        onChange={this.handleChange.bind(this, "techzone")}
                                        style={{ marginBottom: '1rem' }}>
                                        <SelectItem value={false} text="False" />
                                        <SelectItem value={true} text="True" />
                                    </Select>}
                                </Form>


                            </PageWizardStep>
                            <PageWizardStep id="summary" key="summary" label="Summary">
                                <PageWizardStepTitle>Summary: Is this the solution you want ?</PageWizardStepTitle>

                                <div className="summary">

                                    <p>You have chosen to create an IBM Technology solution called <strong>{this.state.fields?.name}</strong></p>

                                    <div className='arch'>
                                        <p>You want to <strong>{persona?.displayName}</strong> <img loading="lazy" src={persona?.iconUrl} alt={persona?.displayName ?? ""} /></p>
                                        <p>You chose to deploy you solution on <strong>{platform?.displayName}</strong> <img loading="lazy" src={platform?.iconUrl} alt={platform?.displayName ?? ""} /></p>
                                        <p>You have chosen the <strong>{arch?.displayName}</strong> reference architecture <div className='flex-inline'><img loading="lazy" src={arch?.iconUrl} alt={arch?.displayName ?? ""} /><img loading="lazy" src={openshiftImg} alt="OpenShift" /></div></p>
                                        <p>It will install with the following Storage Option <img loading="lazy" src={storage?.image} alt={storage?.title ?? ""} /></p>
                                    </div>

                                    <p>You have chosen the following IBM Software to help get your solution started:
                                        <ul>
                                            {software?.map(sw => (
                                                <li>{sw.displayName ?? sw.title}</li>
                                            ))}
                                        </ul>
                                    </p>
                                    <p>If you are happy with this selection of content for your solution click on the Submit button below. You can always change the
                                        content later by adding an removing your own bill of materials.</p>
                                </div>

                            </PageWizardStep> */}
                    </Column>
                </Row>
            </Grid>
        );
    }
}

export default CreateSolutionview;

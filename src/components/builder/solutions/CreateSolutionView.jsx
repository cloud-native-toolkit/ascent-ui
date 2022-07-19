import React, { Component } from 'react';
import {
    Navigate
} from "react-router-dom";
import {
    TextInput, Column, Grid, Row, Tag, Form, TextArea, Select, SelectItem
} from 'carbon-components-react';
import {
    PageWizardStep, StatefulPageWizard, PageWizardStepTitle, Tooltip
} from 'carbon-addons-iot-react';
import {
    ContainerSoftware32
} from '@carbon/icons-react';

import StatefulTileCatalog from './TileCatalog/StatefulTileCatalog';
import { catalogFilters } from '../../../data/data';

import { v4 as uuidv4 } from 'uuid';

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
            curStep: "persona",
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
                platform: "",
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        fetch('/api/architectures')
            .then(res => res.json())
            .then(boms => {
                this.setState({ boms: boms });
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
        switch (this.state.curStep) {
            case "persona":
                return this.state.persona === undefined;
            case "platform":
                return this.state.platform === undefined;
            case "architecture":
                return this.state.architecture === undefined;
            case "storage":
                return this.state.storage === undefined;
            case "software":
                return this.state.software?.length === 0;
            case "details":
                return this.state.fields.name === "";
            case "summary":
                return false;
            default:
                return true;
        }
    }

    handleClose = (event) => {
        console.log(JSON.stringify(event));
    }

    handleNext = (newStep) => {
        if (newStep === "software") this.setState({ software: [] });
        this.setState({ curStep: newStep });
    }

    handleBack = (newStep) => {
        if (newStep === "software") this.setState({ software: [] });
        this.setState({ curStep: newStep });
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
                    this.setState({ newSolId: res.id });
                }
            })
            .catch(console.error);
    }

    solution_wizard = {

        personas: [
            {
                id: "demo",
                title: "Setup a Demo",
                desc: "As a tech seller you want to demo the capability of IBM Technology use this personal to get started quickly",
                docs: "url",
                image: "techsales_tammy.png",
                recommendedArch: "quickstart"
            },
            {
                id: "mvp",
                title: "Create a POC/POT/MVP",
                desc: "You are past the demo phase and now need to prove the technology for a specific client use case",
                docs: "",
                image: "mvp_rohan.png",
                recommendedArch: "standard"
            },
            {
                id: "production",
                title: "Prepare for Production",
                desc: "You are now focused on the delivery phase of a project and need to place IBM Technology into a highly scalable secure production environment",
                docs: "",
                image: "production_admin.png",
                recommendedArch: "advanced"
            },
            {
                id: "developer",
                title: "Support Development",
                desc: "You want to setup a Red Hat OpenShift environment to develop solution assets",
                docs: "",
                image: "developer_rubi.png",
                recommendedArch: "standard"
            },

        ],
        platforms: [
            {
                id: "aws",
                title: "AWS",
                desc: "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled: true,
                boms: {
                    quickstart: [
                        "200-aws-openshift-gitops",
                        "105-aws-vpc-openshift",
                        "220-dev-tools"
                    ],
                    standard: [],
                    advanced: []
                }
            },
            {
                id: "azure",
                title: "Azure",
                desc: "Microsoft Azure infrastructure with Red Hat OpenShift ARO and IPI",
                docs: "https://azure.microsoft.com/",
                image: "azure.png",
                enabled: true,
                boms: {
                    quickstart: [
                        "110-azure-ocp-ipi",
                        "200-azure-openshift-gitops",
                        "220-dev-tools"
                    ],
                    standard: [],
                    advanced: []
                }
            },
            {
                id: "ibm",
                title: "IBM Cloud",
                desc: "IBM Cloud infrastructure with Red Hat OpenShift ROKS ",
                docs: "https://www.ibm.com/cloud",
                image: "ibmcloud.png",
                enabled: true,
                boms: {
                    quickstart: [
                        "200-ibm-openshift-gitops",
                        "105-ibm-vpc-openshift",
                        "220-dev-tools"
                    ],
                    standard: [
                        "000-ibm-account-setup",
                        "100-ibm-shared-services",
                        "110-ibm-vpc-edge-standard",
                        "115-ibm-vpc-openshift-standard",
                        "200-ibm-openshift-gitops",
                        "220-dev-tools"
                    ],
                    advanced: [
                        "000-ibm-account-setup",
                        "100-ibm-shared-services",
                        "110-ibm-edge-vpc",
                        "130-ibm-development-vpc-openshift",
                        "150-ibm-production-vpc-openshift",
                        "200-ibm-openshift-gitops-dev",
                        "200-ibm-openshift-gitops-integration",
                        "220-dev-tools"
                    ]
                }

            },
            {
                id: "vmware",
                title: "VMWare",
                desc: "VMWare vSphere on premise infrastructure powered by Intel with Red Hat OpenShift",
                docs: "",
                image: "vmware.webp",
                enabled: false,
                boms: {
                    quickstart: [],
                    standard: [],
                    advanced: []
                }
            },
            {
                id: "power",
                title: "IBM Cloud + Power",
                desc: "IBM Power 10 AIX environments with Red Hat OpenShift",
                docs: "",
                image: "power.webp",
                enabled: false,
                boms: {
                    quickstart: [],
                    standard: [],
                    advanced: []
                }
            },
            {
                id: "z",
                title: "IBM Cloud + Z Platform",
                desc: "IBM z/Linux and z/OS environment with Red Hat OpenShift",
                docs: "",
                image: "zlogo.png",
                enabled: false,
                boms: {
                    quickstart: [],
                    standard: [],
                    advanced: []
                }
            }

        ],
        architectures: [
            {
                id: "quickstart",
                title: "Quick-Start",
                desc: "A simple architecture to quickly get an OpenShift cluster provisioned ideal for Demos",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#quickstart",
                image: "quick-start.png"
            },
            {
                id: "standard",
                title: "Standard",
                desc: "A standard production deployment environment with typical security protections, private endpoints, VPN server, key management encryption, ideal for POC/POT/MVP",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#standard",
                image: "standard.png"
            },
            {
                id: "advanced",
                title: "Advanced",
                desc: "A more advanced deployment that employs network isolation to securely route traffic between the different layers, prepare environment for production deployed IBM Software",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md#advanced",
                image: "advanced.png"
            },
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
                logo: "/images/turbonomic-short.png",
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
                logo: "/images/mas.svg",
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
                logo: "/images/mas-manage.svg",
                description: "Maximo Application Suite - Manage Application",
                boms : [
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
                logo: "/images/mas-iot.svg",
                description: " Maximo Application Suite - IoT Application",
                boms : [
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
                logo: "/images/mas-monitor.svg",
                description: " Maximo Application Suite - Monitor",
                boms : [
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
                logo: "/images/datafoundation.svg",
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
                logo: "/images/datafabric.svg",
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
                logo: "/images/integration.svg",
                boms : [
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
                logo: "/images/appconnect.svg",
                boms : [
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
                logo: "/images/apiconnect.svg",
                boms : [
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
                logo: "/images/eventstreams.svg",
                boms : [
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
                logo: "/images/mq.svg",
                boms : [
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
                logo: "/images/security.svg",
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
                logo: "/images/db2.svg",
                description: "Trusted SQL database",
                boms : [
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
                logo: "/images/DB2BigSQL.svg",
                description: "Trusted SQL database for building a Data Warehouse",
                boms : [
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
                desc: "Portworx Enterprise is the Kubernetes storage platform trusted in production by the world’s leading enterprises",
                docs: "https://portworx.com/",
                image: "portworx.png",
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
                image: "odf.png",
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
        const persona = this.solution_wizard.personas.find(p => p.id === this.state.persona);
        const platform = this.solution_wizard.platforms.find(p => p.id === this.state.platform);
        const arch = this.solution_wizard.architectures.find(a => a.id === this.state.architecture);
        const storage = this.solution_wizard.storage_providers.find(a => a.id === this.state.storage);
        const software = this.state.software.map(swId => (this.solution_wizard.software.find(sw => sw.id === swId)));
        const architectures = this.solution_wizard.architectures.map(architecture => ({
            ...architecture,
            enabled: this.solution_wizard.platforms.find(p => p.id === this.state.platform)?.boms[architecture.id]?.length > 0
        }));
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
            <Grid>
                <Row>
                    <Column lg={{ span: 12 }}>
                        <h2>Create Solution</h2>
                        <br></br>
                    </Column>
                </Row>

                <Row className="modal-wizard">
                    <Column lg={{ span: 12 }}>

                        {this.state.newSolId ? <Navigate to={`/solutions/${this.state.newSolId}`} /> : <></>}

                        <StatefulPageWizard
                            currentStepId="persona"
                            onNext={this.handleNext}
                            onClose={this.handleSubmit}
                            onSubmit={this.handleSubmit}
                            onClearError={this.handleSubmit}
                            onBack={this.handleBack}
                            nextDisabled={this.nextDisabled()}
                        >
                            <PageWizardStep id="persona" label="Persona" key="persona">
                                <PageWizardStepTitle>Step 1: What are you trying to achieve ?</PageWizardStepTitle>

                                <div className="selection-set">
                                    <form className="plans">

                                        <div className="title">To help guide your solution creation, the first
                                            step is to select the persona you are trying to support.
                                            this will help the solution wizard to guide you to the best outcome
                                            for your automation
                                        </div>

                                        {
                                            this.solution_wizard.personas?.length ?
                                                this.solution_wizard.personas.map((persona) => (

                                                    <label className='plan complete-plan' htmlFor={persona.id} key={persona.id}>
                                                        <input type="radio" className={this.state.persona === persona.id ? 'checked' : ''} name={persona.id} id={persona.id} onClick={() => this.setState({ persona: persona.id })} />
                                                        <div className="plan-content">
                                                            <img loading="lazy" src={"/images/" + persona.image} alt="" />
                                                            <div className="plan-details">
                                                                <span>{persona.title}</span>
                                                                <p>{persona.desc}</p>
                                                            </div>
                                                        </div>
                                                    </label>

                                                )) : <p>No Personas</p>
                                        }

                                    </form>
                                </div>

                            </PageWizardStep>
                            <PageWizardStep id="platform" key="platform" label="Platform">
                                <PageWizardStepTitle>Step 2: Select your platform</PageWizardStepTitle>

                                <div className="selection-set">
                                    <form className="plans platform">

                                        <div className="title">Now you have selected an outcome aligned with your persona. You now want to
                                            select the platform you want to target. This will be the compute layer of your solution
                                        </div>

                                        {
                                            this.solution_wizard.platforms?.length ?
                                                this.solution_wizard.platforms.map((platform) => (

                                                    <label className="plan complete-plan" htmlFor={platform.id} key={platform.id}>
                                                        <input
                                                            type="radio"
                                                            name={platform.id}
                                                            id={platform.id}
                                                            disabled={!platform.enabled}
                                                            className={this.state.platform === platform.id ? 'checked' : ''}
                                                            onClick={() => { if (platform.enabled) this.setState({ platform: platform.id }) }} />
                                                        <div className={platform.enabled ? "plan-content" : "plan-content coming-soon"}>
                                                            <img loading="lazy" src={"/images/" + platform.image}
                                                                alt="" />
                                                            <div className="plan-details">
                                                                <span>{platform.title}
                                                                    {!platform.enabled && <i><b><h6>Coming Soon !</h6></b></i>}
                                                                </span>
                                                                <p>{platform.desc}</p>
                                                            </div>
                                                        </div>
                                                    </label>

                                                )) : <p>No Platforms</p>
                                        }

                                    </form>
                                </div>


                            </PageWizardStep>
                            <PageWizardStep id="architecture" key="architecture" label="Architecture">
                                <PageWizardStepTitle>Step 3: Select your Architecture Pattern</PageWizardStepTitle>

                                <div className="selection-set">
                                    <form className="plans">

                                        <div className="title">Now you have selected an outcome aligned with your persona you want to support
                                            now lets select the platform you want to target. This will be the compute layer of of you solution
                                        </div>

                                        <div className="arch">
                                            <p>You want to <strong>{persona?.title}</strong> <img loading="lazy" src={`/images/${persona?.image}`} alt={persona?.title ?? ""} /></p>
                                            <p>on the platform <img loading="lazy" src={`/images/${platform?.image}`} alt="platform" align={"top"} /></p>
                                            <p>We recommend you use the <strong>{this.solution_wizard.architectures.find(a => a.id === persona?.recommendedArch)?.title}</strong> reference architecture</p>

                                        </div>

                                        {
                                            this.solution_wizard.architectures?.length ?
                                                architectures.map((architecture) => (

                                                    <label className="plan complete-plan" htmlFor={architecture.id} key={architecture.id}>
                                                        <input type="radio" name={architecture.id} id={architecture.id}

                                                            disabled={!architecture.enabled}
                                                            className={this.state.architecture === architecture.id ? 'checked' : ''}
                                                            onClick={() => { if (architecture.enabled) this.setState({ architecture: architecture.id }) }} />
                                                        <div className={`plan-content${architecture.enabled ? '' : ' coming-soon'}`}>
                                                            <img loading="lazy" src={"/images/" + architecture.image}
                                                                alt="" />

                                                            <div className="plan-details">
                                                                <span>{architecture.title}
                                                                    <Tooltip tooltipBodyId="tooltip-body">
                                                                        <p id="tooltip-body">
                                                                            To learn more about the architectural pattern and the reference implementation click on Learn More below
                                                                        </p>
                                                                        <div>
                                                                            <br></br>
                                                                            <a href={architecture.docs} target="_blank" rel="noopener noreferrer">
                                                                                Learn More
                                                                            </a>
                                                                        </div>
                                                                    </Tooltip>
                                                                    {!architecture.enabled && <i><b><h6>Coming Soon !</h6></b></i>}
                                                                </span>
                                                                <p>{architecture.desc}</p>
                                                            </div>
                                                        </div>
                                                    </label>

                                                )) : <p>No Platforms</p>
                                        }

                                    </form>
                                </div>

                            </PageWizardStep>
                            <PageWizardStep id="storage" key="storage" label="Storage">
                                <PageWizardStepTitle>Step 4: What type of Storage ?</PageWizardStepTitle>

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
                                                            <img loading="lazy" src={"/images/" + storage.image}
                                                                alt="" />

                                                            <div className="plan-details">
                                                                <span>{storage.title}
                                                                    <Tooltip tooltipBodyId="tooltip-body">
                                                                        <p id="tooltip-body">
                                                                            To learn more about the your storage options click on Learn More below
                                                                        </p>
                                                                        <div>
                                                                            <br></br>
                                                                            <a href={storage.docs} target="_blank" rel="noopener noreferrer">
                                                                                Learn More
                                                                            </a>
                                                                        </div>
                                                                    </Tooltip>
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


                            </PageWizardStep>
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
                                </Form>


                            </PageWizardStep>

                            <PageWizardStep id="summary" key="summary" label="Summary">
                                <PageWizardStepTitle>Summary: Is this the solution you want ?</PageWizardStepTitle>

                                <div className="summary">

                                    <p>You have chosen to create an IBM Technology solution called <strong>{this.state.fields?.name}</strong></p>

                                    <div className='arch'>
                                        <p>You want to <strong>{persona?.title}</strong> <img loading="lazy" src={`/images/${persona?.image}`} alt={persona?.title ?? ""} /></p>
                                        <p>You chose to deploy you solution on <strong>{platform?.title}</strong> <img loading="lazy" src={`/images/${platform?.image}`} alt={platform?.title ?? ""} /></p>
                                        <p>You have chosen the <strong>{arch?.title}</strong> reference architecture <div className='flex-inline'><img loading="lazy" src={`/images/${arch?.image}`} alt={arch?.title ?? ""} /> <img loading="lazy" src={`/images/openshift.png`} alt="OpenShift" /></div></p>
                                        <p>It will install with the following Storage Option <img loading="lazy" src={`/images/${storage?.image}`} alt={storage?.title ?? ""} /></p>
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

                            </PageWizardStep>


                        </StatefulPageWizard>
                    </Column>
                </Row>
            </Grid>
        );
    }
}

export default CreateSolutionview;

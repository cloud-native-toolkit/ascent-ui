import React, { Component } from 'react';

import "brace/mode/yaml";

import {
    ComposedModal,
    ModalBody, ModalHeader, TextInput,
    ModalFooter, FormGroup,
    Column, Grid, Row, Tag, Form, TextArea, Select, SelectItem, MultiSelect, ButtonSkeleton
} from 'carbon-components-react';

import {
    StatefulTileCatalog,
//    TileCatalog,
    PageWizardStep,
    StatefulPageWizard,
    PageWizardStepTitle,
    Tooltip
} from 'carbon-addons-iot-react';

import {
    Add32 as Add
} from '@carbon/icons-react';

import {catalogFilters, servicePlatforms} from '../data/data';

import { v4 as uuidv4 } from 'uuid';

const CatalogContent = ({ logo, icon, title, displayName, status, type, description }) => (


    <div className={`iot--sample-tile`}>
        {icon ? <div className={`iot--sample-tile-icon`}>
            <img className="software-logo" loading="lazy" src={logo}
                 alt=""/>
        </div> : null}
        <div className={`iot--sample-tile-contents`}>
            <div className={`iot--sample-tile-title`}>
                <span title={title}>{displayName}</span>
                {(type === 'terraform' || type === 'gitops') && <Tag
                    style={{marginLeft: '.5rem'}}
                    type='gray' >
                    {catalogFilters.moduleTypeValues.find(v => v.value === type)?.text}
                </Tag>}
                {(status === 'beta' || status === 'pending') && <Tag
                    style={{marginLeft: '.5rem'}}
                    type={status === 'beta' ? 'teal' : 'magenta'} >
                    {catalogFilters.statusValues.find(v => v.value === status)?.text}
                </Tag>}
            </div>
            <div className={`iot--sample-tile-description`}>{description ? `${description?.slice(0, 95)}${description?.length > 95 ? '...' : ''}` : title}</div>
        </div>
    </div>
);
const tileRenderFunction = ({ values }) => <CatalogContent {...values} icon={<Add />} />;

class CreateSolutionModal extends Component {
    constructor(props) {

        var guid = uuidv4();
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            step: 1,
            create: false,
            software: [],
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                desc: '',
                yaml: "",
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

    validate = (event) => {

    }

    handleClose = (event) => {

        console.log("close");
    }

    handleNext = (event) => {

        console.log(JSON.stringify(event));
    }

    handleBack = (event) => {
        console.log(JSON.stringify(event));
    }

    handleSubmit = (event) => {

        /*
        if (this.state.step < 5) {
            this.setState({ step: this.state.step + 1});
        } else if (this.state.fields.service_id) {
            this.props.service.doUpdateBOM(this.props.data.id, {
                desc: this.state.fields.desc,
                yaml: this.state.fields.yaml
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", `${res.body.error.message}${res.body.error?.details?.reason && " Reason: " + res.body.error.details.reason}`);
                } else {
                    this.props.toast("success", "Success", `Service ${res.service_id} successfully updated!`);
                    this.props.handleClose();
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a service ID.");
        }
        */
    }

    solution_wizard =  {

        personas :[
            {
                id: "demo",
                title :"Setup a Demo",
                desc: "As a tech seller you want to demo the capability of IBM Technology use this personal to get started quickly",
                docs: "url",
                image : "techsales_tammy.png"
            },
            {
                id: "mvp",
                title : "Create a POC/POT/MVP",
                desc: "You are past the demo phase and now need to prove the technology for a specific client use case",
                docs: "",
                image: "mvp_rohan.png"
            },
            {
                id: "production",
                title : "Prepare for Production",
                desc: "You are now focused on the delivery phase of a project and need to place IBM Technology into a highly scalable secure production environment",
                docs: "",
                image: "production_admin.png"
            },
            {
                id: "developer",
                title:"Support Development",
                desc:"You want to setup a Red Hat OpenShift environment to develop solution assets",
                docs: "",
                image: "developer_rubi.png"
            },

        ],
        platforms : [
            {
                title: "AWS",
                desc: "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled: true,
                boms: {
                    quick_start:["",""],
                    standard: ["",""],
                    advanced: ["",""]
                 }
            },
            {
                title : "Azure",
                desc  : "Microsoft Azure infrastructure with Red Hat OpenShift ARO",
                docs: "",
                image: "azure.png",
                enabled : true,
                boms: {
                    quick_start:["",""],
                    standard: ["",""],
                    advanced: ["",""]
                }
            },
            {
                title : "IBM Cloud",
                desc  : "IBM Cloud infrastructure with Red Hat OpenShift ROKS ",
                docs  : "",
                image : "ibmcloud.png",
                enabled : true,
                boms: {
                    quick_start:["",""],
                    standard: ["",""],
                    advanced: ["",""]
                }

            },
            {
                title : "VMWare",
                desc  : "VMWare vSphere on premise infrastructure powered by Intel with Red Hat OpenShift",
                docs  : "",
                image : "vmware.webp",
                enabled : false,
                boms: {
                    quick_start:[],
                    standard: [],
                    advanced: []
                }
            },
            {
                title : "Power",
                desc  : "IBM Power 10 AIX environments with Red Hat OpenShift",
                docs  : "",
                image : "power.webp",
                enabled : false,
                boms: {
                    quick_start:[],
                    standard: [],
                    advanced: []
                }
            },
            {
                title : "Z Platform",
                desc  : "IBM z/Linux and z/OS environment with Red Hat OpenShift",
                docs  : "",
                image : "zlogo.png",
                enabled : false,
                boms: {
                    quick_start:["",""],
                    standard: ["",""],
                    advanced: ["",""]
                }
            }

        ],
        architectures : [

            {
                title : "Quick-Start",
                desc  : "A simple architecture to quickly get an OpenShift cluster provisioned ideal for Demos",
                docs: "https://github.com/cloud-native-toolkit/automation-solutions/blob/main/architectures/README.md",
                image: "quick-start.png",
                enabled : true
            },

            {
                title : "Standard",
                desc  : "A standard production deployment environment with typical security protections, private endpoints, VPN server, key management encryption, ideal for POC/POT/MVP",
                docs: "",
                image: "standard.png",
                enabled : true
            },
            {
                title : "Advanced",
                desc  : "A more advanced deployment that employs network isolation to securely route traffic between the different layers, prepare environment for production deployed IBM Software",
                docs: "",
                image: "advanced.png",
                enabled : false
            },


        ],
        software : [
            {
                title: "turbo",
                displayName: "Turbonomic",
                status: "Released",
                type: "",
                description: "",
            },
            {
                title: "maximo",
                displayName: "Maximo Application Suite",
                status: "Released",
                type: "",
                description: "",

            },
            {
                title: "maximo-plugins",
                displayName: "Maximo Plugins",
                status: "Released",
                type: "",
                description: "",
            },

            {
                title: "data-fabric",
                displayName: "Data Fabric",
                status: "Released",
                type: "",
                description: "",

            },
            {
                title: "integration",
                displayName: "Integration Tools",
                status: "Released",
                type: "Cloud Pak",
                description: "Set of Integration tools that enable application connectivity ideal to compliment your solution",
                icon : true,
                logo :  "/images/integration.png"

            },
            {
                title: "security",
                displayName: "Security",
                status: "Released",
                type: "",
                description: "",
            }

        ],

        storage_providers : [
            {
                title : "Portworx Enterprise",
                desc  : "Portworx Enterprise is the Kubernetes storage platform trusted in production by the world’s leading enterprises",
                docs: "https://portworx.com/",
                image: "portworx.png",
                enabled : true
            },
            {
                title : "OpenShift Data Foundation",
                desc  : "(ODF) is a software-defined, container-native storage solution that's integrated with the OpenShift Container Platform",
                docs: "https://www.redhat.com/en/technologies/cloud-computing/openshift-data-foundation",
                image: "odf.png",
                enabled : true,
                BOMS : ["",""]
            }]

   };


    render() {
        return (
            <div className="bx--grid">

                <div className="bx--row modal-wizard">
                    <div className="bx--row modal-wizard">
                        <ComposedModal
                            open={this.props.show}
                            onClose={this.props.handleClose}>
                            <ModalHeader >
                                <h3 className="bx--modal-header__heading">Create A New Solution</h3>
                                <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                            </ModalHeader>
                            <ModalBody style={{paddingRight: '1rem'}}>

                                <StatefulPageWizard currentStepId="persona"
                                        onNext=   {this.handleNext }
                                        onClose=  {this.handleSubmit}
                                        onSubmit= {this.handleSubmit}
                                        onClearError={this.handleSubmit}
                                        onBack={ this.handleBack}
                                >
                                    <PageWizardStep id="persona" label="Persona" key="persona">
                                        <PageWizardStepTitle>Step 1: What are you trying to achieve ?</PageWizardStepTitle>

                                        <div className="selection-set">
                                            <form class="plans">

                                                <div className="title">To help guide your solution creation, the first
                                                    step is to select the persona you are trying to support.
                                                    this will help the solution wizard to guide you to the best outcome
                                                    for your automation
                                                </div>

                                                {
                                                    this.solution_wizard.personas?.length ?
                                                    this.solution_wizard.personas.map((persona) => (

                                                        <label class="plan complete-plan" for={persona.id}>
                                                            <input type="radio" name={persona.id} id={persona.id} />
                                                            <div class="plan-content">
                                                                <img loading="lazy" src={"/images/"+persona.image} alt="" />
                                                                <div class="plan-details">
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
                                            <form className="plans">

                                                <div className="title">Now you have selected an outcome aligned with your persona. You now want to
                                                    select the platform you want to target. This will be the compute layer of your solution
                                                </div>

                                                {
                                                    this.solution_wizard.platforms?.length ?
                                                        this.solution_wizard.platforms.map((platform) => (

                                                            <label className="plan complete-plan" htmlFor={platform.id}>
                                                                <input type="radio" name={platform.id} id={platform.id} disabled={!platform.enabled} />
                                                                <div className={platform.enabled ? "plan-content" :"plan-content coming-soon"}>
                                                                    <img loading="lazy" src={"/images/" + platform.image}
                                                                         alt=""/>
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
                                                        <p>You have select the <b>Demo</b> persona</p>
                                                        <img loading="lazy" src={"/images/techsales_tammy.png"}
                                                             alt=""/>
                                                        <p>and the platform</p>
                                                        <img loading="lazy" src={"/images/azure.png"}
                                                             alt="" align={"top"}/>
                                                        <p>We recommend you use the <b>Quick Start</b> reference architecture</p>

                                                    </div>

                                                    {
                                                        this.solution_wizard.architectures?.length ?
                                                            this.solution_wizard.architectures.map((architecture) => (

                                                                <label className="plan complete-plan" htmlFor={architecture.id}>
                                                                    <input type="radio" name={architecture.id} id={architecture.id}/>
                                                                    <div className="plan-content">
                                                                        <img loading="lazy" src={"/images/" + architecture.image}
                                                                             alt=""/>

                                                                        <div className="plan-details">
                                                                            <span>{architecture.title}
                                                                                <Tooltip  tooltipBodyId="tooltip-body">
                                                                                    <p id="tooltip-body">
                                                                                        To learn more about the architectural pattern and the reference implementation click on Learn More below
                                                                                    </p>
                                                                                    <div>
                                                                                        <br></br>
                                                                                        <a target="_blank" href={architecture.docs}>
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
                                        <PageWizardStepTitle>Step 4: What type of  Storage ?</PageWizardStepTitle>

                                        <div className="selection-set">
                                            <form className="plans">

                                                <div className="title">Now you have selected your reference architecture you will require some file storage for your IBM Software
                                                </div>

                                                {
                                                    this.solution_wizard.storage_providers?.length ?
                                                        this.solution_wizard.storage_providers.map((storage) => (

                                                            <label className="plan complete-plan" htmlFor={storage.id}>
                                                                <input type="radio" name={storage.id} id={storage.id}/>
                                                                <div className="plan-content">
                                                                    <img loading="lazy" src={"/images/" + storage.image}
                                                                         alt=""/>

                                                                    <div className="plan-details">
                                                                            <span>{storage.title}
                                                                                <Tooltip  tooltipBodyId="tooltip-body">
                                                                                    <p id="tooltip-body">
                                                                                        To learn more about the your storage options click on Learn More below
                                                                                    </p>
                                                                                    <div>
                                                                                        <br></br>
                                                                                        <a target="_blank" href={storage.docs}>
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
                                        <PageWizardStepTitle>Step 5: Select the Software bundles</PageWizardStepTitle>


                                        <div className="title">We are getting close to create your custom solution for your client or partner, we need a few more details
                                        like the solution name and description. Dont worry you can edit you solution once its created to refine it so you client or partner is completely happy
                                        </div>

                                        <br></br>

                                        <Grid>
                                            <Row>

                                                <Column lg={{span: 10}} md={{span: 6}} sm={{span: 4}}>
                                                    <StatefulTileCatalog
                                                        title='Software Bundles'
                                                        id='software-bundles'
                                                        tiles={
                                                            this.solution_wizard.software.sort(function (a, b) { return a.service_id })
                                                                .map((service) => (
                                                                    {
                                                                        id: service.service_id,
                                                                        values: {
                                                                            title: service.service_id,
                                                                            displayName: service.displayName,
                                                                            status: service.status,
                                                                            type: service.type,
                                                                            description: service.description,
                                                                        },
                                                                        renderContent: tileRenderFunction,
                                                                    }
                                                                ))
                                                        }
                                                        pagination={{ pageSize: 10 }}
                                                        isSelectedByDefault={false}
                                                        onSelection={(val) => this.setState({ fields: {
                                                                ...this.state.fields,
                                                                service_id: val
                                                            }})} />
                                                </Column>
                                            </Row>
                                        </Grid>

                                    </PageWizardStep>
                                    <PageWizardStep id="name" key="name" label="Solution Details">
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
                                                disabled="true"
                                                hidden={this.props.isUpdate}
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
                                                value={this.state.fields.short_desc}
                                                labelText="Short Description"
                                                placeholder="e.g. FS Cloud single zone environment with OpenShift cluster and SRE tools."
                                                style={{ marginBottom: '1rem' }}
                                            />}
                                            {!this.props.isDuplicate && <TextArea
                                                required
                                                // cols={50}
                                                id="long_desc"
                                                name="long_desc"
                                                value={this.state.fields.long_desc}
                                                onChange={this.handleChange.bind(this, "long_desc")}
                                                invalidText="A valid value is required"
                                                labelText="Long Description"
                                                placeholder="Solution long description"
                                                rows={2}
                                                style={{ marginBottom: '1rem' }}
                                            />}
                                            {!this.props.isDuplicate && <Select id="public" name="public"
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

                                    <div className="arch">

                                        <p>You have chosen to create an IBM Technology solution called "My rob Thomas demo"</p>

                                        <p>You have select the <b>Demo</b> persona which is ideal for first experince</p>
                                        <img loading="lazy" src={"/images/techsales_tammy.png"}
                                             alt=""/>
                                        <p>and the platform</p>
                                        <img loading="lazy" src={"/images/azure.png"}
                                             alt="" align={"top"}/>

                                        <p>You have chosen the Quick Start reference archiecture which is very simple to setup</p>
                                        <img loading="lazy" src={"/images/quick-start.png"}
                                             alt="" align={"top"}/>
                                        <p>This will install Red Hat OpenShift ARO/IPI with the following Storage Option </p>
                                        <img loading="lazy" src={"/images/portworx.png"}
                                             alt="" align={"top"}/>
                                        <p>You have chosen the following IBM Software bundles to help get your solution started </p>
                                        <ul>
                                            <li>Maximo Application Suite</li>
                                            <li>Integration</li>
                                            <li>Data Fabric</li>
                                        </ul>
                                        <p>If you happy with this selection of content for your solution click on the Submit button below. You can always change the
                                            content later by adding an removing your own bill of materials</p>

                                    </div>





                                </PageWizardStep>


                                </StatefulPageWizard>

                            </ModalBody>
                            <ModalFooter secondaryButtonText= "Cancel"  onRequestSubmit={this.handleSubmit} />
                        </ComposedModal>

                    </div>
                </div>
            </div>
        );
    }
}

export default CreateSolutionModal;

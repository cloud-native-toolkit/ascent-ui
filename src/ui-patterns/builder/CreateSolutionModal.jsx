import React, { Component } from 'react';

import "brace/mode/yaml";

import {
    ComposedModal,
    ModalBody, ModalHeader, TextInput,
    ModalFooter, FormGroup,
    Column, Grid, Row, Tag, Form
} from 'carbon-components-react';

import {
    StatefulTileCatalog,
//    TileCatalog,
    PageWizardStep,
    StatefulPageWizard,
    PageWizardStepTitle
} from 'carbon-addons-iot-react';
import CatalogFilter from "../bom/CatalogFilter";
import AceEditor from "react-ace";
import {Add32 as Add} from "@carbon/icons-react/lib/__generated__/bucket-0";
import {catalogFilters} from "../data/data";
import {Card} from "react-bootstrap";


class CreateSolutionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            step: 1,
            create: false,
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                desc: '',
                yaml: ""
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
                title : "AWS",
                desc  : "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled : true
            },
            {
                title : "Azure",
                desc  : "Microsoft Azure infrastructure with Red Hat OpenShift ARO",
                docs: "",
                image: "azure.png",
                enabled : true,
                BOMS : ["",""]
            },
            {
                title : "IBM Cloud",
                desc  : "IBM Cloud infrastructure with Red Hat OpenShift ROKS ",
                docs  : "",
                image : "ibmcloud.png",
                enabled : true,
                BOMS : ["",""]

            },
            {
                title : "VMWare",
                desc  : "VMWare vSphere on premise infrastructure powered by Intel with Red Hat OpenShift",
                docs  : "",
                image : "vmware.webp",
                enabled : false,
                BOMS : ["",""]

            },
            {
                title : "Power",
                desc  : "IBM Power 10 AIX environments with Red Hat OpenShift",
                docs  : "",
                image : "power.webp",
                enabled : false,
                BOMS : ["",""]

            },
            {
                title : "Z Platform",
                desc  : "IBM z/Linux and z/OS environment with Red Hat OpenShift",
                docs  : "",
                image : "zlogo.png",
                enabled : false,
                BOMS : ["",""]

            }

        ],
        architectures : [

            {
                title : "Quick-Start",
                desc  : "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled : true
            },

            {
                title : "Standard",
                desc  : "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled : true
            },
            {
                title : "Advanced",
                desc  : "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled : true
            },


        ],
        software : [],
        storage : [
            {
                title : "Pothworx",
                desc  : "Amazon Web Services infrastructure with Red Hat OpenShift ROSA",
                docs: "",
                image: "aws.png",
                enabled : true
            },
            {
                title : "ODF",
                desc  : "Microsoft Azure infrastructure with Red Hat OpenShift ARO",
                docs: "",
                image: "azure.png",
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

                                                <div className="title">Now you have selected an outcome aligned with your persona you want to support
                                                    now lets select the platform you want to target. This will be the compute layer of of you solution
                                                </div>

                                                {
                                                    this.solution_wizard.platforms?.length ?
                                                        this.solution_wizard.platforms.map((platform) => (

                                                            <label className="plan complete-plan" htmlFor={platform.id}>
                                                                <input type="radio" name={platform.id} id={platform.id}/>
                                                                <div className="plan-content">
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
                                    </PageWizardStep>
                                    <PageWizardStep id="storage" key="storage" label="Storage">
                                        <PageWizardStepTitle>Step 4: Do you need Storage</PageWizardStepTitle>
                                        <h3>Radio Button</h3>
                                    </PageWizardStep>
                                    <PageWizardStep id="software" key="software" label="Software">
                                        <PageWizardStepTitle>Step 5: Select the Software bundles</PageWizardStepTitle>
                                        <h3>TileCatalog</h3>
                                    </PageWizardStep>
                                    <PageWizardStep id="summary" key="summary" label="Summary">
                                        <PageWizardStepTitle>Summary: Is this the solution you want ?</PageWizardStepTitle>
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

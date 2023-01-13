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

import openshiftImg from '../../../images/openshift.png';
import byoInfra from '../../../images/platforms/cloud-infra-center-byo-infra.svg';
import StacksImg from '../../../images/stacks.png';

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
                console.log(catalog)
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
                        return this.state.flavor === undefined
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
        if (this.state.curStepIx === STEP_SUMMARY) {
            this.handleSubmit();
        } else if (this.state.curStepIx === STEP_INFRASTRUCTURE && this.state.platform !== 'byo-infra' && this.state.infraStepIx !== STEP_INFRA_STORAGE) {
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
        const layers = new Set(this.state.catalog?.boms?.filter(bom => bom.category === 'infrastructure' && bom.cloudProvider === this.state.platform && bom.flavor === this.state.flavor));
        // Get storage layer(s)
        if (this.state.storage) layers.add(this.state.catalog?.boms?.find(bom => bom.name === this.state.storage));
        // Get software layers
        for (const sw of this.state.software) layers.add(this.state.catalog?.boms?.find(bom => bom.name === sw));
        // Create solution
        const body = {
            solution: this.state.fields,
            architectures: Array.from(layers).filter(layer => layer.type === 'bom').map(bom => ({ arch_id: bom.name })),
            solutions: Array.from(layers).filter(layer => layer.type === 'solution').map(sol => sol.name),
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

    render() {
        const persona = this.state.catalog?.metadata?.useCases?.find(p => p.name === this.state.persona);
        const platform = this.state.catalog?.metadata?.cloudProviders?.find(p => p.name === this.state.platform);
        const flavor = this.state.catalog?.metadata?.flavors?.find(p => p.name === this.state.flavor);
        const flavors = this.state.catalog?.metadata?.flavors.map(f => ({
            ...f,
            enabled: this.state.catalog?.boms?.find(bom => bom.category === 'infrastructure' && bom.cloudProvider === platform?.name && bom.flavor === f.name) !== undefined ? true : false
        }));
        const storageOptions = this.state.catalog?.boms?.filter(bom => bom.category === 'storage' && bom.cloudProvider === platform?.name);
        const softwareOptions = this.state.catalog?.boms?.filter(bom => bom.category === 'software' && (bom.cloudProvider === 'multi' || bom.cloudProvider === undefined));
        const storage = this.state.catalog?.boms?.find(bom => bom.name === this.state.storage);
        const software = this.state.software.map(swId => (this.state.catalog?.boms?.find(sw => sw.name === swId)));
        const defaultShortDesc = this.state.fields.short_desc === "" && this.state.curStepIx === STEP_DETAILS ? `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.name ?? sw.id}`)).join(', ')} on ${platform?.displayName}.` : '';
        const defaultLongDesc = this.state.fields.long_desc === "" && this.state.curStepIx === STEP_DETAILS ? `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.name ?? sw.id}`)).join(', ')} in ${flavor?.displayName} reference architecture deployed on ${platform?.displayName} with ${storage?.displayName} as storage option.` : '';
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
                                <Grid className='wizard-grid'>
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
                                <Grid className='wizard-grid'>
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
                                <Grid className='wizard-grid'>
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
                                                                flavors?.length ?
                                                                    flavors.map((flavor) => (
                                                                        <label className="plan complete-plan" htmlFor={flavor.name} key={flavor.name}>
                                                                            <input type="radio" name={flavor.name} id={flavor.name}
                                                                                disabled={!flavor.enabled}
                                                                                className={this.state.flavor === flavor.name ? 'checked' : ''}
                                                                                onClick={() => { if (flavor.enabled) this.setState({ flavor: flavor.name }) }} />
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

                                                            <div className="title">
                                                                Now you have selected your reference architecture you will require some file storage for your IBM Software
                                                            </div>

                                                            {
                                                                storageOptions?.length ?
                                                                    storageOptions.map((storage) => (

                                                                        <label className="plan complete-plan" htmlFor={storage.name} key={storage.name}>
                                                                            <input type="radio" name={storage.name} id={storage.name}
                                                                                className={this.state.storage === storage.name ? 'checked' : ''}
                                                                                onClick={() => { this.setState({ storage: storage.name }) }} />
                                                                            <div className={`plan-content`}>
                                                                                <img loading="lazy" src={storage.iconUrl} alt="" />

                                                                                <div className="plan-details">
                                                                                    <span>{storage.displayName ?? storage.name}</span>
                                                                                    <p>{storage.description}</p>
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
                            : this.state.curStepIx === STEP_SOFTWARE ?
                                <Grid className='wizard-grid'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>Step 3: Select your Software</h3>
                                            <div className="title">
                                                We are getting close to create your custom solution for your client or partner, we need a few more details like the solution name and description.
                                                Dont worry you can edit you solution once its created to refine it so you client or partner is completely happy.
                                            </div>
                                            <br />
                                            <StatefulTileCatalog
                                                title='Software Bundles'
                                                id='software-bundles'
                                                isMultiSelect
                                                tiles= {
                                                    softwareOptions.map((software) => ({
                                                        id: software.name,
                                                        values: {
                                                            title: software.name,
                                                            logo: software.iconUrl,
                                                            displayName: software.displayName ?? software.name,
                                                            description: software.description,
                                                        },
                                                        renderContent: tileRenderFunction,
                                                    }))
                                                }
                                                pagination={{ pageSize: 9 }}
                                                isSelectedByDefault={false}
                                                selectedTileIds={this.state.software}
                                                onSelection={(val) => {
                                                    const sw = Array.from(this.state.software);
                                                    const swIx = this.state.software.indexOf(val);
                                                    if (swIx >= 0) sw.splice(swIx, 1);
                                                    else sw.push(val);
                                                    this.setState({ software: sw });
                                                }} />
                                            <br />
                                        </Column>
                                    </Row>
                                </Grid>
                            : this.state.curStepIx === STEP_DETAILS ?
                                <Grid className='wizard-grid'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>Step 4: What do you want to call your solution?</h3>
                                            <div className="title">
                                                We need a few more details before we can create your solution. We need the solution name
                                                and description so we can identify it later
                                            </div>

                                            <Form name="solutionform">
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
                                        </Column>
                                    </Row>
                                </Grid>
                            : this.state.curStepIx === STEP_SUMMARY ?
                                <Grid className='wizard-grid'>
                                    <Row>
                                        <Column lg={{ span: 12 }}>
                                            <h3>Summary: Is this the solution you want?</h3>

                                            <div className="summary">

                                                <p>You have chosen to create an IBM Technology solution called <strong>{this.state.fields?.name}</strong></p>

                                                <div className='arch'>
                                                    <p>You want to <strong>{persona?.displayName}</strong> <img loading="lazy" src={persona?.iconUrl} alt={persona?.displayName ?? ""} /></p>
                                                    <p>You chose to deploy you solution on <strong>{platform?.displayName}</strong> <img loading="lazy" src={platform?.iconUrl} alt={platform?.displayName ?? ""} /></p>
                                                    <p>You have chosen the <strong>{flavor?.displayName}</strong> reference architecture <div className='flex-inline'><img loading="lazy" src={flavor?.iconUrl} alt={flavor?.displayName ?? ""} /><img loading="lazy" src={openshiftImg} alt="OpenShift" /></div></p>
                                                    <p>It will install with the following Storage Option <img loading="lazy" src={storage?.iconUrl} alt={storage?.displayName ?? ""} /></p>
                                                </div>

                                                <p>
                                                    You have chosen the following IBM Software to help get your solution started:
                                                    <ul>
                                                        {software?.map(sw => (
                                                            <li key={sw.name}>{sw.displayName ?? sw.name}</li>
                                                        ))}
                                                    </ul>
                                                </p>
                                                <p>
                                                    If you are happy with this selection of content for your solution click on the Submit button below. You can always change the
                                                    content later by adding an removing your own bill of materials.
                                                </p>
                                            </div>


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
                                disabled={this.nextDisabled()}>{this.state.curStepIx < STEP_SUMMARY ? 'Next' : 'Submit'}</Button>
                    </Column>
                </Row>
            </Grid>
        );
    }
}

export default CreateSolutionview;

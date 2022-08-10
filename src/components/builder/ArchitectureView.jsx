import React, { Component } from "react";

import {
    Link
} from "react-router-dom";

import {
    CheckmarkFilled16,
    AppConnectivity32
} from '@carbon/icons-react';

import {
    StatefulTileGallery
} from 'carbon-addons-iot-react';

import {
    OverflowMenu,
    OverflowMenuItem,
    SearchSkeleton,
    Button, ButtonSet,
    Grid, Row, Column,
    Form, FormGroup,
    TextInput, TextArea, Select, SelectItem, FileUploader,
    ModalFooter
} from 'carbon-components-react';

import YAML from 'yaml';


import { spacing07 } from '@carbon/layout';
import { green40 } from '@carbon/colors';

import ReactGA from 'react-ga4';

import ArchitectureModal from './ArchitectureModal';
import ImageWithStatus from '../ImageWithStatus';
import ValidateModal from '../ValidateModal';

import { uploadDiagrams, deleteArchitecture, importBomYaml, duplicateArchitecture, 
    addArchitecture, updateArchitecture } from '../../services/architectures';

import SlidingPane from 'react-sliding-pane'

import AceEditor from "react-ace";

import {
    servicePlatforms
} from '../../data/data';


class ArchitectureView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            archLoaded: false,
            architectures: [],
            galleryData: [],
            user: {
                email: "example@example.com",
                role: "editor"
            },
            showArchModal: false,
            updateModal: false,
            archRecord: false,
            isImport: false,
            isDuplicate: false,
            isUser: false,
            isInfra: false,
            isSoftware: false,
            showValidate: false,
            curArch: undefined,
            show: "public-archs",

            show: this.props.show,
            onRequestClose: this.props.handleClose,
            diagramDrawio: undefined,
            diagramPng: undefined,
            bomYaml: undefined,
            overwrite: "",
            fields: {
                arch_id: "",
                name: "",
                short_desc: "",
                long_desc: "",
                public: false,
                production_ready: false,
                yaml: "",
                platform: "",
            }
        };

        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/"id":/g, "\"_id\":"));
            console.log(jsonObject);
            this.state = {
                fields: jsonObject
            }
        }

        this.loadArchitectures = this.loadArchitectures.bind(this);
        this.loadGallery = this.loadGallery.bind(this);
        this.showArchModal = this.showArchModal.bind(this);
        this.hideArchModal = this.hideArchModal.bind(this);
        this.deleteArchitecture = this.deleteArchitecture.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.handleImageErrored = this.handleImageErrored.bind(this);
        this.syncIascable = this.syncIascable.bind(this);

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    uploadDiagrams(arch_id) {
        // Upload Diagrams
        const drawio = this.state.diagramDrawio;
        const png = this.state.diagramPng;
        if (drawio || png) {
            this.props.toast("info", "Uploading Diagram", `Uploading diagrams for architecture ${arch_id}.`);
            console.log(drawio);
            console.log(png);
            if (drawio && !drawio?.name.endsWith(".drawio")) return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (png && png?.type !== "image/png") return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (drawio && drawio?.size > 2048000) return this.props.toast("error", "Too Large", "Drawio file too larde, max size: 2MiB.");
            if (png && png?.size > 2048000) return this.props.toast("error", "Too Large", "PNG file too larde, max size: 2MiB.");
            let data = new FormData();
            if (drawio) data.append("drawio", drawio);
            if (png) data.append("png", png);
            uploadDiagrams(arch_id, data).then((res) => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Upload Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Diagrams upload successful!`);
                    this.props.handleReload();
                }
                this.props.handleClose(true);
            });
        } else {
            this.props.handleClose();
            this.props.handleReload();
        }
    }


    handleChange(field, e) {
        let fields = this.state.fields;
        let overwrite = "";
        if (field === "overwrite") {
            overwrite = e.target.value
        } else if (field === "yaml") {
            fields[field] = e;
        } else if (field === "public" || field === "production_ready") {
            fields[field] = e.target.value === "true";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields, overwrite });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.props.isImport) {
            // Upload Diagrams
            const boms = this.state.bomYaml;
            if (boms?.length > 0) {
                this.props.toast("info", "Uploading BOM", `Uploading BOMs yaml.`);
                let data = new FormData();
                let bomIx = 0;
                for (const bom of boms) {
                    console.log(bom)
                    if (bom?.type !== "application/x-yaml" && bom?.type !== "text/yaml" && !bom?.name.endsWith('.yaml')) return this.props.toast("error", "Wrong File Type", "Only .yaml is accepted.");
                    if (bom?.size > 409600) return this.props.toast("error", "Too Large", "YAML file too larde, max size: 400KiB.");
                    data.append(`bom${bomIx}`, bom);
                    bomIx = bomIx + 1;
                }
                importBomYaml(data, this.state.overwrite === "overwrite", this.state.fields?.public).then(res => {
                    if (res && res.body && res.body.error) {
                        this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                    } else {
                        this.props.toast("success", "Success", `BOM(s) successfully imported!`);
                        this.props.handleClose();
                        this.props.handleReload();
                    }
                });
            } else {
                this.props.toast("error", "File Missing", "You must upload the BOM yaml file.");
            }
        } else if (this.state.fields.name && this.props.isDuplicate) {
            this.props.toast("info", "Duplicating", `Duplicating architecture ${this.props.isDuplicate}...`);
            duplicateArchitecture(this.props.isDuplicate, {
                arch_id: this.state.fields.name.replace(/[\s_]+/g, '-').replace(/[^0-9a-zA-Z-]+/g, '').toLowerCase(),
                name: this.state.fields.name
            })
            .then((res) => {
                if (res?.body?.error) this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res?.body?.error?.message);
                else {
                    this.props.toast("success", "Success", `Bill of Materials ${this.props.isDuplicate} duplicated!`);
                    this.props.handleClose();
                    this.props.handleReload();
                }
            })
            .catch((err) => {
                this.addNotification("error", "Error", err);
            })
        } else if (this.state.fields.name && !this.props.isUpdate) {
            const fields = this.state.fields;
            fields.arch_id = this.state.fields.name.replace(/[\s_]+/g, '-').replace(/[^0-9a-zA-Z-]+/g, '').toLowerCase();
            addArchitecture(fields).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                } else {
                    // TODO: inspect element when you submit the form: "this.props.toast is not a function" --
                        // form isn't submitting and Add/Cancel buttons don't work, this is prob why
                    this.props.toast("success", "Success", `Bill of Materials ${res.arch_id} successfully added!`);
                    this.uploadDiagrams(res.arch_id);
                }
            });
        } else if(this.state.fields.name) {
            updateArchitecture(this.props.data.arch_id, {
                name: this.state.fields.name,
                short_desc: this.state.fields.short_desc,
                long_desc: this.state.fields.long_desc,
                public: this.state.fields.public,
                platform: this.state.fields.platform,
                yaml: this.state.fields.yaml,
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Bill of Materials ${res.arch_id} successfully updated!`);
                    this.uploadDiagrams(res.arch_id);
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set an architecture Name.");
        }

    }




    handleImageLoaded(archid) {
        const images = this.state.images;
        const imgIx = images?.findIndex(i => i.archid === archid);
        if (imgIx >= 0) images[imgIx].status = 'loaded';
        this.setState({ images: images });
    }

    handleImageErrored(archid) {
        const images = this.state.images;
        const imgIx = images?.findIndex(i => i.archid === archid);
        if (imgIx >= 0) images[imgIx].status = 'error';
        this.setState({ images: images });
    }

    async loadGallery() {
        const galleryData = [];
        galleryData.push({
            id: 'public-boms',
            sectionTitle: `${this.props.isUser ? 'Custom' : this.props.isInfra ? 'Infrastructure' : this.props.isSoftware ? 'Software' :  'Public' } Reference Architectures`,
            galleryItems: this.state.architectures?.map(arch => {
                return {
                    title: arch.name,
                    description: <Link to={`/boms/${arch.arch_id}`} ><div className="center-vertical">{arch.long_desc}</div> </Link>,
                    icon: <Link to={`/boms/${arch.arch_id}`} ><CheckmarkFilled16 fill={green40} /></Link>,
                    afterContent: this.overflowComponent(arch, false),
                    thumbnail: <ImageWithStatus imageUrl={`/api/architectures/${arch.arch_id}/diagram/png?small=true`} replacement={<AppConnectivity32 />} />
                }
            }),
        });
        this.setState({ galleryData: galleryData });
    }

    filterBom(bom) {
        // Filter bom type
        if (this.state.isInfra || this.state.isSoftware) {
            try {
                const bomYaml = YAML.parse(bom.yaml);
                if (this.state.isSoftware && bomYaml?.metadata?.labels?.type !== 'software') return false;
                if (this.state.isInfra && bomYaml?.metadata?.labels?.type === 'software') return false;
            } catch (error) {
                return false;
            }
        }
        // Filter based on provider
        const provider = bom.platform ?? bom.provider ?? '';
        const restrictedProviders = [];
        if (!this.state.user?.config?.ibmContent) {
            restrictedProviders.push('ibm');
            restrictedProviders.push('ibm-cp');
        }
        if (!this.state.user?.config?.azureContent) restrictedProviders.push('azure');
        if (!this.state.user?.config?.awsContent) restrictedProviders.push('aws');
        return !restrictedProviders.includes(provider);
    }

    async loadArchitectures() {
        this.setState({
            architectures: [],
            archLoaded: false
        });
        if (this.state.isUser) fetch(`/api/users/${encodeURIComponent(this.state?.user?.email)}/architectures`)
            .then(response => response.json())
            .then(userArchitectures => {
                if (!userArchitectures.error) this.setState({
                    architectures: userArchitectures.filter(this.filterBom.bind(this)),
                    archLoaded: true
                }, () =>  this.loadGallery());
            });
        else fetch("/api/architectures")
            .then(response => response.json())
            .then(architectures => {
                if (!architectures.error) this.setState({
                    architectures: architectures.filter(this.filterBom.bind(this)),
                    archLoaded: true
                }, () =>  this.loadGallery());
            });

    }

    async showArchModal(isImport) {
        this.setState({
            showArchModal: true,
            isImport: isImport
        });
    }

    async hideArchModal() {
        this.setState({
            showArchModal: false,
            updateModal: false,
            archRecord: false,
            isImport: false,
            isDuplicate: false
        });
    }

    async deleteArchitecture() {
        let arch_id = this.state.curArch.arch_id;
        deleteArchitecture(arch_id)
            .then((res) => {
                console.log(res);
                if (res?.body?.error) this.props.addNotification("error", res?.status === 401 ? "Unauthorized" : "Error", res?.body?.error?.message);
                else {
                    this.props.addNotification("success", "Success", `Bill of Materials ${arch_id} deleted!`);
                    this.setState({
                        showValidate: false,
                        curArch: undefined
                    });
                    this.loadArchitectures();
                }
            })
            .catch((err) => {
                this.props.addNotification("error", "Error", err);
                this.setState({
                    showValidate: false,
                    curArch: undefined
                });
            })
    }

    // Load the Data into the Project
    componentDidMount() {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
        this.setState({
            user: this.props.user,
            isUser: this.props.isUser,
            isInfra: this.props.isInfra,
            isSoftware: this.props.isSoftware,
        });
        this.loadArchitectures();
    };

    // Load the Data into the Project
    componentDidUpdate() {
        if (this.props.user?.config !== this.state.user?.config) {
            this.setState({ user: this.props.user });
            this.loadArchitectures();
        }
        if (this.props.isUser !== this.state.isUser || this.props.isInfra !== this.state.isInfra || this.props.isSoftware !== this.state.isSoftware) {
           this.setState({
                isUser: this.props.isUser,
                isInfra: this.props.isInfra,
                isSoftware: this.props.isSoftware
            }, () => {
                this.loadArchitectures();
            });
        }
    };

    syncIascable() {
        this.props.addNotification('info', 'Synchronizing', 'Synchronizing with latest release of @cloud-native-toolkit/iascable');
        fetch('/api/architectures/public/sync', { method: "POST" })
            .then(res => res.json())
            .then(res => {
                const upToDate = res?.error?.message?.includes('up to date');
                if (res.error) this.props.addNotification(upToDate ? 'success' : 'error', upToDate ? 'Up to date' : 'Error', res?.error?.message);
                else if (res.release && res?.refArchs?.length > 0) {
                    this.props.addNotification('success', 'Success', `${res?.refArchs?.length} ref. architectures have been synchronized from iascable: v${res.release.tagName}`);
                    this.loadArchitectures();
                }
            })
            .catch(err => {
                console.log(err);
                this.props.addNotification('error', 'Error', '' + err);
            });
    }

    overflowComponent = (arch, userArch) => (
        this.state.user?.roles.includes("editor") && <OverflowMenu style={{ height: spacing07 }}>
            <OverflowMenuItem itemText="Duplicate" onClick={() => this.setState({
                showArchModal: true,
                isDuplicate: arch.arch_id
            })} />
            {(this.state.user?.role === "admin" || userArch || arch?.owners?.find(user => user.email === this.state.user?.email)) && <OverflowMenuItem itemText="Delete" onClick={() => this.setState({
                showValidate: true,
                curArch: arch
            })} isDelete />}
        </OverflowMenu>
    );


    render() {

        return (

            <Grid className="bills-of-materials">

                {/* {this.state.showArchModal &&
                    <ArchitectureModal
                        show={this.state.showArchModal}
                        handleClose={this.hideArchModal}
                        isUpdate={this.state.updateModal}
                        data={this.state.archRecord}
                        toast={this.props.addNotification}
                        isImport={this.state.isImport}
                        isDuplicate={this.state.isDuplicate}
                        handleReload={this.loadArchitectures}
                    />
                } */}

                

                   

                {this.state.showValidate && this.state.curArch &&
                    <ValidateModal
                        danger
                        submitText="Delete"
                        heading="Delete Archictecture"
                        message={`You are about to remove architecture ${this.state.curArch.name}. This action cannot be undone. This will remove the architecture record, as well as architecture Bill of Material and diagrams. If you are sure, type "${this.state.curArch.arch_id}" and click Delete to confirm deletion.`}
                        show={this.state.showValidate}
                        inputRequired={this.state.curArch.arch_id}
                        onClose={() => {
                            this.setState({
                                showValidate: false,
                                curArch: undefined
                            });
                        }}
                        onRequestSubmit={this.deleteArchitecture}
                        onSecondarySubmit={() => {
                            this.setState({
                                showValidate: false,
                                curArch: undefined
                            });
                        }} />
                }
                <Row className="arch-page__row">
                    <Column className="arch-page__col">


                <h2 style={{"display": "flex"}}>
                    {`${this.props.isUser ? 'Custom Reference Architectures' : this.props.isInfra ? 'Infrastructures' : this.props.isSoftware ? 'Software' :  'Public Reference Architectures' }`}
                    <div style={{marginLeft: "auto", "display": "flex"}}>
                        {(this.state.user?.roles?.includes("editor") && this.props.isUser) || this.state.user?.roles?.includes("admin") ? 
                            <Button onClick={() => this.setState({ showForm: true })} size='small'>Create +</Button> : <></>}
                        {(this.state.user?.roles?.includes("editor") && this.props.isUser) || this.state.user?.roles?.includes("admin") ? 
                            // TODO: fix isImport being set, as of now it isn't being set so the Create and Import forms are unintentionally the same
                            <Button onClick={() => this.setState({ showForm: true , isImport: true})} style={{marginLeft: '1.5rem', marginRight: '1.5rem'}} size='small'>Import +</Button> : <></>}
                    </div>
                </h2>

                <br />

                {
                    this.state.archLoaded ?
                        <StatefulTileGallery
                            title="BOMs tile catalog"
                            hasSearch
                            hasSwitcher
                            galleryData={this.state.galleryData}
                        />
                    :
                        <SearchSkeleton />
                }

                {!this.state.archLoaded && <SearchSkeleton />}
                </Column>
                </Row>

                {/* <div className="sliding-pane"> */}
                <SlidingPane
                    // closeIcon={<Close32 />}
                    title="Add Bill of Materials"
                    isOpen={this.state.showForm}
                    width="600px"
                    onRequestClose={() => this.setState({ showForm: false })}
                    onRequestSubmit={this.handleSubmit}
                    open={this.props.show}
                    onClose={this.props.handleClose}
                    data={this.state.archRecord}
                    handleReload={this.loadArchitectures}
                >
                        <Form name="architectureform" 
                        // onSubmit={this.handleSubmit.bind(this)}
                        style={{position: 'relative'}}
                        >
                            {!this.props.isImport && <TextInput
                                data-modal-primary-focus
                                id="name"
                                name="name"
                                required
                                invalidText="Please Enter The Value"
                                onChange={this.handleChange.bind(this, "name")}
                                value={this.state.fields.name}
                                labelText="Bill of Materials Name"
                                placeholder="e.g. Common Services"
                                style={{ marginBottom: '1rem' }}
                            />}
                            {!this.props.isImport && !this.props.isDuplicate && <TextInput
                                data-modal-primary-focus
                                id="short_desc"
                                name="short_desc"
                                required
                                invalidText="Please Enter The Value"
                                onChange={this.handleChange.bind(this, "short_desc")}
                                value={this.state.fields.short_desc}
                                labelText="Short Description"
                                placeholder="e.g. Common Services"
                                style={{ marginBottom: '1rem' }}
                            />}
                            {!this.props.isImport && !this.props.isDuplicate && <TextArea
                                required
                                // cols={50}
                                id="long_desc"
                                name="long_desc"
                                value={this.state.fields.long_desc}
                                onChange={this.handleChange.bind(this, "long_desc")}
                                invalidText="A valid value is required"
                                labelText="Long Description"
                                placeholder="Long description"
                                rows={2}
                                style={{ marginBottom: '1rem' }}
                            />}
                            {this.props.isImport && <FileUploader 
                                accept={['.yaml']}
                                // labelText={"Drag and drop a .yaml file, or click to upload"}
                                labelTitle={"BOM Yaml"}
                                buttonLabel='Add file(s)'
                                multiple
                                labelDescription={"Max file size is 400KiB. Only .yaml files are supported."}
                                filenameStatus='edit'
                                onChange={(event) => this.setState({bomYaml: event?.target?.files})}
                                onDelete={() => this.setState({bomYaml: undefined})} />}
                            {this.props.isImport && <><strong>Overwrite</strong><TextInput
                                data-modal-primary-focus
                                id="overwrite"
                                name="overwrite"
                                required
                                invalidText="Please Enter The Value"
                                onChange={this.handleChange.bind(this, "overwrite")}
                                value={this.state.overwrite}
                                labelText='Type "overwrite" to overwrite the existing BOM components if architecture already exists.'
                                placeholder="overwrite"
                                style={{ marginBottom: '1rem' }}
                            /></>}
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
                            {!this.props.isDuplicate && !this.props.isImport && <FileUploader 
                                accept={['.drawio']}
                                // labelText={"Drag and drop a .drawio file, or click to upload"}
                                labelTitle={"Diagram .drawio"}
                                buttonLabel='Add file'
                                labelDescription={"Max file size is 2MiB. Only .drawio files are supported."}
                                filenameStatus='edit'
                                onChange={(event) => this.setState({diagramDrawio: event?.target?.files[0]})}
                                onDelete={() => this.setState({diagramDrawio: undefined})} />}
                            {!this.props.isDuplicate && !this.props.isImport && <FileUploader 
                                accept={['.png']}
                                // labelText={"Drag and drop a .png file, or click to upload"}
                                labelTitle={"Diagram .png"}
                                buttonLabel='Add file'
                                labelDescription={"Max file size is 2MiB. Only .png files are supported."}
                                filenameStatus='edit'
                                onChange={(event) => this.setState({diagramPng: event?.target?.files[0]})}
                                onDelete={() => this.setState({diagramPng: undefined})} />}
                            {!this.props.isImport && !this.props.isDuplicate && <Select id="platform" name="platform"
                                labelText="Platform"
                                required
                                defaultValue={this.state.fields.platform}
                                invalidText="A valid value is required"
                                onChange={this.handleChange.bind(this, "platform")}
                                style={{ marginBottom: '1rem' }}>
                                {servicePlatforms.map(platform => (
                                    <SelectItem value={platform.val} text={platform.label} />
                                ))}
                            </Select>}
                            {!this.props.isImport && !this.props.isDuplicate && <Select id="production_ready" name="production_ready"
                                labelText="Production Ready"
                                required
                                defaultValue={!this.state.fields.production_ready ? false : this.state.fields.production_ready}
                                invalidText="A valid value is required"
                                onChange={this.handleChange.bind(this, "production_ready")}
                                style={{ marginBottom: '1rem' }}>
                                <SelectItem value={false} text="False" />
                                <SelectItem value={true} text="True" />
                            </Select>}
                            {!this.props.isImport && !this.props.isDuplicate && <FormGroup legendText="YAML Configuration" >
                                <AceEditor
                                    focus
                                    style={{ width: "100%" }}
                                    mode="yaml"
                                    // theme="github"
                                    height="200px"
                                    id="yaml"
                                    name="yaml"
                                    placeholder="alias: example"
                                    value={this.state.fields.yaml}
                                    onChange={this.handleChange.bind(this, "yaml")}
                                    // TODO: Noe can you help, inspect element warning shows that editorInput isn't valid
                                    ref="editorInput"
                                    // fontSize={20}
                                    showPrintMargin
                                    showGutter={true}
                                    highlightActiveLine
                                    setOptions={{
                                        enableBasicAutocompletion: false,
                                        enableLiveAutocompletion: false,
                                        enableSnippets: false,
                                        showLineNumbers: true,
                                        tabSize: 2
                                    }}
                                    editorProps={{ $blockScrolling: true }}
                                />
                            </FormGroup>}
                            {/* <ButtonSet>
                                <Button
                                size='xl'
                                kind='secondary'
                                style={{ marginBottom: '3rem' }}
                                onClick={() => { this.props.handleClose() }}>
                                Cancel
                                </Button>
                                <Button
                                size='xl'
                                kind="primary"
                                type="submit"
                                style={{ marginBottom: '3rem' }}
                                onClick={() => { this.props.handleSubmit() }}
                                >
                                    Create
                                </Button>
                            </ButtonSet> */}
                            
                        </Form>
                        <ModalFooter 
                            primaryButtonText={this.props.isUpdate ? "Update" : this.props.isDuplicate ? "Duplicate" : "Add"} 
                            onRequestSubmit={this.handleSubmit} 
                            secondaryButtonText="Cancel" 
                            style={{ marginBottom: '3rem' }}
                        />
                    
                </SlidingPane>
                {/* </div> */}


            </Grid>

        );
    }
}

export default ArchitectureView;

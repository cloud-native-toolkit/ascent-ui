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
    Button,
    Grid, Row, Column
} from 'carbon-components-react';

import YAML from 'yaml';

import { spacing07 } from '@carbon/layout';
import { green40 } from '@carbon/colors';

import ArchitectureModal from './ArchitectureModal';
import ImageWithStatus from '../ImageWithStatus';
import ValidateModal from '../ValidateModal';

import { deleteArchitecture } from '../../services/architectures';


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
            show: "public-archs"
        };
        this.loadArchitectures = this.loadArchitectures.bind(this);
        this.loadGallery = this.loadGallery.bind(this);
        this.showArchModal = this.showArchModal.bind(this);
        this.hideArchModal = this.hideArchModal.bind(this);
        this.deleteArchitecture = this.deleteArchitecture.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.handleImageErrored = this.handleImageErrored.bind(this);
        this.syncIascable = this.syncIascable.bind(this);
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

                {this.state.showArchModal &&
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
                }

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
                <Row>
                    <Column lg={{span: 12}}>


                <h2 style={{"display": "flex"}}>
                    {`${this.props.isUser ? 'Custom Reference Architectures' : this.props.isInfra ? 'Infrastructures' : this.props.isSoftware ? 'Software' :  'Public Reference Architectures' }`}
                    <div style={{marginLeft: "auto", "display": "flex"}}>
                        {(this.state.user?.roles?.includes("editor") && this.props.isUser) || this.state.user?.roles?.includes("admin") ? 
                            <Button onClick={() => this.showArchModal(false)} size='small'>Create +</Button> : <></>}
                        {this.state.user?.role === "admin" ? <Button onClick={() => this.showArchModal(true)} style={{marginLeft: '1.5rem', marginRight: '1.5rem'}} size='small'>Import +</Button> : <></>}
                    </div>
                </h2>

                <br />

                {
                    this.state.archLoaded ?
                        <StatefulTileGallery
                            title='BOMs tile catalog'
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

            </Grid>

        );
    }
}

export default ArchitectureView;

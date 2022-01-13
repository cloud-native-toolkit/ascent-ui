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
    ToastNotification,
    SearchSkeleton,
    Button,
} from 'carbon-components-react';

import { spacing07 } from '@carbon/layout';
import { green40 } from '@carbon/colors';

import ImageWithStatus from './ImageWithStatus';

import ArchitectureModal from './ArchitectureModal';

import ValidateModal from '../ValidateModal';

class ArchitectureView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            archLoaded: false,
            architectures: [],
            userArchitectures: [],
            user: {
                email: "example@example.com",
                role: "editor"
            },
            showArchModal: false,
            updateModal: false,
            archRecord: false,
            notifications: [],
            isImport: false,
            isDuplicate: false,
            showValidate: false,
            curArch: undefined,
            show: "public-archs"
        };
        this.showArchModal = this.showArchModal.bind(this);
        this.hideArchModal = this.hideArchModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
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

    async loadArchitectures() {

        this.setState({
            architectures: [],
            archLoaded: false
        });
        let iascableRelease;
        try {
            iascableRelease = await (await fetch('/api/architectures/public/version')).json();
            if (iascableRelease.error) iascableRelease = undefined;
        } catch (error) {
            console.log(error);
        }

        fetch("/api/architectures")
            .then(response => response.json())
            .then(architectures => {
                fetch(`/api/users/${encodeURIComponent(this.state?.user?.email)}/architectures`)
                    .then(response => response.json())
                    .then(userArchitectures => {
                        this.setState({
                            userArchitectures: userArchitectures,
                            architectures: architectures,
                            archLoaded: true,
                            iascableRelease: iascableRelease
                        });
                    });
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
        this.loadArchitectures();
    }

    async deleteArchitecture() {
        let arch_id = this.state.curArch.arch_id;
        this.props.archService.deleteArchitecture(arch_id)
            .then((res) => {
                if (res?.body?.error) this.addNotification("error", res?.status === 401 ? "Unauthorized" : "Error", res?.body?.error?.message);
                else {
                    this.addNotification("success", "Success", `Bill of Materials ${arch_id} deleted!`);
                    this.setState({
                        showValidate: false,
                        curArch: undefined
                    });
                    this.loadArchitectures();
                }
            })
            .catch((err) => {
                this.addNotification("error", "Error", err);
                this.setState({
                    showValidate: false,
                    curArch: undefined
                });
            })
    }

    // Load the Data into the Project
    componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                if (user.name) {
                    this.setState({ user: user || undefined });
                    this.loadArchitectures();
                } else {
                    // Redirect to login page
                    window.location.href = "/login";
                }
            })
            .catch(err => {
                this.loadArchitectures();
            });
    };

    syncIascable() {
        this.addNotification('info', 'Synchronizing', 'Synchronizing with latest release of @cloud-native-toolkit/iascable');
        fetch('/api/architectures/public/sync', { method: "POST" })
            .then(res => res.json())
            .then(res => {
                const upToDate = res?.error?.message?.includes('up to date');
                if (res.error) this.addNotification(upToDate ? 'success' : 'error', upToDate ? 'Up to date' : 'Error', res?.error?.message);
                else if (res.release && res?.refArchs?.length > 0) {
                    this.addNotification('success', 'Success', `${res?.refArchs?.length} ref. architectures have been synchronized from iascable: v${res.release.tagName}`);
                    this.loadArchitectures();
                }
            })
            .catch(err => {
                console.log(err);
                this.addNotification('error', 'Error', '' + err);
            });
    }

    /** Notifications */

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

    /** Notifications END */

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

        const galleryData = [];

        if (this.state.userArchitectures?.length > 0) galleryData.push({
            id: 'user-boms',
            sectionTitle: 'Your Bills Of Materials',
            isOpen: this.state.userArchitectures?.length>0,
            galleryItems: this.state.userArchitectures.map(arch => {
                return {
                    title: arch.name,
                    description: <Link to={`/bom/${arch.arch_id}`} ><div className="center-vertical">{arch.long_desc}</div> </Link>,
                    icon: <Link to={`/bom/${arch.arch_id}`} ><CheckmarkFilled16 fill={green40} /></Link>,
                    afterContent: this.overflowComponent(arch, true),
                    thumbnail: <ImageWithStatus imageUrl={`/api/architectures/${arch.arch_id}/diagram/png?small=true`} replacement={<AppConnectivity32 />} />
                }
            }),
        });

        galleryData.push({
            id: 'public-boms',
            sectionTitle: 'Public Bills Of Materials',
            galleryItems: this.state.architectures.map(arch => {
                return {
                    title: arch.name,
                    description: <Link to={`/bom/${arch.arch_id}`} ><div className="center-vertical">{arch.long_desc}</div> </Link>,
                    icon: <Link to={`/bom/${arch.arch_id}`} ><CheckmarkFilled16 fill={green40} /></Link>,
                    afterContent: this.overflowComponent(arch, false),
                    thumbnail: <ImageWithStatus imageUrl={`/api/architectures/${arch.arch_id}/diagram/png?small=true`} replacement={<AppConnectivity32 />} />
                }
            }),
        });

        return (

            <div className="bx--grid bills-of-materials" >

                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>

                {this.state.showArchModal &&
                    <ArchitectureModal
                        show={this.state.showArchModal}
                        handleClose={this.hideArchModal}
                        isUpdate={this.state.updateModal}
                        data={this.state.archRecord}
                        toast={this.addNotification}
                        architectureService={this.props.archService}
                        isImport={this.state.isImport}
                        isDuplicate={this.state.isDuplicate}
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

                <br />

                <h2 style={{"display": "flex"}}>
                    Bills of Materials
                    <div style={{"margin-left": "auto", "display": "flex"}}>
                        <Button onClick={() => this.showArchModal(false)} size='small'>Create +</Button>
                        <Button onClick={() => this.showArchModal(true)} style={{marginLeft: '1.5rem', marginRight: '1.5rem'}} size='small'>Import +</Button>
                    </div>
                </h2>

                <br />

                {
                    this.state.archLoaded ?
                        <StatefulTileGallery
                            hasSearch
                            hasSwitcher
                            galleryData={galleryData}
                        />
                    :
                        <SearchSkeleton />
                }

                {!this.state.archLoaded && <SearchSkeleton />}

            </div>

        );
    }
}

export default ArchitectureView;

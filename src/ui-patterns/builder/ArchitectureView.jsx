import React, { Component } from "react";
import FormLabel from 'carbon-components-react/lib/components/FormLabel';
import Tooltip from 'carbon-components-react/lib/components/Tooltip';
import ArticleCard from './ArticleCard';

import {
    Link
} from "react-router-dom";

import {
    LogoGithub16 as LogoGitHub,
} from '@carbon/icons-react';

import {
    OverflowMenu,
    OverflowMenuItem,
    ToastNotification,
    SearchSkeleton,
    ContentSwitcher,
    Switch,
    Tag
} from 'carbon-components-react';

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
        this.syncIascable = this.syncIascable.bind(this);
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
                    console.log(userArchitectures)
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
                    this.addNotification("success", "Success", `Architecture ${arch_id} deleted!`);
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
                    this.setState({ user: user || undefined });
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
                console.log(res);
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

    getArchitectures(architectures, userArch) {

        var archTiles = []

        if (!architectures.length) archTiles.push(
            <div className="bx--col-lg-16">
                {userArch ? 
                    <p>You have no architectures at the moment. To create one, duplicate an existing public architecture or click <strong>Add</strong> or <strong>Import BOM</strong> in the top right menu.</p>
                :
                    <p>No architecture available yet.</p>
                }
            </div>
        );
        
        for (var i = 0; i < architectures.length; i++) {
            const arch = architectures[i];

            var link = "/bom/"+arch.arch_id;

            archTiles.push(
                <div className="bx--col-md-4 bx--col-lg-4" key={arch.arch_id}>
                    <ArticleCard
                        title={arch.name}
                        author={arch.short_desc}
                        desc={arch.long_desc}
                        date=""
                        readTime=""
                        link={link}
                        color="dark">

                        <Link to={link}>
                            <img
                                className="resource-img"
                                src={`/api/architectures/${arch.arch_id}/diagram/png?small=true`}
                                alt={arch.short_desc}
                                className="article-img"
                            />
                        </Link>

                        <div className="labels" style={{"display": "flex"}}>
                            <FormLabel style={{"padding-top": "0.5rem"}}>
                                <Tooltip direction="right" triggerText="Terraform">This architecture supports Terraform.</Tooltip>
                            </FormLabel>
                            {this.state.user?.roles.includes("editor") ? <FormLabel style={{"margin-left": "auto", "margin-bottom": "0px"}}>
                                <OverflowMenu light flipped>
                                    <OverflowMenuItem itemText="Duplicate" onClick={() => this.setState({
                                        showArchModal: true,
                                        isDuplicate: arch.arch_id
                                    })}/>
                                    {(this.state.user?.role === "admin" || userArch || arch?.owners?.find(user => user.email === this.state.user?.email)) && <OverflowMenuItem itemText="Delete" onClick={() => this.setState({
                                        showValidate: true,
                                        curArch: arch
                                    })} isDelete/>}
                                </OverflowMenu>
                            </FormLabel> : <></>}
                        </div>
                    

                    </ArticleCard>

                </div>
            );
        }

        return archTiles;

    }

    /** Notifications */

    addNotification(type, message, detail) {
        this.setState(prevState => ({
          notifications: [
            ...prevState.notifications,
            {
              message: message || "Notification",
              detail: detail || "Notification text",
              severity: type || "info"
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


    render() {

        return (

            <div className="bx--grid"  >

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

                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 style={{"display": "flex"}}>
                            Architectures
                            <div style={{"margin-left": "auto", "display": "flex"}}>
                                {
                                    this.state.user?.role === "admin" && 
                                    <Tag
                                        key='tag1'
                                        renderIcon={LogoGitHub}
                                        type="high-contrast"
                                        title="Sync"
                                        onClick={this.syncIascable}
                                    >
                                        iascable: {this.state.iascableRelease ? this.state.iascableRelease.tagName : "unknown"}
                                    </Tag>
                                }

                                {this.state.user?.roles?.includes("editor") && <OverflowMenu
                                    size='lg'
                                    flipped>
                                    <OverflowMenuItem
                                        itemText="Add"
                                        onClick={() => this.showArchModal(false)}/>
                                    <OverflowMenuItem
                                        kind="primary"
                                        itemText="Import BOM"
                                        onClick={() => this.showArchModal(true)}/>
                                </OverflowMenu>}
                            </div>
                        </h2>
                        <br></br>
                        <p>
                            Navigate to the reference architecture you are interested in and see the IBM Cloud bill of materials
                        </p>

                        {this.state.user?.roles?.includes("editor") && <ContentSwitcher
                            size='xl'
                            onChange={(e) => {this.setState({show:e.name})}} >
                                <Switch name="public-archs" text="Public Architectures" />
                                <Switch name="user-archs" text="Your Architectures" />
                        </ContentSwitcher>}
                        <br></br>

                    </div>
                </div>

                

                    {
                        this.state.archLoaded && this.state.show === "public-archs" ?
                            <div className="bx--row">
                                {this.getArchitectures(this.state.architectures, false)}
                            </div>
                            
                        : this.state.archLoaded && this.state.show === "user-archs" ?
                            <div className="bx--row">
                                {this.getArchitectures(this.state.userArchitectures, true)}
                            </div>
                        :
                            <div className="bx--row">
                                <SearchSkeleton />
                            </div>
                    }


            </div>

        );
    }
}

export default ArchitectureView;

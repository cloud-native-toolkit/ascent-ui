import React, { Component } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbSkeleton,
    SearchSkeleton,
    InlineNotification,
    Button
} from 'carbon-components-react';
import {
    Link
} from "react-router-dom";
import {
    Edit16,
    Download16
} from '@carbon/icons-react';

import ReactMarkdown from 'react-markdown';

import SolutionModal from "./SolutionModal";

import marked from 'marked';

import {
    ToastNotification, ContentSwitcher, Switch
} from "carbon-components-react";

class SolutionDetailsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            show: false,
            showContent: "solution-details",
            notif: false,
            notifications: []
        };
        this.loadSolution = this.loadSolution.bind(this);
        this.downloadTerraform = this.downloadTerraform.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }

    async loadSolution() {
        this.setState({ data: undefined });
        fetch(`/api/solutions/${this.props.solId}?filter=${encodeURIComponent(JSON.stringify({ include: ['architectures'] }))}`)
            .then((res) => res.json())
            .then(async (sol) => {
                // Fetch README content if it exists
                let readme = sol.files?.find(elt => elt.Key?.toLowerCase() === "readme.md");
                if (readme) {
                    readme = await (await fetch(`/api/solutions/${this.props.solId}/files/${readme.Key}`)).text();
                }
                this.setState({ data: sol, readme: readme });
            })
            .catch(() => this.addNotification("error", "Error", `Error loading details for solution ${this.props.solId}`))
    }

    async componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                if (user.name) {
                    this.setState({ user: user || undefined });
                    this.loadSolution();
                } else {
                    // Redirect to login page
                    window.location.href = "/login";
                }
            })
            .catch(err => {
                this.loadSolution();
            });
    }

    getMarkdownText() {
        var rawMarkup = marked(this.state.readme, {sanitize: true});
        return { __html: rawMarkup };
    }

    downloadTerraform() {
        this.addNotification("info", "BUILDING", "Building your terraform module...");
        fetch(`/api/solutions/${this.state.data?.id}/automation`)
            .then(response => {
                if (response && response.status === 200) {
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = `${this.state.data?.id}.zip`;
                        a.click();
                    });
                }
                else {
                    this.addNotification("error", response.status + " " + response.statusText, "Error building your terraform module.");
                }
            });
    }

    async showModal(updateModal) {
        this.setState({
            showModal: true,
            updateModal: updateModal || false
        });
    }

    async hideModal() {
        this.setState({
            showModal: false,
            isDuplicate: false,
            updateModal: false
        });
        this.loadSolution();
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

    render() {
        const data = this.state.data;
        const diagram = data?.files?.find(elt => elt.Key?.toLowerCase() === "diagram.png");
        let notif = this.state.notif;
        return (
            <>
                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>
                <div className="bx--grid">
                    {notif &&
                        <InlineNotification
                            id={Date.now()}
                            hideCloseButton lowContrast
                            title={notif.title || "Notification title"}
                            subtitle={<span kind='error' hideCloseButton lowContrast>{notif.message || "Subtitle"}</span>}
                            kind={notif.kind || "info"}
                            caption={notif.caption || "Caption"}
                        />
                    }

                    {this.state.data?.id ?
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to="/solutions">Solutions</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem href="#">{data.name || data.id}</BreadcrumbItem>
                        </Breadcrumb>
                    :
                        <BreadcrumbSkeleton />
                    
                    }
                    <div className="bx--row">
                        <div className="bx--col-lg-12">
                            <br></br>
                            {data?.name ? <h2 style={{ display: 'flex' }}>
                                {data?.name}
                                <div style={{marginLeft: 'auto'}}>

                                    <Button
                                        renderIcon={Download16}
                                        onClick={() => this.downloadTerraform()} >
                                        Terraform
                                    </Button>
                                    {data?.id && this.state.user?.role === "admin" && 
                                        <Button
                                            style={{marginLeft: '1rem'}}    
                                            renderIcon={Edit16}
                                            onClick={() => {
                                                this.showModal(true);
                                            }}>
                                            Edit
                                        </Button>}
                                </div>
                            </h2> : <SearchSkeleton />}
                            <br></br>
                        </div>
                    </div>

                    {data?.id &&
                        <ContentSwitcher
                            size='xl'
                            onChange={(e) => { this.setState({ showContent: e.name }) }} >
                            <Switch name="solution-details" text="Description" />
                            {this.state.readme ? <Switch name="solution-readme" text="Documentation" />: <></>}
                            {diagram ? <Switch name="solution-diagram" text="Diagram" />: <></>}
                        </ContentSwitcher>
                    }

                    {this.state.showContent === "solution-details" &&
                        <>
                            {data && <div>
                                    <br />
                                    {data?.long_desc && <div>
                                        <h3>Description</h3>
                                        <p>
                                            {
                                                data.long_desc
                                            }
                                        </p>
                                    </div>}
                                    <br />
                                    {data?.architectures?.length &&
                                        <div>
                                            <h3>Architectures</h3>
                                            <p>
                                                <ul style={{listStyle:'inside'}}>
                                                    {
                                                        data?.architectures?.map((arch) => (
                                                            <li>
                                                                <Link to={`/bom/${arch.arch_id}`}>
                                                                    {arch.name}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                                
                                            </p>
                                        </div>
                                    }
                                    {data?.files?.length &&
                                        <div>
                                            <h3>Files</h3>
                                            <p>
                                                To update files, dowload them and edit them in your favorite text editor, then upload them again using the <strong>Edit</strong> Button in the top right corner.
                                                <ul style={{listStyle:'inside'}}>
                                                    {
                                                        data?.files?.map((file) => (
                                                            <li>
                                                                <a href={`/api/solutions/${data.id}/files/${file.Key}`} >
                                                                    {file.Key} ({`${(file.Size/1024).toFixed(2)} Kio`}) <Download16/>
                                                                </a>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </p>
                                        </div>
                                    }
                                </div>}
                        </>
                    }
                    {data?.id && this.state.readme && this.state.showContent === "solution-readme" &&
                        <div className="markdown" dangerouslySetInnerHTML={this.getMarkdownText()} />
                    }
                    {data?.id && diagram && this.state.showContent === "solution-diagram" &&
                        <img style={{ maxWidth: '100%' }}
                            src={`/api/solutions/${this.props.solId}/files/${diagram.Key}`}
                            alt={`Diagram of solution ${this.props.solId}`} />
                    }

                    {this.state.showModal && 
                        <SolutionModal
                            show={this.state.showModal}
                            handleClose={this.hideModal}
                            isUpdate={this.state.updateModal}
                            data={this.state.data}
                            toast={this.addNotification}
                            isDuplicate={this.state.isDuplicate}
                            user={this.state.user}
                        />
                    }
                </div >
            </>
        );
    }
}
export default SolutionDetailsView;
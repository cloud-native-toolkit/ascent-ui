


import React, { Component } from "react";

import {
    Link
} from "react-router-dom";

import {
    Button,
    ToastNotification,
    SearchSkeleton
} from 'carbon-components-react';
import {
    Add16,
    Edit16
} from '@carbon/icons-react';

import {
    Card, CardGroup
} from 'react-bootstrap';

import ValidateModal from '../ValidateModal';
import SolutionModal from "./SolutionModal";
import CreateSolutionModal from "./CreateSolutionModal";

import SolutionDetailsPane from './SolutionDetailsPane';

let groupByN = (n, data) => {
    let result = [];
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
    return result;
};

class SolutionsView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            solutions: [],
            notifications: [],
            showModal: false,
            showCreateModal: false,
            user: {},
        };
        this.showModal = this.showModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.deleteSolution = this.deleteSolution.bind(this);
    }

    async loadSolutions() {
        this.setState({dataLoaded: false});
        fetch('/api/solutions')
            .then(res => res.json())
            .then(solutions => {
                this.setState({ solutions: solutions.filter(sol => {
                    const solId = sol.id?.toLowerCase();
                    const solName = sol.name?.toLowerCase();
                    const solDesc = sol.short_desc?.toLowerCase();
                    const provider = sol.platform ?? sol.provider ?? '';
                    const restrictedProviders = [];
                    if (!this.state.user?.config?.ibmContent) {
                        if (solId?.includes('ibm') || solName.includes('ibm')) return false;
                        restrictedProviders.push('ibm');
                        restrictedProviders.push('ibm-cp');
                    }
                    if (!this.state.user?.config?.azureContent) {
                        if (solId?.includes('azure') || solName.includes('azure') || solDesc.includes('azure')) return false;
                        restrictedProviders.push('azure');
                    }
                    if (!this.state.user?.config?.awsContent) {
                        if (solId?.includes('aws') || solName.includes('aws') || solDesc.includes('aws')) return false;
                        restrictedProviders.push('aws');
                    }
                    return !restrictedProviders.includes(provider);
                }), dataLoaded: true });
            })
            .catch(console.error);
    }

    componentDidMount() {
        this.setState({ user: this.props.user });
        this.loadSolutions();
    };

    componentDidUpdate() {
        if (this.props.user?.config !== this.state.user?.config) {
            this.setState({ user: this.props.user });
            this.loadSolutions();
        }
    };

    downloadTerraform(solution) {

        if (!solution) {
            this.addNotification("error", "Error", "Cannot download Automation at this time.");
            return
        }

        this.addNotification("info", "BUILDING", "Building your terraform module...");
        fetch(`/api/solutions/${solution.id}/automation`)
            .then(response => {
                if (response && response.status === 200) {
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = `${solution.name?.toLowerCase()?.replace(/[ /\\_?;.=:,+]/g,'-')}-automation.zip`;
                        a.click();
                    });
                }
                else {
                    this.addNotification("error", response.status + " " + response.statusText, "Error building your terraform module.");
                }
            });
    }

    deleteSolution() {
        if (this.state.curSol) {
            this.addNotification('info', 'Deleting', `Deleting solution ${this.state.curSol.id} id beeing deleted...`);
            fetch(`/api/solutions/${this.state.curSol.id}`, {method: 'delete'})
                .then(res => {
                    console.log(res);
                    if (res.error) return this.addNotification("error", res?.status === 401 ? "Unauthorized" : "Error", res.error.message);
                    this.addNotification('success', 'OK', `Solution ${this.state.curSol.id} deleted successfully!`);
                    this.setState({
                        showValidate: false,
                        curSol: undefined
                    });
                    this.loadSolutions();
                })
                .catch((err) => {
                    this.addNotification('error', 'Error', `Error while deleting solution ${this.state.curSol.id}, check the logs for details.`);
                    console.log(err);
                });
        }
    }

    async showCreateModal() {
        this.setState({
            showCreateModal: true
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
            showCreateModal: false,
            showModal: false,
            isDuplicate: false,
            updateModal: false
        });
        this.loadSolutions();
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

        return (

            <div className="bx--grid"  >

                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>

                <div className="bx--row">
                    <div className="bx--col-lg-12">
                        <br></br>
                        <h2 style={{"display": "flex"}}>
                            Solutions
                            {this.state.user?.role === "admin" && <Button
                                size='sm'
                                style={{"margin-left": "auto"}}
                                onClick={() => this.showModal()}
                                renderIcon={Add16} >
                                Create
                            </Button>}
                            &nbsp;
                            {this.state.user?.role === "admin" && <Button
                                size='sm'
                                onClick={() => this.showCreateModal()}
                                renderIcon={Add16} >
                                Guided
                            </Button>}

                        </h2>
                        <br></br>

                    </div>
                </div>
                {groupByN(4, this.state.solutions).map(solGroup => (
                    <CardGroup>
                        {/* <Row sm={1} md={2} lg={3} xl={4} xxl={5} className="g-4"> */}
                            {this.state.dataLoaded ?
                                solGroup?.length ?
                                solGroup.map((solution) => (
                                    <Card style={{ marginBottom: '1rem', marginRight: '1rem', borderLeft: '1px solid rgba(0, 0, 0, 0.125)' }}>
                                        <Card.Body>
                                            <Card.Title>{solution.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{solution.id}</Card.Subtitle>
                                            <Card.Text>{solution.short_desc}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Card.Link href="#"
                                                // onClick={() => {
                                                //     this.setState({ isPaneOpen: true, dataDetails:undefined });
                                                //     fetch(`/api/solutions/${solution.id}?filter=${encodeURIComponent(JSON.stringify({include: ['architectures']}))}`)
                                                //     .then((res) => res.json())
                                                //     .then((sol) => {
                                                //         this.setState({dataDetails: sol})
                                                //     })
                                                //     .catch(() => this.addNotification("error", "Error", `Error loading details for solution ${solution.id}`))
                                                // }}
                                            >
                                                <Link to={`/solutions/${solution.id}`} >
                                                    Details
                                                </Link>
                                            </Card.Link>
                                            <Card.Link href="#" onClick={() => this.downloadTerraform(solution)} >Download</Card.Link>
                                            {this.state.user?.role === "admin" && <Card.Link style={{color: 'red', cursor: 'pointer'}} onClick={() => {
                                                this.setState({
                                                    showValidate: true,
                                                    curSol: solution
                                                });
                                            }}>Delete</Card.Link>}
                                        </Card.Footer>
                                    </Card>
                                ))
                            :
                                <p>No Solutions at the moment{this.state.user?.role === "admin" ? <>, click <strong>Create</strong> on the top right corner to create a new one.</>: <>.</>}</p>
                            :
                                <SearchSkeleton />
                            }
                        {/* </Row> */}
                </CardGroup>
                ))}

                {this.state.showModal &&
                    <SolutionModal
                        show={this.state.showModal}
                        handleClose={this.hideModal}
                        isUpdate={this.state.updateModal}
                        data={this.state.dataDetails}
                        toast={this.addNotification}
                        isDuplicate={this.state.isDuplicate}
                        user={this.state.user}
                    />
                }

                {this.state.showCreateModal &&
                    <CreateSolutionModal
                        show={this.state.showCreateModal}
                        handleClose={this.hideModal}
                        isUpdate={this.state.updateModal}
                        data={this.state.dataDetails}
                        toast={this.addNotification}
                        isDuplicate={this.state.isDuplicate}
                        user={this.state.user}
                    />
                }

                {this.state.showValidate && this.state.curSol &&
                    <ValidateModal
                        danger
                        submitText="Delete"
                        heading="Delete Solution"
                        message={`You are about to remove solution "${this.state.curSol.name ?? this.state.curSol.id}". This action cannot be undone. This will remove the solution record, as well as all associated files. If you are sure, type "${this.state.curSol.id}" and click Delete to confirm deletion.`}
                        show={this.state.showValidate}
                        inputRequired={this.state.curSol.id}
                        onClose={() => {
                            this.setState({
                                showValidate: false,
                                curSol: undefined
                            });
                        }}
                        onRequestSubmit={this.deleteSolution}
                        onSecondarySubmit={() => {
                            this.setState({
                                showValidate: false,
                                curSol: undefined
                            });
                        }} />
                }

                <div>
                    <SolutionDetailsPane
                        data={this.state.dataDetails}
                        open={this.state.isPaneOpen}
                        buttonClick={() => {
                            this.setState({ isPaneOpen: false });
                            this.showModal(true);
                        }}
                        user={this.state.user}
                        buttonIcon={Edit16}
                        buttonText='Edit'
                        onRequestClose={() => this.setState({ isPaneOpen: false })} />
                </div>

            </div>

        );
    }
}

export default SolutionsView;
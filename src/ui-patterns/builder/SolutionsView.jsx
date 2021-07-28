


import React, { Component } from "react";

import {
    Link
} from "react-router-dom";

import {
    OverflowMenu,
    OverflowMenuItem,
    ToastNotification,
    SearchSkeleton
} from 'carbon-components-react';

import { Card, Container, Row, Col } from 'react-bootstrap';

import ValidateModal from '../ValidateModal';
import SolutionModal from "./SolutionModal";

class SolutionsView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            solutions: [],
            notifications: [],
            showModal: false,
            user: {},
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.deleteSolution = this.deleteSolution.bind(this);
    }

    async loadSolutions() {
        this.setState({dataLoaded: false});
        fetch('/api/solutions')
            .then(res => res.json())
            .then(solutions => {
                console.log(solutions)
                this.setState({ solutions: solutions, dataLoaded: true });
            })
            .catch(console.error);
    }

    // Load the Data into the Project
    componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                this.setState({ user: user || undefined });
                this.loadSolutions();
            })
            .catch(console.error);
    };

    deleteSolution() {
        if (this.state.curSol) {
            this.addNotification('info', 'Deleting', `Deleting solution ${this.state.curSol.id} id beeing deleted...`);
            fetch(`/api/solutions/${this.state.curSol.id}`, {method: 'delete'})
                .then(res => {
                    console.log(res);
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

    async showModal() {
        this.setState({
            showModal: true,
        });
    }

    async hideModal() {
        this.setState({
            showModal: false,
            isDuplicate: false
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

                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 style={{"display": "flex"}}>
                            Solutions
                            <OverflowMenu
                                size='lg'
                                flipped
                                style={{"margin-left": "auto"}}>
                                <OverflowMenuItem
                                    itemText="Add"
                                    onClick={() => this.showModal()}/>
                            </OverflowMenu>
                        </h2>
                        <br></br>
                    </div>
                </div>

                <Container>
                    <Row>
                        {this.state.dataLoaded ?
                        this.state.solutions?.length ?
                            this.state.solutions.map((solution) => (
                                <Col>
                                    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                                        <Card.Body>
                                            <Card.Title>{solution.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{solution.id}</Card.Subtitle>
                                            <Card.Text>{solution.short_desc}</Card.Text>
                                            <Card.Link href="#">View</Card.Link>
                                            <Card.Link href="#">Download</Card.Link>
                                            <Card.Link style={{color: 'red'}} onClick={() => {
                                                this.setState({
                                                    showValidate: true,
                                                    curSol: solution
                                                });
                                            }}>Delete</Card.Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        :
                            <p>No Solutions at the moment, click <strong>Add</strong> on the top right corner to create a new one.</p>
                        :
                            <SearchSkeleton />
                        }
                    </Row>
                </Container>

                {this.state.showModal && 
                    <SolutionModal
                        show={this.state.showModal}
                        handleClose={this.hideModal}
                        isUpdate={this.state.updateModal}
                        data={this.state.archRecord}
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
                        message={`You are about to remove solution ${this.state.curSol.id}. This action cannot be undone. This will remove the solution record, as well as all associated files. If you are sure, type "${this.state.curSol.id}" and click Delete to confirm deletion.`}
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

            </div>

        );
    }
}

export default SolutionsView;

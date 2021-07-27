


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
    }

    async loadSolutions() {
        fetch('/api/solutions')
            .then(res => res.json())
            .then(solutions => {
                this.setState({ solutions: solutions });
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
                        {this.state.solutions ?
                            this.state.solutions.map((solution) => (
                                <Col>
                                    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                                        <Card.Body>
                                            <Card.Title>{solution.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{solution.id}</Card.Subtitle>
                                            <Card.Text>{solution.short_desc}</Card.Text>
                                            <Card.Link href="#">View</Card.Link>
                                            <Card.Link href="#">Download</Card.Link>
                                            <Card.Link style={{color: 'red'}} href="#">Delete</Card.Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        :
                            <SearchSkeleton />
                        }
                    </Row>
                </Container>

            </div>

        );
    }
}

export default SolutionsView;

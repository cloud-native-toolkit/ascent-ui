


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

class SolutionsView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            user: {},
        };
    }

    // Load the Data into the Project
    componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                this.setState({ user: user || undefined })
            })
            .catch(console.error);
    };

    render() {

        return (

            <div className="bx--grid"  >

                <Container>
                    <Row>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>Card Title</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Card.Link href="#">Card Link</Card.Link>
                                    <Card.Link href="#">Another Link</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </div>

        );
    }
}

export default SolutionsView;

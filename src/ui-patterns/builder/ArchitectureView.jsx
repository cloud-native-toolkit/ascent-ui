import React, { Component } from "react";
import FormLabel from 'carbon-components-react/lib/components/FormLabel';
import Tooltip from 'carbon-components-react/lib/components/Tooltip';
import ArticleCard from './ArticleCard';
import _ from 'lodash';

import {
    Link
} from "react-router-dom";

import { Button } from 'carbon-components-react';
import {
    Add16
} from '@carbon/icons-react';

import { ToastNotification } from "carbon-components-react";

import ArchitectureModal from './ArchitectureModal';

class ArchitectureView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            architectures: [],
            userRole: "editor",
            showArchModal: false,
            updateModal: false,
            archRecord: false,
            notifications: []
        };
        this.showArchModal = this.showArchModal.bind(this);
        this.hideArchModal = this.hideArchModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }

    async showArchModal() {
        this.setState({
            showArchModal: true
        });
    }

    async hideArchModal() {
        this.setState({
            showArchModal: false,
            updateModal: false,
            archRecord: false
        });
    }

    // Load the Data into the Project
    componentDidMount() {
        fetch("/api/architectures")
            .then(response => response.json())
            .then(data => {
                this.setState(Object.assign(
                    {},
                    this.state,
                    { architectures: data },
                ));
            });
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                this.setState({ userRole: user.role || undefined })
            })
    };

    getArchitectures(architectures) {

        // Move to global or env var
        if (_.isUndefined(architectures))
            return [];

        var archTiles = []
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
                        color="dark">

                        <Link to={link}>
                            <img
                                className="resource-img"
                                src={`/api/architectures/${arch.arch_id}/diagram/png?small=true`}
                                alt={arch.short_desc}
                                className="article-img"
                            />
                        </Link>

                        <div className="labels">
                            <FormLabel>
                                <Tooltip triggerText="Terraform">This architecture supports Terraform.</Tooltip>
                            </FormLabel>
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
                    />
                }

                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 style={{"display": "flex"}}>
                            Architectures
                            <Button
                                // size="small"
                                kind="primary"
                                renderIcon={Add16}
                                onClick={this.showArchModal}
                                disabled={this.state.userRole !== "editor"}
                                style={{"margin-left": "auto"}}
                            >
                                Create
                            </Button>
                        </h2>
                        <br></br>
                        <p>
                            Navigate to the reference architecture you are interested in and see the IBM Cloud bill of materials
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row">

                    {this.getArchitectures(this.state.architectures, true)}

                </div>

            </div>

        );
    }
}

export default ArchitectureView;

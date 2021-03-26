import React, { Component } from "react";
import FormLabel from 'carbon-components-react/lib/components/FormLabel';
import Tooltip from 'carbon-components-react/lib/components/Tooltip';
import ArticleCard from './ArticleCard';
import _ from 'lodash';

import {
    Link
} from "react-router-dom";

import { useHistory } from "react-router-dom";

class ArchitectureView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            architectures: []
        };

    }


    // Load the Data into the Project
    componentDidMount() {

        fetch("/architectures")
            .then(response => response.json())
            .then(data => {
                console.log('architectures', data);
                this.setState(Object.assign(
                    {},
                    this.state,
                    { architectures: data },
                ));
            });

    };

    getImage(folder, image) {

        const refArchLink  =  "/images/"
        return refArchLink+folder +"/"+ image;
    }

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
                        date="March 22, 2021"
                        readTime="Terraform | FS Ready | Cloud-Native"
                        color="dark">

                        <Link to={link}>

                        <img
                            className="resource-img"
                            src={this.getImage(arch.diagram_folder, arch.diagram_link_png)}
                            alt={arch.short_desc}
                            className="article-img"
                        />
                        </Link>

                    <div className="labels">

                            <FormLabel>
                                <Tooltip triggerText="FS Ready">This Architecture is FS Ready</Tooltip>
                                <Tooltip triggerText="Hippa">This architecture support Hippa Services</Tooltip>
                                <Tooltip triggerText="Terraform">This architecture supports Terraform.</Tooltip>
                            </FormLabel>

                        </div>

                    </ArticleCard>

                </div>
            );
        }

        return archTiles;

    }


    render() {

        return (

            <div className="bx--grid"  >

                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Architectures
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

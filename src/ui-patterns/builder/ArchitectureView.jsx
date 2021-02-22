import React, { Component } from "react";

import FormLabel from 'carbon-components-react/lib/components/FormLabel';
import Tooltip from 'carbon-components-react/lib/components/Tooltip';

import ArticleCard from './ArticleCard';

import _ from 'lodash';

class ArchitectureView extends Component {

    // Configure the App
    constructor(props) {
        super(props);

        this.state = {
            architectures: [],
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
                    {architectures: data},
                ));
            });

    };

    render() {

        function getImage(id, image) {
            return "/images/"+id+"/"+image;
        }

        function getArchitectures(architectures) {

            if (_.isUndefined(architectures) )
                return [];

            var archTiles = []
            for(var i=0;i<architectures.length;i++) {
                const arch = architectures[i];
                archTiles.push(
                    <div className="bx--col-md-8 bx--col-lg-8">
                        <ArticleCard
                            title={arch.name}
                            author={arch.short_desc}
                            desc={arch.long_desc}
                            date="March 12, 2021"
                            readTime="Terraform | FS Ready | Cloud-Native"
                            color="dark">

                            <img
                                className="resource-img"
                                src={getImage(arch._id,arch.diagram_link_png)}
                                alt={arch.short_desc}
                                className="article-img"
                            />

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

        return (

            <div className="bx--grid bx--grid--full-width">

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

                    {getArchitectures(this.state.architectures, true)}

                </div>

            </div>

        );
    }
}
export default ArchitectureView;

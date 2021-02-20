import React, { Component } from "react";

import FormLabel from 'carbon-components-react/lib/components/FormLabel';
import Tooltip from 'carbon-components-react/lib/components/Tooltip';

import ResourceCard from './ResourceCard';
//import ArticleCard from './ArticleCard';
//import CodePatternCard from './CodePatternCard';

import _ from 'lodash';
import ArchReferenceCard from "./ArchReferenceCard";

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
                    <div className="bx--column bx--col-md-8  bx--no-gutter-lg">

                            <ResourceCard
                                title={arch.name}
                                subTitle={arch.short_desc}
                            >
                                <img
                                    className="resource-img"
                                    src={getImage(arch._id,arch.diagram_link_png)}
                                    alt={arch.short_desc}
                                />

                                <div class="labels">

                                    <FormLabel>

                                        <Tooltip triggerText="Label">This is the content of the tooltip.</Tooltip>
                                        <Tooltip triggerText="Label">This is the content of the tooltip.</Tooltip>
                                        <Tooltip triggerText="Label">This is the content of the tooltip.</Tooltip>
                                        <Tooltip triggerText="Label">This is the content of the tooltip.</Tooltip>

                                    </FormLabel>


                                </div>


                            </ResourceCard>

                    </div>
                );
            }

            return archTiles;

        }

        return (

            <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">

                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Architectures
                        </h2>
                        <br></br>
                        <p>
                            Navigate the reference architectures and see the bill of materials
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row ">
                    <div className="bx--row resource-card-group">
                        {getArchitectures(this.state.architectures, true)}
                    </div>
                </div>
            </div>

        );
    }
}
export default ArchitectureView;

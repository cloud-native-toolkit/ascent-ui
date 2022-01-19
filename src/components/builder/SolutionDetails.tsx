import React, { Component } from "react";
import SolutionDetailsView from "../../ui-patterns/builder/SolutionDetailsView";

class SolutionDetailsComponent extends Component<any, any> {
    render() {
        return (
            <SolutionDetailsView 
                solId={this.props.data}
            />
        );
    }
}

export default SolutionDetailsComponent;
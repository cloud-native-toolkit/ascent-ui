import React, { Component } from "react";
import SolutionDetailsView from "../../ui-patterns/builder/SolutionDetailsView";

class SolutionDetailsComponent extends Component<any, any> {
    render() {
        return (
            <div className="pattern-container">
                <SolutionDetailsView 
                    solId={this.props.data}
                />
            </div>
        );
    }
}

export default SolutionDetailsComponent;
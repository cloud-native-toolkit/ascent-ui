import React, { Component } from "react";
import ArchitectureView from "../../ui-patterns/builder/ArchitectureView";
class ArchitectureComponent extends Component<any, any> {
    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <div className="pattern-container">
                <ArchitectureView />
            </div>
        );
    }
}
export default ArchitectureComponent;
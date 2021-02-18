import React, { Component } from "react";
import ControlsView from "../../ui-patterns/compliance/ControlsView";
class ControlsComponent extends Component<any, any> {
    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <div className="pattern-container">
                <ControlsView />
            </div>
        );
    }
}
export default ControlsComponent;
import React, { Component } from "react";
import OverView from "../../ui-patterns/overview/OverView";
class DetailsViewComponent extends Component<any, any> {
    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <div className="pattern-container">
                <OverView />
            </div>
        );
    }
}
export default DetailsViewComponent;
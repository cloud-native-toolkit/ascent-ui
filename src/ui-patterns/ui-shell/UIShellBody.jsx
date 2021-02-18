import React, { Component } from "react";

import DetailsViewComponent from "../../components/overview/DetailsView";
import ArchitectureComponent from "../../components/builder/Architecture";
import ControlsComponent from "../../components/compliance/Controls";

class UIShellBody extends Component {
  components = {
    "Overview": DetailsViewComponent,
    "Architecture": ArchitectureComponent,
    "Controls": ControlsComponent
  };
  defaultComponent = "Overview";

  render() {
    const PatternName = this.components[
      this.props.patternName || this.defaultComponent
    ];
    return (

      <PatternName showDescription={true} />

    );
  }
}
export default UIShellBody;

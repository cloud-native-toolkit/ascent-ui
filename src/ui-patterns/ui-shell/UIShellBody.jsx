import React, { Component } from "react";

import DetailsViewComponent from "../../components/overview/DetailsView";
import ArchitectureComponent from "../../components/builder/Architecture";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";

class UIShellBody extends Component {
  components = {
    "Overview": DetailsViewComponent,
    "Architecture": ArchitectureComponent,
    "Controls": BillofMaterialsComponent
  };
  defaultComponent = "Overview";

  render() {
    const PatternName = this.components[
      this.props.patternName || this.defaultComponent
    ];
    return (
      <div>
        <PatternName showDescription={true} />
      </div>
    );
  }
}
export default UIShellBody;

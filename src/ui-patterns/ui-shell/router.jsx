import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import ArchitectureComponent from "../../components/builder/Architecture";
import ControlsComponent from "../../components/compliance/Controls";
import DetailsViewComponent from "../../components/overview/DetailsView";


function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (

                <Switch>
                    <Route path="/overview" exact component={DetailsViewComponent} />
                    <Route path="/bom" exact component={BillofMaterialsComponent} />
                    <Route path="/architecture" component={ArchitectureComponent} />
                    <Route path="/controls" component={ControlsComponent} />
                </Switch>

            )} />
        </BrowserRouter>
    )
}

export default Routes;
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import ArchitectureComponent from "../../components/builder/Architecture";
import ControlsComponent from "../../components/compliance/Controls";
import ControlDetailsComponent from "../../components/compliance/ControlDetails";
import DetailsViewComponent from "../../components/overview/DetailsView";
import ServiceComponent from "../../components/services/service";

function RenderBOM() {

    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { bomid } = useParams();

    return (
        <BillofMaterialsComponent data={bomid}></BillofMaterialsComponent>
    );
}

function RenderControl() {

    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { control_id } = useParams();

    return (
        <ControlDetailsComponent data={control_id}></ControlDetailsComponent>
    );
}

function Child() {

    let { id } = useParams();

    return (
        <div>
            <h3>ID: {id}</h3>
        </div>
    );
}

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={DetailsViewComponent} />
            <Route path="/bom/:bomid" children={<RenderBOM></RenderBOM>}></Route>
            <Route path="/architectures" component={ArchitectureComponent} />
            <Route path="/controls" component={ControlsComponent} />
            <Route path="/control/:control_id" children={<RenderControl></RenderControl>} />
            <Route path="/services" component={ServiceComponent} />
        </Switch>
    )
}

export default Routes;
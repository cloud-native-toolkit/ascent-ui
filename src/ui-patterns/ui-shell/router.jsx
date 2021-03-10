import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import ArchitectureComponent from "../../components/builder/Architecture";
import ControlsComponent from "../../components/compliance/Controls";
import NistComponent from "../../components/compliance/Nist";
import ControlDetailsComponent from "../../components/compliance/ControlDetails";
import NistDetailsComponent from "../../components/compliance/NistDetails";
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
    if (control_id === control_id.toLowerCase().replace(' ', '_')) {
        return (
            <ControlDetailsComponent data={control_id.toUpperCase().replace('_', ' ')}></ControlDetailsComponent>
        );
    } 
    return (
        <></>
    );
}

function RenderNist() {

    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { number } = useParams();
    if (number === number.toLowerCase().replace(' ', '_')) {
        return (
            <NistDetailsComponent data={number.toUpperCase().replace('_', ' ')}></NistDetailsComponent>
        );
    } 
    return (
        <></>
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
            <Route path="/nist-controls" component={NistComponent} />
            <Route path="/nist/:number" children={<RenderNist></RenderNist>} />
            <Route path="/services" component={ServiceComponent} />
        </Switch>
    )
}

export default Routes;
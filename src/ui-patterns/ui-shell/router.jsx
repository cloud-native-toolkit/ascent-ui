import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import ArchitectureComponent from "../../components/builder/Architecture";
import ControlsComponent from "../../components/compliance/Controls";
import NistComponent from "../../components/compliance/Nist";
import ControlDetailsComponent from "../../components/compliance/ControlDetails";
import NistDetailsComponent from "../../components/compliance/NistDetails";
import ServiceDetailsComponent from "../../components/services/ServiceDetails";
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

function RenderService() {

    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { service_id } = useParams();

    return (
        <ServiceDetailsComponent data={service_id}></ServiceDetailsComponent>
    );
}

/**
 * Controls
 */
function ControlDetails() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { controlId } = useParams();
    if (controlId === controlId.toLowerCase().replace(' ', '_')) {
        return (
            <ControlDetailsComponent data={controlId.toUpperCase().replace('_', ' ')}></ControlDetailsComponent>
        );
    } 
    return (
        <></>
    );
}
function Controls() {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={path}>
                <ControlsComponent />
            </Route>
            <Route path={`${path}/:controlId`}>
                <ControlDetails />
            </Route>
        </Switch>
    )
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
            <Route path="/controls" component={Controls} />
            <Route path="/nist-controls" component={NistComponent} />
            <Route path="/nist/:number" children={<RenderNist></RenderNist>} />
            <Route path="/services" component={ServiceComponent} />
            <Route path="/service/:service_id" children={<RenderService></RenderService>} />
        </Switch>
    )
}

export default Routes;
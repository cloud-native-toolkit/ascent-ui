import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import BillofMaterialsComponent from "../../components/bom/BillofMaterials";
import ArchitectureComponent from "../../components/builder/Architecture";
import SolutionsComponent from "../../components/builder/Solutions";
import ControlsComponent from "../../components/compliance/Controls";
import NistComponent from "../../components/compliance/Nist";
import ControlDetailsComponent from "../../components/compliance/ControlDetails";
import NistDetailsComponent from "../../components/compliance/NistDetails";
import ServiceDetailsComponent from "../../components/services/ServiceDetails";
import DetailsViewComponent from "../../components/overview/DetailsView";
import LandingPage from "../LandingPage";
import ServiceComponent from "../../components/services/service";
import MappingComponent from "../../components/mapping/Mapping";

function RenderBOM() {
    let { bomid } = useParams();
    return (
        <BillofMaterialsComponent data={bomid}></BillofMaterialsComponent>
    );
}

function userArch() {
    return (
        <ArchitectureComponent userArch={true} />
    )
}

/**
 * Services
 */
function ServiceDetails() {
    let { serviceId } = useParams();
    return (
        <ServiceDetailsComponent data={serviceId}></ServiceDetailsComponent>
    );
}
function Services() {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={path}>
                <ServiceComponent />
            </Route>
            <Route path={`${path}/:serviceId`}>
                <ServiceDetails />
            </Route>
        </Switch>
    )
}

/**
 * Controls
 */
function ControlDetails() {
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

/**
 * Nist
 */
 function NistDetails() {
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
function Nists() {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={path}>
                <NistComponent />
            </Route>
            <Route path={`${path}/:number`}>
                <NistDetails />
            </Route>
        </Switch>
    )
}


function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/" exact component={DetailsViewComponent} />
            <Route path="/bom/:bomid" children={<RenderBOM></RenderBOM>}></Route>
            <Route path="/architectures" component={ArchitectureComponent} />
            <Route path="/myarchitectures" component={userArch} />
            <Route path="/solutions" component={SolutionsComponent} />
            <Route path="/mapping" component={MappingComponent} />
            <Route path="/controls" component={Controls} />
            <Route path="/nists" component={Nists} />
            <Route path="/services" component={Services} />
            <Route path="/docs" exact component={DetailsViewComponent} />
        </Switch>
    )
}

export default Routes;

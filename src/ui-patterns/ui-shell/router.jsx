import React from 'react';

import {
    Route,
    Switch,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

import BillofMaterialsComponent from '../../components/bom/BillofMaterials';
import ArchitectureComponent from '../../components/builder/Architecture';
import SolutionsComponent from '../../components/builder/Solutions';
import SolutionDetailsComponent from '../../components/builder/SolutionDetails';
import ControlsComponent from '../../components/compliance/Controls';
import NistComponent from '../../components/compliance/Nist';
import ControlDetailsComponent from '../../components/compliance/ControlDetails';
import NistDetailsComponent from '../../components/compliance/NistDetails';
import ServiceDetailsComponent from '../../components/services/ServiceDetails';
import DetailsViewComponent from '../../components/overview/DetailsView';
import LandingPage from '../LandingPage';
import ServiceComponent from '../../components/services/service';
import MappingComponent from '../../components/mapping/Mapping';
import OnBoardingComponent from '../../components/compliance/OnBoarding';
import NotFound from '../../components/NotFound';


/**
 * BOMs
 */
function BomDetails() {
    let { bomid } = useParams();
    return (
        <BillofMaterialsComponent data={bomid}></BillofMaterialsComponent>
    );
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
    let { path } = useRouteMatch();
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
    let { path } = useRouteMatch();
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

/**
 * Solutions
 */
function SolutionDetails() {
    let { id } = useParams();
    return (
        <SolutionDetailsComponent data={id}></SolutionDetailsComponent>
    );
}

class Routes extends React.Component {
    render() {
        return (
            <div className='pattern-container'>
                <Switch>
                    <Route path='/' exact component={LandingPage} />
                    <Route exact path='/boms'>
                        <ArchitectureComponent user={this.props.user} />
                    </Route>
                    <Route exact path='/boms/user'>
                        <ArchitectureComponent user={this.props.user} isUser />
                    </Route>
                    <Route exact path='/boms/infrastructure'>
                        <ArchitectureComponent user={this.props.user} isInfra />
                    </Route>
                    <Route exact path='/boms/software'>
                        <ArchitectureComponent user={this.props.user} isSoftware />
                    </Route>
                    <Route path={`/boms/:bomid`}>
                        <BomDetails />
                    </Route>
                    <Route exact path='/solutions'>
                        <SolutionsComponent user={this.props.user} />
                    </Route>
                    <Route path={'/solutions/:id'}>
                        <SolutionDetails />
                    </Route>
                    <Route path='/mapping' component={MappingComponent} />
                    <Route path='/controls' component={Controls} />
                    <Route path='/onboarding' component={OnBoardingComponent} />
                    <Route path='/nists' component={Nists} />
                    <Route exact path='/services'>
                        <ServiceComponent user={this.props.user} />
                    </Route>
                    <Route path='/services/ibm'>
                        <ServiceComponent ibm={true} user={this.props.user} />
                    </Route>
                    <Route path={'/services/:serviceId'}>
                        <ServiceDetails />
                    </Route>
                    <Route path='/docs' exact component={DetailsViewComponent} />
                    <Route path='*' component={NotFound} />
                </Switch>
            </div>
        )
    }
}

export default Routes;

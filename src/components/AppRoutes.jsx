import React from 'react';

import {
    Route, Routes, useParams
} from 'react-router-dom';
import importedComponent from 'react-imported-component';

import Loading from './Loading';

import BuildLandingPage from './landing-page/LandingPage';
import FSLandingPage from './fs-landing-page/FSLandingPage';
import OverView from './OverView';
import NotFound from './NotFound';

import ApplicationMode from '../utils/application-mode';

const SolutionsView = importedComponent(
    () => import(/* webpackChunkName:'solutions' */ './builder/solutions/SolutionsView'),
    {LoadingComponent: Loading});

const SolutionDetailsView = importedComponent(
    () => import(/* webpackChunkName:'solutions' */ './builder/solutions/SolutionDetailsView'),
    {LoadingComponent: Loading});

const CreateSolutionView = importedComponent(
    () => import(/* webpackChunkName:'solutions' */ './builder/solutions/CreateSolutionView'),
    {LoadingComponent: Loading});


const ArchitectureView = importedComponent(
    () => import(/* webpackChunkName:'architecture' */ './builder/ArchitectureView'),
    {LoadingComponent: Loading});

const BillofMaterialsView = importedComponent(
    () => import(/* webpackChunkName:'architecture' */ './builder/bom/BillofMaterials'),
    {LoadingComponent: Loading});

const ServiceDetailsView = importedComponent(
    () => import(/* webpackChunkName:'architecture' */ './builder/services/ServiceDetailsView'),
    {LoadingComponent: Loading});


const ControlsView = importedComponent(
    () => import(/* webpackChunkName:'controls' */ './compliance/ControlsView'),
    {LoadingComponent: Loading});

const ControlDetailsView = importedComponent(
    () => import(/* webpackChunkName:'controls' */ './compliance/ControlDetailsView'),
    {LoadingComponent: Loading}
    );

const MappingView = importedComponent(
    () => import(/* webpackChunkName:'controls' */ './compliance/mapping/MappingView'),
    {LoadingComponent: Loading});

const NistView = importedComponent(
    () => import(/* webpackChunkName:'controls' */ './compliance/NistView'),
    {LoadingComponent: Loading});

const NistDetailsView = importedComponent(
    () => import(/* webpackChunkName:'controls' */ './compliance/NistDetailsView'),
    {LoadingComponent: Loading});


function SolutionDetails(props) {
    let { id } = useParams();
    return (
        <SolutionDetailsView {...props} solId={id} />
    );
}

function BomDetails(props) {
    let { bomId } = useParams();
    return (
        <BillofMaterialsView {...props} archId={bomId} />
    );
}

function ServiceDetails(props) {
    let { serviceId } = useParams();
    return (
        <ServiceDetailsView {...props} serviceId={serviceId} />
    );
}

function ControlDetails(props) {
    let { controlId } = useParams();
    if (controlId === controlId.toLowerCase().replace(' ', '_')) {
        return (
            <ControlDetailsView {...props}
                controlId={controlId.toUpperCase().replace('_', ' ')} />
        );
    }
    return (
        <></>
    );
}

function NistDetails(props) {
    let { number } = useParams();
    if (number === number.toLowerCase().replace(' ', '_')) {
        return (
            <NistDetailsView {...props}
                number={number.toUpperCase().replace('_', ' ')} />
        );
    }
    return (
        <></>
    );
}

function LandingPage(props) {
    if (ApplicationMode.isFsControlsMode()) {
        return (<FSLandingPage {...props} />)
    } else {
        return (<LandingPage {...props} />)
    }
}

class AppRoutes extends React.Component {
    render() {
        return (

            <Routes>

                <Route path='/' element={<LandingPage user={this.props.user}
                                                        addNotification={this.props.addNotification}/>}/>

                <Route path='/solutions' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/solutions/user' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} isUser />} />
                <Route path='/solutions/new' exact element={<CreateSolutionView user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path={'/solutions/:id'} element={<SolutionDetails user={this.props.user} addNotification={this.props.addNotification}/>} />
                <Route path='/boms/user' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isUser/>} />
                <Route path='/boms/infrastructure' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isInfra/>} />
                <Route path='/boms/software' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isSoftware/>} />
                <Route path='/boms/:bomId' element={<BomDetails user={this.props.user} addNotification={this.props.addNotification}/>} />
                <Route path='/services/:serviceId' element={<ServiceDetails addNotification={this.props.addNotification} />} />
                <Route path='/controls' element={<ControlsView user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/mapping' element={<MappingView  user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/controls/:controlId' element={<ControlDetails user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/nists' element={<NistView user={this.props.user}  addNotification={this.props.addNotification} />} />
                <Route path='/nists/:number' element={<NistDetails user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/docs' exact element={<OverView />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        )
    }
}

export default AppRoutes;

import React from 'react';

import {
    Route, Routes, useParams
} from 'react-router-dom';

import SolutionsView from './builder/solutions/SolutionsView';
import SolutionDetailsView from './builder/solutions/SolutionDetailsView';
import CreateSolutionview from './builder/solutions/CreateSolutionView';
import ArchitectureView from './builder/ArchitectureView';
import BillofMaterialsView from './builder/bom/BillofMaterials';
import ServiceDetailsView from './builder/services/ServiceDetailsView';
import LandingPage from './landing-page/LandingPage';
import ControlsView from './compliance/ControlsView';
import ControlDetailsView from './compliance/ControlDetailsView';
import MappingView from './compliance/mapping/MappingView';
import NistView from './compliance/NistView';
import NistDetailsView from './compliance/NistDetailsView';
import OverView from './OverView';
import NotFound from './NotFound';


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

class AppRoutes extends React.Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<LandingPage user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/solutions' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} />} />
                <Route path='/solutions/user' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} isUser />} />
                <Route path='/solutions/new' exact element={<CreateSolutionview user={this.props.user} addNotification={this.props.addNotification} />} />
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

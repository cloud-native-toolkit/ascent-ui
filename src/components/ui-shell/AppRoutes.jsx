import React from 'react';

import {
    Route, Routes, useParams
} from 'react-router-dom';

import ServiceDetailsView from '../builder/ServiceDetailsView';
import LandingPage from '../landing-page/LandingPage';
import ControlsView from '../compliance/ControlsView';
import ControlDetailsView from '../compliance/ControlDetailsView';
import MappingView from '../compliance/mapping/MappingView';
import NistView from '../compliance/NistView';
import NistDetailsView from '../compliance/NistDetailsView';
import OverView from '../OverView';
import NotFound from '../NotFound';


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

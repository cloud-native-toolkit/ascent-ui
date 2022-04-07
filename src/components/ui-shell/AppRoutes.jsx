import React from 'react';

import {
    Route, Routes, useParams
} from 'react-router-dom';

import LandingPage from '../landing-page/LandingPage';
import ControlsView from '../compliance/ControlsView';
import ControlDetailsView from '../compliance/ControlDetailsView';
import NistView from '../compliance/NistView';
import NistDetailsView from '../compliance/NistDetailsView';
import OverView from '../OverView';
import NotFound from '../NotFound';


function ControlDetails() {
    let { controlId } = useParams();
    if (controlId === controlId.toLowerCase().replace(' ', '_')) {
        return (
            <ControlDetailsView controlId={controlId.toUpperCase().replace('_', ' ')} />
        );
    }
    return (
        <></>
    );
}

function NistDetails(addNotification) {
    let { number } = useParams();
    if (number === number.toLowerCase().replace(' ', '_')) {
        return (
            <NistDetailsView
                number={number.toUpperCase().replace('_', ' ')}
                addNotification={addNotification} />
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
                <Route path='/' element={<LandingPage />} />
                <Route path='/controls' element={<ControlsView addNotification={this.props.addNotification} />} />
                <Route path='/controls/:controlId' element={<ControlDetails />} />
                <Route path='/nists' element={<NistView addNotification={this.props.addNotification} />} />
                <Route path='/nists/:number' element={<NistDetails addNotification={this.props.addNotification} />} />
                <Route path='/docs' exact element={<OverView />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        )
    }
}

export default AppRoutes;

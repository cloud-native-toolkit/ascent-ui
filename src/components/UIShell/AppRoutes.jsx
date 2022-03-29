import React from 'react';

import {
    Route,
    Routes,
} from 'react-router-dom';

import LandingPage from '../LandingPage/LandingPage';
import OverView from '../OverView';
import NotFound from '../NotFound';


class AppRoutes extends React.Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/docs' exact element={<OverView />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        )
    }
}

export default AppRoutes;

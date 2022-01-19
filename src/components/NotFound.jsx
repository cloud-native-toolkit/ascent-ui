import React, { Component } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    ToastNotification,
} from 'carbon-components-react';


class NotFound extends Component {
    render() {
        return (
            <ToastNotification
                style={{
                    width: 'fit-content',
                    paddingRight: '1rem'
                }}
                title='404 Not Found'
                subtitle={<span>This is not the web page you are looking for. <Link to='/'>Return Home</Link></span>}
                hideCloseButton
            />
        );
    }
}

export default NotFound;

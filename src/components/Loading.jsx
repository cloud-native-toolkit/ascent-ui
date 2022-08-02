import React from 'react';
import {Loading} from 'carbon-components-react';
import ReactDelayRender from 'react-delay-render';

const Loader = () => <Loading />;

export default ReactDelayRender({ delay: 300 })(Loader);

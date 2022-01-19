import React, { Component } from "react";
import SolutionsView from "../../ui-patterns/builder/SolutionsView";

import { SolutionsDataApi } from '../../services';

import {Container} from "typescript-ioc";
class SolutionsComponent extends Component<any, any> {

    solutionsDataAPI: SolutionsDataApi;
    constructor(props: any) {
        super(props);
        this.solutionsDataAPI = this.solutionService()
    }
    solutionService(): SolutionsDataApi {
        return Container.get(SolutionsDataApi);
    }

    render() {
        return (
            <SolutionsView solutionService={this.solutionsDataAPI} />
        );
    }
}

export default SolutionsComponent;

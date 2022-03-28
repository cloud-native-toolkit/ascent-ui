import React, { Component } from "react";
import {Container} from "typescript-ioc";

import SolutionsView from "../../ui-patterns/builder/SolutionsView";
import { SolutionsDataApi } from '../../services';
import { User } from "../../models/user";


class SolutionsComponent extends Component<{ user: User }, any> {

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
            <SolutionsView solutionService={this.solutionsDataAPI} user={this.props.user} />
        );
    }
}

export default SolutionsComponent;

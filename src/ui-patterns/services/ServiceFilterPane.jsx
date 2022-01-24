import React, { Component } from "react";
import {
    Close32 as Close
} from '@carbon/icons-react';

import SlidingPane from "react-sliding-pane";
import CatalogFilter from "../bom/CatalogFilter";

class ServiceFilterPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogFilters: {
                category: '',
                cloudProvider: '',
                softwareProvider: '',
                moduleType: '',
                status: '',
                searchText: ''
            },
        };
        this.filterCatalog = this.filterCatalog.bind(this);
    }

    filterCatalog = (filter, val) => {
        const catalogFilters = this.state.catalogFilters;
        catalogFilters[filter] = val;
        this.setState({
            catalogFilters: catalogFilters,
        }, () => {
            this.props.filterTable(this.state.catalogFilters);
        });
    }

    render () {
        return (
            <SlidingPane
                className="sliding-pane"
                isOpen={this.props.open}
                width="500px"
                title="Filters"
                onRequestClose={this.props.onRequestClose}
                closeIcon={<Close style={{width: '32px'}}/>}
            >
                {
                    <div>
                        <CatalogFilter
                            filterCatalog={this.filterCatalog}
                            catalogFilters={this.state.catalogFilters}
                            hideSearch />
                    </div>
                }
            </SlidingPane>
        )
    }
}
export default ServiceFilterPane;
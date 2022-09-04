import React, { Component } from "react";
import {
    DataTableSkeleton,
    Pagination, Grid, Row, Column
} from 'carbon-components-react';

import ReactGA from 'react-ga4';

import ControlsFilterPane from './ControlsFilterPane';
import ControlsTable from './ControlsTable';
import { ctrlsHeaders } from '../../data/data';
import { getControls } from "../../services/controls";

const b64 = require('../../utils/b64');


const ASCENT_CONTROLS_CACHE = "ASCENT_CTRLS_CACHE";

class ControlsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterData: [],
            headerData: ctrlsHeaders,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 15,
            searchValue: '',
            selectedFilters: [],
            isPaneOpen: false
        };
        this.filterTable = this.filterTable.bind(this);
        this.openFilterPane = this.openFilterPane.bind(this);
        this.hideFilterPane = this.hideFilterPane.bind(this);
    }

    async getControls() {
        let jsonData = [];
        try {
            const localData = sessionStorage.getItem(ASCENT_CONTROLS_CACHE);
            jsonData = JSON.parse(b64.decode(JSON.parse(localData)?.data));
        } catch (error) {
            try {
                const filter = {
                    include: ["nist", "controlDetails"]
                }
                jsonData = await getControls(filter);
            } catch (error) {
                this.props.addNotification('error', 'Error', 'Error fetching Controls data.');
            }
            try {
                sessionStorage.setItem(
                    ASCENT_CONTROLS_CACHE,
                    JSON.stringify({
                      data: b64.encode(JSON.stringify(jsonData))
                    })
                )
            } catch (error) {
                console.log(error);
            }
        }
        const filterData = jsonData.filter(elt => elt.control_item === false);
        this.setState({
            data: jsonData,
            filterData: filterData,
            totalItems: filterData.length
        });
    }

    async componentDidMount() {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
        this.getControls();
    }

    async filterTable(event) {
        const searchValue = event?.target ? event?.target?.value : this.state.searchValue;
        let selFilters = event.hasOwnProperty('selectedItems') ? event?.selectedItems: this.state.selectedFilters;
        let filterIsOr = selFilters.find(elt => elt.attr === 'and') === undefined;
        let filterData;
        if (selFilters.find(elt => elt.attr === 'control_item')) filterData = this.state.data;
        else filterData = this.state.data.filter(elt => !elt?.control_item);
        const selectedFilters = selFilters.filter(elt => elt.attr !== 'control_item' && elt.attr !== 'and');
        if (event?.target || searchValue) {
            filterData = filterData.filter(elt => elt?.id?.includes(searchValue) || elt?.name?.includes(searchValue) || elt?.family?.includes(searchValue) || elt?.controlDetails?.focus_area?.includes(searchValue));
        }
        if (selectedFilters.length) {
            filterData = filterData.filter(elt => {
                let metFilters = 0;
                for (const item of selectedFilters) {
                    if (
                        (
                            ([
                                'scc',
                                'control_type_1',
                                'control_type_2',
                                'control_type_3',
                                'risk_rating',
                            ].includes(item.attr) && elt?.controlDetails?.requirements?.find(req => req[item.attr] === item.val)) ||
                            ([
                                'ibm_public_cloud_resp',
                                'developer_resp',
                                'operator_resp',
                                'consumer_resp'
                            ].includes(item.attr) && elt?.controlDetails?.requirements?.find(req => req[item.attr]?.includes(item.val))) ||
                            (item.attr === 'nist_functions' && elt?.controlDetails[item.attr]?.includes(item.val)) ||
                            (item.attr === 'focus_area' && elt?.controlDetails[item.attr] === item.val) ||
                            elt[item.attr] === item.val
                        )
                        && (filterIsOr || ++metFilters === selectedFilters.length)
                    ) return true;
                }
                return false;
            });
        }
        this.setState({
            filterData: filterData,
            firstRowIndex: 0,
            totalItems: filterData.length,
            searchValue: searchValue,
            selectedFilters: selFilters
        });
    }

    openFilterPane = () => {
        this.setState({
            isFilterPaneOpen: true
        });
    };

    hideFilterPane = () => {
        this.setState({ isFilterPaneOpen: false });
    };

    render() {
        const data = this.state.filterData;
        for (let index = 0; index < data.length; index++) {
            let row = data[index];
            row.family = row?.family || row?.nist?.family
            row.focus_area = row?.focus_area || row?.controlDetails?.focus_area
        }
        const headers = this.state.headerData;
        let table;
        if (this.state.data.length === 0) {
            table = <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={15}
                showHeader={false}
                headers={null}
            />
        } else {
            table = <>
                <ControlsTable
                    headers={headers}
                    rows={data.slice(
                        this.state.firstRowIndex,
                        this.state.firstRowIndex + this.state.currentPageSize
                    )}
                    filter={this.filterTable}
                    onClickFilter={this.openFilterPane}
                />
                <Pagination
                    totalItems={this.state.totalItems}
                    backwardText="Previous page"
                    forwardText="Next page"
                    pageSize={this.state.currentPageSize}
                    pageSizes={[5, 10, 15, 25]}
                    itemsPerPageText="Items per page"
                    onChange={({ page, pageSize }) => {
                        if (pageSize !== this.state.currentPageSize) {
                            this.setState({
                                currentPageSize: pageSize
                            });
                        }
                        this.setState({
                            firstRowIndex: pageSize * (page - 1)
                        });
                    }}
                />
            </>
        }
        return (
            <>
            <Grid>
                <Row className="compliance-page__row">
                    <Column lg={{span: 12}}>
                        <h2>Controls</h2>
                        <p>
                            List of Controls defined for IBM Cloud for Financial Services&nbsp;
                            <a target="_blank" href="https://cloud.ibm.com/docs/framework-financial-services?topic=framework-financial-services-about#framework-control-requirements">(more info...)</a>
                        </p>

                        <br></br>
                    </Column>
                </Row>

                <Row className="compliance-page__row">
                    <Column lg={{span: 12}}>
                        {table}
                    </Column>
                </Row>
            </Grid >
            <div>
                <ControlsFilterPane
                    open={this.state.isFilterPaneOpen}
                    onRequestClose={this.hideFilterPane}
                    filterTable={this.filterTable}
                    selectedFilters={this.state.selectedFilters}/>
            </div>
            </>
        );
    }
}
export default ControlsView;

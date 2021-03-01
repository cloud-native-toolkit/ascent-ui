import React, { Component } from "react";
import Header from "../ui-shell/Header";
import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View
} from '@carbon/icons-react';
import {
    DataTable, TableContainer, Table,
    TableToolbar, TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { headerData } from './headerData';
class ServiceDataView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            headerData: headerData
        };

    }
    async componentDidMount() {
        const jsonData = await this.props.service.getServices();
        const serviceDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"service_id\":/g, "\"id\":"));
        this.setState({
            data: serviceDetails
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            nextProps.data.getArchitectureDetails().then(data => {
                this.setState({ data: nextProps.data });
            });
        }
    }

    render() {
        const data = this.state.data;
        const headers = this.state.headerData;
        return (
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Services
                        </h2>
                        <br></br>
                        <p>
                            List of IBM Cloud services
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row">
                    <DataTable rows={data} headers={headers}>
                        {({
                            rows,
                            headers,
                            getHeaderProps,
                            getRowProps,
                            getTableProps,
                            onInputChange,
                        }) => (
                                <TableContainer>
                                    <TableToolbar>
                                        <TableToolbarContent>
                                            {/* pass in `onInputChange` change here to make filtering work */}
                                            <TableToolbarSearch onChange={onInputChange} />
                                            <TableToolbarMenu>
                                                <TableToolbarAction >
                                                    Action 1
                                        </TableToolbarAction>
                                                <TableToolbarAction>
                                                    Action 2
                                        </TableToolbarAction>
                                                <TableToolbarAction >
                                                    Action 3
                                        </TableToolbarAction>
                                            </TableToolbarMenu>
                                            <Button >Primary Button</Button>
                                        </TableToolbarContent>
                                    </TableToolbar>
                                    <Table {...getTableProps()}>
                                        <TableHead>
                                            <TableRow>
                                                {headers.map((header) => (
                                                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.id} {...getRowProps({ row })}>
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                    </DataTable>
                    <div style={{ width: '800px' }}>
                        <Pagination
                            backwardText="Previous page"
                            forwardText="Next page"
                            itemsPerPageText="Items per page:"
                            page={1}
                            pageNumberText="Page Number"
                            pageSize={10}
                            pageSizes={[
                                10,
                                20,
                                30,
                                40,
                                50
                            ]}
                            totalItems={103}
                        />
                    </div>
                </div>
            </div >
        );
    }
}
export default ServiceDataView;
import React, { Component, useState } from "react";
import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View
} from '@carbon/icons-react';
import {
    DataTable,
    TableContainer,
    Table,
    TableToolbar,
    TableToolbarMenu,
    OverflowMenu,
    OverflowMenuItem,
    TableSelectAll,
    TableSelectRow,
    TableBatchActions,
    TableBatchAction,
    TableToolbarContent,
    TableToolbarSearch,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableToolbarAction,
    Button,
    DataTableSkeleton,
    Pagination
} from 'carbon-components-react';

export const headers = [
    {
        key: 'control_id',
        header: 'Control ID',
    },
    {
        key: 'control_family',
        header: 'Control Family',
    },
    {
        key: 'cf_description',
        header: 'Control Family Description',
    },
    {
        key: 'base_control',
        header: 'Base Control',
    },
    {
        key: 'control_name',
        header: 'Control Name',
    },
    {
        key: 'parameters',
        header: 'Parameters',
    },
    {
        key: 'candidate',
        header: 'Candidate',
    },
    {
        key: 'inherited',
        header: 'Inherited',
    },
    {
        key: 'platform_responsibility',
        header: 'Platform Responsibility',
    },
    {
        key: 'app_responsibility',
        header: 'App Responsibility',
    }
];

class ControlsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            headerData: headers
        };
    }
    
    async componentDidMount() {
        const jsonData = await this.props.controls.getControls();
        this.setState({
            data: jsonData
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            nextProps.data.getArchitectureDetails().then(data => {
                this.setState({ data: nextProps.data });
            });
        }
    }
    doGetControlsDetails(controls_id) {
        console.log(controls_id);
    }
    batchActionClick(rows) {
        let i = 0;
        rows.forEach(data => {
            const jsonData = this.props.controls.doDeleteControls(data.id);
            this.state.data.splice(i, 1);
            console.log(jsonData);
            i++;
        });

        this.setState({
            data: this.state.data
        });
    }
    doOpenForm() {

    }
    render() {
        const data = this.state.data;
        //setTotalItems(data.length)
        const headers = this.state.headerData;
        return (
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Controls
                        </h2>
                        <br></br>
                        <p>
                            List of FS Cloud controls
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row">

                    <DataTable rows={data.slice(
                      this.firstRowIndex,
                      this.firstRowIndex + this.currentPageSize
                    )} headers={headers}>
                        {({
                            rows,
                            headers,
                            getHeaderProps,
                            getSelectionProps,
                            getToolbarProps,
                            getBatchActionProps,
                            getRowProps,
                            getTableProps,
                            selectedRows,
                            onInputChange

                        }) => (
                                <TableContainer>
                                    <TableToolbar>
                                        <TableBatchActions {...getBatchActionProps()}>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Delete}
                                                onClick={() => this.batchActionClick(selectedRows)}>
                                                Delete
                                            </TableBatchAction>
                                            {/*<TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Save}
                                                onClick={batchActionClick(selectedRows)}>
                                                Save
                                            </TableBatchAction>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Download}
                                                onClick={batchActionClick(selectedRows)}>
                                                Download
                                            </TableBatchAction>*/}
                                        </TableBatchActions>
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
                                            <Button onClick={() => this.doOpenForm()} >Add</Button>
                                        </TableToolbarContent>
                                    </TableToolbar>
                                    <Table {...getTableProps()}>
                                        <TableHead>
                                            <TableRow>
                                                <TableSelectAll {...getSelectionProps()} />
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
                                                    <TableSelectRow {...getSelectionProps({ row })} />
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                    <TableCell className="bx--table-column-menu">
                                                        <OverflowMenu light flipped >
                                                            <OverflowMenuItem itemText="Edit" />
                                                        </OverflowMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                    </DataTable>
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
            </div >
        );

    }
}
export default ControlsView;
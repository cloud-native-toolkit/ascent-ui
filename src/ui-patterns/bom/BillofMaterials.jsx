import React, { Component } from "react";
import Header from "../ui-shell/Header";
import 'carbon-components/css/carbon-components.min.css';
import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
} from '@carbon/icons-react';
import {
    DataTable, TableContainer, Table, TableSelectAll, TableBatchAction, TableSelectRow,
    TableBatchActions, TableToolbar, TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction,
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';

class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);

        console.log(this.props.bomService);
        this.state = {
            data: [],
            headersData: [
                /*{
                    key: 'id',
                    header: 'Id',
                },*/
                {
                    key: 'ibm_service',
                    header: 'IBM Service',
                },
                {
                    key: 'desc',
                    header: 'Description',
                },
                {
                    key: 'deployment_method',
                    header: 'Dep Method',
                },
                {
                    key: 'compatibility',
                    header: 'Compatibility',
                },
                /*{
                    key: 'catalog_link',
                    header: 'Catalog View',
                },
                {
                    key: 'documentation',
                    header: 'Documentation',
                },
                {
                    key: 'hippa_compliance',
                    header: 'Hippa Compliance',
                },
                {
                    key: 'remarks',
                    header: 'Remarks',
                },*/
                {
                    key: 'provision',
                    header: 'Provision',
                },
                {
                    key: 'automation',
                    header: 'Automation',
                },
                {
                    key: 'hybrid_option',
                    header: 'Hybrid Option',
                },
                {
                    key: 'arch_id',
                    header: 'Arch Id',
                },
                {
                    key: 'service_id',
                    header: 'Service Id',
                },
                {
                    key: 'availibity',
                    header: 'Availibity',
                }
            ]
        };

    }
    async componentDidMount() {
        const jsonData = await this.props.bomService.doGetBOM(this.props.archId);
        const bomDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"_id\":/g, "\"id\":"));
        this.setState({
            data: bomDetails
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
        const headers = this.state.headersData;
        console.log(data);

        return (
            <div className="bx--grid">
                <Header
                    title="Bill of Materials View"
                    subtitle="Displays a model object as a form in a read only display."
                />
                <div className="bx--row">
                    <DataTable rows={data} headers={headers}>
                        {({
                            rows,
                            headers,
                            getHeaderProps,
                            getRowProps,
                            getSelectionProps,
                            getToolbarProps,
                            getBatchActionProps,
                            onInputChange,
                            selectedRows,
                            getTableProps,
                            getTableContainerProps,
                        }) => (
                                <TableContainer
                                    {...getTableContainerProps()}>
                                    <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                                        <TableBatchActions {...getBatchActionProps()}>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Delete}
                                            >
                                                Delete
                                           </TableBatchAction>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Save}
                                            >
                                                Save
                                           </TableBatchAction>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Download}
                                            >
                                                Download
                                           </TableBatchAction>
                                        </TableBatchActions>
                                        <TableToolbarContent>
                                            <TableToolbarSearch onChange={onInputChange} tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0} />
                                            <TableToolbarMenu
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}>
                                                <TableToolbarAction onClick={() => alert('Alert 1')}>
                                                    Action 1
                                               </TableToolbarAction>
                                                <TableToolbarAction onClick={() => alert('Alert 2')}>
                                                    Action 2
                                                </TableToolbarAction>
                                                <TableToolbarAction onClick={() => alert('Alert 3')}>
                                                    Action 3
                                                </TableToolbarAction>
                                            </TableToolbarMenu>
                                            <Button
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}

                                                size="small"
                                                kind="primary">
                                                Add new
                                            </Button>
                                        </TableToolbarContent>
                                    </TableToolbar>
                                    <Table {...getTableProps()}>
                                        <TableHead>
                                            <TableRow>
                                                <TableSelectAll {...getSelectionProps()} />
                                                {headers.map((header, i) => (
                                                    <TableHeader key={i} {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row, i) => (
                                                <TableRow key={i} {...getRowProps({ row })}>
                                                    <TableSelectRow {...getSelectionProps({ row })} />
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
            </div>
        );
    }
}


export default BillofMaterialsView;
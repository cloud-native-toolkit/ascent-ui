import React, { Component } from "react";
import Header from "../ui-shell/Header";
import 'carbon-components/css/carbon-components.min.css';
import { DataTable, TableContainer, Table, TableToolbar, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            headersData: [
                {
                    key: 'id',
                    header: 'Id',
                },
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
                {
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
                },
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
        const jsonData = await this.props.bomService.doGetBOM("arch01");
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
                            getTableProps,
                            getToolbarProps,
                            onInputChange,
                            getTableContainerProps,
                        }) => (
                                <TableContainer
                                    {...getTableContainerProps()}>
                                    <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                                        <TableToolbarContent>
                                            <TableToolbarSearch onChange={onInputChange} />

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
                </div>
            </div>
        );
    }
}


export default BillofMaterialsView;
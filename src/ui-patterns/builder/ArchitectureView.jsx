import React, { Component } from "react";
import Header from "../ui-shell/Header";
import 'carbon-components/css/carbon-components.min.css';
import { DataTable, TableContainer, Table, TableToolbar, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
class ArchitectureView extends Component {

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
                    key: 'name',
                    header: 'Name',
                },
                {
                    key: 'short_desc',
                    header: 'Short Description',
                },
                {
                    key: 'long_desc',
                    header: 'Long Description',
                },
                {
                    key: 'diagram_link_drawio',
                    header: 'Drawio Link',
                },
                {
                    key: 'diagram_link_png',
                    header: 'Image View',
                },
                {
                    key: 'fs_compliant',
                    header: 'FS Compliant',
                },
                {
                    key: 'partner_name',
                    header: 'Partner Name',
                },
                {
                    key: 'confidential',
                    header: 'Confidential',
                },
                {
                    key: 'production_ready',
                    header: 'Production Ready',
                }
            ]
        };

    }
    async componentDidMount() {
        this.setState({
            data: await this.props.data.getArchitectureDetails(),
            showDescription: this.props.showDescription || true
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
        const showDescription = this.state.showDescription;
        return (
            <div className="bx--grid">
                <Header
                    title="Architecture View"
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


export default ArchitectureView;
import React, { Component } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbSkeleton,
    SearchSkeleton,
    InlineNotification,
    Button,
    DataTableSkeleton, DataTable, TableContainer, Table, TableHead, TableRow,
    TableHeader, TableBody, TableCell, Pagination, Tag,
    ToastNotification, ContentSwitcher, Switch
} from 'carbon-components-react';
import {
    Link
} from "react-router-dom";
import {
    Edit16,
    Download16
} from '@carbon/icons-react';

import marked from 'marked';

import SolutionModal from "./SolutionModal";
import { solutionBomsHeader } from '../data/data';

import NotFound from "../../components/NotFound";


class SolutionDetailsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            show: false,
            showContent: "solution-details",
            notif: false,
            notifications: [],
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10,
        };
        this.loadSolution = this.loadSolution.bind(this);
        this.downloadTerraform = this.downloadTerraform.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }

    async loadSolution() {
        this.setState({ data: undefined });
        fetch(`/api/solutions/${this.props.solId}?filter=${encodeURIComponent(JSON.stringify({ include: ['architectures'] }))}`)
            .then((res) => res.json())
            .then(async (sol) => {
                if (sol.id) {
                    // Fetch README content if it exists
                    let readme = sol.files?.find(elt => elt.Key?.toLowerCase() === "readme.md");
                    if (readme) {
                        readme = await (await fetch(`/api/solutions/${this.props.solId}/files/${readme.Key}`)).text();
                    }
                    this.setState({ data: sol, totalItems: sol?.architectures?.length, readme: readme, showContent: readme ? 'solution-readme' : 'solution-details' });
                } else {
                    this.setState({ error: sol });
                }
            })
            .catch(() => this.addNotification("error", "Error", `Error loading details for solution ${this.props.solId}`))
    }

    async componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(user => {
                if (user.name) {
                    this.setState({ user: user || undefined });
                    this.loadSolution();
                } else {
                    // Redirect to login page
                    window.location.href = "/login";
                }
            })
            .catch(err => {
                this.loadSolution();
            });
    }

    getMarkdownText() {
        var rawMarkup = marked(this.state.readme, { sanitize: true });
        return { __html: rawMarkup };
    }

    downloadTerraform() {
        this.addNotification("info", "BUILDING", "Building your terraform module...");
        fetch(`/api/solutions/${this.state.data?.id}/automation`)
            .then(response => {
                if (response && response.status === 200) {
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = `${this.state.data?.name?.toLowerCase()?.replace(/[ /\\_?;.=:,+]/g,'-')}-automation.zip`;
                        a.click();
                    });
                }
                else {
                    this.addNotification("error", response.status + " " + response.statusText, "Error building your terraform module.");
                }
            });
    }

    async showModal(updateModal) {
        this.setState({
            showModal: true,
            updateModal: updateModal || false
        });
    }

    async hideModal() {
        this.setState({
            showModal: false,
            isDuplicate: false,
            updateModal: false
        });
        this.loadSolution();
    }

    /** Notifications */

    addNotification(type, message, detail) {
        this.setState(prevState => ({
            notifications: [
                ...prevState.notifications,
                {
                    message: message || "Notification",
                    detail: detail || "Notification text",
                    severity: type || "info"
                }
            ]
        }));
    }

    renderNotifications() {
        return this.state.notifications.map(notification => {
            return (
                <ToastNotification
                    title={notification.message}
                    subtitle={notification.detail}
                    kind={notification.severity}
                    timeout={10000}
                    caption={false}
                />
            );
        });
    }

    /** Notifications END */

    render() {
        const data = this.state.data;
        const diagram = data?.files?.find(elt => elt.Key?.toLowerCase() === "diagram.png");
        let notif = this.state.notif;
        return (
            this.state.error ?
                <NotFound />
                :
                <>
                    <div class='notif'>
                        {this.state.notifications.length !== 0 && this.renderNotifications()}
                    </div>
                    <div className="bx--grid">
                        {notif &&
                            <InlineNotification
                                id={Date.now()}
                                hideCloseButton lowContrast
                                title={notif.title || "Notification title"}
                                subtitle={<span kind='error' hideCloseButton lowContrast>{notif.message || "Subtitle"}</span>}
                                kind={notif.kind || "info"}
                                caption={notif.caption || "Caption"}
                            />
                        }

                        {this.state.data?.id ?
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    <Link to="/solutions">Solutions</Link>
                                </BreadcrumbItem>
                                <BreadcrumbItem href="#">{data.name || data.id}</BreadcrumbItem>
                            </Breadcrumb>
                            :
                            <BreadcrumbSkeleton />

                        }
                        <div className="bx--row">
                            <div className="bx--col-lg-12">
                                <br></br>
                                {data?.name ? <h2 style={{ display: 'flex' }}>
                                    {data?.name}
                                    <div style={{ marginLeft: 'auto' }}>

                                        <Button
                                            renderIcon={Download16}
                                            onClick={() => this.downloadTerraform()} >
                                            Automation
                                        </Button>
                                        {data?.files?.length ? <Button
                                            style={{ marginLeft: '1rem' }}
                                            renderIcon={Download16}
                                            href={`/api/solutions/${data.id}/files.zip`} >
                                            Files
                                        </Button>: <></>}
                                        {data?.id && this.state.user?.role === "admin" &&
                                            <Button
                                                style={{ marginLeft: '1rem' }}
                                                renderIcon={Edit16}
                                                onClick={() => {
                                                    this.showModal(true);
                                                }}>
                                                Edit
                                            </Button>}
                                    </div>
                                </h2> : <SearchSkeleton />}
                                <br></br>
                            </div>
                        </div>

                        {data?.id &&
                            <ContentSwitcher
                                size='xl'
                                onChange={(e) => { this.setState({ showContent: e.name }) }} >
                                {this.state.readme ? <Switch name="solution-readme" text="Documentation" /> : <></>}
                                <Switch name="solution-details" text="Details" />
                                {diagram ? <Switch name="solution-diagram" text="Diagram" /> : <></>}
                            </ContentSwitcher>
                        }

                        {this.state.showContent === "solution-details" &&
                            <>
                                {data && <div>
                                    <br />
                                    {data?.long_desc && <div>
                                        <h3>Description</h3>
                                        <p>
                                            {
                                                data.long_desc
                                            }
                                        </p>
                                    </div>}
                                    <br />
                                    {data?.architectures?.length &&
                                        <div>
                                            <h3>BOMs</h3>
                                            {!data?.architectures?.length ?
                                                <DataTableSkeleton
                                                    columnCount={solutionBomsHeader.length}
                                                    rowCount={10}
                                                    showHeader={false}
                                                    headers={null}
                                                />
                                                :
                                                <>
                                                    <DataTable rows={data?.architectures.map(arch => ({...arch, id: arch.arch_id})).slice(
                                                        this.state.firstRowIndex,
                                                        this.state.firstRowIndex + this.state.currentPageSize
                                                    )} headers={solutionBomsHeader}>
                                                        {({
                                                            rows,
                                                            headers,
                                                            getHeaderProps,
                                                            getRowProps,
                                                            getTableProps,
                                                            getTableContainerProps,
                                                        }) => (
                                                            <TableContainer
                                                                {...getTableContainerProps()}>
                                                                <Table {...getTableProps()}>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            {headers.map((header, i) => (
                                                                                <TableHeader key={i} {...getHeaderProps({ header })}>
                                                                                    {header.header}
                                                                                </TableHeader>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>

                                                                    <TableBody>
                                                                        {rows.map((row, i) => (
                                                                            <>
                                                                                <TableRow key={i} {...getRowProps({ row })} >
                                                                                    {row.cells.map((cell) => (
                                                                                        <TableCell key={cell.id} >
                                                                                            {
                                                                                                cell.info && cell.info.header === "arch_id" ?
                                                                                                    <Tag type="blue">
                                                                                                        <Link to={"/boms/" + cell.value} >
                                                                                                            {data?.architectures.find(arch => arch.arch_id === cell.value)?.name}
                                                                                                        </Link>
                                                                                                    </Tag>
                                                                                                    : cell.value
                                                                                            }
                                                                                        </TableCell>
                                                                                    ))}
                                                                                </TableRow>
                                                                            </>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        )}
                                                    </DataTable>

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
                                                        }} />
                                                </>
                                            }
                                        </div>
                                    }
                                </div>}
                            </>
                        }
                        {data?.id && this.state.readme && this.state.showContent === "solution-readme" &&
                            <div className="markdown" dangerouslySetInnerHTML={this.getMarkdownText()} />
                        }
                        {data?.id && diagram && this.state.showContent === "solution-diagram" &&
                            <img style={{ maxWidth: '100%' }}
                                src={`/api/solutions/${this.props.solId}/files/${diagram.Key}`}
                                alt={`Diagram of solution ${this.props.solId}`} />
                        }

                        {this.state.showModal &&
                            <SolutionModal
                                show={this.state.showModal}
                                handleClose={this.hideModal}
                                isUpdate={this.state.updateModal}
                                data={this.state.data}
                                toast={this.addNotification}
                                isDuplicate={this.state.isDuplicate}
                                user={this.state.user}
                            />
                        }
                    </div >
                </>
        );
    }
}
export default SolutionDetailsView;
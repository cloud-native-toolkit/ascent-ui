import React, { Component } from "react";

import {
    ProgressIndicator,
    ProgressStep,
    ToastNotification,
    Button,
    SearchSkeleton,
    ProgressIndicatorSkeleton
} from 'carbon-components-react';

import {
    ChevronRight20 as ChevronRight,
    User16 as User,
    Bot16 as Bot,
    Edit32 as Edit,
} from '@carbon/icons-react';

import OnBoardingStageModal from './OnBoardingStageModal';

import Tree from 'react-d3-tree';

import ControlDetailsPane from './ControlDetailsPane';

class OnBoardingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            showStageModal: false,
            updateStage: false,
            isPaneOpen: false,
            dataDetails: false,
            data: [],
            curControls: [],
            notifications: []
        };
        this.loadStages = this.loadStages.bind(this);
        this.setStage = this.setStage.bind(this);
        this.hideStageModal = this.hideStageModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.renderForeignObjectNode = this.renderForeignObjectNode.bind(this);
        this.decorateTree = this.decorateTree.bind(this);
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
        this.markComplete = this.markComplete.bind(this);
        this.markUncomplete = this.markUncomplete.bind(this);
    }

    async decorateTree(tree, level=0) {
        let filter = {
            include: ['controlDetails', 'nist', 'services', 'architectures']
        }
        tree.attributes = await this.props.controls.getControlsDetails(tree.id, filter);
        if (tree.attributes instanceof Error) tree.attributes = {};
        tree.attributes.expanded = level > 2;
        if (tree.children) {
            let complete = 0;
            for (let index = 0; index < tree?.children?.length; index++) {
                tree.children[index] = await this.decorateTree(tree.children[index], level+1);
                tree.children[index].parent = tree;
                if (tree.children[index].attributes.complete) complete += 1;
            }
            tree.attributes.complete = complete === tree?.children?.length;
        } else {
            tree.attributes.complete = this.state?.userOnBoarding?.find(elt => elt.control_id === tree.id && elt.status === 'complete') !== undefined;
        }
        return tree;
    }

    async setStage(ix) {
        this.setState({
            curStage: false
        });
        const curStage = JSON.parse(JSON.stringify(this.state.stages[ix]));
        curStage.content = await this.decorateTree(JSON.parse(curStage.content));
        console.log(curStage.content)
        this.setState({
            curStageIx: ix,
            curStage: curStage
        });
    }

    async loadStages() {
        this.setState({
            stages: false,
            data: false,
            curStage: false
        });
        // Get onboarding status
        let userOnBoarding = await (await fetch(`/api/user/${encodeURIComponent(this.state.user.email)}/onboarding`)).json();
        // Get stages
        let stages = await (await fetch('/api/on-boarding-stages')).json();
        stages = stages.sort((a,b) => {return a.position-b.position});
        if (stages.length) {
            const controls = await this.props.controls.getControls();
            this.setState({
                userOnBoarding: userOnBoarding,
                stages: stages,
                data: controls
            });
            this.setStage(this.state.curStageIx || 0);
        }
    }

    async componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(async user => {
                if (user.name) {
                    this.setState({
                        user: user || undefined,
                    });
                    this.loadStages();
                } else {
                    // Redirect to login page
                    window.location.href = "/login";
                }
            });
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

    async hideStageModal() {
        this.setState({
            showStageModal: false,
            updateStage: false
        });
        this.loadStages();
    }

    openPane = async (controlId, tree) => {
        if (controlId) {
            let filter = {
                include: ['nist', 'services', 'architectures']
            }
            if (this.state.user?.roles?.includes("fs-viewer")) filter = {
                include: ['controlDetails', 'nist', 'services', 'architectures']
            }
            this.setState({
                isPaneOpen: true,
                dataDetails: false
            });
            this.props.controls.getControlsDetails(controlId, filter).then((controlData) => {
                if (controlData?.controlDetails?.description) controlData.controlDetails.description = controlData.controlDetails.description.replaceAll(/\n\n([a-z]\))/gi, '\n\n**$1**');
                if (controlData?.controlDetails?.implementation) controlData.controlDetails.implementation = controlData.controlDetails.implementation.replaceAll('\n\n#### Part', '\n\n&nbsp;  \n#### Part');
                if (controlData?.controlDetails?.implementation) controlData.controlDetails.implementation = controlData.controlDetails.implementation.replaceAll('\n\n#####', '\n\n&nbsp;  \n#####');
                controlData.children = tree.children;
                controlData.parent = tree.parent;
                this.setState({
                    dataDetails: controlData
                });
            });
        }
    };

    markComplete = async (control) => {
        let newUserOnBoarding = await (await fetch(`/api/user-onboarding`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: this.state.user.email,
                control_id: control.id,
                status: 'complete'
            })
        })).json();
        if (control.children) for (let child of control.children) {
            await this.markComplete(child);
        }
        return newUserOnBoarding;
    }

    markUncomplete = async (control) => {
        let userOnBoarding = this.state?.userOnBoarding?.find(elt => elt.control_id === control.id && elt.status === 'complete');
        let delStatus = await (await fetch(`/api/user-onboarding/${userOnBoarding.id}`, { method: "DELETE" })).status;
        if (control.parent && control.parent.attributes.id) await this.markUncomplete(control.parent);
        return delStatus;
    }

    hidePane = () => {
        this.setState({
            isPaneOpen: false
        });
    };

    renderForeignObjectNode = ({
        nodeDatum,
        toggleNode,
        foreignObjectProps
    }) => (
        <g>
            <circle r={15}></circle>
            {/* `foreignObject` requires width & height to be explicitly set. */}
            <foreignObject {...foreignObjectProps}>
                <div
                    style={{
                        'border': "1px solid #dfe3e6",
                        'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
                        // 'background-color': nodeDatum?.attributes?.human_or_automated === 'Automated' ? '#CBFFCA' : '#fff',
                        'background-color': this.state?.userOnBoarding?.find(elt => elt.control_id === nodeDatum.id && elt.status === 'complete') || nodeDatum?.attributes?.complete ? '#CBFFCA' : '#fff',
                        'min-height': '4rem',
                        'stroke': 'none',
                        'stroke-width': 'unset',
                        'display': 'flex',
                    }}
                    width={128} >
                    <div style={nodeDatum?.attributes?.id ? { 'padding': '0.7rem', 'padding-right': '0'} : { 'padding': '0.7rem', 'padding-right': '0', cursor: 'default' }} onClick={nodeDatum?.attributes?.id ? () => this.openPane(nodeDatum.id, nodeDatum) : undefined}>
                        <span title={nodeDatum?.attributes?.name} className='text' style={{maxHeight: '40px'}} >{nodeDatum.id}</span>
                        {nodeDatum?.attributes?.id ? nodeDatum.attributes?.human_or_automated && nodeDatum.attributes?.human_or_automated === "Automated" ? <Bot className='text-icon' style={{ marginLeft: '5px' }} /> : <User className='text-icon' style={{ marginLeft: '5px' }} /> : <></>}
                    </div>
                    <div style={{ marginLeft: 'auto', 'padding': '1rem', 'padding-left': '0' }} onClick={toggleNode} >
                        {nodeDatum.children && <ChevronRight style={{ 'stroke': '#000', 'stroke-width': '2' }} className='text-icon' />}
                    </div>
                </div>
                {nodeDatum?.attributes?.family && <span className="bx--progress-optional" style={{margin: "0.7rem", "top": "1.2rem", "overflow": "hidden", "maxHeight": "25px", "lineHeight": "1"}}>{nodeDatum?.attributes?.family}</span>}
            </foreignObject>
        </g>
    );

    render() {
        const nodeSize = { x: 250, y: 100 };
        const foreignObjectProps = { width: 200, height: 64, x: -100, y: -32 };
        const containerStyles = {
            width: "75vw",
            height: "75vh"
        };
        return (
            <>
            <div className="bx--grid">

                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>

                <div className="bx--row">
                    <br></br>
                    <h2>
                        Controls On Boarding
                    </h2>
                </div>
                <div>
                    <div className="bx--row" style={{ display: "flex", marginTop: '1rem', marginBottom: '3rem' }}>
                        {this.state.stages ? <>
                            <ProgressIndicator
                                // vertical
                                currentIndex={this.state.curStageIx || 0}
                                onChange={(ix) => this.setStage(ix)}
                                spaceEqually>
                                {this.state.stages.map(stage => (
                                    <ProgressStep
                                        label={stage.label}
                                        description={stage.description}
                                        secondaryLabel={stage.secondary_label} />
                                ))}
                            </ProgressIndicator>
                            {this.state.user?.roles?.includes("admin") && this.state.curStage && <Button renderIcon={Edit} style={{marginLeft: 'auto', marginRight: '2rem'}} onClick={() => {
                                this.setState({
                                    showStageModal: true,
                                    updateStage: true
                                });
                            }}>Edit Stage</Button>}
                        </> : <ProgressIndicatorSkeleton />}
                        
                    </div>
                    <div style={containerStyles} id='test-elt'>
                        {this.state.curStage ? <Tree
                            data={this.state.curStage.content}
                            translate={{ x: 100, y: document.getElementById('test-elt')?.getBoundingClientRect().height / 2 || 200 }}
                            nodeSize={nodeSize}
                            pathFunc="step"
                            initialDepth={1}
                            renderCustomNodeElement={(rd3tProps) =>
                                this.renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
                            }
                        />: <SearchSkeleton />}
                    </div>
                    <div>
                        <ControlDetailsPane
                            data={this.state.dataDetails}
                            open={this.state.isPaneOpen}
                            onRequestClose={this.hidePane}
                            buttonTitle={this.state?.userOnBoarding?.find(elt => elt.control_id === this.state.dataDetails.id && elt.status === 'complete') ? "Mark uncomplete" : "Mark complete"}
                            handleButtonClick={!this.state?.userOnBoarding?.find(elt => elt.control_id === this.state.dataDetails.id && elt.status === 'complete') ? async () => {
                                let newUserOnBoarding = await this.markComplete(this.state.dataDetails);
                                if (newUserOnBoarding?.error) {
                                    this.addNotification("error", "Error", newUserOnBoarding.error.message);
                                } else {
                                    this.addNotification("success", "Success", `Control '${newUserOnBoarding.control_id}' successfully marked complete!`);
                                }
                                this.hidePane();
                                this.loadStages();
                            }: async () => {
                                let userOnBoarding = this.state?.userOnBoarding?.find(elt => elt.control_id === this.state.dataDetails.id && elt.status === 'complete');
                                let delStatus = await this.markUncomplete(this.state.dataDetails);
                                if (delStatus !== 204) {
                                    this.addNotification("error", "Error", `Error marking control ${userOnBoarding.control_id} uncomplete, got status ${delStatus}`);
                                } else {
                                    this.addNotification("success", "Success", `Control '${userOnBoarding.control_id}' successfully marked uncomplete!`);
                                }
                                this.hidePane();
                                this.loadStages();
                            }} />
                    </div>
                </div>

                
                
            </div >
            {this.state.showStageModal && 
                <OnBoardingStageModal
                    show={this.state.showStageModal}
                    handleClose={() => this.setState({
                        showStageModal: false,
                        updateStage: false
                    })}
                    closeAndReload={this.hideStageModal}
                    isUpdate={this.state.updateStage}
                    data={this.state.stages[this.state.curStageIx]}
                    toast={this.addNotification}
                />
            }
            </>
        );
    }
}
export default OnBoardingView;
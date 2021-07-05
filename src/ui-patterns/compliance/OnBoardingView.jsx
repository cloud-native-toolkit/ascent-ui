import React, { Component } from "react";

import {
    ProgressIndicator,
    ProgressStep,
    ClickableTile,
    Button,
    BreadcrumbSkeleton,
    SearchSkeleton
} from 'carbon-components-react';

import {
    ChevronRight20 as ChevronRight,
    User16 as User,
    Bot16 as Bot
} from '@carbon/icons-react';

import Tree from 'react-d3-tree';

import ControlDetailsPane from './ControlDetailsPane';

class OnBoardingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            isPaneOpen: false,
            dataDetails: false,
            data: [],
            curControls: []
        };
        this.renderForeignObjectNode = this.renderForeignObjectNode.bind(this);
        this.decorateTree = this.decorateTree.bind(this);
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
    }

    async decorateTree(tree) {
        let filter = {
            include: ['controlDetails', 'nist', 'services', 'architectures']
        }
        tree.attributes = await this.props.controls.getControlsDetails(tree.id, filter);
        for (let index = 0; index < tree?.children?.length; index++) {
            tree.children[index] = await this.decorateTree(tree.children[index]);
        }
        return tree;
    }

    async componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(async user => {
                let stages = await (await fetch('/api/on-boarding-stages')).json();
                stages = stages.sort((a,b) => {return a.position-b.position});
                const controls = await this.props.controls.getControls();
                // Put control attribute for each control in stage
                for (let index = 0; index < stages.length; index++) {
                    const stage = stages[index];
                    stage.content = await this.decorateTree(JSON.parse(stage.content));
                }
                this.setState({
                    user: user || undefined,
                    stages: stages,
                    curStage: stages[0],
                    data: controls
                });
            });
    }

    openPane = async (controlId) => {
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
                this.setState({
                    dataDetails: controlData
                });
            });
        }
    };

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
                        'background-color': nodeDatum?.attributes?.human_or_automated === 'Automated' ? '#CBFFCA' : '#fff',
                        'min-height': '4rem',
                        'stroke': 'none',
                        'stroke-width': 'unset',
                        'display': 'flex',
                    }}
                    width={128} >
                        {console.log(nodeDatum)}
                    <div style={{ 'padding': '1rem', 'padding-right': '0' }} onClick={() => this.openPane(nodeDatum.id)}>
                        <span title={nodeDatum?.attributes?.name} className='text' >{nodeDatum.id}</span>
                        {nodeDatum?.attributes?.human_or_automated && nodeDatum?.attributes?.human_or_automated === "Automated" ? <Bot className='text-icon' style={{ marginLeft: '5px' }} /> : <User className='text-icon' style={{ marginLeft: '5px' }} />}
                    </div>
                    <div style={{ marginLeft: 'auto', 'padding': '1rem', 'padding-left': '0' }} onClick={toggleNode} >
                        {nodeDatum.children && <ChevronRight style={{ 'stroke': '#000', 'stroke-width': '2' }} className='text-icon' />}
                    </div>
                    {/* {nodeDatum?.attributes?.family && <span style={{'font-size': '0.75rem', 'font-weight': '400', 'color': '#525252'}}>{nodeDatum?.attributes?.family}</span>} */}
                </div>
                {nodeDatum?.attributes?.family && <span className="bx--progress-optional" style={{margin: "1rem", "top": "1.3rem"}}>{nodeDatum?.attributes?.family}</span>}
            </foreignObject>
        </g>
    );

    render() {
        const nodeSize = { x: 175, y: 100 };
        const foreignObjectProps = { width: 150, height: 64, x: -75, y: -32 };
        const containerStyles = {
            width: "75vw",
            height: "75vh"
        };
        return (
            <div className="bx--grid">
                <div className="bx--row">
                    <br></br>
                    <h2>
                        Controls On Boarding
                    </h2>
                </div>
                {this.state.stages ? <div>
                    <div className="bx--row" style={{ marginTop: '1rem', marginBottom: '3rem' }}>
                        <ProgressIndicator
                            // vertical
                            currentIndex={this.state.curStage.position}
                            onChange={(ix) => this.setState({curStage: this.state.stages.find(stage => {return stage.position === ix})})}
                            spaceEqually>
                            {this.state.stages.map(stage => (
                                <ProgressStep
                                    label={stage.label}
                                    description={stage.description}
                                    secondaryLabel={stage.secondary_label} />
                            ))}
                        </ProgressIndicator>
                    </div>
                    <div style={containerStyles} id='test-elt'>
                        <Tree
                            data={this.state.curStage.content}
                            translate={{ x: 100, y: document.getElementById('test-elt')?.getBoundingClientRect().height / 2 || 200 }}
                            nodeSize={nodeSize}
                            pathFunc="step"
                            renderCustomNodeElement={(rd3tProps) =>
                                this.renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
                            }
                        />
                    </div>
                    <div>
                        <ControlDetailsPane
                            data={this.state.dataDetails}
                            open={this.state.isPaneOpen}
                            onRequestClose={this.hidePane} />
                    </div>
                </div>
                : 
                    <div style={{marginTop: '1rem'}}>
                        <BreadcrumbSkeleton />
                        <SearchSkeleton />
                    </div>
                }
                
            </div >
        );
    }
}
export default OnBoardingView;
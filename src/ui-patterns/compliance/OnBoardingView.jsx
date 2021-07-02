import React, { Component } from "react";

import {
    ProgressIndicator,
    ProgressStep,
    ClickableTile,
    Button
} from 'carbon-components-react';

import {
    ChevronRight20 as ChevronRight,
    User16 as User,
    Bot16 as Bot
} from '@carbon/icons-react';

import Tree from 'react-d3-tree';

import ControlDetailsPane from './ControlDetailsPane';

const orgChart = {
    id: 'AC-14',
    attributes: {
        human_or_automated: 'Human',
    },
    children: [
      {
        id: 'AC-17 (9)',
        attributes: {
            human_or_automated: 'Human',
        },
        children: [
          {
            id: 'AC-19 (5)',
            attributes: {
                human_or_automated: 'Automated',
            },
            children: [
              {
                id: 'AC-20',
                attributes: {
                    human_or_automated: 'Human',
                },
              },
            ],
          },
          {
            id: 'AC-21',
            attributes: {
                human_or_automated: 'Automated',
            },
            children: [
              {
                id: 'AC-5',
                attributes: {
                    human_or_automated: 'Human',
                },
              },
            ],
          },
        ],
      },
    ],
  };

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
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
    }

    async componentDidMount() {
        fetch('/userDetails')
            .then(res => res.json())
            .then(async user => {
                const jsonData = await this.props.controls.getControls();
                this.setState({
                    user: user || undefined,
                    data: jsonData
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
                    <div style={{'padding': '1rem', 'padding-right': '0'}} onClick={() => this.openPane(nodeDatum.id)}>
                        <span className='text'>{nodeDatum.id}</span>
                        {nodeDatum?.attributes?.human_or_automated && nodeDatum?.attributes?.human_or_automated === "Human" ? <User className='text-icon' style={{marginLeft: '5px'}} /> : <Bot className='text-icon' style={{marginLeft: '5px'}} /> }
                    </div>
                    <div style={{marginLeft: 'auto', 'padding': '1rem', 'padding-left': '0'}} onClick={toggleNode} >
                        {nodeDatum.children && <ChevronRight style={{'stroke': '#000', 'stroke-width': '2'}} className='text-icon'/>}
                    </div>
                </div>
          </foreignObject>
        </g>
      );

    render() {
        const nodeSize = { x: 175, y: 100 };
        const foreignObjectProps = { width: 150, height: 64, x: -75, y: -32 };   
        const containerStyles = {
            width: "75vw",
            height: "600px"
          };   
        return (
            <div className="bx--grid">
                <div className="bx--row">
                    <br></br>
                    <h2>
                        Controls On Boarding
                    </h2>
                </div>
                <div className="bx--row" style={{ marginTop: '1rem', marginBottom: '3rem' }}>
                    <ProgressIndicator
                        // vertical
                        // currentIndex={number('Current progress (currentIndex)', 1)}
                        spaceEqually>
                        <ProgressStep
                            label="Project Setup"
                            description="Step 1: Getting started with Carbon Design System"
                            secondaryLabel="Initial setup"
                        />
                        <ProgressStep
                            label="Stage 2"
                            description="Step 2: Getting started with Carbon Design System"
                            secondaryLabel="Optional label"
                        />
                        <ProgressStep
                            label="Stage 3"
                            description="Step 3: Getting started with Carbon Design System"
                            secondaryLabel="Optional label"
                        />
                        <ProgressStep
                            label="Stage 4"
                            description="Step 4: Getting started with Carbon Design System"
                            secondaryLabel="Optional label"
                        />
                        <ProgressStep
                            label="Stage 5"
                            description="Step 5: Getting started with Carbon Design System"
                            secondaryLabel="Optional label"
                        />
                    </ProgressIndicator>
                </div>
                {/* <div className="bx--row">

                    {this.state.curControls && this.state.curControls.map((control) => (
                        <ClickableTile
                            id={`control-tile-${control.id.toLowerCase().replaceAll(' ', '-').replace(/[() ]/gi, '')}`}
                            style={{ marginLeft: '2rem' }}
                            handleClick={() => this.openPane(control.id)}>
                            {control.id}
                        </ClickableTile>
                    ))}

                </div> */}

                <div style={containerStyles} id='test-elt'>
                    <Tree
                        data={orgChart}
                        translate={{ x: 100, y: document.getElementById('test-elt')?.getBoundingClientRect().height / 2 }}
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
            </div >
        );
    }
}
export default OnBoardingView;
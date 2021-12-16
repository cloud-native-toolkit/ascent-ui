import React, { Component } from "react";
import {
    UnorderedList, ListItem, Tag, Accordion, AccordionItem, Tooltip
} from 'carbon-components-react';
import {
    Link
} from "react-router-dom";
import ReactMarkdown from 'react-markdown';

import {
    controlTypeTooltip, controlRiskRatingTooltip, controlResp, infoTooltips
} from '../data/data';

class ControlDetails extends Component {

    render() {
        const data = this.props.data;
        return (
            <div>
                {data.id &&
                    <>
                        <br />
                        <h3>Overview</h3>
                        <br />
                        <UnorderedList nested>
                            {data.controlDetails?.focus_area && <ListItem style={{ fontSize: '1rem' }}><strong>Focus Area{infoTooltips.focus_area}: </strong>{data.controlDetails?.focus_area}</ListItem>}
                            {data.controlDetails?.family && <ListItem style={{ fontSize: '1rem' }}><strong>Family{infoTooltips.family}: </strong>{data.controlDetails?.family}</ListItem>}
                            {data.controlDetails?.objective && <ListItem style={{ fontSize: '1rem' }}><strong>Objective{infoTooltips.objective}: </strong>{data.controlDetails?.objective}</ListItem>}
                            {data.controlDetails?.risk_desc && <ListItem style={{ fontSize: '1rem' }}><strong>Risk{infoTooltips.risk_desc}: </strong>{data.controlDetails?.risk_desc}</ListItem>}
                            {/* {data.controlDetails?.nist_functions && <ListItem style={{ fontSize: '1rem' }}><strong>NIST Cybersecurity Functions{infoTooltips.nist_functions}: </strong>{data.controlDetails?.nist_functions}</ListItem>} */}
                        </UnorderedList>
                        <br />
                        <h3>Requirements</h3>
                        <br />
                        <div>
                            <Accordion>
                                {data.controlDetails?.requirements?.map(req => (
                                    <AccordionItem title={
                                        <div>
                                            {req.id}
                                            {controlTypeTooltip[req?.control_type_1]}
                                            {controlTypeTooltip[req?.control_type_2]}
                                            {controlTypeTooltip[req?.control_type_3]}
                                            {req?.scc === 'Y' && <Tooltip triggerText='SCC'>One or more Goals in <a href="https://www.ibm.com/cloud/security-and-compliance-center" target="_blank">IBM Cloud Security and Compliance Center</a> provide evidence for this control requirement.</Tooltip>}
                                        </div>}>
                                            <p>{req?.description}</p>
                                            <UnorderedList nested>
                                                {req?.risk_rating && <ListItem><strong>Risk Rating: </strong>{req?.risk_rating} {controlRiskRatingTooltip[req?.risk_rating]}</ListItem>}
                                                {req?.ibm_public_cloud_scope && <ListItem><strong>IBM Public Cloud Scope{infoTooltips.ibm_public_cloud_scope}: </strong>{req?.ibm_public_cloud_scope} {controlRiskRatingTooltip[req?.ibm_public_cloud_scope]}</ListItem>}
                                                {req?.ibm_public_cloud_resp && <ListItem><strong>IBM Public Cloud Responsibility{infoTooltips.ibm_public_cloud_resp}: </strong>{controlResp.filter((elt) => req?.ibm_public_cloud_resp?.includes(elt.val)).map(item => item.label).join(', ')} {controlRiskRatingTooltip[req?.ibm_public_cloud_resp]}</ListItem>}
                                                {req?.developer_scope && <ListItem><strong>Developer Scope{infoTooltips.developer_scope}: </strong>{req?.developer_scope} {controlRiskRatingTooltip[req?.developer_scope]}</ListItem>}
                                                {req?.developer_resp && <ListItem><strong>Developer Responsibility{infoTooltips.developer_resp}: </strong>{controlResp.filter((elt) => req?.developer_resp?.includes(elt.val)).map(item => item.label).join(', ')} {controlRiskRatingTooltip[req?.developer_resp]}</ListItem>}
                                                {req?.operator_scope && <ListItem><strong>Operator Scope{infoTooltips.operator_scope}: </strong>{req?.operator_scope} {controlRiskRatingTooltip[req?.operator_scope]}</ListItem>}
                                                {req?.operator_resp && <ListItem><strong>Operator Responsibility{infoTooltips.operator_resp}: </strong>{controlResp.filter((elt) => req?.operator_resp?.includes(elt.val)).map(item => item.label).join(', ')} {controlRiskRatingTooltip[req?.operator_resp]}</ListItem>}
                                                {req?.consumer_scope && <ListItem><strong>Consumer Scope{infoTooltips.consumer_scope}: </strong>{req?.consumer_scope} {controlRiskRatingTooltip[req?.consumer_scope]}</ListItem>}
                                                {req?.consumer_resp && <ListItem><strong>Consumer Responsibility{infoTooltips.consumer_resp}: </strong>{controlResp.filter((elt) => req?.consumer_resp?.includes(elt.val)).map(item => item.label).join(', ')} {controlRiskRatingTooltip[req?.consumer_resp]}</ListItem>}
                                            </UnorderedList>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                        {data.controlDetails?.fs_guidance && data.controlDetails?.fs_guidance !== 'None' &&
                            <>
                                <h4>FS Guidance</h4>
                                <p>{data.controlDetails?.fs_guidance}</p>
                            </>
                        }
                        {data.controlDetails?.fs_params && data.controlDetails?.fs_params !== 'None' &&
                            <>
                                <br />
                                <h4>FS Parameters</h4>
                                <p>{data.controlDetails?.fs_params}</p>
                            </>
                        }
                        {data.parent_control && <>
                            <br />
                            <p>Parent control: <Tag type="blue">
                                <Link to={"/controls/" + data.parent_control.toLowerCase().replace(' ', '_')} >
                                    {data.parent_control}
                                </Link>
                            </Tag></p>
                        </>}
                        {data?.controlDetails?.implementation && <>
                            <br />
                            <h3>Solution and Implementation</h3>
                            <br />
                            <ReactMarkdown>{data?.controlDetails?.implementation}</ReactMarkdown>
                            <br />
                        </>}
                    </>
                }
            </div>
        )
    }
}
export default ControlDetails;
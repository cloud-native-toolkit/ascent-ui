import React from "react";
import {
    Tooltip,
    UnorderedList,
    ListItem
} from 'carbon-components-react';

export const catalogFilters = {
    categoryValues: [
        { text: 'All categories', value: '' },
        { text: 'AI/ML', value: 'ai-ml' },
        { text: 'Cluster', value: 'cluster' },
        { text: 'Databases', value: 'databases' },
        { text: 'Dev Tools', value: 'dev-tool' },
        { text: 'GitOps', value: 'gitops' },
        { text: 'IAM', value: 'iam' },
        { text: 'Image Registry', value: 'image-registry' },
        { text: 'Software Infrastructure', value: 'infrastructure' },
        { text: 'Middleware', value: 'middleware' },
        { text: 'Network', value: 'network' },
        { text: 'Source Control', value: 'source-control' },
        { text: 'SRE tools', value: 'sre' },
        { text: 'Storage', value: 'storage' },
        { text: 'multiple', value: 'util' }
    ],
    cloudProviderValues: [
        { text: 'All providers', value: '' },
        { text: 'IBM', value: 'ibm' },
        { text: 'AWS', value: 'aws' },
        { text: 'Azure', value: 'azure' }
    ],
    moduleTypeValues: [
        { text: 'All types', value: '' },
        { text: 'Terraform', value: 'terraform' },
        { text: 'GitOps', value: 'gitops' }
    ],
    statusValues: [
        { text: 'All statuses', value: '' },
        { text: 'Released', value: 'released' },
        { text: 'Beta', value: 'beta' },
        //{ text: 'Pending', value: 'pending' }
    ],
    softwareProviderValues: [
        { text: 'All providers', value: '' },
        { text: 'IBM Cloud Pak', value: 'ibm-cp' }
    ]
}

export const serviceHeader = [
    {
        key: 'service',
        header: 'Service',
    },
    {
        key: 'name',
        header: 'Name',
    },
    {
        key: 'group',
        header: 'Group',
    },
    {
        key: 'type',
        header: 'type',
    },
    {
        key: 'provider',
        header: 'Provider',
    },
    {
        key: 'fs_validated',
        header: 'FS Validated',
    },
];

export const bomHeader = [

    {
        key: 'ibm_service',
        header: 'IBM Service',
    },
    {
        key: 'description',
        header: 'Description',
    },
    {
        key: 'group',
        header: 'Group',
    },
    {
        key: 'type',
        header: 'Type',
    },
    {
        key: 'provider',
        header: 'Provider',
    },
    {
        key: 'fs_validated',
        header: 'FS Validated',
    },
    // {
    //     key: 'desc',
    //     header: 'Description',
    // },
    // {
    //     key: 'grouping',
    //     header: 'Grouping',
    // },
    // {
    //     key: 'deployment_method',
    //     header: 'Deployment Method',
    // },
    // {
    //     key: 'provision',
    //     header: 'Provision',
    // },
    // {
    //     key: 'fs_validated',
    //     header: 'FS Validated',
    // },
    // {
    //     key: 'automation_id',
    //     header: 'Automation ID',
    // },
    // {
    //     key: 'deployment_method',
    //     header: 'Dep Method',
    // },
    // {
    //     key: 'compatibility',
    //     header: 'Compatibility',
    // },
    // {
    //     key: 'provision',
    //     header: 'Provision',
    // },
    // {
    //     key: 'automation',
    //     header: 'Automation',
    // },
    // {
    //     key: 'hybrid_option',
    //     header: 'Hybrid Option',
    // },
    // {
    //     key: 'arch_id',
    //     header: 'Arch Id',
    // },
    // {
    //     key: 'availibity',
    //     header: 'Availibity',
    // }
];

export const ctrlsHeaders = [{
    key: 'id',
    header: 'Control ID',
},
{
    key: 'focus_area',
    header: 'Focus Area',
},
{
    key: 'family',
    header: 'Control Family',
},
{
    key: 'name',
    header: 'Control Name',
},
{
    key: 'parent_control',
    header: 'Parent Control',
},
    // {
    //     key: 'existing_scc_goals',
    //     header: 'Existing SCC Goals',
    // },
    // {
    //     key: 'human_or_automated',
    //     header: 'Human / Automated',
    // },
    // {
    //     key: 'frequency',
    //     header: 'Frequency',
    // },
    // {
    //     key: 'org_defined_parameter',
    //     header: 'Org. Defined Parameters',
    // },
    // {
    //     key: 'create_document',
    //     header: 'Require document',
    // }
];

/////////////////////////////////////////////
// Controls Filters
/////////////////////////////////////////////

export const controlFocusAreas = [
    {
        attr: 'focus_area',
        label: '#1 - Focused Risk Management & Compliance',
        val: '#1 - Focused Risk Management & Compliance​\r\n\r\n​'
    },
    {
        attr: 'focus_area',
        label: '#2 - Advanced Data Protection',
        val: '#2 - Advanced Data Protection'
    },
    {
        attr: 'focus_area',
        label: '#3 - Enhanced Authentication & Access Management',
        val: '#3 - Enhanced Authentication & Access Management'
    },
    {
        attr: 'focus_area',
        label: '#4 - Automated Application &  Workload Protection',
        val: '#4 - Automated Application &  Workload Protection'
    },
    {
        attr: 'focus_area',
        label: '#5 - Unified Infrastructure Security  & Resilience',
        val: '#5 - Unified Infrastructure Security  & Resilience'
    },
    {
        attr: 'focus_area',
        label: '#6 - Operational Excellence',
        val: '#6 - Operational Excellence'
    },
    {
        attr: 'focus_area',
        label: '#7 - Active Monitoring & Response',
        val: '#7 - Active Monitoring & Response'
    },
]

export const controlFamilies = [
    {
        attr: 'family',
        label: 'Access Control (AC)',
        val: 'Access Control (AC)'
    },
    {
        attr: 'family',
        label: 'Audit & Accountability (AU)',
        val: 'Audit & Accountability (AU)'
    },
    {
        attr: 'family',
        label: 'Awareness & Training (AT)​',
        val: 'Awareness & Training (AT)​'
    },
    {
        attr: 'family',
        label: 'Configuration Management (CM)',
        val: 'Configuration Management (CM)'
    },
    {
        attr: 'family',
        label: 'Contingency Planning (CP)',
        val: 'Contingency Planning (CP)'
    },
    {
        attr: 'family',
        label: 'Enterprise Data Management (EDM)',
        val: 'Enterprise Data Management (EDM)'
    },
    {
        attr: 'family',
        label: 'Enterprise System & Services Acquisition (ESA)​',
        val: 'Enterprise System & Services Acquisition (ESA)​'
    },
    {
        attr: 'family',
        label: 'Identification & Authentication (IA)',
        val: 'Identification & Authentication (IA)'
    },
    {
        attr: 'family',
        label: 'Incident Response (IR)',
        val: 'Incident Response (IR)'
    },
    {
        attr: 'family',
        label: 'Information Security Program Management (PM)',
        val: 'Information Security Program Management (PM)'
    },
    {
        attr: 'family',
        label: 'Maintenance (MA)',
        val: 'Maintenance (MA)'
    },
    {
        attr: 'family',
        label: 'Media Protection (MP)',
        val: 'Media Protection (MP)'
    },
    {
        attr: 'family',
        label: 'Personnel Security (PS)',
        val: 'Personnel Security (PS)'
    },
    {
        attr: 'family',
        label: 'Physical and Environmental Protection (PE)',
        val: 'Physical and Environmental Protection (PE)'
    },
    {
        attr: 'family',
        label: 'Privacy (AR/UL)',
        val: 'Privacy (AR/UL)'
    },
    {
        attr: 'family',
        label: 'Risk Assessments (RA)​',
        val: 'Risk Assessments (RA)​'
    },
    {
        attr: 'family',
        label: 'Security Assessment & Authorization (CA)',
        val: 'Security Assessment & Authorization (CA)'
    },
    {
        attr: 'family',
        label: 'Security Planning (PL)',
        val: 'Security Planning (PL)'
    },
    {
        attr: 'family',
        label: 'System & Communication Protection (SC)',
        val: 'System & Communication Protection (SC)'
    },
    {
        attr: 'family',
        label: 'System & Service Acquisition (SA)',
        val: 'System & Service Acquisition (SA)'
    },
    {
        attr: 'family',
        label: 'System and Information Integrity (SI)',
        val: 'System and Information Integrity (SI)'
    },
]

export const nistFunctions = [
    {
        attr: 'nist_functions',
        label: 'Detect',
        val: 'DETECT (DE)*'
    },
    {
        attr: 'nist_functions',
        label: 'Identify',
        val: 'IDENTIFY (ID)*'
    },
    {
        attr: 'nist_functions',
        label: 'Protect',
        val: 'PROTECT (PR)*'
    },
    {
        attr: 'nist_functions',
        label: 'Respond',
        val: 'RESPOND (RS)*'
    },
    {
        attr: 'nist_functions',
        label: 'Recover',
        val: 'RECOVER (RC)*'
    },
    {
        attr: 'nist_functions',
        label: 'Enable (IBM)',
        val: 'Enable (IBM Function)**'
    },
]

export const controlRiskRating = [
    {
        attr: 'risk_rating',
        label: 'Low',
        val: 'Low'
    },
    {
        attr: 'risk_rating',
        label: 'Medium',
        val: 'Medium'
    },
    {
        attr: 'risk_rating',
        label: 'High',
        val: 'High'
    },
]

export const controlType1 = [
    {
        attr: 'control_type_1',
        label: 'Detective',
        val: 'Detective'
    },
    {
        attr: 'control_type_1',
        label: 'Preventative',
        val: 'Preventative'
    },
    {
        attr: 'control_type_1',
        label: 'Corrective',
        val: 'Corrective'
    },
    {
        attr: 'control_type_1',
        label: 'Preventative or Detective',
        val: 'Preventative or Detective'
    },
    {
        attr: 'control_type_1',
        label: 'Detective or Corrective',
        val: 'Detective or Corrective'
    },
    {
        attr: 'control_type_1',
        label: 'Preventative or Corrective',
        val: 'Preventative or Corrective'
    },
]

export const controlType2 = [
    {
        attr: 'control_type_2',
        label: 'Administrative',
        val: 'Administrative'
    },
    {
        attr: 'control_type_2',
        label: 'Physical',
        val: 'Physical'
    },
    {
        attr: 'control_type_2',
        label: 'Technical',
        val: 'Technical'
    },
    {
        attr: 'control_type_2',
        label: 'Administrative or Technical',
        val: 'Administrative or Technical'
    },
    {
        attr: 'control_type_2',
        label: 'Physical or Technical',
        val: 'Physical or Technical'
    },
]

export const controlType3 = [
    {
        attr: 'control_type_3',
        label: 'Automated',
        val: 'Automated'
    },
    {
        attr: 'control_type_3',
        label: 'Automated or Manual, Prospectively Automated',
        val: 'Automated or \r\nManual, Prospectively Automated'
    },
    {
        attr: 'control_type_3',
        label: 'Manual, Improbably Automated',
        val: 'Manual, Improbably Automated'
    },
    {
        attr: 'control_type_3',
        label: 'Manual, Prospectively Automated',
        val: 'Manual, Prospectively Automated'
    },
]

export const controlIbmResp = [
    {
        attr: 'ibm_public_cloud_resp',
        label: 'Responsible',
        val: 'R'
    },
    {
        attr: 'ibm_public_cloud_resp',
        label: 'None',
        val: 'None'
    },
]

export const controlDevResp = [
    {
        attr: 'developer_resp',
        label: 'Responsible',
        val: 'R'
    },
    {
        attr: 'developer_resp',
        label: 'None',
        val: 'None'
    },
]

export const controlOperatorResp = [
    {
        attr: 'operator_resp',
        label: 'Responsible',
        val: 'R'
    },
    {
        attr: 'operator_resp',
        label: 'None',
        val: 'None'
    },
]

export const controlConsumerResp = [
    {
        attr: 'consumer_resp',
        label: 'Responsible',
        val: 'R'
    },
    {
        attr: 'consumer_resp',
        label: 'Consulted',
        val: 'C'
    },
    {
        attr: 'consumer_resp',
        label: 'Informed',
        val: 'I'
    },
    {
        attr: 'consumer_resp',
        label: 'None',
        val: 'None'
    },
]

export const controlResp = [
    {
        label: 'Informed',
        val: 'I'
    },
    {
        label: 'Responsible',
        val: 'R'
    },
    {
        label: 'Consulted',
        val: 'C'
    },
    {
        label: 'None',
        val: 'None'
    },
    {
        label: 'Accountable',
        val: 'A'
    },
]

export const controlTypeTooltip = {
    Preventative: <Tooltip triggerText='Preventative'>
        <p><strong>Preventative: </strong>Designed to avoid an unintended event or result at the time of initial occurrence (e.g., upon initially granting access).</p>
    </Tooltip>,
    Detective: <Tooltip triggerText='Detective'>
        <p><strong>Detective: </strong>Designed to detect an unintended event or result after the initial processing has occurred, but before the ultimate objective has concluded (e.g., access is granted).</p>
    </Tooltip>,
    Corrective: <Tooltip triggerText='Corrective'>
        <p><strong>Corrective: </strong>Designed to correct an unintended event or result after the initial processing has occurred, but before the ultimate objective has concluded (e.g., access is granted).</p>
    </Tooltip>,
    Administrative: <Tooltip triggerText='Administrative'>
        <p><strong>Administrative: </strong>Controls that test policies, procedures, or guidelines that define personnel or business practices in accordance with the organization's security goals.</p>
    </Tooltip>,
    Technical: <Tooltip triggerText='Technical'>
        <p><strong>Technical: </strong>Controls that use technology as a basis for controlling the access and usage of sensitive data throughout a physical structure and over a network.</p>
    </Tooltip>,
    Physical: <Tooltip triggerText='Physical'>
        <p><strong>Physical: </strong>Controls that describe anything tangible that’s used to prevent or detect unauthorized access to physical areas, systems, or assets.</p>
    </Tooltip>,
    Automated: <Tooltip triggerText='Automated'>
        <p><strong>Automated: </strong>Controls wholly performed through technology.</p>
    </Tooltip>,
    'Manual, Improbably Automated': <Tooltip triggerText='Manual, Improbably Automated'>
        <p><strong>Manual, Improbably Automated: </strong>Controls performed manually and having a low possibility of automation.</p>
    </Tooltip>,
    'Manual, Prospectively Automated': <Tooltip triggerText='Manual, Prospectively Automated'>
        <p><strong>Manual, Prospectively Automated: </strong>Controls performed manually, but having a high possibility of automation.</p>
    </Tooltip>
}

export const controlRiskRatingTooltip = {
    Low: <Tooltip>
        <strong>Low: </strong>
        <UnorderedList nested>
            <ListItem>High level of precision (e.g. includes end users vs. overall groups, includes all types of relevant data/users, etc.)</ListItem>
            <ListItem>No judgement required (e.g. control is automated; control does not require specific SMEs to operate, etc.)</ListItem>
            <ListItem>Low volume of data / simple data (e.g. a limited number of admin users, rare changes made to the environment, etc.)</ListItem>
            <ListItem>Low likelihood of changes impacting control design (e.g. non-critical policy and procedures updates, etc.)</ListItem>
            <ListItem>Repetitive controls (e.g. same risk is covered by multiple controls)</ListItem>
        </UnorderedList>
    </Tooltip>,
    Medium: <Tooltip>
        <strong>Medium: </strong>
        <UnorderedList nested>
            <ListItem>Moderate level of precision (e.g. includes all end users vs. overall groups, includes all types of relevant data/users, etc.)</ListItem>
            <ListItem>Limited judgement required (e.g. control is partially automated, requires some SME time to operate, etc.)</ListItem>
            <ListItem>Moderate volume of data (e.g. occasional maintenance changes made to the environment, new user access for large systems, etc.)</ListItem>
            <ListItem>Moderate likelihood of changes impacting control design (e.g. changes made expectations noted in the critical policy, changes made to groups of users reviewed during the access review, etc.)</ListItem>
            <ListItem>Controls executed periodically, but with manual input (e.g. user access review where access is to be modified manually, etc.)</ListItem>
        </UnorderedList>
    </Tooltip>,
    High: <Tooltip>
        <strong>High: </strong>
        <UnorderedList nested>
            <ListItem>Low level of precision (e.g. includes overall groups instead of end users, includes sampled or undefined types of relevant data/users, etc.)</ListItem>
            <ListItem>Non-routine (e.g. highly unique control, etc.)</ListItem>
            <ListItem>Significant degree of judgement required (e.g. operated only by highly skilled SMEs)</ListItem>
            <ListItem>High likelihood of changes impacting control design (e.g. changes to groups of access that are considered "privileged", etc.)</ListItem>
            <ListItem>Controls operating on an ad hoc basis (e.g. controls where an event has to happen first, etc.)</ListItem>
        </UnorderedList>
    </Tooltip>,
}

export const infoTooltips = {
    focus_area: <Tooltip>The IBM Cloud Framework for Financial Services was built by the industry for the industry. The Framework identifies seven primary focus areas built on cloud best practices, initially based upon NIST-800-53 as well as feedback from leading industry partners. These focus areas provide a roadmap to design and implement controls that meet the unique requirements of the Financial Services industry.</Tooltip>,
    family: <Tooltip>The grouping of the controls in the broad areas in which the controls fall.</Tooltip>,
    nist_functions: <Tooltip>The core Functions of the NIST Cybersecurity Framework when performed concurrently and continuously form an operational culture that addresses the dynamic cybersecurity risk. The functions are categorized as follows:
        <UnorderedList nested>
            <ListItem>Identify (ID)* - The Identify Function assists in developing an organizational understanding to managing cybersecurity risk to systems, people, assets, data, and capabilities.</ListItem>
            <ListItem>Protect (PR)*  - The Protect Function outlines appropriate safeguards to ensure delivery of critical infrastructure services. The Protect Function supports the ability to limit or contain the impact of a potential cybersecurity event.</ListItem>
            <ListItem>Detect (DE)* - The Detect Function defines the appropriate activities to identify the occurrence of a cybersecurity event. The Detect Function enables timely discovery of cybersecurity events.</ListItem>
            <ListItem>Respond (RS)* - The Respond Function includes appropriate activities to take action regarding a detected cybersecurity incident. The Respond Function supports the ability to contain the impact of a potential cybersecurity incident.</ListItem>
            <ListItem>Recover (RC)* - The Recover Function identifies appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident. The Recover Function supports timely recovery to normal operations to reduce the impact from a cybersecurity incident.</ListItem>
            <ListItem>Enable (IBM Function)** - The Enable function allows IBM to cater specifically to the financial services needs and requirements as it relates to risk management and governance requirements.</ListItem>
        </UnorderedList>
        *Source: https://www.nist.gov/cyberframework/online-learning/five-functions
        **The IBM Enable function is a custom IBM function and not a part of the NIST Cybersecurity domains.
    </Tooltip>,
    risk_desc: <Tooltip>The Risk Description attribute provides preliminary inherent risks for the processes and operations that threaten the achievement of the control objectives or trust services criteria as identified by management.</Tooltip>,
    objective: <Tooltip>A control objective is the intent defined for a set of controls at a service organization with the primary aim to address risks that the controls are designed to mitigate.</Tooltip>,
    ibm_public_cloud_scope: <Tooltip>Indicates the scope of IBM Public Cloud.</Tooltip>,
    ibm_public_cloud_resp: <Tooltip>Indicates whether IBM Public Cloud is responsible for the performance of the control.</Tooltip>,
    developer_scope: <Tooltip>Indicates the scope of Organization that develops the software to be utilized in IBM public Cloud.</Tooltip>,
    developer_resp: <Tooltip>Indicates whether Organization that develops software is responsible for the performance of the control.</Tooltip>,
    operator_scope: <Tooltip>Indicates the scope of Organization that operates the software on IBM Public Cloud.</Tooltip>,
    operator_resp: <Tooltip>Indicates whether Organization that operates the software is responsible for the performance of the control.</Tooltip>,
    consumer_scope: <Tooltip>Indicates the scope of the Organization that utilizes IBM Public Cloud  i.e. Bank.</Tooltip>,
    consumer_resp: <Tooltip>Indicates whether Client using  Independent Software Vendor provided software is responsible for the performance of a control.</Tooltip>,
}

/////////////////////////////////////////////
// END -> Controls Filters
/////////////////////////////////////////////

/////////////////////////////////////////////
// Services Filters
/////////////////////////////////////////////

export const servicePlatforms = [
    // {
    //     attr: 'supported_platforms',
    //     label: 'IBM Cloud',
    //     val: 'IBM Cloud'
    // },
    // {
    //     attr: 'supported_platforms',
    //     label: 'Azure',
    //     val: 'Azure'
    // },
    // {
    //     attr: 'supported_platforms',
    //     label: 'AWS',
    //     val: 'AWS'
    // },
    // {
    //     attr: 'supported_platforms',
    //     label: 'GCP',
    //     val: 'GCP'
    // },
    // {
    //     attr: 'supported_platforms',
    //     label: 'Other',
    //     val: 'Other'
    // },
    {
        attr: 'platform',
        label: 'Kubernetes',
        val: 'kubernetes'
    },
    {
        attr: 'platform',
        label: 'OpenShift 3.x',
        val: 'ocp3'
    },
    {
        attr: 'platform',
        label: 'OpenShift 4.x',
        val: 'ocp4'
    },
    {
        attr: 'platform',
        label: 'VPC',
        val: 'vpc'
    },
]

export const serviceGroupings = [
    {
        attr: 'grouping',
        label: 'Compute',
        val: 'Compute'
    },
    {
        attr: 'grouping',
        label: 'Databases',
        val: 'Databases'
    },
    {
        attr: 'grouping',
        label: 'Developer Tools',
        val: 'Developer Tools'
    },
    {
        attr: 'grouping',
        label: 'IBM Cloud Platform Services',
        val: 'IBM Cloud Platform Services'
    },
    {
        attr: 'grouping',
        label: 'Middleware',
        val: 'Middleware'
    },
    {
        attr: 'grouping',
        label: 'Network',
        val: 'Network'
    },
    {
        attr: 'grouping',
        label: 'SRE Tools',
        val: 'SRE Tools'
    },
    {
        attr: 'grouping',
        label: 'Security & Identity',
        val: 'Security & Identity'
    },
    {
        attr: 'grouping',
        label: 'Storage',
        val: 'Storage'
    },
]

export const serviceProviders = [
    {
        attr: 'provider',
        label: 'IBM',
        val: 'ibm'
    },
    {
        attr: 'provider',
        label: 'Kubernetes',
        val: 'k8s'
    },
    {
        attr: 'provider',
        label: 'OpenShift',
        val: 'ocp'
    },
    {
        attr: 'provider',
        label: 'Tools',
        val: 'tools'
    },
    {
        attr: 'provider',
        label: 'VSI',
        val: 'vsi'
    },
    {
        attr: 'provider',
        label: 'GitOps',
        val: 'gitops'
    },
    {
        attr: 'provider',
        label: 'Util',
        val: 'util'
    }
]

export const serviceDeploymentMethods = [
    {
        attr: 'deployment_method',
        label: 'Terraform',
        val: 'terraform'
    },
    {
        attr: 'deployment_method',
        label: 'Helm',
        val: 'Helm'
    },
    {
        attr: 'deployment_method',
        label: 'Managed Service',
        val: 'Managed Service'
    },
    {
        attr: 'deployment_method',
        label: 'Operator',
        val: 'Operator'
    },
    {
        attr: 'deployment_method',
        label: 'Platform',
        val: 'Platform'
    },
    {
        attr: 'deployment_method',
        label: 'Custom Script',
        val: 'Custom Script'
    },
]

export const serviceProvisionMethods = [
    {
        attr: 'provision',
        label: 'Terraform',
        val: 'Terraform'
    },
    {
        attr: 'provision',
        label: 'GitOps',
        val: 'GitOps'
    },
    {
        attr: 'provision',
        label: 'Operator',
        val: 'Operator'
    },
]

/////////////////////////////////////////////
// END -> Services Filters
/////////////////////////////////////////////

export const nistHeaders = [{
    key: 'id',
    header: 'Control ID',
},
{
    key: 'title',
    header: 'Title',
},
{
    key: 'family',
    header: 'Control Family',
},
{
    key: 'priority',
    header: 'Priority',
},
{
    key: 'parent_control',
    header: 'Parent Control',
}
];

export const mappingHeaders = [{
    key: 'control_id',
    header: 'Control ID',
},
{
    key: 'component_id',
    header: 'Component ID',
},
{
    key: 'control_subsections',
    header: 'Control Item(s)',
},
{
    key: 'scc_profile',
    header: 'SCC Profile',
},
    // {
    //     key: 'compliant',
    //     header: 'Compliant',
    // },
    // {
    //     key: 'evidence',
    //     header: 'Evidence',
    // }
];
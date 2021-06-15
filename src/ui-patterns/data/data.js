export const serviceHeader = [
    {
        key: 'service',
        header: 'Service Name',
    },
    {
        key: 'id',
        header: 'Service ID',
    },
    {
        key: 'grouping',
        header: 'Grouping',
    },
    // {
    //     key: 'desc',
    //     header: 'Description',
    // },
    {
        key: 'deployment_method',
        header: 'Deployment Method',
    },
    // {
    //     key: 'fs_validated',
    //     header: 'FS Validated',
    // },
    // {
    //     key: 'compliance_status',
    //     header: 'Compliance Status',
    // },
    // {
    //     key: 'quarter',
    //     header: 'Quarter',
    // },
    // {
    //     key: 'date',
    //     header: 'Date',
    // },
    {
        key: 'provision',
        header: 'Provision',
    },
    {
        key: 'fs_validated',
        header: 'FS Validated',
    },
    {
        key: 'automation_id',
        header: 'Automation ID',
    }, 
    // {
    //     key: 'cloud_automation_id',
    //     header: 'CA-ID',
    // },
    // {
    //     key: 'hybrid_automation_id',
    //     header: 'HA-ID',
    // }
];

export const bomHeader = [

    {
        key: 'ibm_service',
        header: 'IBM Service',
    },
    {
        key: 'desc',
        header: 'Description',
    },
    {
        key: 'grouping',
        header: 'Grouping',
    },
    {
        key: 'deployment_method',
        header: 'Deployment Method',
    },
    {
        key: 'provision',
        header: 'Provision',
    },
    {
        key: 'fs_validated',
        header: 'FS Validated',
    },
    {
        key: 'automation_id',
        header: 'Automation ID',
    },
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

export const ctrlsHeaders = [
    {
        key: 'id',
        header: 'Control ID',
    },
    {
        key: 'name',
        header: 'Control Name',
    },
    {
        key: 'family',
        header: 'Control Family',
    },
    {
        key: 'parent_control',
        header: 'Parent Control',
    },
    {
        key: 'existing_scc_goals',
        header: 'Existing SCC Goals',
    },
    {
        key: 'human_or_automated',
        header: 'Human / Automated',
    },
    {
        key: 'frequency',
        header: 'Frequency',
    },
    {
        key: 'org_defined_parameter',
        header: 'Org. Defined Parameters',
    },
    {
        key: 'create_document',
        header: 'Require document',
    }
];

export const controlFamilies = [
    {attr: 'family', label: 'Access Control', val: 'Access Control'}, 
    {attr: 'family', label: 'Awareness And Training', val: 'Awareness And Training'},
    {attr: 'family', label: 'Audit And Accountability', val: 'Audit And Accountability'},
    {attr: 'family', label: 'Security Assessment And Authorization', val: 'Security Assessment And Authorization'},
    {attr: 'family', label: 'Configuration Management', val: 'Configuration Management'},
    {attr: 'family', label: 'Contingency Planning', val: 'Contingency Planning'},
    {attr: 'family', label: 'Identification And Authentication', val: 'Identification And Authentication'},
    {attr: 'family', label: 'Incident Response', val: 'Incident Response'},
    {attr: 'family', label: 'Maintenance', val: 'Maintenance'},
    {attr: 'family', label: 'Media Protection', val: 'Media Protection'},
    {attr: 'family', label: 'Physical And Environmental Protection', val: 'Physical And Environmental Protection'},
    {attr: 'family', label: 'Planning', val: 'Planning'},
    {attr: 'family', label: 'Personnel Security', val: 'Personnel Security'},
    {attr: 'family', label: 'Risk Assessment', val: 'Risk Assessment'},
    {attr: 'family', label: 'System And Services Acquisition', val: 'System And Services Acquisition'},
    {attr: 'family', label: 'System And Communications Protection', val: 'System And Communications Protection'},
    {attr: 'family', label: 'System And Information Integrity', val: 'System And Information Integrity'},
    {attr: 'family', label: 'Program Management', val: 'Program Management'},
    {attr: 'family', label: 'Enterprise Data Management', val: 'Enterprise Data Management'},
    {attr: 'family', label: 'Enterprise System And Services Acquisition', val: 'Enterprise System And Services Acquisition'}
]

export const controlFrequencies = [
    {
        attr: 'frequency',
        label: 'Setup',
        val: 'Setup'
    },
    {
        attr: 'frequency',
        label: 'Event',
        val: 'Event'
    },
    {
        attr: 'frequency',
        label: 'Setup, Event',
        val: 'Setup, Event'
    },
    {
        attr: 'frequency',
        label: 'Every 3 years',
        val: 'Every 3 years'
    },
    {
        attr: 'frequency',
        label: 'Annually',
        val: 'Annually'
    },
    {
        attr: 'frequency',
        label: 'Annually, Event',
        val: 'Annually, Event'
    },
    {
        attr: 'frequency',
        label: 'Setup, Annually, Event',
        val: 'Setup, Annually, Event'
    },
    {
        attr: 'frequency',
        label: 'Quarterly',
        val: 'Quarterly'
    },
    {
        attr: 'frequency',
        label: 'Quarterly and Annually',
        val: 'Quarterly and Annually'
    },
    {
        attr: 'frequency',
        label: 'Monthly',
        val: 'Monthly'
    },
    {
        attr: 'frequency',
        label: 'Monthly, Annually',
        val: 'Monthly, Annually'
    },
    {
        attr: 'frequency',
        label: 'Weekly',
        val: 'Weekly'
    },
    {
        attr: 'frequency',
        label: 'Weekly, Quarterly, Annually',
        val: 'Weekly, Quarterly, Annually'
    },
    {
        attr: 'frequency',
        label: 'Daily',
        val: 'Daily'
    },
    {
        attr: 'frequency',
        label: 'Hourly',
        val: 'Hourly'
    },
    {
        attr: 'frequency',
        label: 'Daily, Hourly',
        val: 'Daily, Hourly'
    },
    {
        attr: 'frequency',
        label: 'Continuous',
        val: 'Continuous'
    },
    {
        attr: 'frequency',
        label: 'When Scanned',
        val: 'WhenScanned'
    },
    {
        attr: 'frequency',
        label: 'Org Defined',
        val: 'Org. Defined'
    },
];

export const nistHeaders = [
    {
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

export const mappingHeaders = [
    {
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
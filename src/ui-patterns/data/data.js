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

export const ctrlsfFilterItems = [
    {
        attr: '',
        label: 'AND',
        val: ''
    },
    {
        attr: 'human_or_automated',
        label: 'human',
        val: 'Human'
    },
    {
        attr: 'human_or_automated',
        label: 'automated',
        val: 'Automated'
    },
    {
        attr: 'existing_scc_goals',
        label: 'scc-goals:yes',
        val: 'Yes'
    },
    {
        attr: 'existing_scc_goals',
        label: 'scc-goals:no',
        val: 'No'
    },
    {
        attr: 'frequency',
        label: 'freq:setup',
        val: 'Setup'
    },
    {
        attr: 'frequency',
        label: 'freq:event',
        val: 'Event'
    },
    {
        attr: 'frequency',
        label: 'freq:setup-event',
        val: 'Setup, Event'
    },
    {
        attr: 'frequency',
        label: 'freq:3-years',
        val: 'Every 3 years'
    },
    {
        attr: 'frequency',
        label: 'freq:annually',
        val: 'Annually'
    },
    {
        attr: 'frequency',
        label: 'freq:annually-event',
        val: 'Annually, Event'
    },
    {
        attr: 'frequency',
        label: 'freq:setup-annually-event',
        val: 'Setup, Annually, Event'
    },
    {
        attr: 'frequency',
        label: 'freq:quarterly',
        val: 'Quarterly'
    },
    {
        attr: 'frequency',
        label: 'freq:quarterly-and-annually',
        val: 'Quarterly and Annually'
    },
    {
        attr: 'frequency',
        label: 'freq:monthly',
        val: 'Monthly'
    },
    {
        attr: 'frequency',
        label: 'freq:monthly-annually',
        val: 'Monthly, Annually'
    },
    {
        attr: 'frequency',
        label: 'freq:weekly',
        val: 'Weekly'
    },
    {
        attr: 'frequency',
        label: 'freq:weekly-quarterly-annually',
        val: 'Weekly, Quarterly, Annually'
    },
    {
        attr: 'frequency',
        label: 'freq:daily',
        val: 'Daily'
    },
    {
        attr: 'frequency',
        label: 'freq:hourly',
        val: 'Hourly'
    },
    {
        attr: 'frequency',
        label: 'freq:daily-hourly',
        val: 'Daily, Hourly'
    },
    {
        attr: 'frequency',
        label: 'freq:continuous',
        val: 'Continuous'
    },
    {
        attr: 'frequency',
        label: 'freq:when-scanned',
        val: 'WhenScanned'
    },
    {
        attr: 'frequency',
        label: 'freq:org-defined',
        val: 'Org Defined'
    },
    {
        attr: 'org_defined_parameter',
        label: 'params:org-defined',
        val: 'Yes'
    },
    {
        attr: 'org_defined_parameter',
        label: 'params:not-org-defined',
        val: 'No'
    },
    {
        attr: 'create_document',
        label: 'document:required',
        val: 'Yes'
    },
    {
        attr: 'create_document',
        label: 'document:not-required',
        val: 'No'
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
"use client"

import {Tag} from "@carbon/react";
import {Icon} from "@/components";
import { catalogFilters } from '@/data';

interface CatalogContentProps {
    logo: string;
    icon: string;
    title: string;
    displayName: string;
    status: string;
    type: string;
    description: string;
}

export const CatalogContent = ({ logo, icon, title, displayName, status, type, description }: CatalogContentProps) => {
    return (
        <div className={`iot--sample-tile`}>
            {logo ? <div className={`iot--sample-tile-icon`}><Icon className="software-logo" src={logo} alt="software logo" /></div> : icon ? <div className={`iot--sample-tile-icon`}>{icon}</div> : null}
            <div className={`iot--sample-tile-contents`}>
                <div className={`iot--sample-tile-title`}>
                    <span title={title}>{displayName}</span>
                    {(type === 'terraform' || type === 'gitops') && <Tag
                      style={{ marginLeft: '.5rem' }}
                      type='gray' >
                        {catalogFilters.moduleTypeValues.find(v => v.value === type)?.text}
                    </Tag>}
                    {(status === 'beta' || status === 'pending') && <Tag
                      style={{ marginLeft: '.5rem' }}
                      type={status === 'beta' ? 'teal' : 'magenta'} >
                        {catalogFilters.statusValues.find(v => v.value === status)?.text}
                    </Tag>}
                </div>
                <div className={`iot--sample-tile-description`}>{description ? `${description?.slice(0, 95)}${description?.length > 95 ? '...' : ''}` : title}</div>
            </div>
        </div>
    )
}

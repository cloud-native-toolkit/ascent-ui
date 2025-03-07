"use client"

import {ReactNode} from "react";
import {RadioTile, SelectableTile} from "@carbon/react";

interface DynamicTileProps {
    isMultiSelect?: boolean;
    className?: string;
    id: string;
    value: string;
    name: string;
    checked: boolean;
    onChange: (id: string, selected?: boolean) => void;
    children: ReactNode;
}

export const DynamicTile = ({isMultiSelect, className, id, value, name, checked, onChange, children}: DynamicTileProps) => {
    if (isMultiSelect) {
        return (
            <SelectableTile
                className={className}
                key={id}
                id={id}
                value={value}
                name={name}
                selected={checked}
                onChange={() => onChange(id, !checked)}
            >
                {children}
            </SelectableTile>
        )
    }

    return (
        <RadioTile
            className={className}
            key={id}
            id={id}
            value={value}
            name={name}
            checked={checked}
            onChange={() => onChange(id, true)}
        >
            {children}
        </RadioTile>
    )
}

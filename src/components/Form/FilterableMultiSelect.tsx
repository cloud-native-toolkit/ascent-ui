"use client"

import { FilterableMultiSelect as CarbonMultiSelect } from "@carbon/react"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FilterableMultiSelectProps<T = any> {
    id: string;
    items: T;
    itemToString: (item: T) => string;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    getValue: () => T[];
    setValue: (selectedItems: T[]) => void;
    filterItems: (items: readonly T[], extra: {inputValue: string | null, itemToString: (item: T) => string}) => T[];
    hide?: boolean;
}

export const FilterableMultiSelect = ({id, items, itemToString, placeholder, size, getValue, setValue, filterItems, hide}: FilterableMultiSelectProps) => {
    if (hide) {
        return (<></>)
    }

    return (<CarbonMultiSelect
        id={id}
        items={items}
        itemToString={itemToString}
        onChange={event => setValue(event.selectedItems)}
        initialSelectedItems={getValue()}
        placeholder={placeholder}
        size={size}
        filterItems={filterItems} />)
}

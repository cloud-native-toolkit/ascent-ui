import {CSSProperties, ReactNode} from "react";
import {Select as CarbonSelect} from "@carbon/react";

interface SelectProps {
    id: string;
    name: string;
    labelText: string;
    required?: boolean;
    getValue: () => string;
    setValue: (value: string) => void;
    invalidText?: string;
    style?: CSSProperties;
    hide?: boolean;
    children: ReactNode;
}

export const Select = ({id, name, labelText, required, getValue, setValue, invalidText, style, hide, children}: SelectProps) => {
    if (hide) {
        return (<></>)
    }

    return(<CarbonSelect
        id={id}
        name={name}
        labelText={labelText}
        required={required}
        defaultValue={getValue()}
        invalidText={invalidText}
        onChange={e => setValue(e.target.value)}
        style={style}>
        {children}
    </CarbonSelect>)
}
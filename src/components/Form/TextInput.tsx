"use client"

import {CSSProperties} from "react";
import {TextInput as CarbonTextInput} from "@carbon/react";

interface TextInputProps {
    id: string;
    name: string;
    required?: boolean;
    primaryFocus?: boolean;
    invalidText?: string;
    setValue: (value: string) => void;
    getValue: () => string;
    labelText: string;
    placeholder: string;
    style?: CSSProperties;
    hide?: boolean;
    disabled?: boolean;
}

export const TextInput = ({primaryFocus, id, name, required, invalidText, getValue, setValue, labelText, placeholder, style, hide, disabled}: TextInputProps) => {
    if (hide) {
        return (<></>)
    }

    return (<CarbonTextInput
            data-modal-primary-focus={primaryFocus}
            id={id}
            name={name}
            required={required}
            disabled={disabled}
            invalidText={invalidText || "Please Enter The Value"}
            onChange={e => setValue(e.target.value)}
            value={getValue()}
            labelText={labelText}
            placeholder={placeholder}
            style={style}
        />
    )
}
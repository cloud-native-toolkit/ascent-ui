
import {TextArea as CarbonTextArea} from "@carbon/react";
import {CSSProperties} from "react";

interface TextAreaProps {
    id: string;
    name: string;
    required?: boolean;
    primaryFocus?: boolean;
    invalidText?: string;
    setValue: (value: string) => void;
    getValue: () => string;
    labelText: string;
    placeholder: string;
    rows?: number;
    style?: CSSProperties;
    hide?: boolean;
}

export const TextArea = ({id, name, required, getValue, setValue, invalidText, labelText, placeholder, style, rows, hide}: TextAreaProps) => {
    if (hide) {
        return (<></>)
    }

    return (<CarbonTextArea
        required={required}
        // cols={50}
        id={id}
        name={name}
        value={getValue()}
        onChange={e => setValue(e.target.value)}
        invalidText={invalidText}
        labelText={labelText}
        placeholder={placeholder}
        rows={rows || 2}
        style={style}
    />)
}
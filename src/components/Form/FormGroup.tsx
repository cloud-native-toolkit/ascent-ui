
import {ButtonSkeleton, FormGroup as CarbonFormGroup} from "@carbon/react";
import {CSSProperties, ReactNode} from "react";

interface FormGroupProps {
    legendText?: string;
    hide?: boolean;
    style?: CSSProperties;
    children: ReactNode;
}

export const FormGroup = ({hide, legendText, style, children}: FormGroupProps) => {
    if (hide) {
        return (<ButtonSkeleton />)
    }

    return (<CarbonFormGroup legendText={legendText} style={style} >{children}</CarbonFormGroup>);
}

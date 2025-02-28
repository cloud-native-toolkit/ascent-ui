
import {FileUploader as CarbonFileUploader} from '@carbon/react'

interface FileUploaderProps {
    multiple?: boolean;
    accept: string[];
    labelTitle?: string;
    labelDescription?: string;
    buttonLabel?: string;
    setValue: (solutionFiles: FileList | undefined) => void;
    hide?: boolean;
    filenameStatus?: 'edit' | 'complete';
}

export const FileUploader = ({multiple, accept, labelTitle, labelDescription, buttonLabel, setValue, hide, filenameStatus}: FileUploaderProps) => {
    if (hide) {
        return (<></>)
    }

    return (
        <CarbonFileUploader
            multiple={multiple}
            accept={accept}
            labelTitle={labelTitle}
            buttonLabel={buttonLabel}
            labelDescription={labelDescription}
            filenameStatus={filenameStatus || 'edit'}
            onChange={event => setValue(event?.target?.files)}
            onDelete={() => setValue(undefined)} />);
}

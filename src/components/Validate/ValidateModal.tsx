
interface ValidateModalProps {
    danger: boolean;
    submitText: string;
    heading: string;
    message: string;
    show: boolean;
    inputRequired: string;
    onClose: () => void;
    onRequestSubmit: () => void;
    onSecondarySubmit: () => void;
}

export const ValidateModal = ({}: ValidateModalProps) => {
    return <div>ValidateModal</div>;
}

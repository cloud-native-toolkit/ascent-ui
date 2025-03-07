
export interface Notification {
    severity: string;
    message: string;
    detail: string;
}

export type AddNotification = (severity: string, message: string, detail: string) => void;
export type NewNotification = (severity: string, message: string, detail: string) => Notification;

export const newNotification: NewNotification = (severity, message, detail): Notification => {
    return {
        severity,
        message,
        detail
    };
}

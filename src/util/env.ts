
// TODO fix

export interface Environment {
    REACT_APP_MODE?: string;
}

export const env: Environment = {
    REACT_APP_MODE: process.env.REACT_APP_MODE || 'builder'
}

import { env } from './env'

const fsControls: string = 'fs-controls'
const builder: string = 'builder'

const mode: string = env.REACT_APP_MODE || builder;
console.log('Mode: ', mode)

export interface ApplicationMode {
    fsControls: string;
    builder: string;
    isFsControlsMode(): boolean;
    isBuilderMode(): boolean;
    isCurrentMode(test: string): boolean;
    isNotCurrentMode(test: string): boolean;
}

export const applicationMode: ApplicationMode = {
    fsControls,
    builder,
    isFsControlsMode: () => mode === fsControls,
    isBuilderMode: () => mode !== fsControls,
    isCurrentMode: (test) => mode === test,
    isNotCurrentMode: (test) => mode !== test,
}
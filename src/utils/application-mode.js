import { env } from '../env'

const fsControls = 'fs-controls'
const builder = 'builder'

const mode = env.REACT_APP_MODE
console.log('Mode: ', mode)

const ApplicationMode = {
    fsControls,
    builder,
    isFsControlsMode: () => mode === fsControls,
    isBuilderMode: () => mode !== fsControls,
    isCurrentMode: (test) => mode === test,
    isNotCurrentMode: (test) => mode !== test,
}

export default ApplicationMode;

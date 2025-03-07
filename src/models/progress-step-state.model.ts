

export interface ProgressStepState {
    index: number;
    label: string;

    next(): ProgressStepState;
    previous(): ProgressStepState;

    hasNext(): boolean;
    hasPrevious(): boolean;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    isValid(data?: any): boolean;
}

interface ProgressStepStateImplFields {
    index: number;
    label: string;
    n?: ProgressStepState;
    p?: ProgressStepState;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    isValid?: (data?: any) => boolean;
}

class ProgressStepStateImpl implements ProgressStepState {
    index: number;
    label: string;
    n?: ProgressStepState;
    p?: ProgressStepState;
    isValidInternal?: (data?: any) => boolean;

    constructor({index, label, n, isValid}: ProgressStepStateImplFields) {
        this.index = index;
        this.label = label;
        this.n = n;

        if (isValid) {
            this.isValidInternal = isValid;
        }
    }

    next(): ProgressStepState {
        if (!this.n) {
            throw new Error(`${this.label}: No next step`);
        }

        return this.n;
    }
    hasNext(): boolean {
        return !!this.n;
    }
    previous(): ProgressStepState {
        if (!this.p) {
            throw new Error(`${this.label}: No previous step`);
        }

        return this.p;
    }
    hasPrevious(): boolean {
        return !!this.p;
    }

    isValid(data?: any): boolean {
        return this.isValidInternal?.(data) ?? true;
    }
}

export interface SimplifiedProgressStep {
    label: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    isValid?: (data?: any) => boolean;
}

export type ProgressStepInput = string | SimplifiedProgressStep;

export const buildSteps = (steps: ProgressStepInput[]): ProgressStepState => {
    if (steps.length === 0) {
        throw new Error("Empty steps");
    }

    const {first} = steps.reduce(({first, last}: {first?: ProgressStepStateImpl, last?: ProgressStepStateImpl}, currentValue: ProgressStepInput, index: number) => {
        const currentStep = new ProgressStepStateImpl({
            index,
            label: (typeof currentValue === "string") ? currentValue : currentValue.label,
            p: last,
            isValid: (typeof currentValue !== "string") ? currentValue.isValid : undefined,
        })

        if (last) {
            last.n = currentStep;
        }

        return {
            first: first || currentStep,
            last: currentStep,
        };
    }, {first: undefined, last: undefined});

    return first as ProgressStepState;
}

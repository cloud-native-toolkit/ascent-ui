export interface NistDataModel {
    number: string,
    family: string,
    title: string,
    priority: string,
    baseline_impact: Array<string>,
    statement: object,
    supplemental_guidance: object,
    references: Array<object>,
    withdrawn: string,
    base_control: string,
    parent_control: string
}
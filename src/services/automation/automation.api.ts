import { AutomationDataModel } from '../../models/automation/AutomationDataModel';

export abstract class AutomationApi {
    abstract async getAutomation(automationId: string): Promise<AutomationDataModel>;
}

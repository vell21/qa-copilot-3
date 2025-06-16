import { getWorkItem } from './azureDevOpsService';
import { generateTestCasesWithAI } from './openAIService';

export async function getWorkItemAndPR(workItemId: number) {
  return await getWorkItem(workItemId);
}

export async function generateTestCases(workItemDetailsInJSON: any) {
  return generateTestCasesWithAI(workItemDetailsInJSON);
}
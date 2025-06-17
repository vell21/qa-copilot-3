import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getWorkItemAndPR, generateTestCases } from '../services/qaService';
import 'dotenv/config';

export async function httpTrigger1(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const workItemId = Number(req.params.id);
  if (!workItemId) {
    return { status: 400, body: 'Missing or invalid workItemId in URL.' };
  }

  try {
    console.log(`1 Received request to generate test cases for work item ${workItemId}`);
    const workItemDetailsInJSON = await getWorkItemAndPR(workItemId);

    console.log(`2 going to ai generateTestCases with params: `);
    const aiOutput = await generateTestCases(workItemDetailsInJSON);
    console.log(`4 aiOutput: ${aiOutput.slice(0, 100)}`);
    return { status: 200, body: JSON.stringify({ testCases: aiOutput }) };
  } catch (error: any) {
    return { status: 500, body: `Internal Server Error try-catch ${error}` };
  }
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'workitem/generate/{id:int?}',
    handler: httpTrigger1
});
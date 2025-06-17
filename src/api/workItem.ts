import { Router } from 'express';
import { getWorkItemAndPR, generateTestCases } from '../services/qaService';

export const workItemRouter = Router();

/**
 * POST /api/workitem/generate/:workItemId
 */
workItemRouter.post('/generate/:workItemId', async (req, res) => {
  const workItemId = Number(req.params.workItemId);
  if (!workItemId) {
    return res.status(400).json({ error: 'Missing or invalid workItemId in URL.' });
  }

  try {
    console.log(`1 Received request to generate test cases for work item ${workItemId}`);
    const workItemDetailsInJSON = await getWorkItemAndPR(workItemId);

    console.log(`2 going to ai generateTestCases with params: `);
    const aiOutput = await generateTestCases(workItemDetailsInJSON);
    console.log(`aiOutput: ${aiOutput.slice(0, 100)}`);

    res.json({ testCases: aiOutput });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
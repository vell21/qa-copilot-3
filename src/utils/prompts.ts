export function getTestCasesPrompt(workItemDetailsInJSON: object): string {
    return `
Assume you are a Senior QA expert trained in advanced ISTQB:
I need you to generate concise test cases.
Optionally, add relevant QA action items, if any.
Assume you only have 1 hour to test this work item.
Please be very brief and concise.
Do not include any explanations or additional text.
Here is the work item information (in JSON format):

${JSON.stringify(workItemDetailsInJSON, null, 2)}
`;
}
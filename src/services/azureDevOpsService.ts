import axios from 'axios';

function getAuthHeader() {
    return {
        headers: {
            Authorization: `Basic ${Buffer.from(':' + process.env.AZURE_PAT).toString('base64')}`,
        },
    };
}

export async function getWorkItem(workItemId: number) {
    const AZURE_DEVOPS_BASE = `https://dev.azure.com/${process.env.AZURE_ORG}/${process.env.AZURE_PROJECT}/_apis`;
    const url = `${AZURE_DEVOPS_BASE}/wit/workitems/${workItemId}?$expand=all&api-version=7.1-preview.3`;
    console.log(`1.1.1. Fetching work item from URL: ${url}`);
    const response = await axios.get(url, getAuthHeader());
    const data = response.data;

    // Extract fields with null guards
    const fields = data.fields || {};
    const relations = data.relations || [];

    // Linked work items
    const linkedItems = relations
        .filter((rel: any) => rel.rel === 'System.LinkTypes.Related' && rel.url.includes('/workItems/'))
        .map((rel: any) => {
            const idMatch = rel.url.match(/workItems\/(\d+)/);
            return idMatch ? parseInt(idMatch[1], 10) : null;
        })
        .filter((id: number | null) => id !== null);

    // Linked pull requests
    const pullRequests = relations
        .filter((rel: any) => rel.rel === 'ArtifactLink' && rel.url.includes('vstfs:///Git/PullRequestId/'))
        .map((rel: any) => {
            // PR artifact format: vstfs:///Git/PullRequestId/{projectId}%2F{repoId}%2F{prId}
            const prMatch = rel.url.match(/PullRequestId\/([^%]+)%2F([^%]+)%2F(\d+)/);
            return prMatch
                ? {projectId: prMatch[1], repoId: prMatch[2], pullRequestId: parseInt(prMatch[3], 10)}
                : null;
        })
        .filter((pr: any) => pr !== null);

    const result = {
        id: data.id ?? 'ID not available',
        title: fields['System.Title'] ?? 'Title not available',
        description: fields['System.Description'] ?? 'Description not available',
        acceptanceCriteria: fields['Microsoft.VSTS.Common.AcceptanceCriteria'] ?? 'Acceptance Criteria not available',
        workType: fields['System.WorkItemType'] ?? 'Work Type not available',
        budget: fields['Custom.Budget'] ?? 'Budget not available',
        priority: fields['Microsoft.VSTS.Common.Priority'] ?? 'Priority not available',
        effort: fields['Microsoft.VSTS.Scheduling.Effort'] ?? 'Effort not available',
        securityType: fields['Custom.SecurityType'] ?? 'Security Type not available',
        severity: fields['Microsoft.VSTS.Common.Severity'] ?? 'Severity not available',
        comments: relations.length ? await getWorkItemComments(workItemId) : 'Comments not available',
        linkedItems: linkedItems.length ? linkedItems : 'Linked Items not available',
        pullRequests: pullRequests.length ? pullRequests : 'Pull Requests not available',
    };
    return result;
}

// Helper to fetch all comments in discussion
async function getWorkItemComments(workItemId: number) {
    const AZURE_DEVOPS_BASE = `https://dev.azure.com/${process.env.AZURE_ORG}/${process.env.AZURE_PROJECT}/_apis`;
    const url = `${AZURE_DEVOPS_BASE}/wit/workItems/${workItemId}/comments?api-version=7.1-preview.3`;
    try {
        const response = await axios.get(url, getAuthHeader());
        return response.data.comments?.map((c: any) => c.text) ?? [];
    } catch {
        return null;
    }
}
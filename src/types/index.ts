export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee: {
      accountId: string;
      displayName: string;
      emailAddress: string;
    } | null;
    updated: string;
  };
}

export interface SlackUser {
  id: string;
  profile: {
    email: string;
  };
}

export interface QAIssueTracker {
  issueKey: string;
  assigneeEmail: string;
  lastUpdated: string;
}
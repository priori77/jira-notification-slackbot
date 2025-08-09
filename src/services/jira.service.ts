import axios from 'axios';
import { JiraIssue } from '../types';

export class JiraService {
  private baseUrl: string;
  private auth: string;

  constructor() {
    const { JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;
    
    if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
      throw new Error('Missing required Jira environment variables');
    }

    this.baseUrl = JIRA_HOST;
    this.auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  }

  async getQAIssues(): Promise<JiraIssue[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/rest/api/3/search`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          jql: 'status = "QA"',
          fields: 'summary,status,assignee,updated',
          maxResults: 100
        }
      });

      return response.data.issues as JiraIssue[];
    } catch (error) {
      console.error('Error fetching QA issues from Jira:', error);
      throw error;
    }
  }
}
import fs from 'fs/promises';
import path from 'path';
import { QAIssueTracker } from '../types';

const STORAGE_FILE = path.join('/tmp', 'qa-issues-tracker.json');

export class Storage {
  async getTrackedIssues(): Promise<QAIssueTracker[]> {
    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveTrackedIssues(issues: QAIssueTracker[]): Promise<void> {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(issues, null, 2));
  }

  async isNewOrUpdatedIssue(issueKey: string, assigneeEmail: string, updated: string): Promise<boolean> {
    const trackedIssues = await this.getTrackedIssues();
    const trackedIssue = trackedIssues.find(issue => issue.issueKey === issueKey);

    if (!trackedIssue) {
      return true;
    }

    return trackedIssue.assigneeEmail !== assigneeEmail || 
           new Date(updated) > new Date(trackedIssue.lastUpdated);
  }

  async updateTrackedIssue(issueKey: string, assigneeEmail: string, updated: string): Promise<void> {
    const trackedIssues = await this.getTrackedIssues();
    const index = trackedIssues.findIndex(issue => issue.issueKey === issueKey);

    const newIssue: QAIssueTracker = {
      issueKey,
      assigneeEmail,
      lastUpdated: updated
    };

    if (index !== -1) {
      trackedIssues[index] = newIssue;
    } else {
      trackedIssues.push(newIssue);
    }

    await this.saveTrackedIssues(trackedIssues);
  }
}
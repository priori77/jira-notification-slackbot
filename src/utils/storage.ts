import fs from 'fs/promises';
import path from 'path';
import { QAIssueTracker } from '../types';

const STORAGE_FILE = path.join('/tmp', 'qa-issues-tracker.json');

export class Storage {
  // 현재까지 추적 중인 이슈 목록 로드 (빈 배열 반환 시 파일없는 상태)
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

  // 신규 이슈 판별 
  // 파일에 기록이 없으면 신규(true)
  // 담당자 이메일이 바뀌거나, updated 타임스탬프가 최신이면 신규(ture)
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
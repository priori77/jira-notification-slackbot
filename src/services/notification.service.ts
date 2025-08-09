import { JiraService } from './jira.service';
import { SlackService } from './slack.service';
import { Storage } from '../utils/storage';
import { JiraIssue } from '../types';

export class NotificationService {
  private jiraService: JiraService;
  private slackService: SlackService;
  private storage: Storage;

  constructor() {
    this.jiraService = new JiraService();
    this.slackService = new SlackService();
    this.storage = new Storage();
  }

  async checkAndNotifyQAIssues(): Promise<void> {
    try {
      console.log('Checking for QA issues...');
      const qaIssues = await this.jiraService.getQAIssues();
      
      console.log(`Found ${qaIssues.length} QA issues`);

      for (const issue of qaIssues) {
        await this.processIssue(issue);
      }

      console.log('QA issues check completed');
    } catch (error) {
      console.error('Error in checkAndNotifyQAIssues:', error);
      throw error;
    }
  }

  private async processIssue(issue: JiraIssue): Promise<void> {
    if (!issue.fields.assignee) {
      console.log(`Issue ${issue.key} has no assignee, skipping`);
      return;
    }

    const assigneeEmail = issue.fields.assignee.emailAddress;
    const isNewOrUpdated = await this.storage.isNewOrUpdatedIssue(
      issue.key,
      assigneeEmail,
      issue.fields.updated
    );

    if (!isNewOrUpdated) {
      console.log(`Issue ${issue.key} has not changed, skipping`);
      return;
    }

    console.log(`Issue ${issue.key} is new or updated, sending notification`);

    const slackUser = await this.slackService.getUserByEmail(assigneeEmail);
    
    if (!slackUser) {
      console.log(`Could not find Slack user for email ${assigneeEmail}`);
      return;
    }

    const message = this.createNotificationMessage(issue);
    await this.slackService.sendDirectMessage(slackUser.id, message);
    
    await this.storage.updateTrackedIssue(
      issue.key,
      assigneeEmail,
      issue.fields.updated
    );

    console.log(`Notification sent for issue ${issue.key} to ${assigneeEmail}`);
  }

  private createNotificationMessage(issue: JiraIssue): string {
    const jiraUrl = `${process.env.JIRA_HOST}/browse/${issue.key}`;
    
    return `🔔 *New QA Issue Assigned to You*\n\n` +
           `*Issue:* ${issue.key}\n` +
           `*Summary:* ${issue.fields.summary}\n` +
           `*Status:* ${issue.fields.status.name}\n` +
           `*Link:* ${jiraUrl}\n\n` +
           `Please review and test this issue.`;
  }
}
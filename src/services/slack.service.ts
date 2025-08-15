import { WebClient } from '@slack/web-api';
import { SlackUser } from '../types';

export class SlackService {
  private client: WebClient;

  constructor() {
    const { SLACK_BOT_TOKEN } = process.env;
    
    if (!SLACK_BOT_TOKEN) {
      throw new Error('Missing required Slack environment variable: SLACK_BOT_TOKEN');
    }

    this.client = new WebClient(SLACK_BOT_TOKEN);
  }

  // 이메일로 Slack 사용자 조회
  async getUserByEmail(email: string): Promise<SlackUser | null> {
    try {
      const result = await this.client.users.lookupByEmail({ email });
      return result.user as SlackUser;
    } catch (error) {
      console.error(`Error finding Slack user by email ${email}:`, error);
      return null;
    }
  }

  // 1:1 DM 채널로 메시지 전송
  async sendDirectMessage(userId: string, message: string): Promise<void> {
    try {
      const result = await this.client.conversations.open({ users: userId });
      
      if (result.channel?.id) {
        await this.client.chat.postMessage({
          channel: result.channel.id,
          text: message
        });
      }
    } catch (error) {
      console.error(`Error sending DM to user ${userId}:`, error);
      throw error;
    }
  }
}
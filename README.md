# Jira-Slack Integration Bot

This bot monitors Jira issues in QA status and sends Slack DM notifications to assignees when new issues are added or updated.

## Features

- Checks Jira for issues in "QA" status every 5 minutes
- Sends Slack DM to assignees when new QA issues are assigned
- Tracks issue state to avoid duplicate notifications
- Runs on Vercel with cron jobs

## Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables:
   - `JIRA_HOST`: Your Jira instance URL (e.g., https://yourcompany.atlassian.net)
   - `JIRA_EMAIL`: Email for Jira authentication
   - `JIRA_API_TOKEN`: Jira API token (create at https://id.atlassian.com/manage-profile/security/api-tokens)
   - `SLACK_BOT_TOKEN`: Slack bot token (create at https://api.slack.com/apps)
   - `CRON_SECRET`: (Optional) Secret for securing the cron endpoint

4. Set up Slack App:
   - Create a new Slack app at https://api.slack.com/apps
   - Add OAuth scopes: `users:read`, `users:read.email`, `chat:write`, `im:write`
   - Install the app to your workspace
   - Copy the Bot User OAuth Token

5. Deploy to Vercel:
```bash
vercel
```

6. Add environment variables in Vercel dashboard

## Local Development

Run the bot locally:
```bash
npm run dev
```

## API Endpoints

- `/api/cron` - Webhook endpoint for Vercel cron job (called every 5 minutes)

## Architecture

- `src/services/jira.service.ts` - Handles Jira API interactions
- `src/services/slack.service.ts` - Handles Slack API interactions
- `src/services/notification.service.ts` - Main logic for checking and notifying
- `src/utils/storage.ts` - Tracks processed issues to avoid duplicates
- `api/cron.ts` - Vercel serverless function endpoint
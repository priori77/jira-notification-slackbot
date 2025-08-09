import dotenv from 'dotenv';
import { NotificationService } from './services/notification.service';

dotenv.config();

export async function checkQAIssues() {
  console.log(`[${new Date().toISOString()}] Starting QA issues check...`);
  
  try {
    const notificationService = new NotificationService();
    await notificationService.checkAndNotifyQAIssues();
    
    return { 
      success: true, 
      message: 'QA issues check completed successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error during QA issues check:', error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

if (require.main === module) {
  checkQAIssues().then(result => {
    console.log('Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
import { PubSub } from '@google-cloud/pubsub';
import { container } from 'tsyringe';
import { SendNotificationUseCase } from '../../../notifications/application/usecases/send-notification.usecase';
import { SubNotificationUseCase } from '../../../notifications/application/usecases/sub-notification.usecase';
import { NotificationRepository } from '../../../notifications/infraestructure/repositories/notification.repository';

if (!process.env.GCLOUD_PROJECT_ID) {
  throw new Error('GCLOUD_PROJECT_ID environment variable is not set');
}

const pubsub =
  process.env.NODE_ENV === 'test' || !process.env.NODE_ENV
    ? new PubSub({
        projectId: process.env.GCLOUD_PROJECT_ID,
        keyFile: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      })
    : new PubSub({
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      });

if (!process.env.GCLOUD_PUBSUB_TOPIC) {
  throw new Error('GCLOUD_PUBSUB_TOPIC environment variable is not set');
}

// Get the topic name from the full path
const topicPath = process.env.GCLOUD_PUBSUB_TOPIC;
const subscriptionName = 'notifications-sub'; // Subscription name for the notifications service

export const topic = pubsub.topic(topicPath);
export const subscription = topic.subscription(subscriptionName);

// Create the subscription if it doesn't exist
const createSubscriptionIfNotExists = async () => {
  try {
    const [exists] = await subscription.exists();
    if (!exists) {
      await topic.createSubscription(subscriptionName, {
        enableMessageOrdering: true,
      });
      console.log(`Subscription ${subscriptionName} created.`);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const publishMessage = async (data: any) => {
  try {
    const messageId = await topic.publish(Buffer.from(JSON.stringify(data)));
    console.log(`Message ${messageId} published.`);
    return messageId;
  } catch (error) {
    console.error('Error publishing message:', error);
    throw error;
  }
};

export const initializeSubscription = async () => {
  await createSubscriptionIfNotExists();

  subscription.on('message', async message => {
    try {
      const data = JSON.parse(message.data.toString());
      console.log('Received message:', data);

      // Process the message here
      await processMessage(data);

      // Acknowledge the message
      message.ack();
    } catch (error) {
      console.error('Error processing message:', error);
      // Negative acknowledge the message to retry
      message.nack();
    }
  });

  subscription.on('error', error => {
    console.error('Subscription error:', error);
  });

  console.log(`Listening for messages on subscription: ${subscriptionName}`);
};

// This function should be implemented according to your business logic
async function processMessage(data: any): Promise<void> {
  try {
    const { videoId, status, email } = data;
    
    if (!videoId || !status || !email) {
      console.error('Invalid message format. Required fields: videoId, status, email');
      return;
    }

    const notificationRepository = container.resolve('NotificationRepository');
    const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
    const subNotificationUseCase = new SubNotificationUseCase(sendNotificationUseCase);

    await subNotificationUseCase.execute({ videoId, status, email });
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}

container.register('NotificationRepository', { useClass: NotificationRepository });

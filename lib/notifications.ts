import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<void> {
  await Notifications.requestPermissionsAsync();
}

export async function sendLowStockNotification(
  productName: string,
  quantity: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Low Stock Alert',
      body: `${productName} is running low — only ${quantity} unit${quantity !== 1 ? 's' : ''} left.`,
    },
    trigger: null,
  });
}

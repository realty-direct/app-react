export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const showNotification = (message: string, type: NotificationType = 'info') => {
  // For now, we'll use console.log to display notifications
  // You can later integrate this with a proper notification library like react-toastify
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // TODO: Implement proper notification system
  // Example: toast(message, { type });
};
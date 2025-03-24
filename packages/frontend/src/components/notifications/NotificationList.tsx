import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { FiX } from 'react-icons/fi';

export function NotificationList() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : notification.type === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-primary-500 text-white'
          }`}
        >
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 rounded-full p-1 hover:bg-black/10"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

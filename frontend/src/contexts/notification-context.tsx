import React, { createContext, useContext, useEffect, useState } from "react";
import ToastContainer from "../components/ui/toast-container";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  persistent?: boolean;
  timestamp: Date;
  read?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  pushEnabled: boolean;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  requestPushPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Check if push notifications are supported and enabled
    checkPushSupport();
  }, []);

  const checkPushSupport = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.log("Push notifications not supported");
      return;
    }

    const permission = Notification.permission;
    setPushEnabled(permission === "granted");

    if (permission === "granted") {
      // TODO: Subscribe to push notifications service
      // This will be implemented when backend push service is ready
    }
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }

    // Show browser notification if permission granted and PWA enabled
    if (
      pushEnabled &&
      import.meta.env.VITE_PUSH_NOTIFICATIONS_ENABLED === "true"
    ) {
      showBrowserNotification(newNotification);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.log("Notifications not supported");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setPushEnabled(granted);

      if (granted) {
        addNotification({
          title: "Notifications Enabled",
          message: "You will now receive push notifications",
          type: "success",
        });

        // TODO: Subscribe to push service
        // This will be implemented when backend push service is ready
      }

      return granted;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    if (Notification.permission !== "granted") return;

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: notification.id,
        requireInteraction: notification.persistent,
        // timestamp: notification.timestamp.getTime(), // Not supported in all browsers
      });

      browserNotification.onclick = () => {
        // Focus the window and mark notification as read
        window.focus();
        markAsRead(notification.id);
        browserNotification.close();
      };

      // Auto-close after 5 seconds for non-persistent notifications
      if (!notification.persistent) {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    } catch (error) {
      console.error("Error showing browser notification:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        pushEnabled,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        requestPushPermission,
      }}
    >
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// Hook for showing quick toast notifications
export function useToast() {
  const { addNotification } = useNotifications();

  return {
    success: (message: string, title = "Success") =>
      addNotification({ title, message, type: "success" }),

    error: (message: string, title = "Error") =>
      addNotification({ title, message, type: "error" }),

    warning: (message: string, title = "Warning") =>
      addNotification({ title, message, type: "warning" }),

    info: (message: string, title = "Info") =>
      addNotification({ title, message, type: "info" }),

    custom: (notification: Omit<Notification, "id" | "timestamp">) =>
      addNotification(notification),
  };
}

/**
 * Future enhancements for push notifications:
 *
 * 1. Backend Integration:
 *    - Implement push notification subscription endpoint
 *    - Store push subscriptions in database
 *    - Send push notifications from backend for persistent notifications
 *
 * 2. Service Worker:
 *    - Handle push events in service worker
 *    - Show notifications when app is in background
 *    - Handle notification clicks and actions
 *
 * 3. Database-driven Notifications:
 *    - Fetch persistent notifications from API
 *    - Real-time updates via WebSocket or Server-Sent Events
 *    - Notification preferences and settings
 *
 * 4. Advanced Features:
 *    - Notification grouping and batching
 *    - Rich notification content (images, actions)
 *    - Scheduled notifications
 *    - Notification analytics and tracking
 */

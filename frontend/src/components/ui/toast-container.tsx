import React from "react";
import {
  useNotifications,
  type Notification,
} from "../../contexts/notification-context.tsx";

const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // Only show non-persistent notifications as toasts
  const toastNotifications = notifications.filter((n) => !n.persistent);

  const getToastStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-400 text-green-800";
      case "error":
        return "bg-red-50 border-red-400 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-400 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-400 text-blue-800";
      default:
        return "bg-gray-50 border-gray-400 text-gray-800";
    }
  };

  const getIconStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  if (toastNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toastNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getToastStyles(notification.type)}
            border-l-4 rounded-lg shadow-lg p-4
            pointer-events-auto
            animate-[slideIn_0.3s_ease-out]
            transition-all duration-300
          `}
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={`${getIconStyles(notification.type)} font-bold text-xl flex-shrink-0`}
            >
              {getIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">
                {notification.title}
              </h4>
              <p className="text-sm opacity-90">{notification.message}</p>
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {notification.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        action.action();
                        removeNotification(notification.id);
                      }}
                      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                        action.primary
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;

import { useState, useCallback } from "react";

interface NotificationState {
  message: string;
  type: "success" | "error" | "warning" | "info";
  isVisible: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showNotification = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      setNotification({
        message,
        type,
        isVisible: true,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => showNotification(message, "success"),
    [showNotification]
  );

  const showError = useCallback(
    (message: string) => showNotification(message, "error"),
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string) => showNotification(message, "warning"),
    [showNotification]
  );

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  };
};

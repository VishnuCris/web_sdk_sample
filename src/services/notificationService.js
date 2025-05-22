export const NotificationService = {
    push(config) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          navigator.serviceWorker.register(config.serviceWorkerPath);
          new Notification(config.titleText, {
            body: config.bodyText,
          });
        }
      });
    }
  };
  
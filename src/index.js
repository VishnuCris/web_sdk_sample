import { UserService } from "./services/userService.js";
import { EventService } from "./services/eventService.js";
import { logger, setLogLevel } from "./core/logger.js";
import { OfflineQueue } from "./services/offlineQueue.js";
import { NotificationService } from "./services/notificationService.js";

const nexora_sdk = {
  init: (options) => {
    window.__NEXORA_SECRET_KEY = options.secretKey;
    window.__NEXORA_OFFLINE_MODE = false;

    const INACTIVITY_TIMEOUT = 60000;
    let inactivityTimer;

    setLogLevel(options.logLevel || "warn");
   
    const { user, isNew } = UserService.initUser();
    logger.log("Nexora SDK initialized", { user });
    
    if(isNew) {
      EventService.send("Website Launch", {
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }else {
      if(options.is_spa){
        // Intercept pushState and replaceState
        const wrapHistoryMethod = (type) => {
          const original = history[type];
          history[type] = function (...args) {
            const result = original.apply(this, args);
            EventService.trackPageView();
            return result;
          };
        };

        wrapHistoryMethod('pushState');
        wrapHistoryMethod('replaceState');

        // Listen to browser navigation (back/forward)
        window.addEventListener('popstate', EventService.trackPageView);

        // initial page view
        EventService.trackPageView();
      }else{
        EventService.send("Page Load", {
            url: window.location.href,
            timestamp: new Date().toISOString(),
        });
      }
    }

    // track inactivity
    EventService.trackInactivity();

  },
  event: {
    push: (name, data) => EventService.send(name, data),
  },
  onUserLogin: {
    push: (data) => UserService.onLogin(data),
  },
  profile: {
    push: (data) => UserService.pushProfile(data),
  },
  notifications: {
    push: (data) => NotificationService.push(data),
  },
  setLogLevel: (level) => setLogLevel(level),
  setOfflineMode: (isOffline) => {
    window.__NEXORA_OFFLINE_MODE = isOffline;
    if (!isOffline) OfflineQueue.flush();
  },
  logout: () => UserService.logout(),
};

window.nexora_sdk = nexora_sdk;
export default nexora_sdk;

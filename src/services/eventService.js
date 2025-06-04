import { ApiService } from "./apiService.js";
import { logger } from "../core/logger.js";
import { OfflineQueue } from "./offlineQueue.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { StorageService } from "./storageService.js";

let inactivityTimer;
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes (example)
export const EventService = {
  send(event, data) {
    const user = StorageService.get(STORAGE_KEYS.USER_PROFILE)
    const payload = {
      event,
      event_properties : data,
      timestamp: new Date().toISOString(),
      session_id : user.session_id,
      device : user.device,
      app : window.__APP_NAME,
      // network
      // context
    };

    if (window.__NEXORA_OFFLINE_MODE) {
      OfflineQueue.queue(payload); // Queued payload will also be enriched by ApiService
      logger.log("Event queued (offline mode):", payload);
    } else {
      ApiService.post("/events", payload);
    }
  },
  trackPageView(){
    const url = new URL(window.location.href);  
    const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const foundUTM = utmParams.filter(param => url.searchParams.has(param));

    if (foundUTM.length > 0) {
      // UTM parameters found – fire event
      this.send("UTM Visited", {
        href: window.location.href,
        utm: Object.fromEntries(
          foundUTM.map(param => [param, url.searchParams.get(param)])
        ),
      });
    }else{
      this.send("Web Session Started", {
        url: window.location.href,
      });
    }
  },
  trackInactivity(){
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // User is inactive
        this.send("Web Session Started", {
          url: window.location.href,
        });
      }, INACTIVITY_TIMEOUT);
    };

    // Events to listen for activity
    ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start tracking after SDK initializes
    resetInactivityTimer();

  }
};

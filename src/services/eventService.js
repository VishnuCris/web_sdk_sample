import { ApiService } from "./apiService.js";
import { logger } from "../core/logger.js";
import { OfflineQueue } from "./offlineQueue.js";

export const EventService = {
  send(event, data) {
    const payload = {
      event,
      data,
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
      nexora_sdk.event.push("UTM Visited", {
        href: window.location.href,
        utm: Object.fromEntries(
          foundUTM.map(param => [param, url.searchParams.get(param)])
        ),
        timestamp: new Date().toISOString(),
      });
    }else{
      this.send("Web Session Started", {
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }
  },
  trackInactivity(){
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // User is inactive
        nexora_sdk.event.push("Web Session Started", {
          url: window.location.href,
          timestamp: new Date().toISOString(),
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

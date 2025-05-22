import { STORAGE_KEYS } from "../core/constants.js";
import { StorageService } from "./storageService.js";
import { ApiService } from "./apiService.js";

export const OfflineQueue = {
  queue(event) {
    const events = StorageService.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
    events.push(event);
    StorageService.set(STORAGE_KEYS.OFFLINE_QUEUE, events);
  },
  flush() {
    const events = StorageService.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
    events.forEach(e => ApiService.post("/events", e));  // User & token added inside ApiService
    StorageService.remove(STORAGE_KEYS.OFFLINE_QUEUE);
  }
};

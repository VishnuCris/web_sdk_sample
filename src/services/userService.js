import { STORAGE_KEYS } from "../core/constants.js";
import { StorageService } from "./storageService.js";
import { ExternalService } from "./externalService.js";
import { logger } from "../core/logger.js";

export const UserService = {
  initUser(meta_data = null) {
    let user = StorageService.get(STORAGE_KEYS.USER_PROFILE);
    let isNew = false
    if (!user) {
      isNew = true
      user = { id: ExternalService.generateUUID(), anonymous: true, createdAt: new Date().toISOString(), };
      // location and device data
      if(meta_data){
        for(let key in meta_data){
          if(meta_data[key])
            user[key] = meta_data[key]
        }
      }else{
        // ask permission for locations and more
        user["Language"] =  navigator.language
        user["Platform"] =  navigator.platform
        user["Device"] = navigator.userAgent
        user["UseLocation"] =  true
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // find location
              if (window.__NEXORA_OFFLINE_MODE) {
                logger.log("Event queued (offline mode): location unable to know");
              }else{
                user["location"] = ExternalService.getLocationName(position.coords.latitude, position.coords.longitude)
              }
            },
            (error) => {
              console.error("Error getting location:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        }
      }
      console.log(user)
      StorageService.set(STORAGE_KEYS.USER_PROFILE, user);
    }
    return {user, isNew};
  },
  onLogin(data) {
    let user = StorageService.get(STORAGE_KEYS.USER_PROFILE) || {};
    user = { ...user, ...data, anonymous: false };
    StorageService.set(STORAGE_KEYS.USER_PROFILE, user);
    return {user, isNew:false};
  },
  pushProfile(details) {
    let user = StorageService.get(STORAGE_KEYS.USER_PROFILE) || {};
    Object.assign(user, details);
    StorageService.set(STORAGE_KEYS.USER_PROFILE, user);
  },
  logout() {
    let user = StorageService.get(STORAGE_KEYS.USER_PROFILE);
    StorageService.remove(STORAGE_KEYS.USER_PROFILE);
    return this.initUser({
      'Device': user.device, 
      'Location': user.location, 
      'Platform': user.platform,
      'Language': user.language,
    });
  },
  getUser() {
    return StorageService.get(STORAGE_KEYS.USER_PROFILE);
  }
};

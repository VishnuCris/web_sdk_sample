import { STORAGE_KEYS } from "../core/constants.js";
import { StorageService } from "./storageService.js";
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

export const UserService = {
  initUser() {
    let user = StorageService.get(STORAGE_KEYS.USER_PROFILE);
    if (!user) {
      user = { id: uuidv4(), anonymous: true, createdAt: new Date().toISOString(), };
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
    StorageService.remove(STORAGE_KEYS.USER_PROFILE);
    return this.initUser();
  },
  getUser() {
    return StorageService.get(STORAGE_KEYS.USER_PROFILE);
  }
};

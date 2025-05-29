import { config } from "../core/config.js";
import { logger } from "../core/logger.js";
import { UserService } from "./userService.js";

export const ApiService = {
  post(path, data = {}) {
    const userProfile = UserService.getUser();

    const payload = {
      ...data,
      user: userProfile,
      token: window.__NEXORA_SECRET_KEY,
    };
    console.log(userProfile);
    console.log(data);
    // fetch(`${config.apiBaseUrl}${path}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${window.__NEXORA_SECRET_KEY}`,
    //   },
    //   body: JSON.stringify(payload),
    // })
    // .then(async (res) => {
    //   if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    //   const json = await res.json();
    //   logger.log("API Response:", json);
    //   return json;
    // })
    // .catch(logger.error);
  }
};

let currentLevel = "warn";

export const setLogLevel = (level) => currentLevel = level;

export const logger = {
  log: (...args) => currentLevel === "debug" && console.log("[Nexora SDK]", ...args),
  warn: (...args) => ["debug", "warn"].includes(currentLevel) && console.warn("[Nexora SDK]", ...args),
  error: (...args) => console.error("[Nexora SDK]", ...args),
};

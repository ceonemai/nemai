const requireServiceUrl = (value, variableName) => {
  const normalizedValue = value?.trim().replace(/\/+$/, "");

  if (!normalizedValue) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return normalizedValue;
};

export const CUSTOMER_SERVICE_URL = requireServiceUrl(
  import.meta.env.VITE_CUSTOMER_SERVICE_URL,
  "VITE_CUSTOMER_SERVICE_URL"
);

export const CHAT_AI_SERVICE_URL = requireServiceUrl(
  import.meta.env.VITE_CHAT_AI_SERVICE_URL,
  "VITE_CHAT_AI_SERVICE_URL"
);

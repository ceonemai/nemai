const normalizedCustomerServiceUrl = import.meta.env.VITE_CUSTOMER_SERVICE_URL
  ?.trim()
  .replace(/\/+$/, "");

if (!normalizedCustomerServiceUrl) {
  throw new Error("Missing required environment variable: VITE_CUSTOMER_SERVICE_URL");
}

export const CUSTOMER_SERVICE_URL = normalizedCustomerServiceUrl;

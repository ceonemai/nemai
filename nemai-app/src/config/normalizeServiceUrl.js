const stripTrailingSlashes = (value) => value.replace(/\/+$/, "");

export const normalizeApiVersion = (value = "v1") => {
  const normalizedVersion = String(value).trim().toLowerCase();

  if (normalizedVersion !== "v1" && normalizedVersion !== "v2") {
    throw new Error("VITE_CHAT_AI_API_VERSION must be either v1 or v2");
  }

  return normalizedVersion;
};

export const ensureApiVersionBaseUrl = (value, version) => {
  const normalizedValue = stripTrailingSlashes(value.trim());
  const serviceOrigin = normalizedValue.replace(/\/api\/v[12]$/, "");
  const normalizedVersion = normalizeApiVersion(version);

  return `${serviceOrigin}/api/${normalizedVersion}`;
};

export const ensureApiV1BaseUrl = (value) => ensureApiVersionBaseUrl(value, "v1");

export const ensureApiV2BaseUrl = (value) => ensureApiVersionBaseUrl(value, "v2");

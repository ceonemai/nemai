const stripTrailingSlashes = (value) => value.replace(/\/+$/, "");

export const ensureApiV1BaseUrl = (value) => {
  const normalizedValue = stripTrailingSlashes(value.trim());

  return normalizedValue.endsWith("/api/v1")
    ? normalizedValue
    : `${normalizedValue}/api/v1`;
};

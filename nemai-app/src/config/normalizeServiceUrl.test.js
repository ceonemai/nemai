import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureApiV1BaseUrl,
  ensureApiV2BaseUrl,
  ensureApiVersionBaseUrl,
  normalizeApiVersion
} from "./normalizeServiceUrl.js";

test("adds /api/v1 to a service origin", () => {
  assert.equal(
    ensureApiV1BaseUrl("https://chat.example.com"),
    "https://chat.example.com/api/v1"
  );
});

test("does not duplicate an existing /api/v1 prefix", () => {
  assert.equal(
    ensureApiV1BaseUrl("https://chat.example.com/api/v1/"),
    "https://chat.example.com/api/v1"
  );
});

test("adds /api/v2 to a service origin", () => {
  assert.equal(
    ensureApiV2BaseUrl("https://chat.example.com"),
    "https://chat.example.com/api/v2"
  );
});

test("replaces an existing API version with /api/v2", () => {
  assert.equal(
    ensureApiV2BaseUrl("https://chat.example.com/api/v1/"),
    "https://chat.example.com/api/v2"
  );
});

test("selects the configured API version", () => {
  assert.equal(
    ensureApiVersionBaseUrl("https://chat.example.com/api/v2", "v1"),
    "https://chat.example.com/api/v1"
  );
});

test("uses v1 as the default API version", () => {
  assert.equal(normalizeApiVersion(), "v1");
});

test("normalizes the configured API version", () => {
  assert.equal(normalizeApiVersion(" V1 "), "v1");
});

test("rejects an unsupported API version", () => {
  assert.throws(
    () => normalizeApiVersion("v3"),
    /must be either v1 or v2/
  );
});

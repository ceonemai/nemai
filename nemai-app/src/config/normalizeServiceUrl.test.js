import test from "node:test";
import assert from "node:assert/strict";
import { ensureApiV1BaseUrl } from "./normalizeServiceUrl.js";

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

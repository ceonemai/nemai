import test from "node:test";
import assert from "node:assert/strict";
import { buildChatMessagePayload } from "./chatApi.js";

test("builds the Dify-compatible v1 chat payload", () => {
  assert.deepEqual(
    buildChatMessagePayload({
      apiVersion: "v1",
      query: "Hello",
      conversationId: "conversation-1"
    }),
    {
      inputs: {},
      query: "Hello",
      conversation_id: "conversation-1",
      response_mode: "blocking"
    }
  );
});

test("builds the Gemini-compatible v2 chat payload", () => {
  assert.deepEqual(
    buildChatMessagePayload({
      apiVersion: "v2",
      query: "Hello",
      conversationId: "conversation-2"
    }),
    {
      query: "Hello",
      conversation_id: "conversation-2",
      source: "chat"
    }
  );
});

test("sends attachment IDs and the retry key on an image-only v2 turn", () => {
  const options = { query: "", attachmentIds: ["image-1"], clientRequestId: "request-1" };
  assert.deepEqual(buildChatMessagePayload({ ...options, apiVersion: "v2" }), {
    query: "",
    conversation_id: undefined,
    source: "chat",
    attachment_ids: ["image-1"],
    client_request_id: "request-1"
  });
  const legacy = buildChatMessagePayload({ ...options, apiVersion: "v1" });
  assert.equal("attachment_ids" in legacy, false);
  assert.equal("client_request_id" in legacy, false);
});

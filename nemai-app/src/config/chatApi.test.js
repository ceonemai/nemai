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

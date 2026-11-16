import { normalizeApiVersion } from "./normalizeServiceUrl.js";

export const buildChatMessagePayload = ({ apiVersion, query, conversationId }) => {
  const commonPayload = {
    query,
    conversation_id: conversationId
  };

  if (normalizeApiVersion(apiVersion) === "v2") {
    return {
      ...commonPayload,
      source: "chat"
    };
  }

  return {
    inputs: {},
    ...commonPayload,
    response_mode: "blocking"
  };
};

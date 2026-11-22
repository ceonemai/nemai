import { normalizeApiVersion } from "./normalizeServiceUrl.js";

export const CHAT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_CHAT_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_CHAT_IMAGES = 3;

export const buildChatMessagePayload = ({ apiVersion, query, conversationId, attachmentIds, clientRequestId }) => {
  const commonPayload = {
    query,
    conversation_id: conversationId
  };

  if (normalizeApiVersion(apiVersion) === "v2") {
    return {
      ...commonPayload,
      source: "chat",
      ...(attachmentIds?.length ? { attachment_ids: attachmentIds } : {}),
      ...(clientRequestId ? { client_request_id: clientRequestId } : {})
    };
  }

  return {
    inputs: {},
    ...commonPayload,
    response_mode: "blocking"
  };
};

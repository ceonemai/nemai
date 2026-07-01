export function formatBlogDate(isoString) {
  if (!isoString) return "Date unavailable";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatBlogDateShort(isoString) {
  if (!isoString) return "Date unavailable";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getBlogCoverImage(imageUrls) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return null;

  const first = imageUrls[0];
  if (typeof first !== "string" || !first.trim()) return null;

  return first;
}

export function truncateText(value, maxLength = 130) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

export function markdownToPlainText(markdown) {
  if (!markdown || typeof markdown !== "string") return "";

  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function estimateReadMinutes(text, wordsPerMinute = 220) {
  if (!text || typeof text !== "string") return 1;

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatReadTimeLabel(minutes) {
  const safeMinutes = Number.isFinite(minutes) ? Math.max(1, Math.floor(minutes)) : 1;
  return safeMinutes === 1 ? "1 min read" : `${safeMinutes} mins read`;
}

import { CUSTOMER_SERVICE_URL } from "../config/serviceUrls";

const BLOG_API_BASE = `${CUSTOMER_SERVICE_URL}/api/v1/blog-posts`;

async function parseJsonResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    throw new Error("Unable to parse server response.");
  }

  if (!response.ok) {
    const message = payload?.message || "Request failed. Please try again.";
    throw new Error(message);
  }

  return payload;
}

export async function fetchBlogPosts(signal) {
  const response = await fetch(BLOG_API_BASE, { signal });
  const payload = await parseJsonResponse(response);

  const items = payload?.data?.items;
  if (!Array.isArray(items)) return [];

  return items;
}

export async function fetchBlogPostById(id, signal) {
  const response = await fetch(`${BLOG_API_BASE}/${id}`, { signal });
  const payload = await parseJsonResponse(response);

  const blog = payload?.data;
  if (!blog || typeof blog !== "object") {
    throw new Error("Blog post not found.");
  }

  return blog;
}

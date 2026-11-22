import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { rehypeChatReplyFormatting } from "./chatReplyFormatting.js";

function renderReply(reply) {
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    rehypePlugins: [rehypeRaw, rehypeChatReplyFormatting]
  }, reply));
}

test("puts inline questions on separate lines and bolds the urgency level", () => {
  const html = renderReply("ขอถามเพิ่มเติมดังนี้ครับ: 1. เริ่มเป็นเมื่อไหร่ 2. วัดอุณหภูมิได้เท่าไหร่ 3. มีอาการอื่นไหม ระดับความเร่งด่วนคือ Level 5 - White (Self-care)");

  assert.match(html, /<br\/>1\. เริ่มเป็นเมื่อไหร่<br\/>2\. วัดอุณหภูมิได้เท่าไหร่<br\/>3\. มีอาการอื่นไหม/);
  assert.match(html, /<strong>Level 5 - White \(Self-care\)<\/strong>/);
});

test("keeps inline emphasis and does not treat decimals as list markers", () => {
  const html = renderReply("Readings were 38.2 and 38.5. Next, 1. **Check the reading** 2. Note the time. ระดับ 3 – สีเหลือง");

  assert.match(html, /38\.2 and 38\.5\. Next,<br\/>1\. <strong>Check the reading<\/strong><br\/>2\. Note the time\./);
  assert.match(html, /<strong>ระดับ 3 – สีเหลือง<\/strong>/);
  assert.equal(renderReply("The value was 1. It then changed to 3."), "<p>The value was 1. It then changed to 3.</p>");
});

test("preserves Markdown lists, existing bold and code", () => {
  const html = renderReply("1. First\n2. Second\n\n**Urgency: Level 2 - Orange**\n\n`Level 5 - White`");

  assert.match(html, /<ol>\s*<li>First<\/li>\s*<li>Second<\/li>\s*<\/ol>/);
  assert.match(html, /<strong>Urgency: Level 2 - Orange<\/strong>/);
  assert.match(html, /<code>Level 5 - White<\/code>/);
});

test("moves a standalone urgency label above the advice list", () => {
  const html = renderReply("Assessment\n\n- Triage Level: **Level 5 - White (Self-care)**\n- **Rest:** Take a break.\n- Watch for changes.");

  assert.match(html, /<p>Assessment<\/p>\s*<p><strong>Level 5 - White \(Self-care\)<\/strong><\/p>\s*<ul>\s*<li><strong>Rest:<\/strong> Take a break\.<\/li>\s*<li>Watch for changes\.<\/li>/);
});

test("recognizes the Dify level title and preserves an urgency mention inside advice", () => {
  const html = renderReply("- Level 5 (White) — Self-Care\n\n- The note described Level 5 (White) — Self-Care.");

  assert.match(html, /<p><strong>Level 5 \(White\) — Self-Care<\/strong><\/p>/);
  assert.match(html, /<li>\s*<p>The note described <strong>Level 5 \(White\) — Self-Care<\/strong>\.<\/p>\s*<\/li>/);
});

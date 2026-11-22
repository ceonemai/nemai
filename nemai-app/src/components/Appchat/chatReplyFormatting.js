const numberedItem = /(^|[ \t]+)([1-9]\d?)[.)](?=[ \t])/gm;
const triageLevel = /(?:\bLevel|ระดับ)[ \t]*[1-5][ \t]*(?:[-–—:][ \t]*(?:(?:Red|Orange|Yellow|Green|White)\b|สี(?:แดง|ส้ม|เหลือง|เขียว|ขาว))(?:[ \t]+\([^()\r\n]+\))?|\((?:Red|Orange|Yellow|Green|White)\)(?:[ \t]+[-–—][ \t]+(?:Emergency|High Risk|Medical Attention Needed|Non-urgent|Self-care)\b)?)/gi;
const triagePrefix = /^(?:Triage(?: Level)?|Urgency(?: Level)?|ระดับความเร่งด่วน(?:ของอาการ)?)[ \t]*[:：][ \t]*/i;

function strongText(value) {
  return {
    type: "element",
    tagName: "strong",
    properties: {},
    children: [{ type: "text", value }]
  };
}

function headingText(node) {
  if (node.type === "text") return node.value;
  if (!["li", "p", "strong"].includes(node.tagName)) return null;
  const parts = node.children.map(headingText);
  return parts.includes(null) ? null : parts.join("");
}

function separateTriageHeading(list) {
  if (list.tagName !== "ul") return [list];
  const firstItem = list.children.find((child) => child.tagName === "li");
  if (!firstItem) return [list];

  const level = headingText(firstItem)?.trim().replace(triagePrefix, "");
  if (!level || [...level.matchAll(triageLevel)][0]?.[0] !== level) return [list];

  const heading = { type: "element", tagName: "p", properties: {}, children: [strongText(level)] };
  const remaining = list.children.filter((child) => child !== firstItem);
  return remaining.some((child) => child.type === "element") ? [heading, { ...list, children: remaining }] : [heading];
}

function breakInlineNumberedList(children) {
  const items = children.flatMap((child, childIndex) =>
    child.type === "text"
      ? Array.from(child.value.matchAll(numberedItem), (match) => ({ childIndex, match }))
      : []
  );
  const first = items.findIndex(({ match }, index) =>
    match[2] === "1" && items[index + 1]?.match[2] === "2"
  );
  if (first === -1) return children;

  const breaksByChild = new Map();
  for (const [offset, { childIndex, match }] of items.slice(first).entries()) {
    if (Number(match[2]) !== offset + 1) break;
    const breaks = breaksByChild.get(childIndex) ?? [];
    breaks.push(match);
    breaksByChild.set(childIndex, breaks);
  }

  return children.flatMap((child, childIndex) => {
    const breaks = breaksByChild.get(childIndex);
    if (!breaks) return [child];

    const parts = [];
    let cursor = 0;
    for (const match of breaks) {
      const before = child.value.slice(cursor, match.index);
      if (before) parts.push({ type: "text", value: before });
      const startsLine = child.value[match.index - 1] === "\n" ||
        (match.index === 0 && (childIndex === 0 || children[childIndex - 1].tagName === "br"));
      if (!startsLine) parts.push({ type: "element", tagName: "br", properties: {}, children: [] });
      cursor = match.index + match[1].length;
    }
    parts.push({ type: "text", value: child.value.slice(cursor) });
    return parts;
  });
}

function boldTriageLevels(node) {
  const parts = [];
  let cursor = 0;
  for (const match of node.value.matchAll(triageLevel)) {
    const before = node.value.slice(cursor, match.index);
    if (before) parts.push({ type: "text", value: before });
    parts.push(strongText(match[0]));
    cursor = match.index + match[0].length;
  }
  if (cursor === 0) return [node];
  const after = node.value.slice(cursor);
  if (after) parts.push({ type: "text", value: after });
  return parts;
}

export const rehypeChatReplyFormatting = () => (tree) => {
  const visit = (node) => {
    if (!node.children || ["a", "code", "pre", "strong", "script", "style"].includes(node.tagName)) return;
    if (node.tagName === "p" || node.tagName === "li") {
      node.children = breakInlineNumberedList(node.children);
    }
    node.children = node.children.flatMap((child) =>
      child.type === "text" ? boldTriageLevels(child) : [child]
    );
    node.children.forEach(visit);
  };

  tree.children = tree.children.flatMap(separateTriageHeading);
  visit(tree);
};

export function truncateText(text, maxLength = 36) {
  if (!text || text.length <= maxLength) return text;

  const cutText = text.slice(0, maxLength);
  const lastSpace = cutText.lastIndexOf(" ");

  if (lastSpace === -1) {
    return cutText + " ...";
  }

  return cutText.slice(0, lastSpace) + " ...";
}

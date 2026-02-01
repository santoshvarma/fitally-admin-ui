

export const stripHtml = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const previewText = (html = "", length = 120) => {
  const text = stripHtml(html);
  return text.length > length
    ? text.substring(0, length) + "…"
    : text;
};

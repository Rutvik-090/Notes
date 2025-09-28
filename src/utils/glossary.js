// Example glossary dictionary
const glossary = {
  React: "A JavaScript library for building user interfaces",
  JavaScript: "A programming language for the web",
  HTML: "The standard markup language for documents",
  CSS: "A style sheet language used for styling HTML content",
};

// Highlight glossary terms
export function highlightGlossary(text) {
  if (!text) return "";
  let highlighted = text;

  Object.keys(glossary).forEach((term) => {
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    highlighted = highlighted.replace(
      regex,
      `<span class="glossary-term" title="${glossary[term]}">$1</span>`
    );
  });

  return highlighted;
}

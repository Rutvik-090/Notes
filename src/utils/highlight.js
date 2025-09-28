import { glossary } from "./glossary";

export function highlightGlossary(content) {
  if (!content) return "";

  let highlighted = content;

  Object.keys(glossary).forEach((term) => {
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    highlighted = highlighted.replace(
      regex,
      `<span class="glossary-term" data-definition="${glossary[term]}">$1</span>`
    );
  });

  return highlighted;
}

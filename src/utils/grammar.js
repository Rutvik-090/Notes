// utils/grammar.js
export const checkGrammar = async (text) => {
  try {
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text,
        language: "en-US",
      }),
    });
    const data = await res.json();
    return data.matches || [];
  } catch (err) {
    console.error("Grammar check failed:", err);
    return [];
  }
};

export const highlightGrammarErrors = (text, mistakes) => {
  if (!mistakes.length) return text;

  let result = text;

  // Sort mistakes by offset in reverse order to avoid position shifts
  const sortedMistakes = [...mistakes].sort((a, b) => b.offset - a.offset);

  sortedMistakes.forEach((mistake) => {
    const before = result.substring(0, mistake.offset);
    const errorText = result.substring(
      mistake.offset,
      mistake.offset + mistake.length
    );
    const after = result.substring(mistake.offset + mistake.length);

    // Simple underline with red wavy style
    const highlighted = `<span class="grammar-error" style="text-decoration: underline; text-decoration-color: red; text-decoration-style: wavy;" title="${mistake.message}">${errorText}</span>`;

    result = before + highlighted + after;
  });

  return result;
};

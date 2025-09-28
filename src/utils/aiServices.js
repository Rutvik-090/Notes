// aiService.js

// Frontend only calls the proxy server
const HF_API_URL = import.meta.env.VITE_API_URL; // Your proxy endpoint
const HF_API_KEY = import.meta.env.VITE_API_KEY; // Used by the backend only

// Model configurations
const MODELS = {
  summarization: "facebook/bart-large-cnn",
  classification: "facebook/bart-large-mnli",
};

// Call proxy server for Hugging Face requests
async function callHFProxy(model, payload) {
  try {
    const response = await fetch(`${HF_API_URL}/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Proxy API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("HF proxy error:", error);
    throw error;
  }
}

// Generate summary
export async function generateSummary(text) {
  if (!text || text.trim().length < 50) throw new Error("Text too short");

  const cleanText = text
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 1024);

  try {
    const result = await callHFProxy(MODELS.summarization, {
      inputs: cleanText,
      parameters: { max_length: 150, min_length: 30, do_sample: false },
      options: { wait_for_model: true },
    });

    // Handle different formats
    if (Array.isArray(result) && result.length > 0) {
      return result[0].summary_text || result[0].generated_text || "";
    } else if (result.summary_text || result.generated_text) {
      return result.summary_text || result.generated_text;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (err) {
    console.warn("Using local fallback summary due to error:", err);
    return generateLocalSummary(cleanText);
  }
}

// Generate tags
export async function generateTags(text) {
  if (!text || text.trim().length < 10) throw new Error("Text too short");

  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  try {
    const aiTags = await generateAITags(cleanText);
    const keywordTags = extractKeywordTags(cleanText);
    return [...new Set([...aiTags, ...keywordTags])].slice(0, 8);
  } catch (err) {
    console.warn("AI tags failed, fallback to keyword tags", err);
    return extractKeywordTags(cleanText);
  }
}

// Generate AI tags
async function generateAITags(text) {
  const candidateLabels = [
    "work",
    "personal",
    "project",
    "meeting",
    "idea",
    "todo",
    "research",
    "learning",
    "technology",
    "business",
    "creative",
    "planning",
    "review",
    "brainstorming",
    "documentation",
    "analysis",
    "strategy",
    "development",
    "design",
    "communication",
    "finance",
    "health",
    "travel",
    "education",
    "productivity",
    "goals",
    "habits",
    "reflection",
    "insights",
  ];

  try {
    const result = await callHFProxy(MODELS.classification, {
      inputs: text.substring(0, 500),
      parameters: { candidate_labels: candidateLabels, multi_label: true },
      options: { wait_for_model: true },
    });

    if (result.labels && result.scores) {
      return result.labels.filter((_, i) => result.scores[i] > 0.3).slice(0, 5);
    }

    return [];
  } catch (err) {
    console.error("AI tag generation error:", err);
    return [];
  }
}

// Fallback keyword tag extraction
function extractKeywordTags(text) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "this",
    "that",
    "these",
    "those",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w));

  const freq = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

  const topWords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([w]) => w);

  const contextTags = [];
  if (/meeting|agenda/i.test(text)) contextTags.push("meeting");
  if (/todo|task/i.test(text)) contextTags.push("todo");
  if (/idea|brainstorm/i.test(text)) contextTags.push("idea");
  if (/project|plan/i.test(text)) contextTags.push("project");

  return [...new Set([...contextTags, ...topWords])].slice(0, 8);
}

// Local fallback summarization
function generateLocalSummary(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length <= 2) return text.substring(0, 200) + "...";

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const freq = {};
  words.forEach((w) => {
    if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
  });

  const scored = sentences.map((s, i) => {
    const sWords = s.toLowerCase().match(/\b\w+\b/g) || [];
    const score =
      sWords.reduce((a, w) => a + (freq[w] || 0), 0) / sWords.length;
    return { sentence: s.trim(), score: score * (i === 0 ? 1.5 : 1), index: i };
  });

  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);

  return topSentences.join(". ") + ".";
}

// Utility: clean HTML
export function cleanHtmlContent(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

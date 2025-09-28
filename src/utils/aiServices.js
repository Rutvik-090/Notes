const HF_API_URL = import.meta.env.REACT_APP_HF_API_URL; // API URL
const HF_API_KEY = import.meta.env.REACT_APP_HF_API_KEY; // Your key

// Model configurations
const MODELS = {
  summarization: "facebook/bart-large-cnn", // Good for summarization
  classification: "microsoft/DialoGPT-medium", // For tag generation (we'll use a different approach)
  sentiment: "cardiffnlp/twitter-roberta-base-sentiment-latest",
};

// Test Hugging Face API connection
export async function testHFConnection() {
  try {
    const response = await fetch(`${HF_API_URL}${MODELS.summarization}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "Test connection",
        options: { wait_for_model: true },
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "API connection failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate summary using Hugging Face API
export async function generateSummary(text) {
  if (!text || text.trim().length < 50) {
    throw new Error("Text too short for summarization");
  }

  // Clean the text (remove HTML tags if any)
  let cleanText = text.replace(/<[^>]*>/g, "").trim();

  if (cleanText.length > 1024) {
    // Truncate if too long for the model
    cleanText = cleanText.substring(0, 1024);
  }

  try {
    const response = await fetch(`${HF_API_URL}${MODELS.summarization}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: cleanText,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        },
        options: {
          wait_for_model: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate summary");
    }

    const result = await response.json();

    // Handle different response formats
    if (Array.isArray(result) && result.length > 0) {
      return (
        result[0].summary_text ||
        result[0].generated_text ||
        "Summary generation failed"
      );
    } else if (result.summary_text) {
      return result.summary_text;
    } else if (result.generated_text) {
      return result.generated_text;
    } else {
      throw new Error("Unexpected response format from API");
    }
  } catch (error) {
    console.error("Summary generation error:", error);

    // Fallback to local summary generation
    return generateLocalSummary(cleanText);
  }
}

// Generate tags using a combination of keyword extraction and AI
export async function generateTags(text) {
  if (!text || text.trim().length < 10) {
    throw new Error("Text too short for tag generation");
  }

  // Clean the text
  const cleanText = text.replace(/<[^>]*>/g, "").trim();

  try {
    // First, try to generate tags using a classification approach
    const aiTags = await generateAITags(cleanText);

    // Combine with keyword-based tags
    const keywordTags = extractKeywordTags(cleanText);

    // Merge and deduplicate
    const allTags = [...new Set([...aiTags, ...keywordTags])];

    // Return top 5-8 most relevant tags
    return allTags.slice(0, 8);
  } catch (error) {
    console.error("AI tag generation failed, using keyword extraction:", error);
    return extractKeywordTags(cleanText);
  }
}

// Generate tags using AI (zero-shot classification)
async function generateAITags(text) {
  // Use zero-shot classification for tag generation
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
    const response = await fetch(`${HF_API_URL}facebook/bart-large-mnli`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text.substring(0, 500), // Limit input length
        parameters: {
          candidate_labels: candidateLabels,
          multi_label: true,
        },
        options: {
          wait_for_model: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Classification API failed");
    }

    const result = await response.json();

    // Extract high-confidence labels
    if (result.labels && result.scores) {
      const relevantTags = result.labels
        .filter((_, index) => result.scores[index] > 0.3) // Confidence threshold
        .slice(0, 5); // Top 5 AI-generated tags

      return relevantTags;
    }

    return [];
  } catch (error) {
    console.error("AI tag generation error:", error);
    return [];
  }
}

// Extract keyword-based tags (fallback method)
function extractKeywordTags(text) {
  // Common stop words to exclude
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
    "above",
    "below",
    "between",
    "among",
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

  // Extract words and calculate frequency
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word) // Exclude pure numbers
    );

  // Calculate word frequency
  const wordFreq = {};
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top frequent words as tags
  const keywordTags = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // Add some context-aware tags based on content patterns
  const contextTags = [];
  if (
    text.toLowerCase().includes("meeting") ||
    text.toLowerCase().includes("agenda")
  ) {
    contextTags.push("meeting");
  }
  if (
    text.toLowerCase().includes("todo") ||
    text.toLowerCase().includes("task")
  ) {
    contextTags.push("todo");
  }
  if (
    text.toLowerCase().includes("idea") ||
    text.toLowerCase().includes("brainstorm")
  ) {
    contextTags.push("idea");
  }
  if (
    text.toLowerCase().includes("project") ||
    text.toLowerCase().includes("plan")
  ) {
    contextTags.push("project");
  }

  return [...new Set([...contextTags, ...keywordTags])].slice(0, 8);
}

// Local fallback summary generation
function generateLocalSummary(text) {
  // Simple extractive summarization
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);

  if (sentences.length <= 2) {
    return text.substring(0, 200) + "...";
  }

  // Score sentences based on word frequency and position
  const wordFreq = {};
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];

  words.forEach((word) => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const sentenceScores = sentences.map((sentence, index) => {
    const sentWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const score =
      sentWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0) /
      sentWords.length;
    const positionScore = index === 0 ? 1.5 : 1; // Boost first sentence
    return { sentence: sentence.trim(), score: score * positionScore, index };
  });

  // Select top 2-3 sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
    .sort((a, b) => a.index - b.index) // Restore original order
    .map((item) => item.sentence);

  return topSentences.join(". ") + ".";
}

// Utility function to clean HTML content
export function cleanHtmlContent(htmlContent) {
  return htmlContent.replace(/<[^>]*>/g, "").trim();
}

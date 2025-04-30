export function detectLanguage(text: string): "en" | "de" | "ja" {
  if (!text) return "en";

  const cleanText = text.toLowerCase().trim();

  // Check for Japanese characters (Hiragana, Katakana, Kanji ranges)
  // Also look for common Japanese words in parentheses that might appear in translations
  const japanesePattern =
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]|konnichiwa|ohayo|sayonara|arigato|onegai|sumimasen/i;
  if (japanesePattern.test(cleanText)) {
    return "ja";
  }

  // Look for German characters and words
  const germanChars = /[äöüßÄÖÜ]/;
  // Add words like "wiedersehen" and "bald" that are in your example
  const commonGermanWords =
    /\b(und|der|die|das|ist|ich|du|wir|sie|nicht|ein|eine|zu|für|mit|dem|den|wie|ja|nein|aber|oder|wenn|dann|auch|schon|noch|nur|so|da|hier|wiedersehen|bis|hallo|guten|tag|morgen|abend|nacht)\b/gi;
  const germanMatches = cleanText.match(commonGermanWords) || [];

  // If text contains German characters or has multiple German word matches and is more than a few words
  if (
    germanChars.test(cleanText) ||
    (germanMatches.length >= 1 && cleanText.split(" ").length > 2) ||
    cleanText.includes("auf wiedersehen") ||
    cleanText.includes("bis bald")
  ) {
    return "de";
  }

  return "en";
}

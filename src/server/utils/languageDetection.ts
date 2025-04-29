export function detectLanguage(text: string): "en" | "de" | "ja" {
  if (!text) return "en";

  const cleanText = text.toLowerCase().trim();

  // Check for Japanese characters (Hiragana, Katakana, Kanji ranges)
  const japanesePattern =
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
  if (japanesePattern.test(cleanText)) {
    return "ja";
  }

  const germanChars = /[äöüßÄÖÜ]/;
  const commonGermanWords =
    /\b(und|der|die|das|ist|ich|du|wir|sie|nicht|ein|eine|zu|für|mit|dem|den|wie|ja|nein|aber|oder|wenn|dann|auch|schon|noch|nur|so|da|hier|dort|jetzt|heute|morgen|kann|muss|soll|will|wurde|haben|sein|werden)\b/g;
  const germanMatches = cleanText.match(commonGermanWords) || [];
  // If text contains German characters or has multiple German word matches and is more than a few words
  if (
    germanChars.test(cleanText) ||
    (germanMatches.length >= 2 && cleanText.split(" ").length > 3)
  ) {
    return "de";
  }
  return "en";
}

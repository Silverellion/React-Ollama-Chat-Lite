export function detectLanguage(text: string): "en" | "de" | "ja" {
  if (!text) return "en";

  const cleanText = text.toLowerCase().trim();

  // Japanese detection
  const japanesePattern =
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]|konnichiwa|ohayo|sayonara|arigato|onegai|sumimasen/i;
  if (japanesePattern.test(cleanText)) {
    return "ja";
  }

  // German detection
  if (/[äöüßÄÖÜ]/.test(cleanText)) {
    return "de";
  }

  return "en";
}

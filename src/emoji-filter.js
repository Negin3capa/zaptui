/**
 * Emoji filtering utility for neo-blessed UI
 * Removes emojis from chat names to ensure consistent border rendering
 */

/**
 * Emoji regex pattern - matches all emoji characters
 * This includes:
 * - Basic emojis (U+1F600-1F64F, etc.)
 * - Emoji with skin tones
 * - Emoji with ZWJ sequences
 * - Variation selectors
 */
const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}\u{FE00}-\u{FE0F}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/gu;

/**
 * Additional Unicode symbols that can cause rendering issues
 * - Hebrew combining characters (vowels)
 * - Mathematical alphanumeric symbols (bold/italic)
 * - Zero-width characters
 */
const PROBLEMATIC_UNICODE_REGEX =
  /[\u0300-\u036F\u0591-\u05C7\u{1D400}-\u{1D7FF}\u200B-\u200D\uFEFF\u00AD\u2060]/gu;

/**
 * Strip emojis from text
 * Replaces emojis with a simple indicator for user awareness
 *
 * @param {string} text - Text to filter
 * @param {string} replacement - Replacement for emojis (default: '')
 * @returns {string} Text with emojis removed/replaced
 */
function stripEmojis(text, replacement = "") {
  if (!text) return "";

  // Remove emojis
  let filtered = text.replace(EMOJI_REGEX, replacement);

  // Remove problematic Unicode
  filtered = filtered.replace(PROBLEMATIC_UNICODE_REGEX, "");

  // Clean up extra spaces from removed emojis
  filtered = filtered.replace(/\s+/g, " ").trim();

  return filtered;
}

/**
 * Check if text contains emojis
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains emojis
 */
function hasEmojis(text) {
  if (!text) return false;
  return EMOJI_REGEX.test(text) || PROBLEMATIC_UNICODE_REGEX.test(text);
}

/**
 * Strip emojis and indicate their presence
 * Useful for showing users that emojis were removed
 *
 * @param {string} text - Text to filter
 * @returns {string} Filtered text with emoji indicator if any were present
 */
function stripEmojisWithIndicator(text) {
  if (!text) return "";

  const hadEmojis = hasEmojis(text);
  const filtered = stripEmojis(text);

  // Add indicator if emojis were present
  if (hadEmojis && filtered) {
    return `${filtered} ✱`; // ✱ is a simple asterisk-like symbol
  }

  return filtered || text;
}

module.exports = {
  stripEmojis,
  hasEmojis,
  stripEmojisWithIndicator,
  EMOJI_REGEX,
  PROBLEMATIC_UNICODE_REGEX,
};

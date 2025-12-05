import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

/**
 * Text formatting utilities for Ink components
 * ULTIMATE FIX: Emoji-aware width calculation with terminal reality
 *
 * The core problem: string-width library reports emoji widths inconsistently
 * Terminal reality: Most emojis render as exactly 2 columns
 * Solution: Count emojis separately and apply fixed width
 */

/**
 * Emoji regex pattern
 * Matches all emoji characters including:
 * - Basic emojis
 * - Emoji with skin tones
 * - Emoji with ZWJ sequences (like 🙅🏽‍♂️)
 * - Variation selectors
 */
const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

/**
 * Count emojis in text
 * Each emoji (including complex ones with skin tones) counts as 1
 *
 * @param {string} text - Text to count emojis in
 * @returns {number} Number of emojis
 */
function countEmojis(text) {
  if (!text) return 0;

  // Remove ZWJ sequences first (they're part of single emoji)
  const withoutZWJ = text.replace(/\u200D/g, "");

  // Match all emojis
  const matches = withoutZWJ.match(EMOJI_REGEX);
  return matches ? matches.length : 0;
}

/**
 * Calculate ACTUAL terminal display width
 * Accounts for the reality that emojis always take 2 columns
 *
 * @param {string} text - Text to measure
 * @returns {number} Actual terminal width
 */
export function getTerminalWidth(text) {
  if (!text) return 0;

  const clean = stripAnsi(text);

  // Count emojis
  const emojiCount = countEmojis(clean);

  // Remove emojis to get non-emoji text
  const withoutEmojis = clean
    .replace(EMOJI_REGEX, "")
    .replace(/\u200D/g, "")
    .replace(/[\uFE00-\uFE0F]/g, "");

  // Width of non-emoji text
  const textWidth = stringWidth(withoutEmojis);

  // Each emoji = 2 columns
  const emojiWidth = emojiCount * 2;

  return textWidth + emojiWidth;
}

/**
 * Convert mathematical bold/italic Unicode to regular ASCII
 * These characters (𝐀-𝐙, 𝐚-𝐳) cause width issues in terminals
 *
 * @param {string} text - Text with possible mathematical alphanumerics
 * @returns {string} Text with regular ASCII letters
 */
export function convertMathematicalAlphanumerics(text) {
  if (!text) return "";

  return Array.from(text)
    .map((char) => {
      const code = char.codePointAt(0);

      // Mathematical Bold Capital A-Z: U+1D400 to U+1D419
      if (code >= 0x1d400 && code <= 0x1d419) {
        return String.fromCharCode(65 + (code - 0x1d400));
      }

      // Mathematical Bold Small a-z: U+1D41A to U+1D433
      if (code >= 0x1d41a && code <= 0x1d433) {
        return String.fromCharCode(97 + (code - 0x1d41a));
      }

      // Mathematical Italic Capital A-Z: U+1D434 to U+1D44D
      if (code >= 0x1d434 && code <= 0x1d44d) {
        return String.fromCharCode(65 + (code - 0x1d434));
      }

      // Mathematical Italic Small a-z: U+1D44E to U+1D467
      if (code >= 0x1d44e && code <= 0x1d467) {
        return String.fromCharCode(97 + (code - 0x1d44e));
      }

      return char;
    })
    .join("");
}

/**
 * Normalize Unicode text to remove problematic characters
 * Strips combining characters, zero-width characters, and converts math Unicode
 *
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text safe for terminal display
 */
export function normalizeUnicode(text) {
  if (!text) return "";

  // First convert mathematical alphanumerics to regular ASCII
  let normalized = convertMathematicalAlphanumerics(text);

  // Strip zero-width characters (but NOT ZWJ for emojis yet)
  normalized = normalized.replace(
    /[\u200B-\u200C\u200E-\u200F\uFEFF\u00AD\u2060]/g,
    "",
  );

  // Strip combining diacritical marks (like Hebrew vowels ִֶָ)
  normalized = normalized.replace(/[\u0300-\u036F\u0591-\u05C7]/g, "");

  return normalized;
}

/**
 * Truncate text to fit within a maximum display width
 * Uses ACTUAL terminal width calculation
 *
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum display width
 * @param {string} ellipsis - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated text
 */
export function truncateText(text, maxWidth, ellipsis = "...") {
  if (!text) return "";

  // Normalize first
  text = normalizeUnicode(text);

  const currentWidth = getTerminalWidth(text);

  // No truncation needed
  if (currentWidth <= maxWidth) {
    return text;
  }

  // Reserve space for ellipsis
  const ellipsisWidth = stringWidth(ellipsis);
  const targetWidth = maxWidth - ellipsisWidth;

  if (targetWidth <= 0) {
    return ellipsis.substring(0, maxWidth);
  }

  // Truncate character by character using terminal width
  let truncated = "";
  let width = 0;

  for (const char of Array.from(text)) {
    const charWidth = getTerminalWidth(char);
    if (width + charWidth > targetWidth) {
      break;
    }
    truncated += char;
    width += charWidth;
  }

  return truncated + ellipsis;
}

/**
 * Pad text to exact display width
 * Uses terminal width for accurate padding
 *
 * @param {string} text - Text to pad
 * @param {number} targetWidth - Target display width
 * @param {string} padChar - Character to pad with (default: ' ')
 * @returns {string} Padded text
 */
export function padText(text, targetWidth, padChar = " ") {
  if (!text) text = "";

  const cleanText = stripAnsi(text);
  const currentWidth = getTerminalWidth(cleanText);
  const paddingNeeded = Math.max(0, targetWidth - currentWidth);

  return text + padChar.repeat(paddingNeeded);
}

/**
 * Format text to exact width (truncate if too long, pad if too short)
 * STRICT MODE: Ensures text is EXACTLY the specified width
 *
 * @param {string} text - Text to format
 * @param {number} width - Exact display width
 * @param {string} ellipsis - Truncation suffix
 * @returns {string} Formatted text that is exactly `width` columns
 */
export function formatToWidth(text, width, ellipsis = "...") {
  // Normalize and truncate
  const truncated = truncateText(text, width, ellipsis);

  // Pad to exact width
  const padded = padText(truncated, width);

  // Verify and force if needed
  const actualWidth = getTerminalWidth(stripAnsi(padded));
  if (actualWidth !== width) {
    // Something went wrong, apply emergency truncation
    if (actualWidth > width) {
      const excess = actualWidth - width;
      // Remove excess spaces from padding
      return padded.substring(0, padded.length - excess);
    } else {
      // Add more padding
      return padded + " ".repeat(width - actualWidth);
    }
  }

  return padded;
}

/**
 * Get the actual display width of text
 * Accounts for ANSI codes and emojis
 *
 * @param {string} text - Text to measure
 * @returns {number} Display width in columns
 */
export function getTextWidth(text) {
  return getTerminalWidth(text);
}

/**
 * Format timestamp for message display
 *
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted time string
 */
export function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000)
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, "");
}

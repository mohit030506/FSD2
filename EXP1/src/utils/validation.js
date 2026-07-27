import { PLATFORMS } from '../data/platforms';

// Regular expression patterns
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const HASHTAG_REGEX = /#([\w\u0590-\u05ff\u0600-\u06ff\u0400-\u04ff]+)/g;
const MENTION_REGEX = /@([\w_]+)/g;

/**
 * Parses raw text to extract metadata: length, link counts, hashtags, and mentions.
 */
export function parsePostText(text = '') {
  const links = text.match(URL_REGEX) || [];
  const hashtags = text.match(HASHTAG_REGEX) || [];
  const mentions = text.match(MENTION_REGEX) || [];

  return {
    rawLength: text.length,
    links,
    hashtags,
    mentions,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    linkCount: links.length,
  };
}

/**
 * Calculates effective character count for a specific platform.
 * E.g., Twitter shortens links to 23 characters regardless of original length.
 */
export function calculateEffectiveCharCount(text = '', platformId) {
  const config = PLATFORMS[platformId];
  if (!config) return text.length;

  if (platformId === 'twitter' && config.linkCharCount) {
    const parsed = parsePostText(text);
    let effectiveLength = text.length;

    parsed.links.forEach(url => {
      effectiveLength = effectiveLength - url.length + config.linkCharCount;
    });

    return effectiveLength;
  }

  return text.length;
}

/**
 * Validates post content against a single platform's rules.
 */
export function validatePlatform(platformId, postData) {
  const { text = '', media = [], pinTitle = '', destinationUrl = '', firstComment = '' } = postData;
  const config = PLATFORMS[platformId];

  if (!config) {
    return { status: 'error', errors: ['Unknown platform'], warnings: [] };
  }

  const errors = [];
  const warnings = [];

  const parsedText = parsePostText(text);
  const effectiveLength = calculateEffectiveCharCount(text, platformId);
  const charLimit = config.charLimit;
  const remainingChars = charLimit - effectiveLength;

  // 1. Character Limit Validation
  if (effectiveLength > charLimit) {
    errors.push(`Exceeds limit by ${effectiveLength - charLimit} character${effectiveLength - charLimit > 1 ? 's' : ''}.`);
  } else if (remainingChars < 20 && remainingChars >= 0) {
    warnings.push(`Close to character limit (${remainingChars} left).`);
  }

  // 2. Media Validation
  if (config.mediaRules.requiresMedia && media.length === 0) {
    errors.push(`${config.name} requires at least 1 image or video.`);
  }

  if (media.length > config.maxMediaCount) {
    errors.push(`Maximum ${config.maxMediaCount} media attachment${config.maxMediaCount > 1 ? 's' : ''} allowed.`);
  }

  // Check media size & individual item validation
  media.forEach((item, index) => {
    if (item.sizeMB && item.sizeMB > config.mediaRules.maxSizeMB) {
      errors.push(`Media #${index + 1} (${item.sizeMB}MB) exceeds max size limit of ${config.mediaRules.maxSizeMB}MB.`);
    }
  });

  // 3. Hashtag Guideline Validation
  const hashtagCount = parsedText.hashtagCount;
  if (config.hashtagGuideline) {
    if (config.hashtagGuideline.max && hashtagCount > config.hashtagGuideline.max) {
      if (platformId === 'instagram' && hashtagCount > 30) {
        errors.push(`Instagram allows a maximum of 30 hashtags (currently ${hashtagCount}).`);
      } else {
        warnings.push(`Too many hashtags (${hashtagCount}). ${config.hashtagGuideline.recommended}.`);
      }
    }
    if (config.hashtagGuideline.min > 0 && hashtagCount < config.hashtagGuideline.min && text.trim().length > 0) {
      warnings.push(`Consider adding hashtags. ${config.hashtagGuideline.recommended}.`);
    }
  }

  // 4. Platform-Specific Rule Checks
  if (config.requiresPinTitle) {
    if (!pinTitle.trim()) {
      errors.push('Pin Title is required for Pinterest.');
    } else if (pinTitle.length > 100) {
      errors.push(`Pin Title exceeds 100 characters (${pinTitle.length}/100).`);
    }
    if (destinationUrl && !/^https?:\/\/.+/i.test(destinationUrl)) {
      warnings.push('Destination URL should start with http:// or https://');
    }
  }

  // Instagram non-clickable links notice
  if (platformId === 'instagram' && parsedText.linkCount > 0) {
    warnings.push('Links in Instagram captions are not clickable. Consider using "link in bio".');
  }

  // 5. Determine overall status
  let status = 'valid';
  if (errors.length > 0) {
    status = 'error';
  } else if (warnings.length > 0) {
    status = 'warning';
  }

  return {
    platformId,
    platformName: config.name,
    status,
    effectiveLength,
    charLimit,
    remainingChars,
    usagePercentage: Math.min(100, Math.round((effectiveLength / charLimit) * 100)),
    parsedText,
    errors,
    warnings,
  };
}

/**
 * Validates post content across all selected platforms.
 */
export function validateAllPlatforms(selectedPlatformIds = [], postData) {
  const results = {};
  let overallValid = true;
  let errorCount = 0;
  let warningCount = 0;

  selectedPlatformIds.forEach(id => {
    const res = validatePlatform(id, postData);
    results[id] = res;

    if (res.status === 'error') {
      overallValid = false;
      errorCount += res.errors.length;
    }
    if (res.status === 'warning') {
      warningCount += res.warnings.length;
    }
  });

  return {
    results,
    overallValid,
    errorCount,
    warningCount,
  };
}

/**
 * Trims text to fit within a specific platform's character limit cleanly.
 */
export function autoTrimText(text, platformId) {
  const config = PLATFORMS[platformId];
  if (!config) return text;

  const targetLimit = config.charLimit;
  let trimmed = text;

  while (calculateEffectiveCharCount(trimmed, platformId) > targetLimit && trimmed.length > 0) {
    trimmed = trimmed.substring(0, trimmed.length - 1);
  }

  // Trim trailing whitespace or incomplete sentence gracefully
  return trimmed.trim() + '...';
}

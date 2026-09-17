import { ConfidenceLevel, Report } from '../types';

/**
 * Calculates a confidence score (0-100) and tier (hog, osaker, ej_verifierad)
 * based on confirmations, refutations, age decay, author reputation and flags.
 */
export function calculateConfidence(report: Report): {
  score: number;
  level: ConfidenceLevel;
} {
  // Base score from author's reputation (0 to 40 pts)
  const authorReputationFactor = Math.min(Math.max(report.userReputation / 5, 10), 40);
  
  // Confirmations weight (+8 pts per confirmation, up to 45 pts)
  const confirmationPts = Math.min(report.confirmationsCount * 8, 45);
  
  // Refutations / Rejections penalty (-18 pts per rejection)
  const refutationPenalty = report.rejectionsCount * 18;
  
  // Flag penalty (-25 pts per flag)
  const flagPenalty = report.flaggedCount * 25;
  
  // Age decay factor
  const ageInMinutes = (Date.now() - new Date(report.createdAt).getTime()) / (1000 * 60);
  let ageDecayPenalty = 0;
  if (ageInMinutes > 15) {
    ageDecayPenalty = Math.min((ageInMinutes - 15) * 0.8, 30);
  }
  
  // Calculate raw score
  let score = Math.round(
    authorReputationFactor + confirmationPts - refutationPenalty - flagPenalty - ageDecayPenalty
  );
  
  score = Math.max(5, Math.min(score, 99));
  
  let level: ConfidenceLevel = 'ej_verifierad';
  if (score >= 75 && report.confirmationsCount >= 2 && report.rejectionsCount === 0) {
    level = 'hog';
  } else if (score >= 45 || report.confirmationsCount >= 1) {
    level = 'osaker';
  } else {
    level = 'ej_verifierad';
  }
  
  return { score, level };
}

export function getReputationTier(reputation: number): string {
  if (reputation >= 300) return 'Veteran-observatör';
  if (reputation >= 150) return 'SL-spanare';
  if (reputation >= 50) return 'Pålitlig resenär';
  return 'Ny pendlare';
}

export function formatTimeAgo(isoDate: string, lang: 'sv' | 'en' | 'es' = 'sv'): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === 'sv') {
    if (diffMin < 1) return 'just nu';
    if (diffMin < 60) return `för ${diffMin} min sedan`;
    if (diffHours < 24) return `för ${diffHours} tim sedan`;
    return `för ${diffDays} dgr sedan`;
  } else if (lang === 'es') {
    if (diffMin < 1) return 'hace un momento';
    if (diffMin < 60) return `hace ${diffMin} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    return `hace ${diffDays} días`;
  } else {
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}

/**
 * Safely extracts localized string whether the input is a { sv, en, es } map or a plain string
 */
export function getLocalizedText(
  value: any,
  lang: 'sv' | 'en' | 'es' = 'sv',
  fallback = ''
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] || value.sv || value.en || value.es || Object.values(value)[0] || fallback;
  }
  return String(value);
}

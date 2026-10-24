(function (scope) {
  'use strict';
  // Shared by the combined results mock and its tests, not the live quiz.
  const policy = Object.freeze({
    version: 'feline-life-stage-review-v1-2026-10-24',
    status: 'proposed',
    source: '2021 AAHA/AAFP Feline Life Stage Guidelines, Table 1 (printed page 52), definitions (page 53)',
    sourceUrl: 'https://www.aaha.org/wp-content/uploads/2021/02/2021-aaha-aafp-feline-life-stage-guidelines.pdf',
    interpretation: 'Young adult continues until the seventh birthday. Mature adult includes the tenth birthday. Senior begins after ten years (10 years 1 month at this input resolution). Heather must review these month-level boundaries.',
  });
  const stages = Object.freeze([
    Object.freeze({ id: 'kitten', label: 'Kitten', range: 'Under 1 year', detail: 'The growing-up chapter', description: 'A life stage for growth, discovery and building everyday routines.', minMonths: 0, maxMonths: 11 }),
    Object.freeze({ id: 'young', label: 'Young adult', range: '1 year to under 7 years', detail: 'The finding-their-rhythm chapter', description: 'An adult chapter, with routines that can grow around your cat’s individual needs.', minMonths: 12, maxMonths: 83 }),
    Object.freeze({ id: 'mature', label: 'Mature adult', range: '7 years through exactly 10 years', detail: 'The familiar-routines chapter', description: 'A mature chapter. Changes in everyday habits are useful things to discuss with your veterinary team.', minMonths: 84, maxMonths: 120 }),
    Object.freeze({ id: 'senior', label: 'Senior', range: 'Over 10 years', detail: 'The more-to-share chapter', description: 'Senior is a life stage, not a statement that your cat is unwell. Their care can evolve with their individual needs.', minMonths: 121, maxMonths: null }),
  ]);
  function classify(years, months) {
    if (!Number.isSafeInteger(years) || years < 0 || !Number.isInteger(months) || months < 0 || months > 11) return null;
    const totalMonths = years * 12 + months;
    if (!Number.isSafeInteger(totalMonths)) return null;
    const stage = stages.find(item => totalMonths >= item.minMonths && (item.maxMonths === null || totalMonths <= item.maxMonths));
    return { stage: stage.id, label: stage.label, totalMonths, policyVersion: policy.version, status: policy.status };
  }
  function formatAge(years, months) {
    const parts = [];
    if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    return parts.join(', ') || 'Under 1 month';
  }
  const api = { policy, stages, classify, formatAge };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.FelineLifeStage = api;
})(globalThis);

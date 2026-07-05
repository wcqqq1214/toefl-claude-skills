const TOTAL_THRESHOLDS = [
  [114, 6],
  [107, 5.5],
  [95, 5],
  [86, 4.5],
  [72, 4],
  [58, 3.5],
  [44, 3],
  [34, 2.5],
  [24, 2],
  [12, 1.5],
  [0, 1],
];

const SECTION_THRESHOLDS = {
  reading: [
    [29, 6], [27, 5.5], [24, 5], [22, 4.5], [18, 4],
    [12, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [0, 1],
  ],
  listening: [
    [28, 6], [26, 5.5], [22, 5], [20, 4.5], [17, 4],
    [13, 3.5], [9, 3], [6, 2.5], [4, 2], [2, 1.5], [0, 1],
  ],
  writing: [
    [29, 6], [27, 5.5], [24, 5], [21, 4.5], [17, 4],
    [15, 3.5], [13, 3], [11, 2.5], [7, 2], [3, 1.5], [0, 1],
  ],
  speaking: [
    [28, 6], [27, 5.5], [25, 5], [23, 4.5], [20, 4],
    [18, 3.5], [16, 3], [13, 2.5], [10, 2], [5, 1.5], [0, 1],
  ],
};

function fromThresholds(value, thresholds) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  for (const [min, band] of thresholds) {
    if (n >= min) return band;
  }
  return 1;
}

export function clampBand(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(6, Math.max(1, Math.round(n * 2) / 2));
}

export function formatBand(value) {
  const band = clampBand(value);
  if (band == null) return '—';
  return band.toFixed(1);
}

export function toTotalBand(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= 6) return clampBand(n);
  return fromThresholds(n, TOTAL_THRESHOLDS);
}

export function toSectionBand(section, value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= 6) return clampBand(n);
  return fromThresholds(n, SECTION_THRESHOLDS[section] || SECTION_THRESHOLDS.reading);
}

export function accuracyToBand(entries, fallback, section) {
  if (!entries || entries.length === 0) return toSectionBand(section, fallback);
  const recent = entries.slice(-5);
  const explicit = recent
    .map((e) => e.section_band ?? e.estimated_band)
    .filter((v) => v != null)
    .map(clampBand);
  if (explicit.length > 0) {
    return clampBand(explicit.reduce((a, b) => a + b, 0) / explicit.length);
  }
  const rates = recent
    .map((e) => Number(e.correct) / Number(e.total_questions))
    .filter((v) => Number.isFinite(v));
  if (rates.length === 0) return toSectionBand(section, fallback);
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  if (avg >= 0.95) return 6;
  if (avg >= 0.9) return 5.5;
  if (avg >= 0.82) return 5;
  if (avg >= 0.74) return 4.5;
  if (avg >= 0.65) return 4;
  if (avg >= 0.56) return 3.5;
  if (avg >= 0.47) return 3;
  if (avg >= 0.38) return 2.5;
  if (avg >= 0.28) return 2;
  if (avg >= 0.15) return 1.5;
  return 1;
}

export function writingEntryBand(entry) {
  const rawBand = entry.raw_score != null && entry.raw_total
    ? 1 + (Number(entry.raw_score) / Number(entry.raw_total)) * 5
    : null;
  return clampBand(
    entry.section_band ??
    entry.estimated_band ??
    (entry.estimated_30 != null ? toSectionBand('writing', entry.estimated_30) : null) ??
    (entry.rubric_score != null ? Number(entry.rubric_score) + 1 : null) ??
    rawBand
  );
}

export function speakingEntryBand(entry) {
  return clampBand(
    entry.section_band ??
    entry.estimated_band ??
    (entry.estimated_30 != null ? toSectionBand('speaking', entry.estimated_30) : null) ??
    (entry.overall_rubric != null ? 1 + (Number(entry.overall_rubric) / 4) * 5 : null)
  );
}

export function averageEntryBand(entries, getter, fallback, section) {
  if (!entries || entries.length === 0) return toSectionBand(section, fallback);
  const vals = entries.slice(-5).map(getter).filter((v) => v != null);
  if (vals.length === 0) return toSectionBand(section, fallback);
  return clampBand(vals.reduce((a, b) => a + b, 0) / vals.length);
}

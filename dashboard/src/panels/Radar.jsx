import React from 'react';
import { Radar as RadarChart, RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

function avgRubricTo30(entries, getRubric, fallback) {
  if (!entries || entries.length === 0) return fallback ?? null;
  const recent = entries.slice(-5);
  const vals = recent.map(getRubric).filter((v) => v != null);
  if (vals.length === 0) return fallback ?? null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(avg * 6);
}

function accuracyTo30(entries, fallback) {
  if (!entries || entries.length === 0) return fallback ?? null;
  const recent = entries.slice(-5);
  const rates = recent.map((e) => e.correct / e.total_questions).filter((v) => !isNaN(v));
  if (rates.length === 0) return fallback ?? null;
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  return Math.round(avg * 30);
}

export default function Radar({ data }) {
  const cfg = data.config;
  const target = cfg?.target_breakdown || {};
  const baseline = cfg?.current_baseline || {};

  const rEst = accuracyTo30(data.reading.entries, baseline.reading);
  const lEst = accuracyTo30(data.listening.entries, baseline.listening);
  const wEst = avgRubricTo30(data.writing.entries, (e) => e.rubric_score, baseline.writing);
  const sEst = avgRubricTo30(
    data.speaking.entries,
    (e) => e.overall_rubric,
    baseline.speaking ? baseline.speaking / 7.5 : null
  );

  const chart = [
    { subject: 'Reading', current: rEst ?? 0, target: target.reading ?? 0, full: 30 },
    { subject: 'Listening', current: lEst ?? 0, target: target.listening ?? 0, full: 30 },
    { subject: 'Speaking', current: sEst ?? 0, target: target.speaking ?? 0, full: 30 },
    { subject: 'Writing', current: wEst ?? 0, target: target.writing ?? 0, full: 30 },
  ];

  return (
    <div className="panel">
      <h2>四科状态</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RC data={chart}>
            <PolarGrid stroke="#242838" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b93a7', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 30]} tick={{ fill: '#8b93a7', fontSize: 10 }} />
            <RadarChart name="当前" dataKey="current" stroke="#4c9aff" fill="#4c9aff" fillOpacity={0.3} />
            <RadarChart name="目标" dataKey="target" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </RC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

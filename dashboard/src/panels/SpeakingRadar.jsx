import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { clampBand } from '../score.js';

export default function SpeakingRadar({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="panel">
        <h2>口语维度 (近 10 次平均)</h2>
        <div className="empty">暂无口语数据。</div>
      </div>
    );
  }

  const recent = entries.slice(-10);
  const keys = ['relevance', 'elaboration', 'fluency', 'language_use', 'intelligibility'];
  const labels = {
    relevance: 'Relevance',
    elaboration: 'Elaboration',
    fluency: 'Fluency',
    language_use: 'Language',
    intelligibility: 'Intelligibility',
  };

  const legacy = {
    relevance: 'general',
    elaboration: 'topic_development',
    fluency: 'delivery',
    language_use: 'language',
    intelligibility: 'delivery',
  };

  const valueFor = (entry, key) => {
    const modern = entry.dimension_scores?.[key];
    if (modern != null) return clampBand(modern);
    const old = entry.rubric_scores?.[legacy[key]];
    if (old != null) return clampBand(1 + (Number(old) / 4) * 5);
    return null;
  };

  const avg = {};
  for (const k of keys) {
    const vals = recent.map((e) => valueFor(e, k)).filter((v) => v != null);
    avg[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }

  const chart = keys.map((k) => ({
    subject: labels[k],
    value: Number(avg[k].toFixed(2)),
    full: 6,
  }));

  return (
    <div className="panel">
      <h2>口语维度 (近 {recent.length} 次 · 1-6)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RadarChart data={chart}>
            <PolarGrid stroke="#242838" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b93a7', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 6]} tick={{ fill: '#8b93a7', fontSize: 10 }} />
            <Radar dataKey="value" stroke="#4c9aff" fill="#4c9aff" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="sub">
        最弱: {chart.slice().sort((a, b) => a.value - b.value)[0].subject} ({chart.slice().sort((a, b) => a.value - b.value)[0].value})
      </div>
    </div>
  );
}

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function SpeakingRadar({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="panel">
        <h2>口语四维 (近 10 次平均)</h2>
        <div className="empty">暂无口语数据。</div>
      </div>
    );
  }

  const recent = entries.slice(-10);
  const keys = ['general', 'delivery', 'language', 'topic_development'];
  const labels = {
    general: 'General',
    delivery: 'Delivery',
    language: 'Language',
    topic_development: 'Topic Dev',
  };

  const avg = {};
  for (const k of keys) {
    const vals = recent.map((e) => e.rubric_scores?.[k]).filter((v) => v != null);
    avg[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }

  const chart = keys.map((k) => ({
    subject: labels[k],
    value: Number(avg[k].toFixed(2)),
    full: 4,
  }));

  return (
    <div className="panel">
      <h2>口语四维 (近 {recent.length} 次 · 0-4)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RadarChart data={chart}>
            <PolarGrid stroke="#242838" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b93a7', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 4]} tick={{ fill: '#8b93a7', fontSize: 10 }} />
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

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import {
  accuracyToBand,
  averageEntryBand,
  speakingEntryBand,
  toSectionBand,
  writingEntryBand,
} from '../score.js';

export default function SectionRadar({ data }) {
  const cfg = data.config;
  const target = cfg?.target_breakdown || {};
  const baseline = cfg?.current_baseline || {};

  const rEst = accuracyToBand(data.reading.entries, baseline.reading, 'reading');
  const lEst = accuracyToBand(data.listening.entries, baseline.listening, 'listening');
  const wEst = averageEntryBand(data.writing.entries, writingEntryBand, baseline.writing, 'writing');
  const sEst = averageEntryBand(data.speaking.entries, speakingEntryBand, baseline.speaking, 'speaking');

  const chart = [
    { subject: 'Reading', current: rEst ?? 0, target: toSectionBand('reading', target.reading) ?? 0, full: 6 },
    { subject: 'Listening', current: lEst ?? 0, target: toSectionBand('listening', target.listening) ?? 0, full: 6 },
    { subject: 'Speaking', current: sEst ?? 0, target: toSectionBand('speaking', target.speaking) ?? 0, full: 6 },
    { subject: 'Writing', current: wEst ?? 0, target: toSectionBand('writing', target.writing) ?? 0, full: 6 },
  ];

  return (
    <div className="panel">
      <h2>四科状态 (1-6)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RadarChart data={chart}>
            <PolarGrid stroke="#242838" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b93a7', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 6]} tick={{ fill: '#8b93a7', fontSize: 10 }} />
            <Radar name="当前" dataKey="current" stroke="#4c9aff" fill="#4c9aff" fillOpacity={0.3} />
            <Radar name="目标" dataKey="target" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

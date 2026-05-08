import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AccuracyTrend({ reading, listening }) {
  if ((!reading || reading.length === 0) && (!listening || listening.length === 0)) {
    return (
      <div className="panel">
        <h2>阅读 / 听力正确率</h2>
        <div className="empty">暂无数据。</div>
      </div>
    );
  }

  const mapPct = (arr, key) =>
    arr.slice(-15).map((e, i) => ({
      idx: i + 1,
      date: e.date?.slice(5, 10),
      [key]: Math.round((e.correct / e.total_questions) * 100),
    }));

  const rData = mapPct(reading, 'reading');
  const lData = mapPct(listening, 'listening');

  // Merge by idx
  const maxLen = Math.max(rData.length, lData.length);
  const merged = [];
  for (let i = 0; i < maxLen; i++) {
    merged.push({
      idx: i + 1,
      reading: rData[i]?.reading,
      listening: lData[i]?.listening,
    });
  }

  return (
    <div className="panel">
      <h2>阅读 / 听力正确率 (%)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242838" />
            <XAxis dataKey="idx" tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1c2030', border: '1px solid #242838', fontSize: 12 }}
              labelStyle={{ color: '#8b93a7' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="reading" stroke="#4c9aff" strokeWidth={2} dot={{ r: 3 }} name="Reading" connectNulls />
            <Line type="monotone" dataKey="listening" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} name="Listening" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

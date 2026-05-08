import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const sectionColors = {
  reading: '#4c9aff',
  listening: '#fbbf24',
  writing: '#a78bfa',
  speaking: '#4ade80',
};

export default function TopErrors({ tags }) {
  const entries = Object.entries(tags || {});
  if (entries.length === 0) {
    return (
      <div className="panel">
        <h2>高频错题 Top 10</h2>
        <div className="empty">暂无错题标签。</div>
      </div>
    );
  }

  const data = entries
    .map(([name, v]) => ({
      name,
      count: v.count,
      sections: v.sections || [],
      lastSeen: v.last_seen,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="panel">
      <h2>高频错题 Top 10</h2>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242838" />
            <XAxis type="number" tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#8b93a7', fontSize: 11 }}
              width={160}
            />
            <Tooltip
              contentStyle={{ background: '#1c2030', border: '1px solid #242838', fontSize: 12 }}
              labelStyle={{ color: '#8b93a7' }}
            />
            <Bar dataKey="count" fill="#4c9aff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

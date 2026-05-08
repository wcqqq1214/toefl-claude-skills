import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function VocabSrs({ queue }) {
  if (!queue || queue.length === 0) {
    return (
      <div className="panel">
        <h2>词汇 SRS</h2>
        <div className="empty">暂无单词。去 /toefl-vocab 添加。</div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const boxDist = [0, 0, 0, 0, 0];
  const dueToday = [];
  const upcoming = [];

  for (const w of queue) {
    const b = (w.box ?? 1) - 1;
    if (b >= 0 && b < 5) boxDist[b]++;
    if (w.next_review && w.next_review <= today) dueToday.push(w);
    else upcoming.push(w);
  }

  const chart = boxDist.map((count, i) => ({
    box: `B${i + 1}`,
    count,
  }));

  const boxColors = ['#f87171', '#fbbf24', '#4c9aff', '#a78bfa', '#4ade80'];

  return (
    <div className="panel">
      <h2>词汇 SRS ({queue.length} 词)</h2>
      <div className="row" style={{ gap: 16, marginBottom: 12 }}>
        <div>
          <div className="big-num" style={{ fontSize: 28 }}>{dueToday.length}</div>
          <div className="sub">今日到期</div>
        </div>
        <div>
          <div className="big-num" style={{ fontSize: 28, color: '#4ade80' }}>{boxDist[4]}</div>
          <div className="sub">Box 5 (毕业候选)</div>
        </div>
      </div>
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242838" />
            <XAxis dataKey="box" tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1c2030', border: '1px solid #242838', fontSize: 12 }}
              labelStyle={{ color: '#8b93a7' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chart.map((_, i) => <Cell key={i} fill={boxColors[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

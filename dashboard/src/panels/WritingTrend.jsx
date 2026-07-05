import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { formatBand, toSectionBand, writingEntryBand } from '../score.js';

export default function WritingTrend({ entries, target }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="panel">
        <h2>写作趋势</h2>
        <div className="empty">暂无数据。批改一篇作文后会显示。</div>
      </div>
    );
  }

  const data = entries
    .slice(-20)
    .map((e, i) => ({
      idx: i + 1,
      date: e.date?.slice(5, 10),
      score: writingEntryBand(e),
      taskScore: e.rubric_score ?? e.raw_score,
      type: e.task_type || 'writing',
    }));

  const targetBand = toSectionBand('writing', target);

  return (
    <div className="panel">
      <h2>写作趋势 (1-6)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242838" />
            <XAxis dataKey="idx" tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <YAxis domain={[1, 6]} tick={{ fill: '#8b93a7', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1c2030', border: '1px solid #242838', fontSize: 12 }}
              labelStyle={{ color: '#8b93a7' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {targetBand && (
              <ReferenceLine y={targetBand} stroke="#4ade80" strokeDasharray="4 4" label={{ value: `目标 ${formatBand(targetBand)}`, fill: '#4ade80', fontSize: 11 }} />
            )}
            <Line type="monotone" dataKey="score" stroke="#4c9aff" strokeWidth={2} dot={{ r: 3 }} name="Practice band" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="sub" style={{ marginTop: 8 }}>近 {data.length} 次 · 最新 {formatBand(data[data.length - 1]?.score)} / 6</div>
    </div>
  );
}

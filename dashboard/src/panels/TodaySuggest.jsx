import React from 'react';
import {
  accuracyToBand,
  averageEntryBand,
  speakingEntryBand,
  toSectionBand,
  writingEntryBand,
} from '../score.js';

export default function TodaySuggest({ data }) {
  const cfg = data.config;
  if (!cfg || !cfg.target_breakdown) {
    return (
      <div className="panel">
        <h2>今日建议</h2>
        <div className="empty">未配置目标。运行 /toefl 初始化。</div>
      </div>
    );
  }

  const baseline = cfg.current_baseline || {};
  const target = cfg.target_breakdown;

  const rEst = accuracyToBand(data.reading.entries, baseline.reading, 'reading');
  const lEst = accuracyToBand(data.listening.entries, baseline.listening, 'listening');
  const wEst = averageEntryBand(data.writing.entries, writingEntryBand, baseline.writing, 'writing');
  const sEst = averageEntryBand(data.speaking.entries, speakingEntryBand, baseline.speaking, 'speaking');

  const gaps = [
    { sec: 'reading', gap: (toSectionBand('reading', target.reading) || 0) - (rEst || 0), skill: '/toefl-reading' },
    { sec: 'listening', gap: (toSectionBand('listening', target.listening) || 0) - (lEst || 0), skill: '/toefl-listening' },
    { sec: 'writing', gap: (toSectionBand('writing', target.writing) || 0) - (wEst || 0), skill: '/toefl-writing' },
    { sec: 'speaking', gap: (toSectionBand('speaking', target.speaking) || 0) - (sEst || 0), skill: '/toefl-speaking' },
  ].sort((a, b) => b.gap - a.gap);

  const top = gaps[0];

  const vocabDue = (data.vocab.queue || []).filter((w) => {
    const today = new Date().toISOString().slice(0, 10);
    return w.next_review && w.next_review <= today;
  }).length;

  const exam = cfg.exam_date ? new Date(cfg.exam_date) : null;
  const days = exam ? Math.ceil((exam - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="panel">
      <h2>今日建议</h2>
      <div className="big-num" style={{ fontSize: 18 }}>
        焦点: {top.sec}
      </div>
      <div className="sub" style={{ marginBottom: 12 }}>
        差距 {top.gap.toFixed(1)} band · <code>{top.skill}</code>
      </div>

      <ul className="tasks">
        <li>
          <span>{top.sec} 专项训练</span>
          <span className="muted">~60 min</span>
        </li>
        <li>
          <span>词汇 SRS 复习</span>
          <span className="muted">{vocabDue} 词 / ~20 min</span>
        </li>
        {gaps[1].gap > 1 && (
          <li>
            <span>{gaps[1].sec} 次要训练</span>
            <span className="muted">~40 min</span>
          </li>
        )}
        {data.synonyms.entries?.length > 30 && (
          <li>
            <span>同义替换训练</span>
            <span className="muted">~15 min</span>
          </li>
        )}
      </ul>

      {days != null && days < 30 && (
        <div className="pill danger" style={{ marginTop: 12 }}>
          距考试 {days} 天，优先复盘错题
        </div>
      )}

      <div className="sub" style={{ marginTop: 12 }}>
        完整计划运行 <code>/toefl-diagnose</code>
      </div>
    </div>
  );
}

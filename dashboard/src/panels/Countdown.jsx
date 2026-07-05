import React from 'react';
import { formatBand, toTotalBand } from '../score.js';

export default function Countdown({ config }) {
  if (!config || !config.target_score) {
    return (
      <div className="panel">
        <h2>目标 / 倒计时</h2>
        <div className="empty">未配置</div>
      </div>
    );
  }

  const { target_score, exam_date, current_baseline } = config;
  const today = new Date();
  const exam = exam_date ? new Date(exam_date) : null;
  const days = exam ? Math.ceil((exam - today) / (1000 * 60 * 60 * 24)) : null;

  const targetBand = toTotalBand(target_score);
  const current = toTotalBand(current_baseline?.total);
  const diff = current != null && targetBand != null ? targetBand - current : null;
  const progress = current != null && targetBand != null ? Math.min(100, (current / targetBand) * 100) : 0;

  return (
    <div className="panel">
      <h2>目标 / 倒计时</h2>
      <div className="big-num">
        {formatBand(current)}<span className="slash"> / {formatBand(targetBand)}</span>
      </div>
      <div className="sub">
        {diff != null && diff > 0 && <span className="pill warn">差 {diff.toFixed(1)} band</span>}
        {diff != null && diff <= 0 && <span className="pill ok">已达标</span>}
        {' '}
        {days != null && (
          <span className={`pill ${days < 30 ? 'danger' : days < 60 ? 'warn' : ''}`}>
            D-{days}
          </span>
        )}
      </div>
      <div className="progress">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>
      {exam_date && (
        <div className="sub" style={{ marginTop: 10 }}>
          考试日期: {exam_date}
        </div>
      )}
      {current_baseline?.measured_at && (
        <div className="sub">
          基线测于: {current_baseline.measured_at}
        </div>
      )}
    </div>
  );
}

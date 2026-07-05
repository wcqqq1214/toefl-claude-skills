import React, { useEffect, useState } from 'react';
import Countdown from './panels/Countdown.jsx';
import SectionRadar from './panels/SectionRadar.jsx';
import WritingTrend from './panels/WritingTrend.jsx';
import AccuracyTrend from './panels/AccuracyTrend.jsx';
import SpeakingRadar from './panels/SpeakingRadar.jsx';
import TopErrors from './panels/TopErrors.jsx';
import Synonyms from './panels/Synonyms.jsx';
import VocabSrs from './panels/VocabSrs.jsx';
import TodaySuggest from './panels/TodaySuggest.jsx';

async function fetchJson(url) {
  const r = await fetch(url);
  return r.json();
}

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchJson('/api/config'),
      fetchJson('/api/writing'),
      fetchJson('/api/reading'),
      fetchJson('/api/listening'),
      fetchJson('/api/speaking'),
      fetchJson('/api/errors'),
      fetchJson('/api/synonyms'),
      fetchJson('/api/vocab'),
    ])
      .then(([config, writing, reading, listening, speaking, errors, synonyms, vocab]) => {
        setData({ config, writing, reading, listening, speaking, errors, synonyms, vocab });
      })
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="app"><div className="error">加载失败: {err}</div></div>;
  if (!data) return <div className="app"><div className="empty">加载中...</div></div>;

  const configMissing = data.config?.error && !data.config?.target_score;

  return (
    <div className="app">
      <div className="header">
        <h1>TOEFL Dashboard</h1>
        <div className="subtitle">
          读取 ~/.toefl/ · <a href="javascript:location.reload()">刷新</a>
        </div>
      </div>

      {configMissing && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="error">尚未初始化配置。请先在 Codex App 或 Claude Code 运行 <code>/toefl</code> 完成摸底。</div>
        </div>
      )}

      <div className="grid">
        <div className="col-4"><Countdown config={data.config} /></div>
        <div className="col-4"><SectionRadar data={data} /></div>
        <div className="col-4"><TodaySuggest data={data} /></div>

        <div className="col-6"><WritingTrend entries={data.writing.entries || []} target={data.config?.target_breakdown?.writing} /></div>
        <div className="col-6"><AccuracyTrend reading={data.reading.entries || []} listening={data.listening.entries || []} /></div>

        <div className="col-6"><SpeakingRadar entries={data.speaking.entries || []} /></div>
        <div className="col-6"><TopErrors tags={data.errors.tags || {}} /></div>

        <div className="col-6"><VocabSrs queue={data.vocab.queue || []} /></div>
        <div className="col-6"><Synonyms entries={data.synonyms.entries || []} /></div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';

export default function Synonyms({ entries }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('count');

  const filtered = useMemo(() => {
    let list = entries || [];
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.topic_word?.toLowerCase().includes(needle) ||
          e.source_word?.toLowerCase().includes(needle) ||
          e.context?.toLowerCase().includes(needle)
      );
    }
    if (sort === 'count') return list.slice().sort((a, b) => (b.count || 0) - (a.count || 0));
    if (sort === 'recent') return list.slice().sort((a, b) => (b.last_seen || '').localeCompare(a.last_seen || ''));
    return list;
  }, [entries, q, sort]);

  return (
    <div className="panel">
      <h2>同义替换库 ({entries?.length || 0})</h2>
      {(!entries || entries.length === 0) ? (
        <div className="empty">暂无数据。做阅读分析后自动累积。</div>
      ) : (
        <>
          <input
            className="search"
            placeholder="搜索..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="row" style={{ marginBottom: 10, fontSize: 12 }}>
            <span className="muted">排序:</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setSort('count'); }} style={{ color: sort === 'count' ? '#4c9aff' : '#8b93a7' }}>频次</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setSort('recent'); }} style={{ color: sort === 'recent' ? '#4c9aff' : '#8b93a7' }}>最近</a>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>题目用词</th>
                  <th>原文用词</th>
                  <th style={{ textAlign: 'right' }}>频次</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map((e, i) => (
                  <tr key={i}>
                    <td>{e.topic_word}</td>
                    <td>{e.source_word}</td>
                    <td style={{ textAlign: 'right', color: '#8b93a7' }}>{e.count || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

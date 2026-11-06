"use client";
import React, { useState, useEffect } from 'react';


interface Announcement {
  id: number;
  content: string;
  scope: string;
  status: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [list, setList] = useState<Announcement[]>([]);
  const [newContent, setNewContent] = useState('');

  /* 从后端获取公告列表 */
  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/announcements')
      .then(r => r.json())
      .then(data => { if (data.code === 200) setList(data.data || []); });
  }, []);

  /* 发布新公告 */
  const handlePublish = () => {
    if (!newContent.trim()) return;
    fetch('http://localhost:8080/api/admin/peripheral/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent, status: 'BROADCASTING', scope: 'ALL' })
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setList(prev => [data.data, ...prev]);
          setNewContent('');
        }
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="cyber-label" style={{ fontSize: '18px', letterSpacing: '2px' }}>[ BROADCAST_CENTER ] 公告发布中心</div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        <textarea className="cyber-input font-mono" style={{ flex: 1, height: '80px', resize: 'none' }} value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="输入公告内容..." />
        <button className="btn-cyber" onClick={handlePublish} style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>[ BROADCAST ] 发布</button>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table className="cyber-table">
          <thead>
            <tr><th>ID</th><th>内容</th><th>状态</th><th>创建时间</th></tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td className="font-mono">{a.id}</td>
                <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.content}</td>
                <td><span style={{ color: a.status === 'BROADCASTING' ? 'var(--primary-cyber)' : 'var(--text-secondary)' }}>{a.status}</span></td>
                <td className="font-mono" style={{ fontSize: '11px' }}>{a.createdAt ? String(a.createdAt).substring(0, 19) : '—'}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无公告数据</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

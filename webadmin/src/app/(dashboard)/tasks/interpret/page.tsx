"use client";
import React, { useState, useEffect } from 'react';


interface AsyncTask {
  id: number;
  taskType: string;
  refType: string;
  refId: number;
  status: number;
  durationMs: number;
  failReason: string | null;
  retryCount: number;
  maxRetry: number;
  createdAt: string;
}

export default function InterpretTasksPage() {
  const [tasks, setTasks] = useState<AsyncTask[]>([]);

  /* 从后端获取解读任务列表 */
  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/interpret-tasks')
      .then(r => r.json())
      .then(data => { if (data.code === 200) setTasks(data.data || []); });
  }, []);

  /* 重试失败任务 */
  const handleRetry = (id: number) => {
    fetch(`http://localhost:8080/api/admin/peripheral/tasks/${id}/retry`, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 1, failReason: null } : t));
        }
      });
  };

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: '待提交', color: 'var(--text-command)' },
    1: { label: '已提交', color: '#F59E0B' },
    2: { label: '分析中', color: '#3B82F6' },
    3: { label: '已完成', color: 'var(--primary-cyber)' },
    4: { label: '失败', color: 'var(--danger-cyber)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="cyber-label" style={{ fontSize: '18px', letterSpacing: '2px' }}>[ INTERPRET_PIPELINE ] 解读任务管线</div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table className="cyber-table">
          <thead>
            <tr><th>TASK_ID</th><th>REF_TYPE</th><th>STATUS</th><th>DURATION</th><th>RETRY</th><th>CREATED</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td className="font-mono">{t.id}</td>
                <td>{t.refType || '—'}</td>
                <td><span style={{ color: statusMap[t.status]?.color || '#FFF' }}>{statusMap[t.status]?.label || t.status}</span></td>
                <td className="font-mono">{t.durationMs ? `${t.durationMs}ms` : '—'}</td>
                <td className="font-mono">{t.retryCount}/{t.maxRetry}</td>
                <td className="font-mono" style={{ fontSize: '11px' }}>{t.createdAt ? String(t.createdAt).substring(0, 19) : '—'}</td>
                <td>
                  {t.status === 4 && (
                    <button className="btn-cyber" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => handleRetry(t.id)}>RETRY</button>
                  )}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无解读任务</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

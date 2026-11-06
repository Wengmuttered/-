"use client";
import React, { useState, useEffect } from 'react';


interface AuditLog {
  id: number;
  logType: string;
  operatorId: number;
  operatorType: string;
  operatorName: string;
  action: string;
  targetType: string;
  targetId: number;
  result: string;
  ipAddress: string;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  /* 从后端获取审计日志列表 */
  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/logs')
      .then(r => r.json())
      .then(data => { if (data.code === 200) setLogs(data.data || []); });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="cyber-label" style={{ fontSize: '18px', letterSpacing: '2px' }}>[ AUDIT_LOG_STREAM ] 系统审计日志流</div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>TYPE</th>
              <th>操作人</th>
              <th>ACTION</th>
              <th>TARGET</th>
              <th>RESULT</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td className="font-mono" style={{ fontSize: '11px' }}>{l.createdAt ? String(l.createdAt).substring(0, 19) : '—'}</td>
                <td><span style={{ color: l.logType === 'login' ? '#3B82F6' : l.logType === 'config' ? '#F59E0B' : 'var(--primary-cyber)' }}>{l.logType}</span></td>
                <td>{l.operatorName || '—'} <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-command)' }}>({l.operatorType})</span></td>
                <td>{l.action}</td>
                <td className="font-mono" style={{ fontSize: '11px' }}>{l.targetType || '—'}{l.targetId ? '#' + l.targetId : ''}</td>
                <td><span style={{ color: l.result === 'success' ? 'var(--primary-cyber)' : 'var(--danger-cyber)' }}>{l.result}</span></td>
                <td className="font-mono" style={{ fontSize: '11px' }}>{l.ipAddress || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无审计日志</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

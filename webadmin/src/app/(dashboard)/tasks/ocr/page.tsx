"use client";
import React, { useState, useEffect } from 'react';

export default function OcrTasksPage() {
  interface OcrTask { id: string; requester: string; target: string; status: string; duration: string; result: string; }
  const [OCR_TASKS, setOcrTasks] = useState<OcrTask[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/ocr-tasks', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '') }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) setOcrTasks(res.data);
      });
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="cyber-label">【萃取队列】 图像/截图光学字符萃取监控队列</div>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>序列任务牌</th>
                <th>下达人防局号</th>
                <th>载荷目标文件</th>
                <th style={{ width: '120px' }}>解析进度</th>
                <th style={{ width: '100px' }}>耗时监测</th>
                <th>截取剥离量</th>
                <th style={{ textAlign: 'right' }}>干预指令</th>
              </tr>
            </thead>
            <tbody>
              {OCR_TASKS.map(job => (
                <tr key={job.id}>
                  <td className="font-mono text-cyan-400" style={{ color: 'var(--primary-cyber)' }}>{job.id}</td>
                  <td className="font-mono">{job.requester}</td>
                  <td>{job.target}</td>
                  <td>
                    <span style={{ 
                      color: job.status === '完成' ? 'var(--primary-cyber)' : job.status === '处理失败' ? 'var(--danger-cyber)' : 'var(--warning-cyber)'
                    }} className="font-mono">
                      {job.status === '处理中' ? '⚙️ '+job.status : job.status}
                    </span>
                  </td>
                  <td className="font-mono">{job.duration}</td>
                  <td className="font-mono" style={{ fontSize: '12px', color: job.status === '处理失败' ? 'var(--danger-cyber)' : 'var(--text-secondary)' }}>{job.result}</td>
                  <td style={{ textAlign: 'right' }}>
                    {job.status === '处理失败' && <button style={{ background: 'transparent', color: 'var(--primary-cyber)', border: '1px solid var(--primary-cyber)', padding: '2px 8px', fontSize: '10px' }}>复现重压</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

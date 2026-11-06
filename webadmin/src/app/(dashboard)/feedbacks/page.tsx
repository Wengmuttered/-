"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


interface FeedbackItem {
  id: number;
  reporterId: string;
  issueType: string;
  content: string;
  status: string;
}

export default function FeedbacksPage() {
  const [filter, setFilter] = useState('ALL');
  const [fdksInfo, setFdksInfo] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/feedbacks')
       .then(res => res.json())
       .then(res => {
         if (res.code === 200) setFdksInfo(res.data);
       });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div className="cyber-label">【战损情报池】 终端工单反馈接收池</div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['未处置', '已了结', '全局总轴'].map(tab => (
                 <button key={tab} onClick={()=>setFilter(tab)} className="font-mono" style={{ padding: '4px 12px', fontSize: '10px', background: filter===tab?'var(--primary-glow)':'transparent', border: '1px solid '+(filter===tab?'var(--primary-cyber)':'var(--border-glass-light)'), color: filter===tab?'var(--primary-cyber)':'var(--text-secondary)' }}>
                    [{tab}]
                 </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>工单追认码</th>
                <th style={{ width: '160px' }}>损伤类型</th>
                <th>线报摘录</th>
                <th style={{ width: '120px' }}>前线特工</th>
                <th style={{ width: '120px' }}>最后跃迁标识</th>
                <th style={{ textAlign: 'right', width: '120px' }}>战地裁决</th>
              </tr>
            </thead>
            <tbody>
               {fdksInfo.filter(f => filter === '全局总轴' || f.status === filter).map(fd => (
                <tr key={fd.id}>
                  <td className="font-mono" style={{ color: 'var(--primary-cyber)' }}>FDK-{fd.id}</td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass-light)' }}>
                      {fd.issueType}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-command)' }}>{fd.content.length > 30 ? fd.content.substring(0, 30) + '...' : fd.content}</td>
                  <td className="font-mono">{fd.reporterId}</td>
                  <td className="font-mono" style={{ fontSize: '10px' }}>{fd.status}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/feedbacks/${fd.id}`} className="font-mono" style={{ color: 'var(--primary-cyber)', fontSize: '12px', textDecoration: 'none', borderBottom: '1px dashed var(--primary-glow)' }}>
                      [ 介入并处置 ]
                    </Link>
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

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KnowledgePage() {
  interface KnowledgeDoc { id: string; title: string; tag: string; status: string; }
  const [KNOWLEDGE, setKnowledge] = useState<KnowledgeDoc[]>([]);

  useEffect(() => {
    // [实战连网] 向大填海总管控制器提取信息
    fetch('http://localhost:8080/api/admin/peripheral/knowledge', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '') }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) setKnowledge(res.data);
      });
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="cyber-label">【安全兵器库】 隐私合规安全军武数据库</div>
          <Link href="/knowledge/edit" className="btn-cyber" style={{ textDecoration: 'none' }}>+ 录入新兵器</Link>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>文档溯源代号</th>
                <th style={{ width: '100px' }}>领域标定</th>
                <th>卷宗标题</th>
                <th style={{ width: '120px' }}>发布状态</th>
                <th style={{ textAlign: 'right' }}>操作授权</th>
              </tr>
            </thead>
            <tbody>
              {KNOWLEDGE.map(doc => (
                <tr key={doc.id}>
                  <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{doc.id}</td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: '2px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary-cyber)' }}>{doc.tag}</span>
                  </td>
                  <td>{doc.title}</td>
                  <td>
                    <span style={{ color: doc.status === '已发布' ? 'var(--primary-cyber)' : 'var(--warning-cyber)' }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/knowledge/edit?id=${doc.id}`} className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px', textDecoration: 'none' }}>
                      [ 查阅/编纂 ]
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

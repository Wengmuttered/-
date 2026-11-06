"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TemplatesPage() {
  interface TemplateDoc { id: string; name: string; updated: string; status: string; }
  const [TEMPLATES, setTemplates] = useState<TemplateDoc[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/templates', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '') }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) setTemplates(res.data);
      });
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="cyber-label">【解析中枢】 NLP解析协议的引擎模制库</div>
          <Link href="/templates/edit" className="btn-cyber" style={{ textDecoration: 'none' }}>+ 打造新模具</Link>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>模组代号</th>
                <th>模位命名</th>
                <th style={{ width: '150px' }}>最后校译周期</th>
                <th style={{ width: '120px' }}>工况</th>
                <th style={{ textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {TEMPLATES.map(tpl => (
                <tr key={tpl.id}>
                  <td className="font-mono" style={{ color: 'var(--primary-cyber)' }}>{tpl.id}</td>
                  <td>{tpl.name}</td>
                  <td className="font-mono" style={{ fontSize: '10px' }}>{tpl.updated}</td>
                  <td>
                     <span style={{ color: tpl.status === '活跃' ? 'var(--primary-cyber)' : 'var(--text-secondary)' }}>
                      {tpl.status === '活跃' ? '▣ 已外挂' : '▢ 未通电'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/templates/edit?id=${tpl.id}`} className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px', textDecoration: 'none', borderBottom: '1px dashed var(--text-command)' }}>
                      [ 改写参数 ]
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

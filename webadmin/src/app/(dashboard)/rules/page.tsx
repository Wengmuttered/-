"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


interface SecurityRule {
  id: number;
  targetModule: string;
  condition: string;
  action: string;
  status: string;
}

export default function RulesPage() {
  const [filter, setFilter] = useState('ALL');
  const [rulesInfo, setRulesInfo] = useState<SecurityRule[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/rules')
       .then(res => res.json())
       .then(res => {
         if (res.code === 200) setRulesInfo(res.data);
       });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 控制横幅 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div className="cyber-label">【规则熔炉】 核心拦截策略与阈值引擎</div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['全局态', '战斗态', '待命休眠'].map(tab => (
                 <button key={tab} onClick={()=>setFilter(tab)} className="font-mono" style={{ padding: '4px 12px', fontSize: '10px', background: filter===tab?'var(--primary-glow)':'transparent', border: '1px solid '+(filter===tab?'var(--primary-cyber)':'var(--border-glass-light)'), color: filter===tab?'var(--primary-cyber)':'var(--text-secondary)' }}>
                    [{tab}]
                 </button>
              ))}
            </div>
          </div>
          <Link href="/rules/edit" className="btn-cyber" style={{ textDecoration: 'none' }}>+ 播撒新律法</Link>
        </div>

        {/* 赛博数据矩阵表 */}
        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>铁律编号</th>
                <th style={{ width: '160px' }}>压制主控域</th>
                <th>深层判断符文 (AST)</th>
                <th style={{ width: '140px' }}>冷酷裁决</th>
                <th style={{ width: '100px' }}>引擎温度</th>
                <th style={{ textAlign: 'right', width: '120px' }}>干预操作</th>
              </tr>
            </thead>
            <tbody>
              {rulesInfo.filter(r => filter === '全局态' || r.status === filter).map(rule => (
                <tr key={rule.id}>
                  <td className="font-mono" style={{ color: 'var(--primary-cyber)' }}>RL-{rule.id}</td>
                  <td>{rule.targetModule}</td>
                  <td className="font-mono" style={{ color: 'var(--text-command)' }}>{rule.condition}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold',
                      color: rule.action === 'BLOCK' ? '#000' : rule.action.includes('ALERT') ? 'var(--warning-cyber)' : 'var(--primary-cyber)',
                      background: rule.action === 'BLOCK' ? 'var(--danger-cyber)' : 'transparent',
                      border: `1px solid ${rule.action === 'BLOCK' ? 'var(--danger-cyber)' : rule.action.includes('ALERT') ? 'var(--warning-cyber)' : 'var(--primary-cyber)'}`
                    }}>
                      {rule.action}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: rule.status === 'ACTIVE' ? 'var(--primary-cyber)' : 'var(--text-secondary)', fontSize: '12px' }}>
                      {rule.status === 'ACTIVE' ? '▣ 强效防线' : '▢ 卸载休眠'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/rules/edit?id=${rule.id}`} className="font-mono" style={{ 
                      color: 'var(--primary-cyber)', fontSize: '12px', textDecoration: 'none', borderBottom: '1px dashed var(--primary-glow)'
                    }}>
                      [ 重铸律法 ]
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

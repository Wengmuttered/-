"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


interface AdminUser {
  id: string;
  name: string;
  phone: string;
  source: string;
  trustScore: number;
  riskLevel: string;
  status: string;
  joinDate: string;
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [usersInfo, setUsersInfo] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/users')
       .then(res => res.json())
       .then(res => {
         if (res.code === 200) setUsersInfo(res.data);
       })
       .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 控制横幅 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="cyber-label">【实体记录库】 全局用户资产名册</div>
          <div style={{ display: 'flex', gap: '16px' }}>
             <input type="text" className="cyber-input" style={{ width: '300px' }} placeholder="> 检索身份主键 / 名称..." value={search} onChange={e=>setSearch(e.target.value)} />
             <button className="btn-cyber">执行筛查</button>
          </div>
        </div>

        {/* 赛博数据矩阵表 */}
        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>实体主键号</th>
                <th>用户身份标识</th>
                <th>信用健康评分</th>
                <th>风控危险评级</th>
                <th>资产连接状态</th>
                <th style={{ textAlign: 'right' }}>特区操作项</th>
              </tr>
            </thead>
            <tbody>
              {usersInfo.filter(u => (!search || u.id.includes(search) || u.name.includes(search))).map(user => (
                <tr key={user.id}>
                  <td className="font-mono" style={{ color: 'var(--primary-cyber)' }}>{user.id}</td>
                  <td>{user.name}</td>
                  <td className="font-mono">{user.trustScore}/100</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px',
                      color: user.riskLevel === 'HIGH' ? '#000' : 'var(--text-secondary)',
                      background: user.riskLevel === 'HIGH' ? 'var(--danger-cyber)' : user.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${user.riskLevel === 'HIGH' ? 'var(--danger-cyber)' : 'transparent'}`
                    }}>
                      {user.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: user.status === 'ACTIVE' ? 'var(--primary-cyber)' : 'var(--danger-cyber)', fontSize: '12px' }}>
                      ▣ {user.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/users/${user.id}`} className="font-mono" style={{ 
                      color: 'var(--primary-cyber)', fontSize: '12px', textDecoration: 'none',
                      borderBottom: '1px dashed var(--primary-glow)'
                    }}>
                      [ 深度侦测 ]
                    </Link>
                  </td>
                </tr>
              ))}
              {usersInfo.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }} className="font-mono glitch-text">未能检索到任何落库数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

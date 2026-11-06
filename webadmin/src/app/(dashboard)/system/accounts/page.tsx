"use client";
import React, { useState, useEffect } from 'react';

export default function AdminsPage() {
  interface AdminAccount { account: string; role: string; status: string; lastLogin: string; }
  const [ADMINS, setAdmins] = useState<AdminAccount[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/accounts', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '') }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) setAdmins(res.data);
      });
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="cyber-label">【至高主宰名册】 特工系统后台最高管辖名册</div>
          <button className="btn-cyber">+ 特批新执政官</button>
        </div>

        <div style={{ flex: 1, border: '1px solid var(--border-glass-light)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '200px' }}>高参枢密代码</th>
                <th>战区委任军衔</th>
                <th style={{ width: '120px' }}>驻扎状态</th>
                <th style={{ width: '150px' }}>最后的跃迁轨迹</th>
                <th style={{ textAlign: 'right' }}>特权剥夺/重赋</th>
              </tr>
            </thead>
            <tbody>
              {ADMINS.map(adm => (
                <tr key={adm.account}>
                  <td className="font-mono" style={{ color: '#fff', fontWeight: 'bold' }}>{adm.account}</td>
                  <td className="font-mono" style={{ color: 'var(--primary-cyber)' }}>{adm.role}</td>
                  <td>
                    <span style={{ color: adm.status === '活跃' ? 'var(--primary-cyber)' : 'var(--text-secondary)' }}>
                      {adm.status === '活跃' ? '▣ 无阻碍' : '▢ 防火墙冻结'}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontSize: '10px' }}>{adm.lastLogin}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ background: 'transparent', color: 'var(--danger-cyber)', border: '1px solid var(--danger-cyber)', padding: '2px 8px', fontSize: '10px', marginRight: '8px' }}>褫夺</button>
                    <button style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--text-secondary)', padding: '2px 8px', fontSize: '10px' }}>微调</button>
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

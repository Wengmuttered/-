"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';


interface CheckRecord { id: number; totalScore: number; riskLevel: string; summary: string; createdAt: string; }
interface UserDetail {
  id: number; nickname: string; phone: string; source: string; status: number;
  createdAt: string; lastLoginAt: string; checkCount: number;
  latestScore: number | null; latestRiskLevel: string | null;
  checkHistory: CheckRecord[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const [user, setUser] = useState<UserDetail | null>(null);

  /* 从后端真实API获取用户详情 */
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/users/${userId}`)
      .then(r => r.json())
      .then(data => { if (data.code === 200) setUser(data.data); })
      .catch(() => {});
  }, [userId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 导航归源 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-cyber" onClick={() => router.back()} style={{ padding: '4px 12px', fontSize: '12px' }}>&#x21A9; RETURN</button>
        <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px' }}>USERS / DEEP_SCAN / {userId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* 左侧：用户全息档案板 */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div className="cyber-label" style={{ marginBottom: '24px' }}>[ IDENTITY_CORE ]</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ width: '80px', height: '80px', border: '1px solid var(--primary-cyber)', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--primary-cyber)', marginRight: '24px', boxShadow: '0 0 10px inset var(--primary-glow)' }}>
              UX
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{user?.nickname || '加载中...'}</div>
              <div className="font-mono" style={{ fontSize: '12px', color: 'var(--primary-cyber)' }}>UID: {userId}</div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', borderTop: '1px dashed var(--border-glass-light)', paddingTop: '24px' }}>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">PHONE:</span> {user?.phone || '未绑定'}</div>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">SOURCE:</span> {user?.source || '—'}</div>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">JOINED:</span> {user?.createdAt ? String(user.createdAt).substring(0, 19) : '—'}</div>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">LAST_LOGIN:</span> {user?.lastLoginAt ? String(user.lastLoginAt).substring(0, 19) : '—'}</div>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">RISK_LEVEL:</span> {user?.latestRiskLevel || '未检测'}</div>
            <div><span style={{color:'var(--text-command)', fontSize:'10px'}} className="font-mono">LATEST_SCORE:</span> {user?.latestScore ?? '—'}</div>
          </div>
        </div>

        {/* 右侧：体检历史 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '32px', flex: 1 }}>
            <div className="cyber-label" style={{ marginBottom: '24px' }}>[ THREAT_HISTORY ] 扫描历史阵列 ({user?.checkCount || 0} 次)</div>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>SCORE</th>
                  <th>RISK_LEVEL</th>
                  <th>SUMMARY</th>
                </tr>
              </thead>
              <tbody>
                {user?.checkHistory?.length > 0 ? user.checkHistory.map((h: CheckRecord) => (
                  <tr key={h.id}>
                    <td className="font-mono">{h?.createdAt ? String(h.createdAt).substring(0, 19) : '—'}</td>
                    <td style={{ color: (h.totalScore >= 80 ? 'var(--primary-cyber)' : h.totalScore >= 60 ? '#F59E0B' : 'var(--danger-cyber)') }}>{h.totalScore}</td>
                    <td>{h.riskLevel?.toUpperCase()}</td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.summary || '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无扫描记录</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('AWAITING_INPUT');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(!account || !password) {
       setStatus('ERR_EMPTY_CREDENTIALS');
       return;
    }
    setStatus('ESTABLISHING_CONNECTION...');
    
    // 调用后端真实认证接口
    fetch('http://localhost:8080/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password })
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setStatus('AUTH_SUCCESS // REDIRECTING...');
          localStorage.setItem('PG_TOKEN', data.data.token);
          localStorage.setItem('PG_ACCOUNT_ID', data.data.accountId);
          localStorage.setItem('PG_REAL_NAME', data.data.realName);
          setTimeout(() => router.push('/dashboard'), 800);
        } else {
          setStatus('ERR_AUTH_FAILED: ' + (data.message || '认证失败'));
        }
      })
      .catch(() => {
        setStatus('ERR_CONNECTION_LOST // 后端服务失联');
      });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      
      {/* 极光背景增强 */}
      <div style={{ position: 'absolute', width: '80vw', height: '80vh', background: 'radial-gradient(circle, rgba(0, 244, 163, 0.05) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="glass-panel" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* 雷达扫描标识 */}
        <div style={{ marginBottom: '40px', width: '100px', height: '100px', border: '1px solid var(--primary-cyber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 30px inset rgba(0,244,163,0.2)' }}>
          <div style={{ position: 'absolute', inset: 4, border: '2px dashed rgba(0,244,163,0.5)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
          <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary-cyber)', transform: 'rotate(-45deg)'}}>🛡️</span>
        </div>

        <h1 style={{ fontSize: '28px', letterSpacing: '4px', textAlign: 'center', marginBottom: '8px', textShadow: '0 0 15px rgba(0,244,163,0.6)' }}>
          SYS.PG
        </h1>
        <p className="font-mono" style={{ fontSize: '10px', color: 'var(--primary-cyber)', marginBottom: '48px', letterSpacing: '2px' }}>
          {"// 隐私数据安全管家后台防线"}
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>[ACCOUNT_ID]</div>
            <input 
              type="text" 
              className="cyber-input" 
              value={account}
              onChange={e => {setAccount(e.target.value); setStatus('TYPING...');}}
              placeholder="请输入管理员编号"
            />
          </div>

          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>[ACCESS_TOKEN]</div>
            <input 
              type="password" 
              className="cyber-input" 
              value={password}
              onChange={e => {setPassword(e.target.value); setStatus('TYPING...');}}
              placeholder="请输入权限访问密匙"
            />
          </div>

          <div style={{ height: '20px', marginTop: '-8px' }}>
            <span className="font-mono" style={{ fontSize: '10px', color: status.includes('ERR') ? 'var(--danger-cyber)' : status.includes('SUCCESS') ? 'var(--primary-cyber)' : 'var(--text-command)' }}>
              &gt; {status}
            </span>
          </div>

          <button type="submit" className="btn-cyber" style={{ padding: '16px', fontSize: '16px', marginTop: '16px', letterSpacing: '4px' }}>
            INITIATE_LOGIN
          </button>
        </form>

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

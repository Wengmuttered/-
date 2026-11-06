"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RuleEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ruleId = searchParams.get('id');
  const [status, setStatus] = useState('DRAFT');
  const [targetModule, setTargetModule] = useState('LINK_SCAN');
  const [action, setAction] = useState('BLOCK');
  const [condition, setCondition] = useState('');

  /* 编辑模式：从后端获取规则详情 */
  useEffect(() => {
    if (ruleId) {
      fetch(`http://localhost:8080/api/admin/rules/${ruleId}`)
        .then(r => r.json())
        .then(data => {
          if (data.code === 200 && data.data) {
            setTargetModule(data.data.targetModule || 'LINK_SCAN');
            setAction(data.data.action || 'BLOCK');
            setCondition(data.data.condition || '');
            setStatus(data.data.status || 'DRAFT');
          }
        });
    }
  }, [ruleId]);

  /* 提交到后端真实API */
  const handleSave = () => {
    const method = ruleId ? 'PUT' : 'POST';
    const url = ruleId
      ? `http://localhost:8080/api/admin/rules/${ruleId}`
      : 'http://localhost:8080/api/admin/rules';
    
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetModule, action, condition, status: 'ACTIVE' })
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setStatus('DEPLOYED');
          setTimeout(() => router.push('/rules'), 1200);
        }
      })
      .catch(() => setStatus('ERR_DEPLOY_FAILED'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-cyber" onClick={() => router.back()} style={{ padding: '4px 12px', fontSize: '12px' }}>&#x21A9; RETURN</button>
        <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px' }}>RULES_ENGINE / SANDBOX_EDITOR / {ruleId || 'NEW'}</span>
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="cyber-label">[ CONFIGURATION_SANDBOX ] 拦截规则配置沙盒</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>TARGET_MODULE (目标扫描器)</div>
            <select className="cyber-input" value={targetModule} onChange={e => setTargetModule(e.target.value)}>
              <option value="LINK_SCAN">LINK_SCAN [防诈骗拦截器]</option>
              <option value="OCR_IMAGE">OCR_IMAGE [图形敏感源提取器]</option>
              <option value="PRIVACY_PROTOCOL">PRIVACY_PROTOCOL [霸王条款解构引擎]</option>
            </select>
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>EXEC_ACTION (满足时执行方案)</div>
            <select className="cyber-input" style={{ borderColor: 'var(--danger-cyber)' }} value={action} onChange={e => setAction(e.target.value)}>
              <option value="BLOCK">BLOCK [强制阻断/极度高危]</option>
              <option value="ALERT_HIGH">ALERT_HIGH [高危弹窗告警]</option>
              <option value="TRIGGER_WARN">TRIGGER_WARN [预警标红记录]</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-label" style={{ marginBottom: '8px' }}>EVALUATION_CONDITION (抽象语法树代码块)</div>
          <textarea 
            className="cyber-input font-mono" 
            style={{ height: '160px', resize: 'vertical', color: 'var(--primary-cyber)', border: '1px dashed var(--primary-cyber)', background: 'rgba(0,244,163,0.02)' }}
            value={condition}
            onChange={e => setCondition(e.target.value)}
            placeholder={`CONTAIN("钓鱼") OR DOMAIN_SCORE < 40\nAND HAS_REDIRECT = TRUE`}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
          <button className="btn-cyber" style={{ background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-glass-light)' }} onClick={() => router.back()}>CANCEL</button>
          <button className="btn-cyber" onClick={handleSave}>[ COMMIT_AND_DEPLOY ] 发布规则池</button>
        </div>
        
        {status === 'DEPLOYED' && (
          <div className="font-mono glitch-text" style={{ textAlign: 'right', fontSize: '10px', color: 'var(--primary-cyber)' }}>&gt; RULE UPLOADED TO ENGINE. ACTIVE.</div>
        )}
      </div>
    </div>
  );
}

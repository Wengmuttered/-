"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
export default function TemplateEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tplId = searchParams.get('id');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('APP_PRIVACY_POLICY');
  const [statusVal, setStatusVal] = useState<number>(1);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  /* 编辑模式：从后端获取模板详情 */
  useEffect(() => {
    if (tplId) {
      fetch(`http://localhost:8080/api/admin/peripheral/templates/${tplId}`)
        .then(r => r.json())
        .then(data => {
          if (data.code === 200 && data.data) {
            setName(data.data.templateName || '');
            setCategory(data.data.category || 'APP_PRIVACY_POLICY');
            setStatusVal(data.data.status ?? 1);
            setContent(data.data.content || '');
          }
        });
    }
  }, [tplId]);

  /* 保存到后端真实API */
  const handleSave = () => {
    const payload: Record<string, string | number> = { templateName: name, category, status: statusVal, content };
    if (tplId) payload.id = Number(tplId);
    
    fetch('http://localhost:8080/api/admin/peripheral/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setSaved(true);
          setTimeout(() => router.push('/templates'), 1000);
        }
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-cyber" onClick={() => router.back()} style={{ padding: '4px 12px', fontSize: '12px' }}>&#x21A9; RETURN</button>
        <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px' }}>TEMPLATES_ENGINE / EDITOR / {tplId || 'NEW'}</span>
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="cyber-label">[ AST_TEMPLATE_EDITOR ] NLP协议语法解析模板编辑器</div>

        <div>
          <div className="cyber-label" style={{ marginBottom: '8px' }}>TEMPLATE_NAME (提取器命名)</div>
          <input className="cyber-input" value={name} onChange={e => setName(e.target.value)} style={{ width: '50%' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>TEMPLATE_TYPE (适用场景)</div>
            <select className="cyber-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="APP_PRIVACY_POLICY">APP_PRIVACY_POLICY [软件隐私协定]</option>
              <option value="USER_AGREEMENT">USER_AGREEMENT [冗长霸王防线检查]</option>
            </select>
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>MOUNT_STATUS (挂载状态)</div>
            <select className="cyber-input" value={statusVal} onChange={e => setStatusVal(Number(e.target.value))}>
              <option value={1}>ACTIVE (部署运行中)</option>
              <option value={0}>STANDBY (离线测试配置)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="cyber-label" style={{ marginBottom: '8px' }}>TEMPLATE_CONTENT (模板正文)</div>
          <textarea 
            className="cyber-input font-mono" 
            style={{ height: '200px', resize: 'vertical' }}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
          <button className="btn-cyber" onClick={handleSave}>[ SAVE_AND_DEPLOY ] 保存投产</button>
        </div>
        {saved && <div className="font-mono" style={{ textAlign: 'right', fontSize: '10px', color: 'var(--primary-cyber)' }}>&gt; TEMPLATE SAVED.</div>}
      </div>
    </div>
  );
}

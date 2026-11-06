"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KnowledgeEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kId = searchParams.get('id');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [sceneTags, setSceneTags] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [saved, setSaved] = useState(false);

  /* 编辑模式：从后端获取知识详情 */
  useEffect(() => {
    if (kId) {
      fetch(`http://localhost:8080/api/admin/peripheral/knowledge/${kId}`)
        .then(r => r.json())
        .then(data => {
          if (data.code === 200 && data.data) {
            setTitle(data.data.title || '');
            setCategory(data.data.category || '');
            setContent(data.data.content || '');
            setSceneTags(data.data.sceneTags || '');
            setSuggestionText(data.data.suggestionText || '');
          }
        });
    }
  }, [kId]);

  /* 保存到后端真实API */
  const handleSave = () => {
    const payload: Record<string, string | number> = { title, category, content, sceneTags, suggestionText, status: 1 };
    if (kId) payload.id = Number(kId);
    
    fetch('http://localhost:8080/api/admin/peripheral/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          setSaved(true);
          setTimeout(() => router.push('/knowledge'), 1000);
        }
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-cyber" onClick={() => router.back()} style={{ padding: '4px 12px', fontSize: '12px' }}>&#x21A9; RETURN</button>
        <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px' }}>KNOWLEDGE / DATABASE_EDITOR / {kId || 'NEW'}</span>
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="cyber-label">[ DATA_INJECTION ] 知识库注入编辑器</div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>TITLE (词条标题)</div>
            <input className="cyber-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>CATEGORY (分类)</div>
            <input className="cyber-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="如：权限安全、隐私政策" />
          </div>
        </div>

        <div>
          <div className="cyber-label" style={{ marginBottom: '8px' }}>CONTENT (知识正文)</div>
          <textarea className="cyber-input font-mono" style={{ height: '200px', resize: 'vertical' }} value={content} onChange={e => setContent(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>SCENE_TAGS (场景标签 JSON)</div>
            <input className="cyber-input" value={sceneTags} onChange={e => setSceneTags(e.target.value)} placeholder='["社交安全","密码防护"]' />
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '8px' }}>SUGGESTION (建议话术)</div>
            <input className="cyber-input" value={suggestionText} onChange={e => setSuggestionText(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
          <button className="btn-cyber" style={{ background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-glass-light)' }} onClick={() => router.back()}>CANCEL</button>
          <button className="btn-cyber" onClick={handleSave}>[ INJECT_AND_COMMIT ] 写入知识库</button>
        </div>
        {saved && <div className="font-mono" style={{ textAlign: 'right', fontSize: '10px', color: 'var(--primary-cyber)' }}>&gt; KNOWLEDGE INJECTED.</div>}
      </div>
    </div>
  );
}

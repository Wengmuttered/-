"use client";
import React, { useState, useEffect } from 'react';

interface MsgTemplate {
  id: number;
  templateName: string;
  templateType: string;
  content: string;
  variables?: string;
  status: number;
}

export default function MsgTemplatesPage() {
  const [list, setList] = useState<MsgTemplate[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ templateName: '', templateType: 'in_app', content: '', status: 1 });

  /* 从后端获取消息模板列表 */
  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/msg-templates')
      .then(r => r.json())
      .then(data => { if (data.code === 200) setList(data.data || []); });
  }, []);

  /* 保存消息模板 */
  const handleSave = () => {
    if (!form.templateName.trim() || !form.content.trim()) return;
    const payload: Record<string, string | number> = { ...form };
    if (editId) payload.id = editId;
    fetch('http://localhost:8080/api/admin/peripheral/msg-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          if (editId) {
            setList(prev => prev.map(x => x.id === editId ? data.data : x));
          } else {
            setList(prev => [data.data, ...prev]);
          }
          setEditId(null);
          setForm({ templateName: '', templateType: 'in_app', content: '', status: 1 });
        }
      });
  };

  const startEdit = (item: MsgTemplate) => {
    setEditId(item.id);
    setForm({ templateName: item.templateName, templateType: item.templateType, content: item.content, status: item.status });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="cyber-label" style={{ fontSize: '18px', letterSpacing: '2px' }}>[ MSG_TEMPLATE_ENGINE ] 消息模板引擎</div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>TEMPLATE_NAME</div>
            <input className="cyber-input" value={form.templateName} onChange={e => setForm({...form, templateName: e.target.value})} />
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>TYPE</div>
            <select className="cyber-input" value={form.templateType} onChange={e => setForm({...form, templateType: e.target.value})}>
              <option value="in_app">站内消息</option>
              <option value="subscribe">订阅消息</option>
            </select>
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>STATUS</div>
            <select className="cyber-input" value={form.status} onChange={e => setForm({...form, status: Number(e.target.value)})}>
              <option value={1}>启用</option>
              <option value={0}>停用</option>
            </select>
          </div>
        </div>
        <textarea className="cyber-input font-mono" style={{ height: '80px', resize: 'none' }} value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="模板内容...支持 {{变量}} 占位符" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-cyber" onClick={handleSave}>{editId ? '[ UPDATE ]' : '[ CREATE ]'}</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table className="cyber-table">
          <thead>
            <tr><th>ID</th><th>模板名称</th><th>类型</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id}>
                <td className="font-mono">{t.id}</td>
                <td>{t.templateName}</td>
                <td>{t.templateType === 'in_app' ? '站内' : '订阅'}</td>
                <td><span style={{ color: t.status === 1 ? 'var(--primary-cyber)' : 'var(--text-secondary)' }}>{t.status === 1 ? 'ACTIVE' : 'DISABLED'}</span></td>
                <td><button className="btn-cyber" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => startEdit(t)}>EDIT</button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无模板数据</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

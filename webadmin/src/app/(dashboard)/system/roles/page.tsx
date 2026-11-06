"use client";
import React, { useState, useEffect } from 'react';

interface AdminRole {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  permissions: string;
  menuPermissions?: string;
  status: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [form, setForm] = useState({ roleName: '', roleCode: '', description: '', permissions: '' });
  const [editId, setEditId] = useState<number | null>(null);

  /* 从后端获取角色列表 */
  useEffect(() => {
    fetch('http://localhost:8080/api/admin/peripheral/roles')
      .then(r => r.json())
      .then(data => { if (data.code === 200) setRoles(data.data || []); });
  }, []);

  /* 保存角色 */
  const handleSave = () => {
    if (!form.roleName.trim() || !form.roleCode.trim()) return;
    const payload: Record<string, string | number> = { ...form, status: 1 };
    if (editId) payload.id = editId;
    fetch('http://localhost:8080/api/admin/peripheral/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          if (editId) {
            setRoles(prev => prev.map(r => r.id === editId ? data.data : r));
          } else {
            setRoles(prev => [data.data, ...prev]);
          }
          setEditId(null);
          setForm({ roleName: '', roleCode: '', description: '', permissions: '' });
        }
      });
  };

  const startEdit = (r: AdminRole) => {
    setEditId(r.id);
    setForm({ roleName: r.roleName, roleCode: r.roleCode, description: r.description || '', permissions: r.permissions || '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="cyber-label" style={{ fontSize: '18px', letterSpacing: '2px' }}>[ RBAC_ENGINE ] 角色权限管理</div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px' }}>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>ROLE_NAME</div>
            <input className="cyber-input" value={form.roleName} onChange={e => setForm({...form, roleName: e.target.value})} placeholder="角色名称" />
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>ROLE_CODE</div>
            <input className="cyber-input" value={form.roleCode} onChange={e => setForm({...form, roleCode: e.target.value})} placeholder="角色编码" />
          </div>
          <div>
            <div className="cyber-label" style={{ marginBottom: '4px' }}>DESCRIPTION</div>
            <input className="cyber-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="描述" />
          </div>
        </div>
        <div>
          <div className="cyber-label" style={{ marginBottom: '4px' }}>PERMISSIONS (JSON)</div>
          <textarea className="cyber-input font-mono" style={{ height: '60px', resize: 'none' }} value={form.permissions} onChange={e => setForm({...form, permissions: e.target.value})} placeholder='["users:read","rules:write","system:admin"]' />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {editId && <button className="btn-cyber" style={{ marginRight: '8px', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => { setEditId(null); setForm({ roleName: '', roleCode: '', description: '', permissions: '' }); }}>CANCEL</button>}
          <button className="btn-cyber" onClick={handleSave}>{editId ? '[ UPDATE ]' : '[ CREATE ]'}</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table className="cyber-table">
          <thead>
            <tr><th>ID</th><th>角色名</th><th>编码</th><th>描述</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id}>
                <td className="font-mono">{r.id}</td>
                <td>{r.roleName}</td>
                <td className="font-mono">{r.roleCode}</td>
                <td>{r.description || '—'}</td>
                <td><span style={{ color: r.status === 1 ? 'var(--primary-cyber)' : 'var(--text-secondary)' }}>{r.status === 1 ? 'ACTIVE' : 'DISABLED'}</span></td>
                <td><button className="btn-cyber" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => startEdit(r)}>EDIT</button></td>
              </tr>
            ))}
            {roles.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-command)' }}>暂无角色数据</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

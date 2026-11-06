"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';


interface FeedbackTicket {
  id: number;
  reporterId: string;
  issueType: string;
  content: string;
  description?: string;
  status: string;
  createdAt: string;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const feedbackId = params.id;
  const [feedback, setFeedback] = useState<FeedbackTicket | null>(null);

  /* 从后端获取反馈详情 */
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/feedbacks/${feedbackId}`)
      .then(r => r.json())
      .then(data => { if (data.code === 200) setFeedback(data.data); });
  }, [feedbackId]);

  /* 更新反馈状态 */
  const updateStatus = (newStatus: string) => {
    fetch(`http://localhost:8080/api/admin/feedbacks/${feedbackId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) setFeedback(data.data);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-cyber" onClick={() => router.back()} style={{ padding: '4px 12px', fontSize: '12px' }}>&#x21A9; RETURN</button>
        <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '12px' }}>FEEDBACKS / TICKET / {feedbackId}</span>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <div className="cyber-label" style={{ marginBottom: '24px' }}>[ FEEDBACK_DETAIL ] 反馈工单详情</div>
        {feedback ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '11px' }}>TICKET_ID: </span>
              <span>{feedback.id}</span>
            </div>
            <div>
              <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '11px' }}>STATUS: </span>
              <span style={{ color: feedback.status === 'RESOLVED' ? 'var(--primary-cyber)' : feedback.status === 'PENDING' ? '#F59E0B' : 'var(--text-secondary)' }}>
                {feedback.status}
              </span>
            </div>
            <div>
              <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '11px' }}>CONTENT: </span>
              <p style={{ marginTop: '8px', lineHeight: '1.8', color: 'var(--text-primary)' }}>{feedback.content || feedback.description || '无内容'}</p>
            </div>
            <div>
              <span className="font-mono" style={{ color: 'var(--text-command)', fontSize: '11px' }}>CREATED_AT: </span>
              <span className="font-mono" style={{ fontSize: '12px' }}>{feedback.createdAt ? String(feedback.createdAt).substring(0, 19) : '—'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px dashed var(--border-glass-light)', paddingTop: '24px' }}>
              <button className="btn-cyber" onClick={() => updateStatus('PROCESSING')} style={{ padding: '8px 16px' }}>[ ACCEPT ] 受理</button>
              <button className="btn-cyber" onClick={() => updateStatus('RESOLVED')} style={{ padding: '8px 16px', borderColor: 'var(--primary-cyber)', color: 'var(--primary-cyber)' }}>[ RESOLVE ] 已解决</button>
              <button className="btn-danger" onClick={() => updateStatus('REJECTED')} style={{ padding: '8px 16px' }}>[ REJECT ] 驳回</button>
            </div>
          </div>
        ) : (
          <div className="font-mono" style={{ color: 'var(--text-command)' }}>LOADING...</div>
        )}
      </div>
    </div>
  );
}

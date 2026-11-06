"use client";
import React, { useEffect, useState } from 'react';


interface DashboardStat { label: string; value: string | number; status: string; }
interface LiveFeed { time: string; event: string; alert?: boolean; }

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [feeds, setFeeds] = useState<LiveFeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 假设管理后端的登录态已通过请求头等方式设置，这里模拟请求我们刚挂载的最强终端大屏
    fetch('http://localhost:8080/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) {
          setStats(res.data.systemStats || []);
          setFeeds(res.data.liveFeeds || []);
        }
      })
      .catch(err => console.error('MATRIX_CRASH', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 行1：系统负荷雷达监控 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {loading ? (
           <div className="font-mono" style={{ color: 'var(--primary-cyber)' }}>正在从战舰核心主板同步源数据...</div>
        ) : stats.map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div className="cyber-label" style={{ marginBottom: '16px' }}>【{stat.label}】</div>
            <div className="font-mono" style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', color: stat.status === 'WARNING' || stat.status === '危险告警' ? 'var(--danger-cyber)' : 'var(--text-primary)' }}>
              {stat.value}
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
              <span>运行工况评估:</span>
              <span style={{ color: stat.status === 'WARNING' || stat.status === '危险告警' ? 'var(--danger-cyber)' : 'var(--primary-cyber)' }}>{stat.status === 'WARNING' ? '危险告警' : stat.status === 'NORMAL' ? '平稳顺畅' : stat.status}</span>
            </div>
            
            {/* 顶角闪点特效 */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', background: stat.status === 'WARNING' ? 'var(--danger-cyber)' : 'var(--primary-cyber)', boxShadow: stat.status === 'WARNING' ? '0 0 10px var(--danger-glow)' : '0 0 10px var(--primary-glow)' }} />
          </div>
        ))}
      </div>

      {/* 行2：深度分析图谱槽 (模拟区块) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* 威胁活动分布图表槽 */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-label" style={{ borderBottom: '1px solid var(--border-glass-light)', paddingBottom: '16px', marginBottom: '24px' }}>
            【全网风险流转威胁分布热图】
          </div>
          
          {/* 这里放置一个仿终端雷达背景的底槽 */}
          <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <div className="font-mono glitch-text" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>正在等待探针引擎装载底层流...</div>
             
             {/* 伪扫描线 */}
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--primary-cyber)', boxShadow: '0 0 10px var(--primary-cyber)', animation: 'scan 4s linear infinite', opacity: 0.3 }} />
          </div>
        </div>

        {/* 实时工单协同队列 */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '360px' }}>
          <div className="cyber-label" style={{ borderBottom: '1px solid var(--border-glass-light)', paddingBottom: '16px', marginBottom: '24px' }}>
            【全时安全协同侦测流】
          </div>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
               <div className="font-mono" style={{ color: 'var(--primary-cyber)' }}>正在建置跨网连接...</div>
            ) : feeds.map((feed, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', borderLeft: feed.alert ? '2px solid var(--danger-cyber)' : '2px solid var(--primary-cyber)', paddingLeft: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div className="font-mono" style={{ fontSize: '10px', color: feed.alert ? 'var(--danger-cyber)' : 'var(--primary-cyber)', marginBottom: '4px' }}>时间戳追踪信号 &gt; {feed.time}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feed.event}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

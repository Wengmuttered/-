import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-container">
      {/* 极客终端侧边栏 */}
      <Sidebar />
      
      {/* 业务中枢操作主屏 */}
      <main className="main-dashboard">
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="cyber-label glitch-text" style={{ fontSize: '10px' }}>天网系统 // 安全鉴权完毕</div>
            <h1 style={{ fontSize: '24px', letterSpacing: '4px', textShadow: '0 0 10px rgba(0,244,163,0.4)', marginTop: '4px' }}>
              主控数据面板
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--primary-cyber)' }}>心跳延迟: 14ms</span>
            <span style={{ padding: '4px 12px', border: '1px solid var(--primary-cyber)', background: 'var(--primary-glow)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>最高执掌特工</span>
          </div>
        </header>
        
        {/* 内容投射区 */}
        <section style={{ flex: 1, position: 'relative' }}>
          {children}
        </section>
      </main>
    </div>
  );
}

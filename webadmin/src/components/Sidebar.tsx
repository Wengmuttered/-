"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_GROUPS = [
  {
    title: "核心总线",
    items: [
      { name: "综合态势统计", path: "/dashboard", code: "总报" },
      { name: "特工/用户名册", path: "/users", code: "名册" }
    ]
  },
  {
    title: "矩阵引擎",
    items: [
      { name: "全局拦截策略集", path: "/rules", code: "铁律" },
      { name: "协议解析模板引擎", path: "/templates", code: "模组" },
      { name: "合规安全知识军武库", path: "/knowledge", code: "兵器" }
    ]
  },
  {
    title: "任务中枢",
    items: [
      { name: "OCR视觉提取分析", path: "/tasks/ocr", code: "视觉" },
      { name: "NLP语义解读分析", path: "/tasks/interpret", code: "语义" },
      { name: "URL深度节点分析", path: "/tasks/scan", code: "深潜" }
    ]
  },
  {
    title: "通讯频段",
    items: [
      { name: "通信广播大屏", path: "/notifications/announcements", code: "天音" },
      { name: "通信信件模制", path: "/notifications/templates", code: "密卷" },
      { name: "高危前端工单预警", path: "/feedbacks", code: "战损" }
    ]
  },
  {
    title: "深空权限",
    items: [
      { name: "高层权柄矩阵", path: "/system/roles", code: "天权" },
      { name: "特工职员账号", path: "/system/accounts", code: "主宰" },
      { name: "底层操作追踪日记", path: "/system/logs", code: "归档" }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-terminal">
      <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--border-glass-light)' }}>
        <h2 style={{ fontSize: '20px', letterSpacing: '4px', textShadow: '0 0 10px rgba(0, 244, 163, 0.6)', color: '#fff' }}>SYS.PG</h2>
        <div style={{ fontSize: '10px', color: 'var(--primary-cyber)', fontFamily: 'monospace', marginTop: '8px' }}>
          {"// 绝对控制中心"}
        </div>
      </div>

      <nav style={{ padding: '24px 16px', flex: 1, overflowY: 'auto' }}>
        {MENU_GROUPS.map((g, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: '8px', paddingLeft: '8px' }}>
              [{g.title}]
            </div>
            <ul style={{ listStyle: 'none' }}>
              {g.items.map(item => {
                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                return (
                  <li key={item.path} style={{ marginBottom: '4px' }}>
                    <Link href={item.path} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      color: isActive ? 'var(--bg-dark)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--primary-cyber)' : 'transparent',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 0 15px rgba(0, 244, 163, 0.4)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if(!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(0, 244, 163, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if(!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        marginRight: '12px', 
                        opacity: isActive ? 1 : 0.4 
                      }}>{item.code}</span>
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border-glass-light)' }}>
        <Link href="/login" style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px',
          background: 'rgba(244, 63, 94, 0.1)',
          color: 'var(--danger-cyber)',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '4px',
          border: '1px solid rgba(244,63,94,0.3)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
           (e.currentTarget as HTMLElement).style.background = 'var(--danger-cyber)';
           (e.currentTarget as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={(e) => {
           (e.currentTarget as HTMLElement).style.background = 'rgba(244, 63, 94, 0.1)';
           (e.currentTarget as HTMLElement).style.color = 'var(--danger-cyber)';
        }}>
          切断脑机连接 {"// 强制登出"}
        </Link>
      </div>
    </aside>
  );
}

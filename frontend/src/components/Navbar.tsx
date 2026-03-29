import { Link, useLocation } from 'react-router-dom';
import { Shield, Fingerprint, Radar, FileSearch, Scale, ImageOff, ScanFace, Network, LineChart, Activity, MessageSquareWarning, ScanLine, BadgeDollarSign, Globe2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '安全控制台', icon: <Shield size={18} /> },
    { path: '/phishing', label: '防骗鉴定', icon: <MessageSquareWarning size={18} /> },
    { path: '/watermark', label: '本地打码', icon: <ScanLine size={18} /> },
    { path: '/password', label: '脱敏测试', icon: <Fingerprint size={18} /> },
    { path: '/leak', label: '暗网雷达', icon: <Radar size={18} /> },
    { path: '/sandbox', label: '沙箱解析', icon: <FileSearch size={18} /> },
    { path: '/rights', label: '维权中心', icon: <Scale size={18} /> },
    { path: '/exif', label: '轨迹清洗', icon: <ImageOff size={18} /> },
    { path: '/nlp', label: '条款检测', icon: <ScanFace size={18} /> },
    { path: '/graph', label: '知识图谱', icon: <Network size={18} /> },
    { path: '/dp', label: '差分隐私', icon: <LineChart size={18} /> },
    { path: '/sniffer', label: '动态抓包', icon: <Activity size={18} /> },
    { path: '/marketplace', label: '数据金库', icon: <BadgeDollarSign size={18} className="text-yellow-400" /> },
    { path: '/earth', label: '全息态势', icon: <Globe2 size={18} className="text-blue-400" /> },
  ];

  return (
    <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <Shield className="text-primary" size={20} />
            </div>
            <span className="font-bold text-xl tracking-wider text-white">
              PRIVACY<span className="text-primary">GUARD</span>
            </span>
          </div>
          <div className="flex md:hidden items-center text-primary font-bold text-sm ml-2">滑动展开 &gt; </div>
          <div className="overflow-x-auto flex space-x-1 custom-scrollbar py-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,255,204,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-card-dark'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

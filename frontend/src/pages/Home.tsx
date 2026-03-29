import { ShieldAlert, Database, LockKeyhole, FileSignature, ImageOff, ScanFace, Network, LineChart, Activity, MessageSquareWarning, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const cards = [
    { title: '防钓鱼短信 AI 鉴定', desc: '强力拆解仿冒ETC/医保停用骗局，阻断父母被骗路径', icon: <MessageSquareWarning size={32}/>, path: '/phishing', color: 'text-rose-400', border: 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]' },
    { title: '零上传证件防伪仪', desc: '纯本地Canvas绘制倾斜盲水印，拍身份证再也不怕被网贷', icon: <ScanLine size={32}/>, path: '/watermark', color: 'text-teal-400', border: 'border-teal-500/80 shadow-[0_0_20px_rgba(20,184,166,0.2)]' },
    { title: '全网态势拦截大屏', desc: '模拟 Matrix 级手机数据底层抓包，带有一键物理「全网熔断」震撼动画', icon: <Activity size={32}/>, path: '/sniffer', color: 'text-red-500', border: 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' },
    { title: '暗物质溯源星图', desc: '采用 D3 力导向引擎渲染泄露节点的互相牵挂锚点，支持鼠标拖拽互动检索', icon: <Network size={32}/>, path: '/graph', color: 'text-yellow-400', border: 'border-yellow-500/50' },
    { title: '差分隐私算法舱', desc: '顶尖计算机数据扰动证明：给临床数据注入 Laplace 噪声并比对底层直方分布', icon: <LineChart size={32}/>, path: '/dp', color: 'text-blue-500', border: 'border-blue-500/50' },
    { title: '无痕清洗提取器', desc: '上传自拍原图在世界地图标记危险范围，物理阉割所有追踪印记', icon: <ImageOff size={32}/>, path: '/exif', color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { title: 'AI 法务照妖镜', desc: '模拟搭载语义认知模型，让躲藏在三万字下的收集陷阱直接变红', icon: <ScanFace size={32}/>, path: '/nlp', color: 'text-orange-400', border: 'border-orange-500/30' },
    { title: '密码脱敏检测', desc: '采用端侧计算与 K-匿名算法，零风险探测您的密码安全边界', icon: <LockKeyhole size={32}/>, path: '/password', color: 'text-blue-400', border: 'border-blue-500/30' },
    { title: '全网泄露雷达', desc: '实时监控暗网与公开拖库事件，一键生成您的专属外泄报告', icon: <Database size={32}/>, path: '/leak', color: 'text-purple-400', border: 'border-purple-500/30' },
    { title: '未知应用沙箱', desc: '纯净隔绝的解析环境，深度解剖流氓 APP 的每一项越权行为', icon: <ShieldAlert size={32}/>, path: '/sandbox', color: 'text-red-400', border: 'border-red-500/30' },
    { title: '数据权利主张', desc: '根据《个人信息保护法》自动生成维权法务信件，一键带走', icon: <FileSignature size={32}/>, path: '/rights', color: 'text-green-400', border: 'border-green-500/30' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          掌控你的<span className="text-primary">数字足迹</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          PrivacyGuard 是新一代个人隐私数据安全管家。我们首创采用**本地沙箱端侧计算**与**K-匿名脱敏传输**，郑重承诺：您的所有检测数据都会在阅后即焚，绝不留存任何明文隐私。
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            key={card.title}
          >
            <Link to={card.path} className={`block p-8 rounded-xl bg-card-dark border ${card.border} hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group overflow-hidden relative h-full`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className={`${card.color} mb-4 group-hover:scale-110 transition-transform origin-left`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-gray-400">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;

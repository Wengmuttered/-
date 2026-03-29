import { useState } from 'react';
import { Radar, ShieldAlert, Cpu, Monitor, Database, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const getCanvasFingerprint = () => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'Unsupported Context';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = '#069';
        ctx.fillText('PrivacyGuard, OS fingerprinting trace test 2026', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('PrivacyGuard, OS fingerprinting trace test 2026', 4, 17);
        const b64 = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < b64.length; i++) {
            hash = ((hash << 5) - hash) + b64.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(16);
    } catch(e) {
        return 'Blocked by Sandbox';
    }
};

const LeakRadar = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [fingerprints, setFingerprints] = useState<any[]>([]);

  const runFingerprintScan = () => {
      setAnalyzing(true);
      setScanned(false);
      
      const newPrints: any[] = [];
      setTimeout(() => {
          // Hardware
          newPrints.push({ category: '硬件并发架构', val: navigator.hardwareConcurrency + ' 核并行线程', icon: <Cpu className="text-purple-400"/> });
          newPrints.push({ category: '内存物理限制', val: (navigator as any).deviceMemory ? `大于 ${(navigator as any).deviceMemory} GiB` : '被系统屏蔽隐匿', icon: <Database className="text-purple-400"/> });
          
          // Browser tracking canvas hash
          newPrints.push({ category: 'WebGL Canvas 洗稿级追踪散列', val: 'hash::' + getCanvasFingerprint(), icon: <ShieldAlert className="text-red-500 animate-pulse"/> });
          
          // Agent
          newPrints.push({ category: 'HTTP User-Agent 裸奔载荷', val: navigator.userAgent.substring(0, 45) + '...', icon: <UploadCloud className="text-blue-400"/> });
          
          // Sensors/Display
          newPrints.push({ category: '物理屏幕视网膜特征分布', val: `${window.screen.width}x${window.screen.height} (ColorDepth: ${window.screen.colorDepth})`, icon: <Monitor className="text-green-400"/> });
          
          setFingerprints(newPrints);
          setAnalyzing(false);
          setScanned(true);
      }, 1500); 
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 z-0">
           {analyzing && (
               <div className="w-[800px] h-[800px] rounded-full border border-blue-500/30">
                  <div className="w-full h-full border-t border-blue-500 rounded-full animate-spin [animation-duration:3s]"></div>
               </div>
           )}
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative z-10">
           <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4 inline-flex items-center gap-4">
              <Radar size={40} className="text-blue-400"/> 物理级私隐指纹提取探针
           </h1>
           <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
               废弃老旧的邮箱查库（假）方式。我们在这里部署了极高权限的浏览器底层 JS 探针，直接刺穿浏览器的沙盒层。
               它能在你不填写任何资料的情况下，利用 Canvas 图像重绘、硬件线程暴露等漏洞，当场提取出你这台物理设备在宇宙中**唯一的追踪指纹散列**！
           </p>
        </motion.div>

        <div className="flex justify-center mb-12 relative z-10">
            <button 
                onClick={runFingerprintScan} disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] disabled:opacity-50 tracking-widest uppercase flex items-center gap-3"
            >
               {analyzing ? <Radar className="animate-spin" size={24}/> : <Monitor size={24}/>} 
               {analyzing ? '高危 JS 探针深入操作系统抽取中...' : '点击执行本机物理特征扫描'}
            </button>
        </div>

        {scanned && fingerprints.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative z-10">
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 font-bold mb-6 flex gap-3 text-sm">
                   <ShieldAlert size={20} className="shrink-0 animate-pulse" /> 危险警告：你以为你不注册账号就毫无踪迹？看看从你硬件底层提取出的组合追踪码，凭这套“指纹”，哪怕你天天换 IP，广告追踪网照样死死锁定你！
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fingerprints.map((item, i) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i}
                        className="bg-black/40 border border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="p-3 bg-gray-900 rounded-xl">{item.icon}</div>
                        <div className="overflow-hidden">
                            <div className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{item.category}</div>
                            <div className="text-gray-200 font-mono text-sm break-all">{item.val}</div>
                        </div>
                    </motion.div>
                ))}
                </div>
            </motion.div>
        )}
    </div>
  );
};

export default LeakRadar;

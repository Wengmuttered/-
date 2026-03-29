import { useState, useEffect, useRef } from 'react';
import { Activity, Power, ShieldOff, AlertTriangle, CheckCircle, Wifi, ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';

const TrafficSniffer = () => {
   const [isSniffing, setIsSniffing] = useState(true);
   const [logs, setLogs] = useState<any[]>([]);
   const [interceptCount, setInterceptCount] = useState({ danger: 0, warning: 0 });
   
   const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
       if (!isSniffing) return;
       
       const interval = setInterval(async () => {
           try {
               const res = await fetch('http://localhost:8000/api/network/connections');
               const data = await res.json();
               
               if (data.connections && data.connections.length > 0) {
                   // Calculate counts
                   let newDangers = 0;
                   let newWarnings = 0;
                   data.connections.forEach((conn: any) => {
                       if (conn.type === 'DANGER') newDangers++;
                       if (conn.type === 'WARNING') newWarnings++;
                   });
                   
                   setInterceptCount(p => ({ danger: p.danger + newDangers, warning: p.warning + newWarnings }));
                   setLogs(prev => [...prev.slice(-80), ...data.connections]);
                   
                   if (scrollRef.current) {
                       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                   }
               }
           } catch(e) {
               console.error("OS Network Sniffer API Error:", e);
           }
       }, 2000); // Poll every 2 seconds

       return () => clearInterval(interval);
   }, [isSniffing]);

   return (
     <div className="max-w-7xl mx-auto py-8 h-[90vh] flex flex-col">
       <div className="mb-6 flex items-center justify-between">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
               <div className={`p-4 rounded-xl border ${isSniffing ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-green-500/20 text-green-500 border-green-500/30'}`}>
                  {isSniffing ? <Activity size={32} className="animate-pulse" /> : <ShieldOff size={32} />}
               </div>
               <div>
                   <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
                       本机真实抓包与阻断大屏 <span className={`text-xl ${isSniffing ? 'text-red-500' : 'text-green-500'}`}>{isSniffing ? 'LIVE' : 'SECURE'}</span>
                   </h1>
                   <p className="text-gray-400 text-sm mt-1">Matrix 级物理链路探针：正在直接嗅探答辩机底层真实运行进程发往全球的 TCP/UDP 连接状态！请拔掉网线体验真正的物理熔断。</p>
               </div>
            </motion.div>
            
            {/* The Big Red Kill Switch */}
            <button 
                onClick={() => setIsSniffing(!isSniffing)}
                className={`group relative overflow-hidden rounded-2xl p-1 transition-all 
                ${isSniffing ? 'bg-gradient-to-br from-red-600 to-red-900 shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
                             : 'bg-gradient-to-br from-green-600 to-green-900 shadow-[0_0_50px_rgba(34,197,94,0.3)]'}`}
            >
                <div className="absolute inset-0 bg-white/20 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl border ${isSniffing ? 'border-red-500 bg-red-900/50 text-red-100' : 'border-green-500 bg-green-900/50 text-green-100'}`}>
                    <Power size={48} className={isSniffing ? "animate-pulse" : ""} />
                    <span className="font-black mt-2 text-sm uppercase tracking-wider">{isSniffing ? '全球熔断' : '恢复探针'}</span>
                </div>
            </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
           {/* Left Info Panel */}
           <div className="col-span-1 flex flex-col gap-6">
               <div className="bg-card-dark border border-gray-800 rounded-3xl p-6">
                   <h3 className="text-gray-400 font-bold mb-6 flex items-center gap-2 uppercase tracking-wide text-sm"><ActivitySquare size={16}/>拦截器统计舱 (Session)</h3>
                   <div className="space-y-6">
                       <div>
                           <div className="text-xs text-red-500/80 mb-1">DANGER 熔断越权</div>
                           <div className="text-5xl font-black text-red-500 font-mono">{interceptCount.danger}</div>
                       </div>
                       <div>
                           <div className="text-xs text-orange-500/80 mb-1">WARNING 审计警告</div>
                           <div className="text-3xl font-black text-orange-400 font-mono">{interceptCount.warning}</div>
                       </div>
                       <div className="pt-6 border-t border-gray-800">
                           <div className="text-xs text-green-500/80 mb-1">SYSTEM STATE</div>
                           <div className={`text-xl font-black font-mono flex items-center gap-2 ${isSniffing ? 'text-red-500' : 'text-green-500'}`}>
                               {isSniffing ? <><AlertTriangle size={18}/> TRAFFIC LEAK</> : <><CheckCircle size={18}/> ALL ISOLATED</>}
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           {/* Right Terminal Log Panel */}
           <div className={`col-span-1 lg:col-span-3 rounded-3xl border border-gray-700 bg-black/90 p-4 relative overflow-hidden flex flex-col transaction-all duration-500 ${!isSniffing && 'shadow-[inset_0_0_100px_rgba(34,197,94,0.15)] border-green-500/50'}`}>
               <div className="flex items-center gap-4 border-b border-gray-800 pb-3 mb-3 shrink-0">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <div className="text-gray-500 font-mono text-sm flex items-center gap-2">
                       <Wifi size={14} className={isSniffing ? 'animate-pulse text-red-500' : 'text-green-500'}/> root@privacy-guard:/var/log/traffic_interceptors
                   </div>
               </div>

               <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-xs sm:text-sm custom-scrollbar pb-6 space-y-1 pr-2">
                  {!isSniffing && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-green-900/10 pointer-events-none">
                          <div className="text-green-500 font-black text-6xl opacity-20 transform -rotate-12 tracking-widest border-4 border-green-500/50 p-6 rounded-3xl">SECURED_SANDBOX</div>
                      </div>
                  )}
                  
                  {logs.map(log => (
                      <div key={log.id} className={`flex gap-4 p-1 
                          ${log.type === 'DANGER' ? 'text-red-400 bg-red-500/10' : 
                            log.type === 'WARNING' ? 'text-orange-300' : 
                            'text-gray-500'}`}>
                          <span className="shrink-0">[{log.time}]</span>
                          <span className={`shrink-0 font-bold w-16 ${log.type === 'DANGER' ? 'animate-pulse' : ''}`}>{log.type}</span>
                          <span className={`${log.type === 'DANGER' ? 'text-red-300 font-bold' : log.type === 'WARNING' ? 'text-orange-300' : 'text-gray-500'}`}>{log.source}</span>
                          <span className="text-yellow-100 flex-1 truncate">{log.desc} {'=>'} {log.target}</span>
                      </div>
                  ))}
               </div>
           </div>
       </div>
     </div>
   );
};

export default TrafficSniffer;

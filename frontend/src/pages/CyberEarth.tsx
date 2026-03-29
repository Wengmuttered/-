import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { motion } from 'framer-motion';
import { Globe2, ShieldAlert, Cpu, Fingerprint } from 'lucide-react';

const CyberEarth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ phi }, set] = useState({ phi: 0 });

  useEffect(() => {
    let phiOffset = 0;
    
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.1,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 4,
      baseColor: [0.05, 0.05, 0.15],
      markerColor: [1, 0.1, 0.1],
      glowColor: [0.1, 0.3, 1],
      markers: [
        // Simulated dark web or leak nodes around the world
        { location: [37.7595, -122.4367], size: 0.08 }, // SF
        { location: [40.7128, -74.0060], size: 0.1 },   // NY
        { location: [35.6895, 139.6917], size: 0.06 },  // JP
        { location: [51.5074, -0.1278], size: 0.07 },   // London
        { location: [55.7558, 37.6173], size: 0.09 },   // Moscow
        { location: [39.9042, 116.4074], size: 0.12 },  // Beijing (Defender)
      ],
      onRender: (state) => {
        // Drag logic
        if (!pointerInteracting.current) {
          phiOffset += 0.005;
        }
        state.phi = phiOffset + pointerInteractionMovement.current;
        state.width = 1000 * 2;
        state.height = 1000 * 2;
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 lg:p-12 relative flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden h-[85vh]">
       {/* UI Panel */}
       <div className="lg:w-1/3 relative z-10 space-y-8 glass-panel p-8 rounded-3xl border border-blue-500/20 bg-black/60 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-md">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight mb-4">
                  全息三维 <br/> 全球泄露态势追踪
               </h1>
               <p className="text-gray-400 leading-relaxed text-sm">
                   融合 WebGL 与底层端口捕获技术。你可以直观地用鼠标向任意角度旋转地球。大屏幕上标红的锚点，正是此刻对你在网络上的身份特征进行**高危轮询**的暗网数据流转集群中心节点。
               </p>
           </motion.div>

           <div className="space-y-4">
               <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-4">
                   <ShieldAlert className="text-red-400 shrink-0 mt-1" />
                   <div>
                       <div className="text-white font-bold mb-1">拦截到跨国探针轮询</div>
                       <div className="text-red-400/80 text-xs font-mono">2026.03.29 · TCP 越权扫描 · 来自北美节点</div>
                   </div>
               </div>
               
               <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-start gap-4">
                   <Fingerprint className="text-blue-400 shrink-0 mt-1" />
                   <div>
                       <div className="text-white font-bold mb-1">Canvas 指纹被东欧劫持</div>
                       <div className="text-blue-400/80 text-xs font-mono">已被底层 LeakRadar 并发防火墙就地粉碎。</div>
                   </div>
               </div>
           </div>

           <button className="w-full py-4 text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-all">
               <Cpu className="inline mr-2" /> 开启天网级全球物理封控
           </button>
       </div>

       {/* 3D Globe Canvas Container */}
       <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }}
          className="absolute lg:relative -right-[20%] lg:right-0 w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px] z-0 opacity-80 md:opacity-100 flex items-center justify-center cursor-move"
       >
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full scale-75"></div>
          <canvas
              ref={canvasRef}
              style={{ width: 1000, height: 1000, maxWidth: "100%", aspectRatio: "1" }}
              onPointerDown={(e) => {
                pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                canvasRef.current!.style.cursor = 'grabbing';
              }}
              onPointerUp={() => {
                pointerInteracting.current = null;
                canvasRef.current!.style.cursor = 'grab';
              }}
              onPointerOut={() => {
                pointerInteracting.current = null;
                canvasRef.current!.style.cursor = 'grab';
              }}
              onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                  const delta = e.clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta;
                  set({ phi: delta / 200 });
                }
              }}
              onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta;
                  set({ phi: delta / 100 });
                }
              }}
          />
       </motion.div>
    </div>
  );
};

export default CyberEarth;

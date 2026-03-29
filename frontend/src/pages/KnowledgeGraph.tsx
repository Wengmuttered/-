import { useState } from 'react';
import { Network, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const KnowledgeGraph = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    
    setLoading(true);
    setHasSearched(false);
    
    try {
        const res = await fetch(`http://localhost:8000/api/osint/scan?target=${encodeURIComponent(account)}`);
        const data = await res.json();
        setGraphData(data);
    } catch(err) {
        console.error("OSINT API FAILED", err);
    } finally {
        setLoading(false);
        setHasSearched(true);
    }
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', padding: 12, backgroundColor: '#1f2937', borderColor: '#4b5563', textStyle: { color: '#fff' } },
    legend: {
        data: ['侦查标的(域名/IP)', '底层真实解析IP', '暴露的高危端口', '暗网爬虫风险暴露面'],
        textStyle: { color: '#9ca3af' },
        bottom: 10
    },
    series: [
        {
            type: 'graph',
            layout: 'force',
            data: graphData.nodes,
            links: graphData.links,
            categories: [
                { name: '侦查标的(域名/IP)' },
                { name: '底层真实解析IP' },
                { name: '暴露的高危端口' },
                { name: '暗网爬虫风险暴露面' }
            ],
            roam: true,
            label: { show: true, position: 'right', color: '#fff', fontSize: 12 },
            force: { repulsion: 400, edgeLength: [50, 150], gravity: 0.1 },
            lineStyle: { color: 'source', curveness: 0.2, width: 2, opacity: 0.7 },
            emphasis: { focus: 'adjacency', lineStyle: { width: 4 } }
        }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto py-8 flex flex-col items-center h-[90vh]">
      <div className="mb-8 w-full">
         <div className="flex items-end justify-between">
             <div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl border border-yellow-500/30">
                       <Network size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">真实服务器 OSINT 情报侦测谱图 <span className="text-yellow-500">Nmap-Link</span></h1>
                </motion.div>
                <p className="text-gray-400 max-w-2xl text-sm">废除假数据模拟。利用真实的后端 Python 底层高并发 Socket 技术对目标进行真实的外网 DNS 解析穿透并爆破扫描 22,3306,6379 等漏洞端口。生成 D3 力导向可视化作战图。</p>
             </div>
             
             <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 relative z-10 w-full max-w-md">
                <input 
                  type="text" 
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="输入某个真实的大学域名或域名(例如 baidu.com)..."
                  className="w-full bg-background-dark/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-all font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                />
                <button type="submit" disabled={loading || !account} className="bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-all disabled:opacity-50 shrink-0 flex items-center gap-2">
                   {loading ? <Cpu className="animate-pulse" /> : '启动溯源'}
                </button>
             </form>
         </div>
      </div>

      <div className="flex-1 w-full bg-black/40 border border-gray-800 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {/* Cyberpunk grid bg directly on container */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
          
          {loading && (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <div className="text-yellow-400 font-mono font-bold text-xl tracking-widest animate-pulse">CONNECTING TO DARKNET NODES...</div>
             </div>
          )}

          {!hasSearched && !loading ? (
             <div className="text-gray-600 font-mono text-center z-10 flex flex-col items-center gap-4">
                 <Network size={80} className="opacity-20" />
                 <div>输入主节点（靶点）后，物理碰撞引擎将自动渲染拓扑图<br/>支持鼠标滚轮无限缩放，支持拖放重塑引力模型。</div>
             </div>
          ) : (
             <ReactECharts 
                option={option} 
                style={{ height: '100%', width: '100%', zIndex: 10 }}
                opts={{ renderer: 'canvas' }}
             />
          )}

          {hasSearched && (
             <div className="absolute top-6 left-6 z-20 bg-black/60 border border-red-500/50 p-4 rounded-xl backdrop-blur-md">
                 <div className="flex items-center gap-2 text-red-500 font-bold mb-2 uppercase text-sm">
                    <ShieldAlert size={16}/> 情报雷达检出高危关联网
                 </div>
                 <div className="text-gray-300 font-mono text-sm leading-relaxed">
                     <span className="text-yellow-500">主目标:</span> {account}<br/>
                     <span className="text-yellow-500">命中泄露源:</span> {graphData.nodes.filter((n:any)=>n.category===1).length} 宗<br/>
                     <span className="text-yellow-500">横向暴露节点:</span> {graphData.links.length} 个
                 </div>
             </div>
          )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;

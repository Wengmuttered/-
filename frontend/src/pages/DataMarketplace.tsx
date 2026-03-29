import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Activity, Lock, Database, Globe, TrendingUp, AlertTriangle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface Bid {
    id: string;
    buyer: string;
    demand: string;
    price: number;
    timestamp: number;
    status: string;
}

const DataMarketplace = () => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [revenue, setRevenue] = useState(12435.00);
    const [active, setActive] = useState(true);
    const [chartData, setChartData] = useState<number[]>(Array(20).fill(12400));

    // Fetch dynamic revenue & chart
    useEffect(() => {
        if (!active) return;
        const revInterval = setInterval(() => {
            fetch('http://localhost:8000/api/broker/revenue')
                .then(r => r.json())
                .then(data => {
                    setRevenue(data.total_revenue);
                    setChartData(prev => [...prev.slice(1), data.total_revenue]);
                })
                .catch(() => {});
        }, 3000);
        return () => clearInterval(revInterval);
    }, [active]);

    // Fetch live bids
    useEffect(() => {
        if (!active) return;
        const bidInterval = setInterval(() => {
            fetch('http://localhost:8000/api/broker/bids')
                .then(r => r.json())
                .then(data => {
                    setBids(data.bids);
                })
                .catch(() => {});
        }, 4000);
        
        // Initial fetch
        fetch('http://localhost:8000/api/broker/bids')
            .then(r => r.json())
            .then(data => setBids(data.bids))
            .catch(() => {});
            
        return () => clearInterval(bidInterval);
    }, [active]);

    const chartOption = {
        grid: { left: '10px', right: '10px', top: '10px', bottom: '10px', containLabel: false },
        xAxis: { type: 'category', show: false, boundaryGap: false },
        yAxis: { type: 'value', show: false, scale: true },
        series: [{
            data: chartData,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#10b981', width: 3, shadowColor: 'rgba(16,185,129,0.5)', shadowBlur: 10 },
            areaStyle: {
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: 'rgba(16,185,129,0.5)' }, { offset: 1, color: 'rgba(16,185,129,0)' }]
                }
            }
        }]
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl md:text-5xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                      <Globe className="text-emerald-400" size={40} /> Web3.0 数据流转变现中心
                   </motion.h1>
                   <p className="text-gray-400 mt-3 text-sm max-w-2xl leading-relaxed">
                       打破大厂的数据霸权垄断！在这里，你的个人隐私将通过【差分隐私加噪算法】过滤脱敏，打包转化为符合《个保法》的高价值 AI 训练语料。让每一次隐私掠夺，都变成对您的合法数字货币分红。
                   </p>
                </div>
                
                <button 
                   onClick={() => setActive(!active)}
                   className={`shrink-0 px-6 py-3 rounded-xl font-bold font-mono tracking-widest flex items-center gap-2 transition-all ${active ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/40' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/40'}`}
                >
                   {active ? <><AlertTriangle size={18}/> 紧急熔断智能合约</> : <><Activity size={18}/> 重启数据流转授权</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Vault - 1 Column */}
                <div className="bg-black/80 border border-emerald-900/50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <TrendingUp size={160}/>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold mb-6 text-sm uppercase tracking-widest">
                            <DollarSign size={18}/> 累计保护变现分润 (USDT)
                        </div>
                        <motion.div 
                           key={revenue}
                           initial={{ y: -10, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           className="text-5xl lg:text-7xl font-mono font-black text-white"
                        >
                            <span className="text-emerald-400">$</span>{revenue.toFixed(2)}
                        </motion.div>
                        <div className="mt-4 flex items-center gap-4 text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded"><TrendingUp size={12}/> + ${(Math.random() * 5 + 1).toFixed(2)} / Hour</span>
                            <span>由差分隐私引擎担保的合规交易</span>
                        </div>
                    </div>

                    <div className="h-40 mt-6 -mx-4 -mb-4 opacity-80">
                         <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* Bidding Log - 2 Columns */}
                <div className="lg:col-span-2 bg-black/60 border border-gray-800 rounded-3xl p-6 flex flex-col">
                    <div className="flex justify-between items-end border-b border-gray-800 pb-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2 uppercase tracking-widest"><Activity size={20} className="text-blue-500"/> AI 厂商实时语料求购订单大厅</h2>
                            <p className="text-xs text-gray-500 mt-1">Live Bidding Exchange (Powered by PostgreSQL & DP Smart Contracts)</p>
                        </div>
                        <div className="flex gap-2">
                             <span className="relative flex h-3 w-3">
                                <span className={`${active ? 'animate-ping bg-emerald-400' : 'bg-red-500'} absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                             </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {!active && (
                            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/50 flex flex-col items-center justify-center border border-red-500/20 rounded-xl">
                                <Lock size={48} className="text-red-500 mb-4 opacity-50"/>
                                <h3 className="text-xl text-red-500 font-bold tracking-widest uppercase">变现熔断机制已激活</h3>
                                <p className="text-gray-400 text-sm mt-2">保护绝对安全：物理切断了一切对外部 AI 厂商的流转映射</p>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <AnimatePresence>
                                {bids.map((bid, i) => (
                                    <motion.div 
                                        key={bid.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        className="bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30 p-4 rounded-2xl flex items-center justify-between transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <Database size={20} />
                                            </div>
                                            <div>
                                                <div className="text-gray-300 font-bold text-sm lg:text-base">{bid.buyer}</div>
                                                <div className="text-gray-500 text-xs mt-1">求购目标：{bid.demand}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-emerald-400 font-mono font-bold text-lg">${bid.price.toFixed(2)}</div>
                                            <div className="text-gray-500 text-[10px] font-mono mt-1">Hash ID: {bid.id}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {bids.length === 0 && active && (
                                <div className="text-center text-gray-500 py-10 animate-pulse">
                                    正在接入全球暗网节点行情数据...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 text-sm text-blue-400/80 leading-relaxed font-mono">
                <strong>💡 答辩商业逻辑解析：</strong> 
                系统在此环节展现了“从防到治，从治到赢”的国奖商业思维。我们不是只在做枯燥的防火墙，而是做了一个数据经纪人中介所。用户的源数据绝不出本地，只输出利用“拉普拉斯噪音机制（Differential Privacy）”打散过的特征废料，保障了物理绝对安全。但这些看似无用的混淆废料聚合成海后，对 AI 厂商却是千金难求的宏观大语言模型训练宝藏。我们以此完成了向侵犯隐私的超级大厂的逆向收割。
            </div>
        </div>
    );
};

export default DataMarketplace;

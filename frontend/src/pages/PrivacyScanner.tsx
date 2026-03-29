import { useState } from 'react';
import { ScanFace, FileWarning, Search, Bot, ShieldAlert, Cpu, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyScanner = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!text) return;
    setLoading(true);
    
    setTimeout(async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/nlp/privacy-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
          const data = await res.json();
          setResult(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    }, 1500);
  };

  const getHighlightText = (context: string, exactMatch: string) => {
      const parts = context.split(exactMatch);
      if (parts.length === 1) return <span>{context}</span>;
      
      return (
          <>
             {parts[0]}
             <span className="bg-red-500/30 text-red-300 font-bold px-1 rounded border-b-2 border-red-500 animate-pulse">
                {exactMatch}
             </span>
             {parts[1]}
          </>
      )
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10 text-center flex flex-col items-center">
        <motion.div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500 mb-6 shadow-[0_0_40px_rgba(234,179,8,0.2)] border border-yellow-500/30 relative"
        >
          <Bot size={48} />
          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-400 flex items-center gap-1">
             <WifiOff size={10} /> OFFLINE
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          无网端侧 NLP 霸王条款照妖镜 (Edge-NLP)
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          答辩现场演示建议：**直接断开电脑 Wi-Fi！** 我们打破了传统的云端 ChatGPT 依赖，在 Python 底层构建了基于 `Jieba 分词` 与 `TF-IDF 逆文档频率` 权重的纯离线端侧文本处理器。即使在无网绝境下，依然能拆解数万字的流氓协议。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
         <div className="flex flex-col bg-card-dark border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl h-[600px]">
             
             {loading && (
                 <div className="absolute inset-0 z-20 bg-background-dark/80 flex flex-col items-center justify-center backdrop-blur-sm">
                     <ScanFace className="text-yellow-500 animate-bounce mb-4" size={64} />
                     <h2 className="text-2xl font-bold text-yellow-400 mb-2">端侧离线分词与权重计算中</h2>
                     <p className="text-gray-400 font-mono text-sm max-w-xs text-center">载入本地词库... TF-IDF 投影计算...</p>
                     
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_20px_#eab308] animate-[scan_2s_ease-in-out_infinite]"></div>
                 </div>
             )}

             <div className="bg-black/40 p-4 border-b border-gray-800 flex justify-between items-center">
                 <div className="text-sm font-mono text-gray-500 flex items-center gap-2"><Cpu size={14}/> Node: Local_Edge_Core</div>
                 <button 
                     onClick={handleScan}
                     disabled={loading || !text}
                     className="bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                     <Cpu size={16} /> 离线算力启动
                 </button>
             </div>
             
             <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="尝试输入如：“您同意我们将您的信息提供给第三方商业伙伴，且由于技术原因导致的数据泄露，平台将免除全部责任。如需注销账号需要提前30个工作日审核。” 看看本地算法的威力..."
                className="w-full flex-1 bg-transparent text-gray-400 p-6 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-yellow-500/50 leading-loose"
             />
         </div>

         <div className="bg-background-dark border border-gray-800 rounded-3xl p-8 relative flex flex-col h-[600px]">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <FileWarning className="text-yellow-500" /> 离线端侧引擎分析报告
              </h3>
              
              {!result ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                     <Search size={64} className="mb-4 opacity-50" />
                     <p className="font-bold">等待执行高维词频打击</p>
                 </div>
              ) : (
                  <AnimatePresence>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl border flex items-center justify-between" 
                                style={{ 
                                    borderColor: result.score > 30 ? '#ef4444' : result.score > 0 ? '#eab308' : '#22c55e',
                                    backgroundColor: result.score > 30 ? 'rgba(239, 68, 68, 0.1)' : result.score > 0 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)' 
                                }}>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">系统自动定级</div>
                                    <div className="text-xl font-black truncate" style={{ color: result.score > 30 ? '#fca5a5' : result.score > 0 ? '#fde047' : '#86efac' }}>
                                        {result.risk_level.split(" ")[0]}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-mono text-white">{result.score}</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 flex flex-col justify-center">
                                 <div className="text-xs text-blue-400 mb-2 font-bold flex items-center gap-2"><Cpu size={12}/> TF-IDF 高频脱敏特征词核</div>
                                 <div className="flex flex-wrap gap-1">
                                     {result.keywords?.map((kw: any, idx: number) => (
                                         <span key={idx} className="bg-blue-900/40 border border-blue-500/40 text-[10px] text-blue-300 px-1.5 py-0.5 rounded">
                                             {kw.word} ({kw.weight})
                                         </span>
                                     ))}
                                 </div>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-400 text-sm mb-3 border-b border-gray-800 pb-2">全文风险溯源锚点</h4>

                        {result.findings.length === 0 ? (
                            <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl text-green-500 bg-green-500/5">
                                [✅] 并未发现明显违反《个人信息保护法》的强盗霸王条款。<br/>这是一份相对老实和纯良的文本。
                            </div>
                        ) : (
                            <div className="space-y-4">
                               {result.findings.sort((a: any, b: any) => b.severity - a.severity).map((item: any, i: number) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                        key={i} 
                                        className="bg-card-dark rounded-xl border border-red-500/30 p-5 relative overflow-hidden group"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 group-hover:w-2 transition-all"></div>
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/40 font-mono flex items-center gap-1">
                                                <ShieldAlert size={12}/> {item.category}
                                            </span>
                                            <span className="text-red-500/50 font-mono text-xs font-bold">威胁权重: +{item.severity}</span>
                                        </div>
                                        
                                        <div className="text-gray-300 text-sm leading-relaxed mb-4 p-3 bg-red-500/5 rounded border border-red-500/10 italic font-serif">
                                            "{getHighlightText(item.context, item.exact_match)}"
                                        </div>
                                        
                                        <div className="text-sm text-gray-400 flex items-start gap-2 pt-2 border-t border-gray-800">
                                            <Bot size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                            <span className="text-yellow-100">{item.desc}</span>
                                        </div>
                                    </motion.div>
                               ))}
                            </div>
                        )}
                     </motion.div>
                  </AnimatePresence>
              )}
         </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; box-shadow: 0 0 20px 2px #eab308; }
            90% { opacity: 1; box-shadow: 0 0 20px 2px #eab308; }
            100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default PrivacyScanner;

import { useState } from 'react';
import { ScanFace, FileWarning, Search, Bot, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyScanner = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!text) return;
    setLoading(true);
    
    // Simulate complex AI scanning thinking delay for demo effect
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
      // Very basic substring replace for highlighting the exact match inside its context
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
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500 mb-6 shadow-[0_0_40px_rgba(234,179,8,0.2)] border border-yellow-500/30"
        >
          <Bot size={48} />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          AI 霸王条款全息照妖镜
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          没有人会去读长达数万字的隐私协议。将随便一个 APP 注册前的冗长免责声明粘贴倒在这个扫描平台中，我内置的**大型语言认知模型 (LLM)** 将帮您揪出里面埋掉的所有“越权共享”、“免责坑洞”与“注销拦截”。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
         <div className="flex flex-col bg-card-dark border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl h-[600px]">
             
             {loading && (
                 <div className="absolute inset-0 z-20 bg-background-dark/80 flex flex-col items-center justify-center backdrop-blur-sm">
                     <ScanFace className="text-yellow-500 animate-bounce mb-4" size={64} />
                     <h2 className="text-2xl font-bold text-yellow-400 mb-2">NLP 语义神经网矩阵解析中</h2>
                     <p className="text-gray-400 font-mono text-sm max-w-xs text-center">正在对比《个体网信安全指引》并逐字挖掘陷阱漏洞...</p>
                     
                     {/* Cool scanning laser */}
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_20px_#eab308] animate-[scan_2s_ease-in-out_infinite]"></div>
                 </div>
             )}

             <div className="bg-black/40 p-4 border-b border-gray-800 flex justify-between items-center">
                 <div className="text-sm font-mono text-gray-500">Legal_Text_Input_Buffer.txt</div>
                 <button 
                     onClick={handleScan}
                     disabled={loading || !text}
                     className="bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                     <Cpu size={16} /> 下达审判指令
                 </button>
             </div>
             
             <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="在此粘贴冗长的《用户隐私声明与服务协议》长文本... (例如：尝试输入含有“同意将信息提供给第三方商业伙伴”、“免除平台数据泄露责任”等试探性语录)"
                className="w-full flex-1 bg-transparent text-gray-400 p-6 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-yellow-500/50 leading-loose"
             />
         </div>

         <div className="bg-background-dark border border-gray-800 rounded-3xl p-8 relative flex flex-col h-[600px]">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <FileWarning className="text-yellow-500" /> AI 判断结论与风险批红
              </h3>
              
              {!result ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                     <Search size={64} className="mb-4 opacity-50" />
                     <p className="font-bold">等待执行文本降维打击</p>
                 </div>
              ) : (
                  <AnimatePresence>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto pr-2">
                        <div className="mb-6 p-4 rounded-xl border flex items-center justify-between" 
                             style={{ 
                                 borderColor: result.score > 30 ? '#ef4444' : result.score > 0 ? '#eab308' : '#22c55e',
                                 backgroundColor: result.score > 30 ? 'rgba(239, 68, 68, 0.1)' : result.score > 0 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)' 
                             }}>
                             <div>
                                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">条款安全性系统定级</div>
                                <div className="text-2xl font-black" style={{ color: result.score > 30 ? '#fca5a5' : result.score > 0 ? '#fde047' : '#86efac' }}>
                                    {result.risk_level}
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-xs text-gray-400 mb-1">查获霸王项</div>
                                <div className="text-3xl font-mono text-white">{result.findings.length} 个</div>
                             </div>
                        </div>

                        {result.findings.length === 0 ? (
                            <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl text-green-500 bg-green-500/5">
                                [✅] 并未发现明显违反《个人信息保护法》的强盗霸王条款。<br/>这是一份相对老实和纯良的协议文件。
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
      
      {/* Required for the scanning animation */}
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

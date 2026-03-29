import { useState } from 'react';
import { ShieldAlert, Info, ShieldCheck, SearchCode, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';

const SCAM_KEYWORDS = ['ETC', '医保', '停用', '冻结', '退订回T', '积分清零', '航班取消', '理赔', '公安', '安全账户', '涉嫌违规', '24小时内', '法院', '由于您的'];

const PhishingDetector = () => {
  const [smsText, setSmsText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeSms = () => {
    if (!smsText.trim()) return;
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
        // Extract links
        const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/g;
        const urls = smsText.match(urlRegex) || [];
        
        // Extract keywords
        const foundKeywords = SCAM_KEYWORDS.filter(kw => smsText.includes(kw));
        
        // Calculate risk
        let riskScore = 0;
        let threatLevel = 'SAFE'; // SAFE, WARNING, DANGER
        
        if (urls.length > 0) riskScore += 40;
        if (foundKeywords.length > 0) riskScore += foundKeywords.length * 20;
        if (smsText.includes('【') && smsText.includes('】')) riskScore += 10; // Common SMS header
        
        if (riskScore >= 70) threatLevel = 'DANGER';
        else if (riskScore >= 40) threatLevel = 'WARNING';
        
        setResult({ urls, foundKeywords, riskScore, threatLevel });
        setAnalyzing(false);
    }, 1500); // Fake delay for UX
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl border border-red-500/30">
             <MessageSquareWarning size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">防骗短信 AI 鉴定器 <span className="text-red-500 text-lg ml-2">Phishing Detector</span></h1>
       </motion.div>
       <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed text-sm">收到带有链接的医保停用、快递异常、ETC 冻结短信？千万别乱点！那是套取你在银行卡余额的“杀猪盘”。把内容复制到下面，AI 帮你秒摘它的画皮。</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Input section */}
           <div className="bg-card-dark border border-gray-800 rounded-3xl p-6 flex flex-col">
               <h3 className="text-gray-300 font-bold mb-4 font-mono text-sm uppercase">1. 粘贴可疑短彩信</h3>
               <textarea 
                  className="w-full h-48 bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors custom-scrollbar resize-none font-mono text-sm leading-relaxed"
                  placeholder="例如：【社保中心】您名下医保卡已于今日封停，请于24小时内点击 a.sb-update.cc 完成信息补录，逾期账户销户..."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
               ></textarea>
               <button 
                  onClick={analyzeSms}
                  disabled={analyzing || !smsText.trim()}
                  className="mt-4 w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
               >
                   {analyzing ? <SearchCode className="animate-spin" size={20} /> : <ShieldAlert size={20} />} 
                   {analyzing ? '正则特征匹配中 (Matching...)' : '进行木马/钓鱼特征分析'}
               </button>
           </div>

           {/* Result section */}
           <div className="bg-black/40 border border-gray-800 rounded-3xl p-6 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <ShieldAlert size={150} />
               </div>
               
               <h3 className="text-gray-300 font-bold mb-4 font-mono text-sm uppercase">2. 诈骗基因报告</h3>
               
               {!result && !analyzing && (
                   <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-center">
                       <Info size={48} className="mb-4 opacity-50" />
                       <p>等待投喂短信内容...<br/>长辈防骗第一关，鉴定后再点链接不迟。</p>
                   </div>
               )}

               {analyzing && (
                   <div className="flex-1 flex flex-col items-center justify-center">
                       <div className="flex gap-1 mb-4">
                           <div className="w-2 h-6 bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                           <div className="w-2 h-6 bg-red-500 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                           <div className="w-2 h-6 bg-red-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                       </div>
                       <div className="text-red-500 font-bold font-mono text-sm animate-pulse tracking-widest">ANALYZING PAYLOAD...</div>
                   </div>
               )}

               {result && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col z-10">
                       <div className={`p-4 rounded-xl border mb-6 flex items-start gap-4
                           ${result.threatLevel === 'DANGER' ? 'bg-red-500/10 border-red-500/50' : 
                             result.threatLevel === 'WARNING' ? 'bg-yellow-500/10 border-yellow-500/50' : 
                             'bg-green-500/10 border-green-500/50'}`}>
                           {result.threatLevel === 'DANGER' && <ShieldAlert size={36} className="text-red-500 shrink-0" />}
                           {result.threatLevel === 'WARNING' && <Info size={36} className="text-yellow-500 shrink-0" />}
                           {result.threatLevel === 'SAFE' && <ShieldCheck size={36} className="text-green-500 shrink-0" />}
                           
                           <div>
                               <h2 className={`font-black text-xl mb-1
                                   ${result.threatLevel === 'DANGER' ? 'text-red-500' : 
                                     result.threatLevel === 'WARNING' ? 'text-yellow-500' : 'text-green-500'}`}>
                                   {result.threatLevel === 'DANGER' ? '极度危险！典型的钓鱼诈骗！' : 
                                    result.threatLevel === 'WARNING' ? '中度可疑，包含未知网页链接' : '暂未发现典型诈骗黑词与木马链接'}
                               </h2>
                               <p className="text-gray-300 text-sm">
                                   {result.threatLevel === 'DANGER' ? '千万不可点击其中的链接！此类短信通常伪装成官方机构制造恐慌，诱导你前往假冒的钓鱼网站填报银行卡账号和密码。' : 
                                    result.threatLevel === 'SAFE' ? '但也请保持警惕，不要转账汇款。' : '请确认该链接是否为正规官方域名，切勿在此链接中下载任何未知的 APK 安装包。'}
                               </p>
                           </div>
                       </div>

                       <div className="space-y-4 font-mono text-sm">
                           <div>
                               <div className="text-gray-500 mb-1 border-b border-gray-800 pb-1">侦测到的洗脑违规词汇 (Social Engineering)</div>
                               {result.foundKeywords.length > 0 ? (
                                   <div className="flex flex-wrap gap-2 mt-2">
                                       {result.foundKeywords.map((kw: string, i: number) => (
                                           <span key={i} className="px-2 py-1 bg-red-900/50 text-red-300 border border-red-700/50 rounded">{kw}</span>
                                       ))}
                                   </div>
                               ) : <span className="text-green-500">未提取到高频诈骗词</span>}
                           </div>

                           <div>
                               <div className="text-gray-500 mb-1 border-b border-gray-800 pb-1">侦测到的诱饵链接 (Phishing URLs / APK Downloader)</div>
                               {result.urls.length > 0 ? (
                                   <div className="flex flex-col gap-2 mt-2">
                                       {result.urls.map((url: string, i: number) => (
                                           <div key={i} className="px-3 py-2 bg-yellow-900/30 text-yellow-300 border border-yellow-700/30 rounded break-all shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                                               ☠️ {url}
                                           </div>
                                       ))}
                                   </div>
                               ) : <span className="text-green-500">未命中链接抛投行为</span>}
                           </div>
                       </div>
                   </motion.div>
               )}
           </div>
       </div>
    </div>
  );
};

export default PhishingDetector;

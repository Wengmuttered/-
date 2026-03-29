import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Loader2, ArrowRight, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordScanner = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [zkpLoading, setZkpLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [zkpResult, setZkpResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setZkpResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/password/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_plain: password })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleZKP = async () => {
      if (!password) return;
      setZkpLoading(true);
      setResult(null);
      try {
          const res = await fetch('http://127.0.0.1:8000/api/password/zkp-proof', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password_plain: password })
          });
          const data = await res.json();
          setTimeout(() => {
              setZkpResult(data);
              setZkpLoading(false);
          }, 1000); // add a slight delay for dramatic effect
      } catch (e) {
          console.error(e);
          setZkpLoading(false);
      }
  };

  const scoreColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const scoreLabels = ['极度危险 (0)', '极弱 (1)', '中等 (2)', '安全 (3)', '绝对安全 (4)'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3 text-white">
          <Fingerprint className="text-primary" size={36} />
          密码学零知识证明与脱敏引擎 (ZKP)
        </h1>
        <p className="text-gray-400 leading-relaxed text-lg">
          除了基础的 <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">K-匿名 SHA-1</span> 撞库检测外，我们新增了 <span className="text-emerald-400 font-mono font-bold">Schnorr Zero-Knowledge Proof (零知识证明)</span> 数学演算推导。向世界证明：“你可以在不上传任何密码明文的前提下，证明你对账号的绝对所有权。”
        </p>
      </div>

      <div className="bg-card-dark border border-border-dark p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
        
        <form onSubmit={handleScan} className="flex flex-col relative z-10 gap-4">
          <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入测试密码 (不会被保存)"
              className="w-full bg-background-dark/50 border border-gray-700 rounded-lg px-6 py-5 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-inner"
          />
          <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit" 
                disabled={loading || zkpLoading || !password}
                className="flex-1 bg-primary text-black font-bold px-8 py-4 rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : '常规哈希脱敏安检'}
                {!loading && <ArrowRight size={18} />}
              </button>
              <button 
                type="button" 
                onClick={handleZKP}
                disabled={loading || zkpLoading || !password}
                className="flex-[1.5] bg-emerald-600/20 text-emerald-400 border border-emerald-500 font-bold px-8 py-4 rounded-lg hover:bg-emerald-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {zkpLoading ? <Loader2 className="animate-spin" /> : '🚀 发起 Schnorr ZKP 零知识证明推演'}
              </button>
          </div>
        </form>

        {/* --- 常规测试结果展示 --- */}
        {result && !zkpResult && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background-dark/30 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-5 text-gray-300">强度与信息熵分析模型</h3>
              <div className="flex gap-2 mb-6">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`h-2 flex-1 rounded-full ${level <= result.score ? scoreColors[result.score] : 'bg-gray-800'}`}></div>
                ))}
              </div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">当前安全评级</div>
                  <div className={`text-2xl font-black ${result.score >= 3 ? 'text-green-400' : 'text-red-400'}`}>{scoreLabels[result.score]}</div>
                </div>
                <div className="text-right">
                   <div className="text-sm text-gray-500 mb-1">熵值 (Entropy)</div>
                   <div className="text-xl font-mono text-primary">{result.entropy?.toFixed(2) || "0.00"} bits</div>
                </div>
              </div>
            </div>

            <div className="bg-background-dark/30 rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold mb-4 text-gray-300 w-full text-left">历史外网泄露状态</h3>
              {result.is_leaked ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6">
                  <ShieldAlert className="text-red-500 mb-4" size={56} />
                  <div className="text-red-400 font-bold text-2xl mb-2">极度危险：存在明文记录</div>
                  <div className="text-red-500/80 text-sm max-w-xs">被截获了 <span className="font-bold text-red-400 text-lg mx-1">{result.leak_count.toLocaleString()}</span> 次。</div>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6">
                  <ShieldCheck className="text-green-500 mb-4" size={56} />
                  <div className="text-green-400 font-bold text-2xl mb-2">暗网查无记录</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- ZKP 推演大屏 --- */}
        {zkpResult && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 bg-[#0a0a0a] border border-emerald-900/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
               <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                   <div className="flex items-center gap-3">
                       <Network className="text-emerald-500" size={24} />
                       <h3 className="text-xl font-black text-emerald-400 tracking-widest uppercase">{zkpResult.protocol}</h3>
                   </div>
                   <div className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded font-mono border border-emerald-500/30">
                       Math Status: {zkpResult.status}
                   </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-8">
                   <div className="flex-1 space-y-4 font-mono">
                       <AnimatePresence>
                           {zkpResult.steps.map((step: any, idx: number) => (
                               <motion.div 
                                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.4 }}
                                  key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
                               >
                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50"></div>
                                   <div className="text-emerald-500 font-bold mb-2 text-xs">{step.phase}</div>
                                   <div className="text-gray-400 text-sm leading-relaxed">{step.desc}</div>
                               </motion.div>
                           ))}
                       </AnimatePresence>
                   </div>
                   
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="w-full lg:w-[350px] bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-6 flex flex-col justify-center">
                       <div className="text-center mb-6">
                           <ShieldCheck size={64} className="text-emerald-500 mx-auto mb-4 animate-pulse" />
                           <h4 className="text-2xl font-black text-white">{zkpResult.math_verified ? '恒等式成立' : '验证失败'}</h4>
                       </div>
                       <p className="text-emerald-300/80 text-sm text-center leading-loose">
                           {zkpResult.conclusion}
                       </p>
                       <div className="mt-6 pt-6 border-t border-emerald-900/50 text-xs text-gray-500 font-mono flex flex-col gap-2">
                           <div className="flex justify-between"><span>公钥参数 P:</span> <span className="text-emerald-400">{zkpResult.parameters.p}</span></div>
                           <div className="flex justify-between"><span>生成元 G:</span> <span className="text-emerald-400">{zkpResult.parameters.g}</span></div>
                           <div className="flex justify-between"><span>公钥承诺 Y:</span> <span className="text-emerald-400">{zkpResult.parameters.y}</span></div>
                       </div>
                   </motion.div>
               </div>
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default PasswordScanner;

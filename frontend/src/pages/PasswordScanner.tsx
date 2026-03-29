import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordScanner = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
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

  const scoreColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const scoreLabels = ['极度危险 (0)', '极弱 (1)', '中等 (2)', '安全 (3)', '绝对安全 (4)'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3 text-white">
          <Fingerprint className="text-primary" size={36} />
          密码脱敏安全引擎
        </h1>
        <p className="text-gray-400 leading-relaxed text-lg">
          您可以输入任意密码进行深度检测。我们会先对其进行计算，仅将 <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">SHA-1: 前 5 位特征</span> 发送至泄露比对接口。您的明文密码<strong className="text-white">永远不会离开这个浏览器并遭到记录。</strong>
        </p>
      </div>

      <div className="bg-card-dark border border-border-dark p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
        
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入测试密码 (不会被保存)"
              className="w-full bg-background-dark/50 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !password}
            className="bg-primary text-black font-bold px-8 py-4 rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : '执行脱敏安检'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* 的强度条与反馈 */}
            <div className="bg-background-dark/30 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-5 text-gray-300">强度与信息熵分析模型</h3>
              <div className="flex gap-2 mb-6">
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level} 
                    className={`h-2 flex-1 rounded-full ${level <= result.score ? scoreColors[result.score] : 'bg-gray-800'}`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">当前安全评级</div>
                  <div className={`text-2xl font-black ${result.score >= 3 ? 'text-green-400' : 'text-red-400'}`}>
                    {scoreLabels[result.score]}
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm text-gray-500 mb-1">熵值 (Entropy)</div>
                   <div className="text-xl font-mono text-primary">{result.entropy?.toFixed(2) || "0.00"} bits</div>
                </div>
              </div>

              {result.feedback?.warning && (
                <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 p-4 rounded-lg text-sm mb-4 font-medium flex items-start gap-2">
                  <span>⚠️</span> <span>{result.feedback.warning}</span>
                </div>
              )}
              {result.feedback?.suggestions?.length > 0 && (
                <ul className="text-sm text-gray-400 list-disc list-inside space-y-2">
                  {result.feedback.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>

            {/* 数据库撞库检测 */}
            <div className="bg-background-dark/30 rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold mb-4 text-gray-300 w-full text-left">历史外网泄露状态</h3>
              
              {result.is_leaked ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6">
                  <ShieldAlert className="text-red-500 mb-4" size={56} />
                  <div className="text-red-400 font-bold text-2xl mb-2">极度危险：存在明文记录</div>
                  <div className="text-red-500/80 text-sm max-w-xs">
                    此密码在历史黑客脱库事件中被截获过 <span className="font-bold text-red-400 text-lg mx-1">{result.leak_count.toLocaleString()}</span> 次。这意味着只要别人尝试该弱口令，就能秒破。
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6">
                  <ShieldCheck className="text-green-500 mb-4" size={56} />
                  <div className="text-green-400 font-bold text-2xl mb-2">暗网查无记录</div>
                  <div className="text-green-500/80 text-sm max-w-xs">
                    在全球数十亿的庞大黑客拖库记录档案中没有找到该特征，证明它暂未外泄。
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PasswordScanner;

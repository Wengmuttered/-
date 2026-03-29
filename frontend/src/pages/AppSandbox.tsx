import { useState } from 'react';
import { UploadCloud, ShieldAlert, Crosshair, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const AppSandbox = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml')) {
      setErrorMsg("目前沙箱仅支持静态分析 AndroidManifest.xml 文件！");
      return;
    }
    
    setErrorMsg('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/app/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setErrorMsg(data.detail || "分析失败");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("无法连接到沙箱后端");
    } finally {
      setLoading(false);
    }
  };

  // Convert API result to Recharts Radar data format based on categories
  const radarData = result ? (() => {
      const categories: any = {
          "隐私极高风险": 0,
          "隐私中等风险": 0,
          "财产扣费风险": 0,
          "一般风险": 0,
          "系统交互": 0
      };
      
      result.permissions_found.forEach((p: any) => {
          if (categories[p.category] !== undefined) {
              categories[p.category] += p.score || 1; 
          }
      });
      
      return Object.keys(categories).map(key => ({
          subject: key,
          A: categories[key],
          fullMark: 50,
      }));
  })() : [];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center flex flex-col items-center">
        <motion.div 
          animate={loading ? { rotate: 360 } : {}}
          transition={loading ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400 mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] border border-red-500/30"
        >
          <Cpu size={48} />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          流氓应用深层解析沙箱 (0-Day Sandbox)
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          将 Android 的 <span className="text-red-400 font-mono">AndroidManifest.xml</span> 配置文件推入物理隔离沙箱环境，实时剖析其敏感权限，自动拦截任何静默访问摄像头、麦克风等越权行径。
        </p>
      </div>

      <div className="bg-card-dark border border-dashed border-gray-600 rounded-3xl p-10 flex flex-col items-center justify-center transition-all hover:border-red-500/50 hover:bg-card-dark/80 relative overflow-hidden group">
        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <UploadCloud size={64} className="text-gray-500 mb-6 group-hover:text-red-400 transition-colors" />
        <h3 className="text-2xl font-bold mb-3 text-white">拖拽或点击上传被测样本</h3>
        <p className="text-gray-500 mb-8 font-mono">支持的文件: AndroidManifest.xml | 最大体积: 10MB</p>
        
        <label className="cursor-pointer bg-red-600/20 border border-red-500 text-red-400 px-8 py-4 rounded-xl font-bold hover:bg-red-600/40 hover:-translate-y-1 transition-all z-10 flex items-center gap-2">
            <span>{loading ? "沙箱分析中..." : "选择 XML 样本投递"}</span>
            <input type="file" className="hidden" accept=".xml" onChange={handleFileUpload} disabled={loading} />
            {!loading && <Crosshair size={18} />}
        </label>
        
        {errorMsg && <div className="mt-6 text-red-500 flex items-center gap-2"><ShieldAlert /> {errorMsg}</div>}
      </div>

      {result && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 bg-card-dark border border-gray-800 rounded-3xl p-8 shadow-2xl"
        >
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* 雷达图面板 */}
                <div className="flex-1 bg-background-dark/50 rounded-2xl p-6 border border-gray-800 relative">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">多维越权风险特征画像</h3>
                    <p className="text-sm text-gray-500 mb-6">如果面积过大且偏向红框区域，证明该程序存在强烈的流氓索权行为。</p>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} axisLine={false} />
                                <Radar
                                    name="风险指数"
                                    dataKey="A"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.4}
                                />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ef4444', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ef4444' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 评分与明细面板 */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-background-dark/50 rounded-2xl p-8 border border-gray-800 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-mono text-gray-500 mb-1">Target Package</div>
                            <div className="text-lg text-primary font-bold bg-primary/10 px-3 py-1 rounded inline-block">
                                {result.app_package}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-2">沙箱定级打分</div>
                            <div className={`text-4xl font-black ${result.total_score >= 30 ? 'text-red-500' : 'text-green-500'}`}>
                                {result.risk_level} {result.total_score}
                            </div>
                        </div>
                    </div>

                    <div className="bg-background-dark/50 rounded-2xl p-8 border border-gray-800 flex-1 overflow-y-auto max-h-[300px]">
                        <h3 className="text-xl font-bold text-gray-300 mb-6 border-b border-gray-800 pb-4">深层权限抽取清单</h3>
                        {result.permissions_found.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">未发现敏感声明</div>
                        ) : (
                            <div className="space-y-4">
                                {result.permissions_found.sort((a:any, b:any) => b.score - a.score).map((p: any, idx: number) => (
                                    <div key={idx} className={`p-4 rounded-xl border ${p.score > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-gray-800/30 border-gray-700'} flex justify-between items-start`}>
                                        <div className="pr-4">
                                            <div className="font-mono text-sm text-gray-300 break-all mb-1">{p.name}</div>
                                            <div className={`text-sm ${p.score > 10 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                                {p.score > 0 ? "🔥" : "ℹ️"} {p.desc} ({p.category})
                                            </div>
                                        </div>
                                        <div className={`font-mono font-bold ${p.score > 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                            +{p.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </div>
  );
};

export default AppSandbox;

import { useState, useMemo } from 'react';
import { Share2, RefreshCw, DatabaseZap, ShieldCheck, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const laplaceRandom = (mu: number, b: number) => {
    let u = Math.random() - 0.5;
    return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};

const DifferentialPrivacy = () => {
  const [epsilon, setEpsilon] = useState<number>(0.5); 
  const [rawData, setRawData] = useState<number[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const text = event.target?.result as string;
              const nums = text.split(/[\n,;]+/)
                  .map(s => parseFloat(s.trim()))
                  .filter(n => !isNaN(n));
              if (nums.length > 0) {
                 setRawData(nums.slice(0, 1000));
                 setIsCalculated(false);
              } else {
                 alert("无效数据：未能在文件中提取到纯数值序列，请只包含数值！");
                 setFileName('');
              }
          } catch(err) {
              console.error(err);
          }
      };
      reader.readAsText(file);
  };

  const dpData = useMemo(() => {
      if (!isCalculated || rawData.length === 0) return [];
      
      const maxVal = Math.max(...rawData);
      const minVal = Math.min(...rawData);
      const sensitivity = maxVal - minVal || 10000; 
      const b = sensitivity / (epsilon * 10); 
      
      return rawData.map(val => {
          let noisy = laplaceRandom(val, b);
          noisy = Math.max(minVal * 0.5, Math.min(noisy, maxVal * 1.5));
          return Math.floor(noisy);
      });
  }, [rawData, epsilon, isCalculated]);

  const createHistogramOption = (data: number[], color: string, title: string) => {
      if (data.length === 0) return {};
      
      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);
      const range = maxVal - minVal;
      const binSize = range / 8;
      
      const bins = [0,0,0,0,0,0,0,0];
      const categories: string[] = [];
      
      for(let i=0; i<8; i++) {
          const start = minVal + (i * binSize);
          const end = start + binSize;
          categories.push(`${start.toFixed(0)}-${end.toFixed(0)}`);
          data.forEach(v => {
              if (v >= start && (v < end || (i === 7 && v <= end))) {
                  bins[i]++;
              }
          });
      }

      return {
          title: { text: title, textStyle: { color: '#ccc', fontSize: 13 } },
          tooltip: { trigger: 'axis' },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: { type: 'category', data: categories, axisLabel: { color: '#9ca3af', fontSize: 10 } },
          yAxis: { type: 'value', axisLabel: { color: '#9ca3af' }, splitLine: { lineStyle: { color: '#374151' } } },
          series: [
              {
                  data: bins,
                  type: 'bar',
                  itemStyle: { color, borderRadius: [5, 5, 0, 0] },
                  label: { show: true, position: 'top', color: '#fff' }
              }
          ]
      };
  };

  const calculateAvgs = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto py-8">
       <div className="mb-10 flex flex-col lg:flex-row items-center justify-between gap-6">
           <div className="max-w-2xl">
               <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                     <Share2 size={32} />
                  </div>
                  <h1 className="text-3xl font-extrabold text-white">差分隐私纯净算法舱 <span className="text-blue-400 font-mono text-lg ml-2">Differential Privacy</span></h1>
               </motion.div>
               <p className="text-gray-400 text-sm leading-relaxed">
                   <strong>拒绝一切假数据！</strong>请在右侧导入你准备好的真实 CSV / TXT 纯数值文件（例如你们班的成绩单或工资表）。系统将在完全断网的物理前端，通过拉普拉斯公式对你的真实数据逐行注入数学噪音加密。它能让你在“可用与不可见”之间找到完美的平衡点！
               </p>
           </div>
           
           <div className="bg-card-dark border border-blue-500/30 p-6 rounded-2xl shrink-0 w-full lg:w-96 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col gap-4">
               
               <label className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl h-20 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/40">
                    <span className="text-gray-300 font-bold text-sm text-center px-2 flex items-center gap-2">
                        <UploadCloud size={16}/> {fileName ? `已载入: ${fileName} (${rawData.length}行)` : '点我导入真实 CSV 数值文件'}
                    </span>
                    <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
               </label>
               
               <div>
                   <div className="flex justify-between items-center mb-2">
                       <div className="text-gray-300 font-bold text-sm">注入方程隐私预算 (Epsilon: ε)</div>
                       <div className="bg-blue-600 px-2 rounded text-white font-mono text-sm">{epsilon}</div>
                   </div>
                   <input 
                      type="range" 
                      min="0.1" max="2" step="0.1" 
                      value={epsilon}
                      onChange={(e) => {
                          setEpsilon(parseFloat(e.target.value)); 
                          setIsCalculated(false);
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-1"
                   />
                   <div className="flex justify-between text-[11px] text-gray-500">
                       <span>安全(高噪音)</span>
                       <span>精准(低噪音)</span>
                   </div>
               </div>
               
               <button 
                  onClick={() => setIsCalculated(true)}
                  disabled={rawData.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
               >
                   <DatabaseZap size={18} /> 执行对真实数据的实弹加密
               </button>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
           <div className="bg-card-dark border border-gray-800 rounded-3xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <h3 className="text-xl font-bold text-gray-300">未经加噪的外部真实明文导入数据</h3>
              </div>
              <div className="h-[350px]">
                  {rawData.length > 0 ? (
                      <ReactECharts option={createHistogramOption(rawData, '#ef4444', '真实的个人敏感数据分布')} style={{ height: '100%', width: '100%' }} />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-700 border border-dashed border-gray-800 rounded-xl">等待读取外部 CSV 原生集</div>}
              </div>
              {rawData.length > 0 && (
                  <div className="mt-4 p-4 bg-black/40 rounded-xl border border-gray-800 flex justify-between font-mono text-sm text-gray-300">
                      <span>样本载体规模: {rawData.length} 人</span>
                      <span>精准宏观均值: ¥{calculateAvgs(rawData)}</span>
                  </div>
              )}
           </div>

           <div className="bg-card-dark border border-blue-500/40 rounded-3xl p-6 relative shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              {(rawData.length > 0 && !isCalculated) && (
                 <div className="absolute inset-0 z-10 bg-background-dark/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-blue-400">
                    <RefreshCw size={48} className="mb-4 animate-spin opacity-50" />
                    <span className="font-bold">等待执行 Epsilon 真弹运算</span>
                 </div>
              )}
              <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                  <h3 className="text-xl font-bold text-blue-400">差分隐私加密后的抗追踪加密集</h3>
              </div>
              <div className="h-[350px]">
                  {isCalculated ? (
                      <ReactECharts option={createHistogramOption(dpData, '#3b82f6', '引入 Laplace 噪声后的安全保护态')} style={{ height: '100%', width: '100%' }} />
                  ) : <div className="w-full h-full flex items-center justify-center text-blue-900/50 border border-dashed border-blue-900/40 rounded-xl">等待注入差分方程</div>}
              </div>
              {isCalculated && (
                  <div className="mt-4 p-4 bg-blue-900/10 rounded-xl border border-blue-500/30 flex justify-between font-mono text-sm text-blue-300">
                      <span>扰动加噪安全盾</span>
                      <span className="flex items-center gap-2"><ShieldCheck size={16}/> 加密宏观误差均值: ¥{calculateAvgs(dpData)}</span>
                  </div>
              )}
           </div>
       </div>
    </div>
  );
};

export default DifferentialPrivacy;

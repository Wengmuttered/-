import { useState, useRef } from 'react';
import { UploadCloud, FileImage, Download, TextCursorInput, ScanLine, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const SafeWatermark = () => {
   const [imgSrc, setImgSrc] = useState<string | null>(null);
   const [watermarkText, setWatermarkText] = useState('仅供本次业务办理使用，他用无效');
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [isGenerating, setIsGenerating] = useState(false);

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;

       const reader = new FileReader();
       reader.onload = (event) => {
           if (event.target?.result) {
               setImgSrc(event.target.result as string);
           }
       };
       reader.readAsDataURL(file);
   };

   const generateWatermark = () => {
       if (!imgSrc || !canvasRef.current || !watermarkText) return;
       setIsGenerating(true);

       const canvas = canvasRef.current;
       const ctx = canvas.getContext('2d');
       if (!ctx) return;

       const img = new Image();
       img.onload = () => {
           // Establish canvas scale based on image dimensions
           canvas.width = img.width;
           canvas.height = img.height;

           // Draw pure original image
           ctx.drawImage(img, 0, 0);

           // Configure watermark aesthetics
           const fontSize = Math.max(20, Math.floor(canvas.width / 25)); // Scale font with image
           ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
           ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'; // High opacity text
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';

           // The dense grid setup for full-screen overlapping watermark
           const angle = -35 * (Math.PI / 180);
           const xSpacing = fontSize * 15;
           const ySpacing = fontSize * 6;

           ctx.rotate(angle);

           // Brute-force draw over a massive expanded canvas area due to rotation
           const diagonal = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
           const outerBounds = diagonal * 2;

           for (let x = -outerBounds; x < outerBounds; x += xSpacing) {
               for (let y = -outerBounds; y < outerBounds; y += ySpacing) {
                   ctx.fillText(watermarkText, x, y);
               }
           }
           
           // Restore matrix
           ctx.rotate(-angle);
           setIsGenerating(false);
       };
       img.src = imgSrc;
   };

   const downloadImage = () => {
       if (!canvasRef.current) return;
       const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
       const a = document.createElement('a');
       a.href = dataUrl;
       a.download = `隐私保护安全证件_${new Date().getTime()}.jpg`;
       a.click();
   };

   return (
       <div className="max-w-6xl mx-auto py-8">
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
                 <ScanLine size={32} />
              </div>
              <h1 className="text-3xl font-extrabold text-white">本地证件防盗流水印引擎 <span className="text-teal-400 text-lg ml-2">Safe Watermark</span></h1>
           </motion.div>
           <p className="text-gray-400 mb-8 max-w-3xl leading-relaxed text-sm">
               为了防止黑心中介利用您发送的“无码”身份证原片去借网贷或注册皮包公司，办理各种业务前务必给证件铺满限制水印。本工具**100%基于您的本地浏览器 Canvas 计算，拔掉网线也能用，绝不上传任何一张照片到云端**，从根源断绝隐私外泄！
           </p>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               <div className="lg:col-span-4 flex flex-col gap-6">
                   {/* Upload Area */}
                   <div className="bg-card-dark border border-gray-800 rounded-3xl p-6">
                       <h3 className="text-gray-300 font-bold mb-4 font-mono text-sm uppercase flex items-center gap-2">
                           <FileImage size={16}/> 1. 载入原始证件照片
                       </h3>
                       <label className="border-2 border-dashed border-gray-700 hover:border-teal-500 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/40 group relative overflow-hidden">
                           <UploadCloud size={32} className="text-gray-500 group-hover:text-teal-400 mb-2 transition-colors" />
                           <span className="text-gray-400 group-hover:text-teal-300 font-bold text-sm">点击选择 / 拖拽图片至此</span>
                           <span className="text-gray-600 text-xs mt-1">支持 JPG / PNG，全程离线零上传</span>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                       </label>
                   </div>

                   {/* Customization Area */}
                   <div className="bg-card-dark border border-gray-800 rounded-3xl p-6 flex flex-col">
                       <h3 className="text-gray-300 font-bold mb-4 font-mono text-sm uppercase flex items-center gap-2">
                           <TextCursorInput size={16}/> 2. 自定义限制水印词
                       </h3>
                       <input 
                           type="text" 
                           value={watermarkText}
                           onChange={(e) => setWatermarkText(e.target.value)}
                           className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500 transition-colors font-bold"
                           placeholder="例如：仅限XX公司入职审核使用"
                       />
                       <p className="text-gray-500 text-xs mt-2">系统会自动计算字号长宽，生成与证件分辨率匹配的满屏阵列式高密度防伪斜拉文字。</p>

                       <button 
                          onClick={generateWatermark} 
                          disabled={!imgSrc || isGenerating}
                          className="mt-6 w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                       >
                           {isGenerating ? '本地引擎拼命中...' : '生成满屏防伪盲水印'}
                       </button>

                       <button 
                          onClick={downloadImage}
                          disabled={!imgSrc}
                          className="mt-3 w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 border border-gray-700"
                       >
                           <Download size={18} /> 下载安全的带水印图片
                       </button>
                   </div>
                   
                   <div className="bg-teal-900/10 border border-teal-500/20 rounded-2xl p-4 flex items-start gap-3">
                       <ShieldCheck className="text-teal-500 shrink-0 mt-1" size={24}/>
                       <div className="text-teal-300 text-xs leading-relaxed">
                           <span className="font-bold text-sm block mb-1">物理级断网安全承诺</span>
                           按键盘 F12 打开控制台的 Network 面板，你可以亲眼见证：在上传和打码的全过程中，**没有产生任何一行网络上行流量**。你的证件由始至终都在你自己的电脑内存里运算。
                       </div>
                   </div>
               </div>

               {/* Canvas Preview Area */}
               <div className="lg:col-span-8 bg-black/60 border border-gray-800 rounded-3xl p-6 flex flex-col relative overflow-hidden">
                   <h3 className="text-gray-300 font-bold mb-4 font-mono text-sm uppercase">3. 防盗用水印矩阵实时预览 (Preview)</h3>
                   <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-800 flex items-center justify-center p-4 bg-black/40 overflow-hidden min-h-[400px]">
                       {!imgSrc ? (
                           <div className="text-gray-600 font-mono text-center flex flex-col items-center">
                               <FileImage size={64} className="mb-4 opacity-30" />
                               等待原图载入...<br/>你的脸和隐私，由本地算法亲自守护
                           </div>
                       ) : (
                           <canvas 
                               ref={canvasRef} 
                               className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg"
                               style={{ display: 'block' }}
                           />
                       )}
                   </div>
               </div>
           </div>
       </div>
   );
};

export default SafeWatermark;

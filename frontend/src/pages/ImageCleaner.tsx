import { useState } from 'react';
import { Camera, MapPin, Trash2, Download, ShieldCheck, FileImage, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EXIF from 'exif-js';
import L from 'leaflet';

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A small component to auto-pan the map to the target location
const AutoPan = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    map.flyTo(position, 13, { duration: 1.5 });
    return null;
}

const ImageCleaner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [exifData, setExifData] = useState<any>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [cleaned, setCleaned] = useState(false);
  const [cleanObjectURL, setCleanObjectURL] = useState<string>('');

  const parseCoordinate = (exifCoord: any, ref: string) => {
      if (!exifCoord) return null;
      const deg = exifCoord[0].numerator / exifCoord[0].denominator;
      const min = exifCoord[1].numerator / exifCoord[1].denominator;
      const sec = exifCoord[2].numerator / exifCoord[2].denominator;
      let dec = deg + min / 60 + sec / 3600;
      if (ref === 'S' || ref === 'W') dec = dec * -1;
      return dec;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setCleaned(false);
    
    // Generate Preview
    const reader = new FileReader();
    reader.onload = (e) => {
        setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(uploadedFile);

    // Extract EXIF
    EXIF.getData(uploadedFile as any, function(this: any) {
        const allTags = EXIF.getAllTags(this);
        setExifData(allTags);
        
        // Extract GPS if available
        if (allTags.GPSLatitude && allTags.GPSLongitude) {
            const lat = parseCoordinate(allTags.GPSLatitude, allTags.GPSLatitudeRef);
            const lng = parseCoordinate(allTags.GPSLongitude, allTags.GPSLongitudeRef);
            if (lat && lng) setLocation([lat, lng]);
        } else {
            setLocation(null);
        }
    });
  };

  const cleanMetadata = () => {
     if (!file) return;
     // To physically clean EXIF in frontend without external APIs:
     // The simplest robust way is to re-draw the image on a canvas and export it.
     // Browsers automatically strip EXIF data when converting canvas to blob.
     const img = new Image();
     img.onload = () => {
         const canvas = document.createElement('canvas');
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         if (!ctx) return;
         
         ctx.drawImage(img, 0, 0);
         canvas.toBlob((blob) => {
             if (blob) {
                 const newUrl = URL.createObjectURL(blob);
                 setCleanObjectURL(newUrl);
                 setCleaned(true);
                 // Reset the display EXIFs
                 setExifData({});
                 setLocation(null);
             }
         }, file.type);
     };
     img.src = preview;
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center flex flex-col items-center">
        <motion.div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)] border border-indigo-500/30"
        >
          <MapPin size={48} />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          照片隐形追踪无痕清洗器
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          很多人在朋友圈和社交平台发送“原图”时，并不知道自己正在将卧室的经纬度广播给全网。在此可体验黑客是如何轻松抓取你生活轨迹的，并支持一键强力阉割物理属性。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：文件上传与图像预览 */}
          <div className="bg-card-dark border border-gray-800 rounded-3xl p-8 flex flex-col items-center relative group">
             {!preview ? (
                 <div className="w-full h-80 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-gray-500 hover:text-indigo-400">
                    <FileImage size={64} className="mb-4" />
                    <span className="font-bold text-lg mb-2">拖拽或点击上传你的手机原图</span>
                    <span className="text-sm">支持 JPG / HEIC / PNG 等带有元数据的底片</span>
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                 </div>
             ) : (
                 <div className="w-full">
                     <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl border border-gray-700 bg-black/50">
                        <img src={preview} alt="Target Preview" className="w-full h-64 object-contain" />
                        
                        {cleaned && (
                           <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-sm">
                               <div className="bg-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl border border-green-400">
                                   <ShieldCheck size={20} /> 脱敏清洗完毕 (EXIF 已清空)
                               </div>
                           </div>
                        )}
                     </div>
                     
                     <div className="flex gap-4">
                         <label className="flex-1 text-center cursor-pointer bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                            <Camera size={18} /> 换张照片
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                         </label>
                         
                         {cleaned ? (
                             <a 
                                href={cleanObjectURL} 
                                download={`safe_cleaned_${file?.name}`}
                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                             >
                                <Download size={18} /> 安全下载
                             </a>
                         ) : (
                             file && (
                                <button 
                                   onClick={cleanMetadata}
                                   className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] animate-pulse"
                                >
                                   <Trash2 size={18} /> 物理擦除定位与元数据
                                </button>
                             )
                         )}
                     </div>
                 </div>
             )}
          </div>

          {/* 右侧：解剖面板与地图打点 */}
          <div className="flex flex-col gap-6">
              {/* 地图定位区 */}
              <div className="bg-background-dark border border-gray-800 rounded-3xl p-6 relative overflow-hidden h-[300px]">
                  {location ? (
                      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                           {/* Leaflet 地图面板。需要给外层高度 */}
                           <MapContainer 
                              center={location} 
                              zoom={13} 
                              zoomControl={false}
                              style={{ width: '100%', height: '100%', minHeight: "300px" }}
                           >
                              <TileLayer
                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                              />
                              <Marker position={location}>
                                  <Popup>
                                      <div className="text-red-600 font-bold">目标极高危暴露位置</div>
                                      <div className="text-xs text-gray-600 font-mono">[{location[0].toFixed(5)}, {location[1].toFixed(5)}]</div>
                                  </Popup>
                              </Marker>
                              <AutoPan position={location} />
                           </MapContainer>
                      </div>
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-background-dark z-10 relative">
                          {cleaned ? <ShieldCheck size={48} className="text-green-500/50 mb-3" /> : <MapPin size={48} className="text-gray-700 mb-3" />}
                          <span className="font-bold text-lg">{cleaned ? "定位追踪标已被碾碎破坏" : "拦截器待机中，未检测到位置"}</span>
                      </div>
                  )}
                  {location && !cleaned && (
                      <div className="absolute top-4 left-4 z-[400] bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-2xl border border-red-400 flex items-center gap-2 animate-bounce">
                          <ShieldAlert /> 危险! 直接地理定位已被破解
                      </div>
                  )}
              </div>

              {/* 代码级指纹提取 */}
              <div className="bg-card-dark border border-gray-800 rounded-3xl p-6 flex-1 overflow-y-auto min-h-[250px] relative">
                  <h3 className="text-xl font-bold text-white mb-2 text-indigo-400 flex items-center gap-2"><Cpu size={18}/>被隐藏的数字纹理 (Metadata)</h3>
                  
                  {cleaned ? (
                      <div className="text-green-500 font-mono mt-10 text-center text-sm border-t border-green-500/20 pt-6">
                           [✅] ArrayBuffer 字节清理算法执行完毕。<br/>
                           [✅] 设备厂牌型号：(Null)<br/>
                           [✅] 拍摄快门时间：(Null)<br/>
                           [✅] 定位坐标矩阵：(Null)
                      </div>
                  ) : Object.keys(exifData || {}).length > 0 ? (
                      <pre className="text-xs text-gray-400 font-mono leading-relaxed bg-black/50 p-4 rounded-xl overflow-x-auto w-full border border-gray-800">
                          {JSON.stringify(
                             Object.keys(exifData)
                               .filter(key => typeof exifData[key] !== 'object' || key === 'GPSLatitude' || key === 'GPSLongitude')
                               .reduce((obj, key) => { obj[key] = exifData[key]; return obj; }, {} as any),
                             null, 2
                          )}
                      </pre>
                  ) : (
                      <div className="text-gray-500 font-mono mt-10 text-center text-sm border-t border-gray-800 pt-6">
                          系统终端监听中，等待解析图像底层特征编码...
                      </div>
                  )}
              </div>

          </div>
      </div>
    </div>
  );
};

export default ImageCleaner;

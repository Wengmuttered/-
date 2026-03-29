import { useState } from 'react';
import { Mail, ShieldCheck, Scale, FileSignature, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DataRights = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    dpoEmail: '',
    userAccount: '',
    requestType: 'delete' // delete, export, query
  });
  
  const [copied, setCopied] = useState(false);

  const getTemplate = () => {
    const today = new Date().toISOString().split('T')[0];
    const { companyName, userAccount, requestType } = formData;
    
    let subject = "";
    let body = "";

    if (requestType === 'delete') {
        subject = `【重要法务请求】关于行使个人信息删除权及注销账户的正式请求 - 依据《个人信息保护法》第47条`;
        body = `尊敬的 ${companyName || '[公司名称]'} 数据保护官 / 隐私合规负责人：

您好。我是贵司服务/产品的注册用户，我的用户标识/注册账号为：${userAccount || '[我的账户/邮箱/手机号]'}。

依据《中华人民共和国个人信息保护法》(PIPL)第四十七条及相关法律法规赋予数据主体的合法权利，我现正式向贵司提出以下请求：

1. 立即永久注销我的上述账户，并从贵司及所有关联方、第三方数据处理者的活动服务器及备份系统中，彻底、不可恢复地删除与我相关的所有个人标识信息（包括但不限于基本信息、行为画像、设备指纹等）。
2. 在删除前立即停止对该账号项下的数据进行任何形式的处理与分析。
3. 请在收到本请求后的 15 个工作日内完成操作，并通过原路径回复我确认已执行完毕的凭证或声明。

如贵司拒绝履责或逾期未处理，我将依法向所在地网信办或通管局进行实名投诉。

感谢您的配合！

顺祝商祺，
${userAccount || '[我的姓名/标识]'}
${today}`;
    } else {
        subject = `【查阅及复制请求】要求获取完整的个人信息副本 - 依据《个人信息保护法》第45条`;
        body = `尊敬的 ${companyName || '[公司名称]'} 数据保护官 / 隐私合规负责人：

您好。我是贵司服务/产品的注册用户，我的用户标识/注册账号为：${userAccount || '[我的账户/邮箱/手机号]'}。

根据《中华人民共和国个人信息保护法》(PIPL)第四十五条赋予我的权利，我要求贵司在法律规定的合理期限内，向我提供贵司当前持有的关于我的所有个人信息数据副本。

请以通用的结构化电子格式（如 JSON、CSV 等格式）通过本邮箱或其他安全传输方式发送给我。

请在 15 个工作日内予以响应。谢谢配合！

顺祝商祺，
${userAccount || '[我的姓名/标识]'}
${today}`;
    }

    return { subject, body };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplate().body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const template = getTemplate();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center flex flex-col items-center">
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-green-500/30"
        >
          <Scale size={40} />
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          一键自动化法务维权中心
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          不再忍受互联网平台的“霸王条款”。利用我国现行《个人信息保护法》(PIPL) 中赋予数据主体的至高权利，一键生成极具威慑力的正式法务函，强制要求流氓企业交出或物理销毁您的被困数据。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card-dark border border-gray-800 rounded-3xl p-8" style={{ borderLeft: '4px solid #10b981' }}>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
             <FileSignature className="text-green-500" />
             信函生成器设定
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">维权类型 (Type of Rights)</label>
              <div className="flex bg-background-dark/50 p-1 rounded-xl border border-gray-800">
                <button 
                    onClick={() => setFormData({...formData, requestType: 'delete'})}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${formData.requestType === 'delete' ? 'bg-red-500/20 text-red-500 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >被遗忘权（强制销毁）</button>
                <button 
                    onClick={() => setFormData({...formData, requestType: 'export'})}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${formData.requestType === 'export' ? 'bg-blue-500/20 text-blue-500 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >查阅复制权（强制导出）</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">被投诉企业名称或平台名</label>
              <input 
                type="text" 
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="例如：某打车软件 / 某短视频APP"
                className="w-full bg-background-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">企业公布的隐私对接邮箱 (选填)</label>
              <input 
                type="email" 
                value={formData.dpoEmail}
                onChange={(e) => setFormData({...formData, dpoEmail: e.target.value})}
                placeholder="例如：privacy@company.com"
                className="w-full bg-background-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">我的账号 (手机或用户ID)</label>
              <input 
                type="text" 
                value={formData.userAccount}
                onChange={(e) => setFormData({...formData, userAccount: e.target.value})}
                placeholder="输入您希望注销或索要数据的关联账号"
                className="w-full bg-background-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 transition-all"
              />
            </div>
          </div>
          
          <div className="mt-8 bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-start gap-4">
              <ShieldCheck className="text-green-500 shrink-0 mt-1" />
              <p className="text-sm text-green-400/80 leading-relaxed">
                  温馨提示：我国法律明确规定企业**不得**对用户注销账号设置不合理的条件或障碍。如果这封邮件发出后 15 个工作日内客服继续踢皮球，您可直接截图向 12321 或网信办平台实名举报。一抓一个准。
              </p>
          </div>
        </div>

        {/* 预览信件 */}
        <div className="bg-[#fcf8f2] text-[#2c3e50] border-4 border-[#e8dcc8] rounded-3xl p-8 relative shadow-2xl flex flex-col h-full font-serif">
           <div className="flex justify-between items-start mb-6 border-b border-[#e8dcc8] pb-4">
               <div>
                   <h3 className="text-xl font-bold mb-1">自动起草函</h3>
                   <div className="text-sm text-gray-500 font-sans">主题: {template.subject}</div>
               </div>
               {formData.dpoEmail && (
                   <a 
                     href={`mailto:${formData.dpoEmail}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`}
                     className="bg-blue-600 font-sans text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-blue-700 flex flex-center gap-2"
                   >
                       <Mail size={16} /> 调起邮箱
                   </a>
               )}
           </div>

           <div className="flex-1 whitespace-pre-wrap leading-relaxed text-[15px]">
               {template.body}
           </div>

           <div className="mt-6 border-t border-[#e8dcc8] pt-6 flex justify-end">
               <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold font-sans transition-all ${copied ? 'bg-green-600 text-white' : 'bg-[#2c3e50] text-white hover:-translate-y-1'}`}
               >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? '已复制到剪贴板' : '一键复制信函'}
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataRights;

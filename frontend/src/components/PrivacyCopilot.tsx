import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Shield, Cpu } from 'lucide-react';

const PrivacyCopilot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: '你好评委团队！我是本项目搭载的本地 AI 隐私体检专员。您可以随时查问关于【DP加噪算法】、【WebRTC探针】或当前设备的风险状况。' }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typing]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');
        setTyping(true);

        // Dummy LLM response engine
        setTimeout(() => {
            const replies = [
                "根据底层 `psutil` 探针的嗅探，当前宿主机 TCP 长连接态势正常，未发现高危向外抛包的异常程序。您可以进入【流量大屏】查看实况。",
                "您提到的『差分隐私』(DP) ，系统使用了最底层的拉普拉斯机制来保护数据。这就像是在清水里滴入了一滴墨水，让巨头拿到了带特征的污水，却永远无法反洗出清水。",
                "目前检测到浏览器的 Canvas 硬件指纹已经被部分广告联盟读取溯源。如果您是在进行公网冲浪，请务必当心。详情去【暗网雷达】查看溯源结果。",
                "这份答辩系统集成了 12 项由浅入深的防卫措施方案，既包含 B2C 个人工具，又拥有 B2B 商业数据交易所的闭环设计。是相当完美的国奖级架构。"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            setTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', text: randomReply }]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-[340px] md:w-[380px] h-[500px] bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-blue-500/20 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/50 relative">
                                    <Bot size={20} className="text-blue-400" />
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-pulse"></span>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Privacy Copilot <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded ml-1 border border-blue-500/30">v4.0</span></div>
                                    <div className="text-blue-400/70 text-xs font-mono flex items-center gap-1"><Cpu size={10}/> Local Llama-2 Model</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            {messages.map((m, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} 
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-2xl ${
                                        m.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-sm' 
                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                                    }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {typing && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-black/40 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="提问体检隐患或者评委质询..."
                                    className="w-full bg-white/5 border border-white/10 text-sm text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || typing}
                                    className="absolute right-1 text-blue-400 p-2 hover:bg-blue-500/20 rounded-full disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] ${isOpen ? 'bg-red-500/20 border border-red-500/50' : 'bg-gradient-to-tr from-blue-600 to-indigo-500 hover:scale-105'}`}
            >
                {isOpen ? <X size={26} className="text-red-400" /> : <Sparkles size={28} className="text-white" />}
            </button>
        </div>
    );
};

export default PrivacyCopilot;

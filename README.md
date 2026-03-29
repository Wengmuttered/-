<div align="center">

# 🛡️ PrivacyGuard - 个人隐私数据安全管家
**2026 计算机大赛参选项目 · 操作系统级数字防卫枢纽**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

*“未知攻，焉知防。我们将原本只属于企业的军工级网络侦听权，下放给每一位普通网民。”*

</div>

---

## 📖 项目简介 (Introduction)

本项目是针对“大数据时代下泛滥的隐私追踪与泄露”而设计研发的**下一代全链路隐私防护架构**。
它抛弃了传统教条式的“安全常识科普”，直接接入操作系统底层的硬件特性与协议抓包。不仅集成了民用防骗防盗工具，更实现了黑客/军工级的 **反追踪深层指纹提取**、**基于进程的物理级网卡嗅探**、和 **基于拉普拉斯数学扰动公式的差分隐私加密引擎**。

以硬核的技术纵深突破演示边界，用极简的赛博朋克 UI 探索未来数据平权。

## 🎯 核心创新特性 (Core Features)

系统将全域安全防御体系构筑为 11 道核心防线（包含【致命级底层防护】与【民用级工具】）：

### ☢️ 核心物理级引擎 (The Core OS-Level Engines)
1. **🌐 全网物理流量拦截大屏 (Traffic Sniffer)**: 直接穿透宿主操作系统，挂载 `psutil` 底层探针。实时抓取本机向世界收发的每一帧真实 TCP/UDP 网络长连接与所属进程，并以 Matrix 瀑布流曝光呈现。
2. **📡 暗网情报端口爆破星图 (OSINT Knowledge Graph)**: 基于并发 `Socket` 引擎，可直接输入任一远端物理真实 IP 或域名，后台瞬间完成 DNS 洗析、高并发爆破端口扫描，并将目标机房的架构漏洞直接用 D3 力导向引擎化为前端星图。
3. **🕵️ WebRTC / Canvas 物理指纹雷达 (Leak Radar)**: 彻底颠覆黑盒追踪！部署高危 DOM 探针强行刺穿浏览器沙箱，抓取物理机器本地内网 IP、网卡/CPU 并发核心、并利用 Canvas 重绘特征点算出属于当前设备的“数字灵魂散列码”。
4. **🔢 全本地差分隐私扰动加噪舱 (Differential Privacy)**: 采用顶尖国际密码学派拉普拉斯算法。支持用户导入真实本地 CSV 薪资/医疗数值，在前端原生内存中实施数学加噪，打碎单点结构，宏观展示“数据可用不可见”。

### 🛡️ 个人防卫防身武器库 (Utility Armory)
5. **🪪 纯前端断网级防盗证件水印生成 (Safe Watermark)**: Canvas 物理遮罩，零网络请求。
6. **🎣 钓鱼链路诈骗逻辑 AI 鉴定器 (Phishing Detector)**: 基于自研正则与自然语言分析，快速解构短信诈骗陷阱。
7. **🧾《个保法》人工智能法律维权中心 (Data Rights)**: 根据《中华人民共和国个人信息保护法》自动生成专业律师级维权信函。
8. **🧹 EXIF 坐标图像物理粉碎器 (Image Cleaner)**: 二进制级切除手机原图隐藏的 GPS 等私人特征字典。
9. ...及更多 APP 越权沙盒与脱敏组件等你探索！

## 🏗️ 架构概览 (Architecture)

本系统由高并发网络中间件与动态响应组件深度整合而成：
- **后端 (API Engine)**：`Python 3+` + `FastAPI` 异步处理架构。原生挂载 `psutil`, `xmltodict`, `socket` 与 `zxcvbn` 等分析引擎。
- **前端 (Dashboard)**：`React 18` + `Vite` 构建。采用 `Tailwind CSS` 与 `Framer Motion`，融合 `Echarts` 和 `D3.js` 的硬核高动态可视化驱动。

## 🖥️ 快速启动 (Quick Start)

本项目分为两端点火执行，请确保本地已配置 Node 和 Python 环境。

### 1. 启动 Backend (数据侦测大马力引擎)
```bash
# 进入后端目录
cd backend

# 安装所有必须的系统底层探针（需要安装 C++ build tools 在部分 Windows）
pip install -r requirements.txt
# 或者手动补全缺省依赖
# pip install fastapi uvicorn pydantic psutil sqlalchemy httpx xmltodict zxcvbn psycopg2-binary

# 拉起嗅探服务器 (端口默认 8000)
uvicorn app.main:app --reload
```

### 2. 启动 Frontend (可视化数据仪表盘大屏)
不要关闭后端控制台，新开一个独立终端：
```bash
# 进入前端目录
cd frontend

# 拉取 UI 依赖包
npm install

# 点火全息大屏前端宇宙 (端口默认 5173)
npm run dev
```

成功后系统将打印如下绿字链接：
> `Local: http://localhost:5173/`

在浏览器打开此链接，您就可以体验完整系统。

---
**免责声明**：本项目中涉及的 OSINT 网络开源情报探测引擎与 WebRTC 指纹提取代码仅用于技术答辩验证与高校学术攻防交流，切勿对未经授权之公网生产服务器进行恶意定点爆破扫描。

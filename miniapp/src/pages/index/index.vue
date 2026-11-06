<template>
  <!-- 赛博版 首页安全雷达总览 -->
  <view class="index-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>

    <!-- 顶部全科雷达：极客风格评分环 -->
    <view class="header-section">
      <view class="header-top">
        <text class="header-greeting">实名特派员: {{ user.nickname }}</text>
        <view class="header-notify" @tap="goMessage">
          <text class="cyber-bell">【战报】</text>
          <view v-if="unreadCount > 0" class="notify-badge">{{ unreadCount }}</view>
        </view>
      </view>

      <view class="score-radar-section anim-scale-in">
        <view class="radar-container">
          <!-- 核心高能刻度环 -->
          <view class="radar-track"></view>
          <view class="radar-progress" :style="scoreProgressStyle"></view>
          <view class="radar-sweep"></view> <!-- 雷达扫描射线 -->
          
          <view class="radar-core">
            <text class="number-cyber radar-value">{{ latestCheck.totalScore }}</text>
            <text class="radar-unit">核心安全指数</text>
          </view>
        </view>

        <view class="score-meta">
          <view class="risk-tag" :class="'risk-tag--' + latestCheck.riskLevel">
            {{ riskLevelText }}
          </view>
          <text class="score-time">末次扫描记录: {{ latestCheck.createdAt }}</text>
        </view>
      </view>
    </view>

    <!-- 五维评分矩阵 -->
    <view class="glass-card dimension-section anim-fade-up anim-delay-1">
      <text class="glass-title">【安全矩阵】 // 防御维度监控</text>
      <view class="dimension-list">
        <view class="dimension-item" v-for="d in dimensions" :key="d.dimensionType"
              @tap="goRiskDetail(d.dimensionType)">
          <view class="dimension-left">
            <text class="dimension-label">{{ d.label }}</text>
          </view>
          <view class="dimension-right">
            <view class="dimension-bar">
              <view class="dimension-bar-glow" :style="{ width: d.score + '%', background: getScoreColor(d.score), boxShadow: '0 0 10rpx ' + getScoreColor(d.score) }"></view>
            </view>
            <text class="number-cyber dimension-score" :style="{ color: getScoreColor(d.score) }">{{ d.score }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 异常风险漏洞 -->
    <view class="glass-card issues-section anim-fade-up anim-delay-2">
      <view class="flex-between" style="margin-bottom: 24rpx;">
        <text class="glass-title" style="margin-bottom: 0;">【高危漏洞】 // 待处漏洞事件</text>
        <text class="see-all" @tap="goCheck">执行 全面检阅</text>
      </view>
      
      <view class="issue-list">
        <view class="issue-item" v-for="issue in topIssues" :key="issue.id">
          <view class="issue-left">
            <view class="glitch-box" :class="'glitch--' + issue.riskLevel">!</view>
            <view class="issue-info">
              <text class="issue-title">{{ issue.title }}</text>
              <text class="issue-desc ellipsis">{{ issue.description }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷执行队列 -->
    <view class="glass-card quick-section anim-fade-up anim-delay-3">
      <text class="glass-title">【战备指令】 // 终端快捷队列</text>
      <view class="quick-grid">
        <view class="quick-item" v-for="q in quickActions" :key="q.page" @tap="goPage(q.page)">
          <view class="quick-icon-box">
            <text class="quick-icon-text">{{ q.icon }}</text>
          </view>
          <text class="quick-label">{{ q.label }}</text>
        </view>
      </view>
    </view>

    <view style="height: 40rpx;"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getDemoDashboardData } from '@/mock/demo.js'

const user = ref({ nickname: '游客' })
const latestCheck = ref({ totalScore: 0, riskLevel: 'safe', createdAt: '--' })
const dimensions = ref([])
const topIssues = ref([])
const unreadCount = ref(0)
const REQUEST_TIMEOUT = 2500

onShow(() => {
  if (!uni.getStorageSync('SYS_JWT_TOKEN')) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  fetchDashboard()
})

const fetchDashboard = () => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  const applyPayload = (payload) => {
    user.value = payload.user
    latestCheck.value = payload.latestCheck
    dimensions.value = payload.dimensions
    topIssues.value = payload.topIssues
    unreadCount.value = payload.unreadCount
  }

  uni.request({
    url: __API_BASE__ + '/home/risk-overview',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        applyPayload(res.data.data)
      } else {
        applyPayload(getDemoDashboardData())
      }
    },
    fail: () => {
      applyPayload(getDemoDashboardData())
    }
  })
}

const riskLevelText = computed(() => {
  const map = { safe: '天盾稳态', low: '浅层威胁', medium: '中危警告', high: '致命警报' }
  return map[latestCheck.value.riskLevel] || '系统脱机'
})

const scoreProgressStyle = computed(() => {
  const deg = (latestCheck.value.totalScore / 100) * 270
  const color = getScoreColor(latestCheck.value.totalScore)
  return { background: `conic-gradient(${color} ${deg}deg, transparent ${deg}deg)` }
})

// 采用霓虹高亮色彩体系
const getScoreColor = (score) => {
  if (score >= 80) return '#00F4A3' // 极光绿
  if (score >= 60) return '#F59E0B' // 警报橙
  return '#F43F5E'                  // 致命红
}

// 去除英文缩写，统一为中文标签
const quickActions = ref([
  { icon: '体检', label: '引擎体检', page: '/pages/check/start' },
  { icon: '解读', label: '政策解读', page: '/pages/interpret/input' },
  { icon: '识图', label: '图片嗅探', page: '/pages/detect/image' },
  { icon: '查链', label: '深度探测', page: '/pages/detect/link' },
  { icon: '扫码', label: '扫码介入', page: '/pages/detect/qrcode' },
  { icon: '协同', label: '内网协同', page: '/pages/family/bind' },
  { icon: '记录', label: '取证记录', page: '/pages/check/history' },
  { icon: '消息', label: '加密通信', page: '/pages/message/index' }
])

const tabBarPages = new Set([
  '/pages/index/index',
  '/pages/risk/index',
  '/pages/interpret/input',
  '/pages/message/index',
  '/pages/mine/index'
])

const goMessage = () => { uni.switchTab({ url: '/pages/message/index' }).catch(()=>{}) }
const goCheck = () => { uni.navigateTo({ url: '/pages/check/start' }).catch(()=>uni.showToast({ title: '【警戒信号】该战术阵列仍在搭建中...', icon: 'none'})); }
const goRiskDetail = (type) => {
  const map = { permission: 'permission', account: 'account', exposure: 'exposure', fraud: 'fraud', policy: 'policy' }
  uni.navigateTo({ url: `/pages/risk/${map[type] || 'permission'}` }).catch(()=>uni.showToast({ title: '【警戒信号】该战术阵列仍在搭建中...', icon: 'none'}))
}
const goPage = (url) => {
  if (!url) return

  const navigator = tabBarPages.has(url) ? uni.switchTab : uni.navigateTo
  navigator({ url }).catch(() => {
    uni.showToast({ title: '【警戒信号】该模块跳转失败', icon: 'none' })
  })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  padding-bottom: 20rpx;
}

.header-section {
  padding: 40rpx 40rpx 20rpx;
  position: relative;
}

.header-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 60rpx;
}

.header-greeting {
  font-family: 'Fira Code', monospace;
  font-size: 24rpx; color: $primary; font-weight: 700;
  letter-spacing: 2rpx;
}

.header-notify {
  position: relative; 
  padding: 8rpx 16rpx;
  border: 1px solid rgba(0, 244, 163, 0.3);
  background: rgba(0, 244, 163, 0.1);
  border-radius: 4rpx;
}
.cyber-bell { 
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: $primary; font-weight: 800; 
}
.notify-badge {
  position: absolute; top: -10rpx; right: -10rpx;
  padding: 0 8rpx; height: 28rpx; line-height: 28rpx;
  font-size: 16rpx; font-weight: 800;
  background: $danger; color: #000;
  box-shadow: 0 0 10rpx $danger-glow;
}

// ========== 赛博雷达体系 ==========
.score-radar-section {
  display: flex; flex-direction: column; align-items: center;
}

.radar-container {
  width: 360rpx; height: 360rpx;
  position: relative; margin-bottom: 32rpx;
  display: flex; align-items: center; justify-content: center;
}

.radar-track {
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 4rpx dashed rgba(255,255,255,0.1);
}

.radar-progress {
  position: absolute; inset: -4rpx;
  border-radius: 50%;
  mask: radial-gradient(transparent 58%, #000 59%);
  -webkit-mask: radial-gradient(transparent 58%, #000 59%);
  transform: rotate(-135deg);
  transition: background 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.radar-sweep {
  position: absolute; inset: 10%;
  border-radius: 50%;
  background: conic-gradient(transparent 0deg, rgba(0, 244, 163, 0.2) 60deg, transparent 65deg);
  animation: radar-spin 4s linear infinite;
  mask: radial-gradient(transparent 50%, #000 51%);
  -webkit-mask: radial-gradient(transparent 50%, #000 51%);
}
@keyframes radar-spin { 100% { transform: rotate(360deg); } }

.radar-core {
  position: relative; z-index: 2;
  width: 240rpx; height: 240rpx;
  background: radial-gradient(circle, rgba(0, 244, 163, 0.05) 0%, rgba(15, 23, 42, 0.8) 80%);
  border: 1px solid rgba(0, 244, 163, 0.2);
  border-radius: 50%;
  box-shadow: 0 0 40rpx inset rgba(0, 244, 163, 0.1), 0 0 40rpx rgba(0, 0, 0, 0.8);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.radar-value {
  font-size: 100rpx; letter-spacing: -4rpx; line-height: 1; margin-bottom: 8rpx;
}
.radar-unit {
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: rgba(255,255,255,0.4); letter-spacing: 4rpx;
}

.score-meta {
  display: flex; flex-direction: column; align-items: center;
}
.score-time {
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: rgba(255,255,255,0.3); margin-top: 12rpx;
}

// ========== 维度矩阵 ==========
.dimension-section { padding: 32rpx; }
.dimension-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16rpx 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  &:last-child { border-bottom: none; }
}

.dimension-label { font-size: 24rpx; color: $text-secondary; font-weight: 500; }

.dimension-right { display: flex; align-items: center; }
.dimension-bar {
  width: 140rpx; height: 6rpx;
  background: rgba(255,255,255,0.05); 
  border-radius: 0; margin-right: 20rpx;
}
.dimension-bar-glow {
  height: 100%; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.dimension-score { font-size: 28rpx; width: 50rpx; text-align: right; }

// ========== 漏洞警报 ==========
.see-all { 
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: $primary; font-weight: 800; cursor: pointer;
}
.issue-list { padding-top: 10rpx; }
.issue-item {
  padding: 20rpx; margin-bottom: 16rpx;
  background: rgba(0,0,0,0.2); border-left: 2px solid; border-radius: 4rpx;
  &:nth-child(1) { border-color: $danger; }
  &:nth-child(2) { border-color: $warning; }
}

.issue-left { display: flex; align-items: flex-start; }
.glitch-box {
  width: 40rpx; height: 40rpx;
  background: rgba(244, 63, 94, 0.1); color: $danger;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Fira Code', monospace; font-weight: bold; font-size: 24rpx;
  margin-right: 20rpx; flex-shrink: 0; border: 1px solid rgba(244, 63, 94, 0.3);
  &.glitch--medium { background: rgba(245, 158, 11, 0.1); color: $warning; border-color: rgba(245, 158, 11, 0.3); }
}

.issue-info { flex: 1; overflow: hidden; }
.issue-title { 
  font-size: 24rpx; font-weight: 600; color: #FFF; display: block; margin-bottom: 6rpx;
}
.issue-desc { font-size: 20rpx; color: rgba(255,255,255,0.5); display: block; }

// ========== 快捷命令 ==========
.quick-section { padding: 32rpx; }
.quick-grid { display: flex; flex-wrap: wrap; margin-top: 16rpx; }
.quick-item {
  width: 25%; display: flex; flex-direction: column; align-items: center; padding: 20rpx 0;
  &:active .quick-icon-box { background: rgba(0, 244, 163, 0.2); border-color: $primary; }
}

.quick-icon-box {
  width: 80rpx; height: 80rpx;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12rpx; display: flex; align-items: center; justify-content: center;
  margin-bottom: 16rpx; transition: all 0.2s;
}
.quick-icon-text { 
  font-family: 'Fira Code', monospace;
  font-size: 20rpx; color: $primary; font-weight: 800;
}
.quick-label { font-size: 20rpx; color: $text-secondary; letter-spacing: 1rpx; }
</style>

<template>
  <!-- 全新的极客风 - 风险概览 -->
  <view class="risk-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>
    
    <view class="page-header anim-fade-up">
      <view class="scan-line"></view>
      <text class="page-title">【风险防御概览】</text>
      <text class="page-subtitle">// 核心防护节点追踪中 // 天基在线</text>
    </view>

    <!-- 高级排版的卡片流 -->
    <view class="dashboard">
      
      <!-- 主雷达卡片：权限 (占用全宽) -->
      <view class="glass-card main-radar anim-fade-up anim-delay-1" @tap="goDetail(dimensions[0].dimensionType)">
        <view class="radar-header">
          <view class="radar-hud">
            <text class="hud-icon">{{ dimensions[0].icon }}</text>
            <view class="hud-text">
              <text class="hud-title">{{ dimensions[0].label }}</text>
              <text class="hud-desc">{{ dimensions[0].detail }}</text>
            </view>
          </view>
          <view class="risk-tag" :class="'risk-tag--' + dimensions[0].riskLevel">
            {{ riskText(dimensions[0].riskLevel) }}
          </view>
        </view>
        
        <view class="radar-score-area">
          <text class="number-cyber giant-score">{{ dimensions[0].score }}</text>
        </view>
        <view class="circuit-decoration"></view>
      </view>

      <!-- 双列副矩阵 -->
      <view class="grid-layout">
        <view 
          v-for="(d, index) in dimensions.slice(1, 5)" 
          :key="d.dimensionType"
          class="glass-card grid-item anim-fade-up" 
          :class="'anim-delay-' + (index + 2)"
          @tap="goDetail(d.dimensionType)"
        >
          <view class="item-top">
            <text class="item-icon">{{ d.icon }}</text>
            <view class="status-pulse" :class="'pulse-' + d.riskLevel"></view>
          </view>
          
          <view class="number-cyber mid-score">{{ d.score }}</view>
          <view class="risk-tag mini" :class="'risk-tag--' + d.riskLevel" style="margin: 8rpx 0;">
            {{ riskText(d.riskLevel) }}
          </view>

          <text class="item-title">{{ d.label }}</text>
          <text class="item-desc ellipsis-2">{{ d.detail }}</text>
        </view>
      </view>

      <!-- 侦测说明卡片 -->
      <view class="glass-card terminal-card anim-fade-up anim-delay-6">
        <text class="glass-title">统御档案 // 安全容错阈值参数</text>
        <view class="terminal-body">
          <view class="terminal-line">
            <text class="t-key">层级防御阈值（稳态）：</text> 
            <text class="t-val safe">80 - 100</text>
          </view>
          <view class="terminal-line">
            <text class="t-key">破盾前夕阈值（警报）：</text> 
            <text class="t-val warn">60 - 80</text>
          </view>
          <view class="terminal-line">
            <text class="t-key">防线崩溃阈值（致命）：</text> 
            <text class="t-val crit">＜ 60</text>
          </view>
          <view class="cursor-blink"></view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getDemoRiskCategories } from '@/mock/demo.js'

const dimensions = ref([
  { label: '正在接入', detail: '激活底层探针中...', riskLevel: 'safe', score: 0, icon: '📡', dimensionType: 'none' },
  { label: '待激活', detail: '-', riskLevel: 'safe', score: 0, icon: '·', dimensionType: 'none' },
  { label: '待激活', detail: '-', riskLevel: 'safe', score: 0, icon: '·', dimensionType: 'none' },
  { label: '待激活', detail: '-', riskLevel: 'safe', score: 0, icon: '·', dimensionType: 'none' },
  { label: '待激活', detail: '-', riskLevel: 'safe', score: 0, icon: '·', dimensionType: 'none' }
])
const REQUEST_TIMEOUT = 2500

onShow(() => {
  if (!uni.getStorageSync('SYS_JWT_TOKEN')) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  fetchRiskData()
})

const fetchRiskData = () => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/risk/list',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data.categories?.length) {
        dimensions.value = res.data.data.categories || []
      } else {
        dimensions.value = getDemoRiskCategories()
      }
    },
    fail: () => {
      dimensions.value = getDemoRiskCategories()
    }
  })
}

const riskText = (l) => ({ safe: '安全认证', low: '低危提示', medium: '中危警告', high: '高危漏洞' }[l])
const goDetail = (type) => uni.navigateTo({ url: `/pages/risk/${type}` })
</script>

<style lang="scss" scoped>
/* 雷达扫描线动画 */
.scan-line {
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, $primary, transparent);
  animation: scan 3s infinite linear;
  box-shadow: 0 0 20rpx $primary-glow;
}
@keyframes scan {
  0% { transform: translateY(-20rpx); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(160rpx); opacity: 0; }
}

.dashboard {
  padding: 0;
}

/* 主雷达卡片 */
.main-radar {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 280rpx;
  
  .radar-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .radar-hud {
    display: flex;
    .hud-icon {
      font-size: 48rpx;
      margin-right: 24rpx;
      filter: drop-shadow(0 0 10rpx rgba(0, 244, 163, 0.4));
    }
    .hud-title {
      font-size: 32rpx;
      font-weight: 800;
      color: $text-primary;
      display: block;
    }
    .hud-desc {
      font-size: 22rpx;
      color: $text-secondary;
    }
  }

  .radar-score-area {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
  
  .giant-score {
    font-size: 140rpx;
    line-height: 1;
    letter-spacing: -4rpx;
    margin-right: -10rpx;
    margin-bottom: -20rpx;
  }

  // 赛博纹路
  .circuit-decoration {
    position: absolute;
    bottom: 20rpx; left: 20rpx;
    width: 100rpx; height: 40rpx;
    background-image: radial-gradient($primary-glow 2px, transparent 2px);
    background-size: 10rpx 10rpx;
    opacity: 0.3;
  }
}

/* 矩阵网格排版 */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-md;
}

.grid-item {
  margin: 0 !important; // 覆盖 glass-card 的 margin
  padding: $spacing-md;
  display: flex;
  flex-direction: column;

  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
  }

  .item-icon {
    font-size: 40rpx;
  }

  .mid-score {
    font-size: 64rpx;
    line-height: 1;
    margin-bottom: 8rpx;
  }

  .item-title {
    font-size: 24rpx;
    font-weight: 700;
    color: $text-primary;
    margin-top: auto;
  }

  .item-desc {
    font-size: 20rpx;
    color: $text-secondary;
    margin-top: 4rpx;
  }
}

// 指示灯
.status-pulse {
  width: 12rpx; height: 12rpx; border-radius: 50%;
  animation: lightPulse 2s infinite;
}
.pulse-high { background: $danger; box-shadow: 0 0 10rpx $danger; }
.pulse-medium { background: $warning; box-shadow: 0 0 10rpx $warning; }
.pulse-low { background: $primary; box-shadow: 0 0 10rpx $primary; }
.pulse-safe { background: $success; box-shadow: 0 0 10rpx $success; }

@keyframes lightPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* 终端风格说明卡 */
.terminal-card {
  font-family: "Fira Code", monospace, sans-serif;
  
  .terminal-body {
    background: rgba(0, 0, 0, 0.3);
    padding: 20rpx;
    border-radius: $radius-sm;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .terminal-line {
    display: flex;
    justify-content: space-between;
    font-size: 20rpx;
    margin-bottom: 8rpx;
  }

  .t-key { color: $text-secondary; }
  .safe { color: $success; text-shadow: 0 0 8rpx $success-light; }
  .warn { color: $warning; text-shadow: 0 0 8rpx $warning-light; }
  .crit { color: $danger; text-shadow: 0 0 8rpx $danger-light; }

  .cursor-blink {
    width: 12rpx; height: 24rpx;
    background: $primary;
    display: inline-block;
    animation: blink 1s step-end infinite;
    margin-top: 10rpx;
  }
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>

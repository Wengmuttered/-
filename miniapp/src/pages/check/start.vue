<template>
  <!-- 极客扫描引擎面板（一键体检发起页） -->
  <view class="check-start-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>
    
    <!-- 核心雷达脉冲区 -->
    <view class="shield-section anim-scale-in">
      <view class="shield-outer" :class="{ 'shield-scanning': isScanning }">
        <view class="shield-inner">
          <text class="shield-icon">安全</text>
        </view>
        <view class="shield-pulse shield-pulse--1"></view>
        <view class="shield-pulse shield-pulse--2"></view>
        <view class="shield-pulse shield-pulse--3"></view>
      </view>
    </view>

    <!-- 说明与状态文字 -->
    <view class="info-section anim-fade-up anim-delay-1" v-if="!isScanning">
      <text class="info-title">隐私深度体检</text>
      <text class="info-desc">请求授权启动深度隐私探针，覆盖 5 项系统维度</text>
    </view>

    <!-- 扫描中控制台 -->
    <view class="scanning-section anim-fade-in" v-if="isScanning">
      <text class="scanning-title">体检状态：{{ scanningText }}</text>
      <view class="scanning-progress glass-card" style="padding: 4rpx; margin: 0;">
        <view class="scanning-bar" :style="{ width: scanProgress + '%' }"></view>
      </view>
      <text class="number-cyber scanning-percent">{{ scanProgress }}%</text>
    </view>

    <!-- 检测范围矩阵列表 -->
    <view class="scope-section anim-fade-up anim-delay-2" v-if="!isScanning">
      <view class="glass-card scope-item" v-for="(item, index) in scopes" :key="index">
        <view class="scope-left">
          <text class="scope-icon">{{ item.icon }}</text>
          <view class="scope-info">
            <text class="scope-title">{{ item.title }}</text>
            <text class="scope-desc">{{ item.desc }}</text>
          </view>
        </view>
        <view class="scope-status">待检</view>
      </view>
    </view>

    <!-- 操作启动区 -->
    <view class="action-section">
      <button class="btn-cyber start-btn" :class="{ 'btn-disabled': isScanning }"
              @tap="startCheck" :disabled="isScanning">
        {{ isScanning ? '体检中...' : '开始体检' }}
      </button>
      <text class="privacy-note" v-if="!isScanning">体检过程仅用于本次分析演示，重点展示风险识别与结果解读</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { saveDemoCheckResult } from '@/mock/demo.js'

const isScanning = ref(false)
const scanProgress = ref(0)
const scanningText = ref('正在初始化体检引擎...')
const CHECK_START_TIMEOUT = 2500
const MIN_SCAN_DURATION = 2200
const MAX_SCAN_DURATION = 4800

let scanTimer = null
let finishTimer = null
let scanStartedAt = 0
let scanSettled = false

const scopes = ref([
  { icon: '权限', title: '权限风险检测', desc: '探测应用越权记录与隐蔽后台行为' },
  { icon: '账号', title: '账号安全分析', desc: '匹配弱口令、撞库与重放攻击风险' },
  { icon: '图片', title: '隐私暴露排查', desc: '深度扫描图库与剪贴板泄漏痕迹' },
  { icon: '链接', title: '链接诈骗识别', desc: '识别重定向劫持与钓鱼域名风险' },
  { icon: '协议', title: '协议条款解读', desc: '分析隐私协议中的敏感授权与霸王条款' }
])

const scanTexts = [
  '正在加载本地分析环境...', 
  '正在核查应用权限调用...', 
  '正在分析潜在隐私痕迹...', 
  '正在识别链接与跳转风险...', 
  '正在解读隐私协议内容...', 
  '正在生成体检报告...'
]

const clearTimers = () => {
  if (scanTimer) {
    clearInterval(scanTimer)
    scanTimer = null
  }
  if (finishTimer) {
    clearTimeout(finishTimer)
    finishTimer = null
  }
}

const completeScan = () => {
  if (scanSettled) return
  scanSettled = true
  clearTimers()
  saveDemoCheckResult()
  scanProgress.value = 100
  scanningText.value = '体检报告生成完成'
  setTimeout(() => {
    isScanning.value = false
    uni.navigateTo({ url: '/pages/check/result' })
  }, 400)
}

const scheduleComplete = () => {
  if (scanSettled) return
  const elapsed = Date.now() - scanStartedAt
  const delay = Math.max(0, MIN_SCAN_DURATION - elapsed)
  clearTimeout(finishTimer)
  finishTimer = setTimeout(() => {
    completeScan()
  }, delay)
}

const startProgressAnimation = () => {
  clearInterval(scanTimer)
  scanTimer = setInterval(() => {
    const increment = Math.floor(Math.random() * 8) + 4
    scanProgress.value = Math.min(scanProgress.value + increment, 96)
    const index = Math.min(
      Math.floor((scanProgress.value / 100) * scanTexts.length),
      scanTexts.length - 1
    )
    scanningText.value = scanTexts[index]
  }, 180)
}

const startCheck = () => {
  if (isScanning.value) return
  isScanning.value = true
  scanSettled = false
  scanProgress.value = 0
  scanningText.value = '正在初始化体检引擎...'
  scanStartedAt = Date.now()
  startProgressAnimation()
  finishTimer = setTimeout(() => {
    completeScan()
  }, MAX_SCAN_DURATION)

  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''

  uni.request({
    url: __API_BASE__ + '/check/start',
    method: 'POST',
    timeout: CHECK_START_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        scheduleComplete()
      } else {
        scheduleComplete()
      }
    },
    fail: () => {
      scheduleComplete()
    }
  })
}

onUnmounted(() => {
  clearTimers()
})
</script>

<style lang="scss" scoped>
.check-start-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx; // 往下推移避开顶部
}

// ========== 极光扫描引擎 ==========
.shield-section {
  position: relative; z-index: 2;
  margin-top: 60rpx; margin-bottom: 60rpx;
}

.shield-outer {
  width: 320rpx; height: 320rpx;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}

.shield-inner {
  width: 180rpx; height: 180rpx;
  background: radial-gradient(circle, rgba(0,244,163,0.1) 0%, rgba(15,23,42,0.8) 100%);
  border: 1px solid $primary;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 60rpx inset rgba(0, 244, 163, 0.2), 0 0 40rpx rgba(0,0,0,0.8);
  z-index: 2;
}

.shield-icon { 
  font-family: 'Fira Code', monospace;
  font-size: 32rpx; font-weight: 800; color: $primary; 
  letter-spacing: 2rpx;
  text-shadow: 0 0 20rpx $primary;
}

.shield-pulse {
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 2rpx solid $primary;
  opacity: 0;
}

.shield-scanning .shield-pulse {
  animation: pulseWave 1.5s ease-out infinite;
  &--1 { animation-delay: 0s; }
  &--2 { animation-delay: 0.5s; }
  &--3 { animation-delay: 1.0s; }
  
  .shield-inner {
    animation: rotateInner 4s linear infinite;
  }
}

@keyframes pulseWave {
  0% { transform: scale(0.6); opacity: 1; box-shadow: 0 0 20rpx inset $primary; }
  100% { transform: scale(1.6); opacity: 0; border-width: 10rpx; }
}

@keyframes rotateInner {
  0% { transform: rotate(0deg); box-shadow: 0 0 20rpx inset $primary; }
  50% { box-shadow: 0 0 80rpx inset $primary; }
  100% { transform: rotate(360deg); box-shadow: 0 0 20rpx inset $primary; }
}

// ========== 状态控制台 ==========
.info-section {
  text-align: center; padding: 0 60rpx; z-index: 2;
}
.info-title { 
  font-family: 'SF Pro Display', sans-serif;
  font-size: 40rpx; font-weight: 800; color: $text-primary; 
  display: block; margin-bottom: 12rpx; letter-spacing: 4rpx;
}
.info-desc { 
  font-family: 'Fira Code', monospace;
  font-size: 20rpx; color: $text-secondary; display: block; 
}

.scanning-section {
  text-align: center; z-index: 2; padding: 0 60rpx; width: 100%; box-sizing: border-box;
}
.scanning-title { 
  font-family: 'Fira Code', monospace;
  font-size: 24rpx; color: $primary; display: block; margin-bottom: 24rpx; font-weight: 600; 
  text-align: left;
}
.scanning-progress {
  width: 100%; height: 24rpx;
  background: rgba(0,0,0,0.5) !important;
  border-radius: 4rpx !important; overflow: hidden;
}
.scanning-bar {
  height: 100%; 
  background: linear-gradient(90deg, transparent 0%, $primary 100%);
  border-radius: 2rpx; transition: width 0.3s ease;
  position: relative;
  &::after {
    content: ''; position: absolute; right: 0; top: -5rpx; bottom: -5rpx; width: 4rpx;
    background: #FFF; box-shadow: 0 0 10rpx #FFF;
  }
}
.scanning-percent { 
  font-size: 40rpx; color: $primary; margin-top: 16rpx; display: block; text-align: right;
}

// ========== 检测范围矩阵 ==========
.scope-section {
  width: 100%; padding: 40rpx 40rpx 0; z-index: 2; margin-top: 20rpx;
}

.scope-item {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20rpx !important; padding: 24rpx !important;
}

.scope-left { display: flex; align-items: center; }

.scope-icon {
  width: 60rpx; height: 60rpx; border-radius: 8rpx;
  background: rgba(0,244,163,0.1); border: 1px solid rgba(0,244,163,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Fira Code', monospace; font-size: 16rpx; color: $primary; font-weight: 800;
  margin-right: 24rpx; flex-shrink: 0;
}

.scope-info { flex: 1; }
.scope-title { 
  font-family: 'Fira Code', monospace;
  font-size: 24rpx; font-weight: 700; color: $text-primary; display: block; 
}
.scope-desc { font-size: 20rpx; color: $text-secondary; display: block; margin-top: 4rpx; }

.scope-status {
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: rgba(255,255,255,0.3);
}

// ========== 终端命令按钮 ==========
.action-section {
  width: 100%; padding: 40rpx 48rpx; z-index: 2; margin-top: auto;
}

.start-btn { width: 100%; }
.btn-disabled { opacity: 0.5; border-color: $text-secondary; color: $text-secondary; box-shadow: none; }

.privacy-note {
  display: block; text-align: center;
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: $text-placeholder;
  margin-top: 32rpx;
}
</style>

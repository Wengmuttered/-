<template>
  <!-- 体检结果页 -->
  <view class="result-page">
    <!-- 评分头部 -->
    <view class="result-header">
      <view class="result-score-ring anim-scale-in">
        <view class="ring-track"></view>
        <view class="ring-progress" :style="ringStyle"></view>
        <view class="ring-inner">
          <text class="ring-value">{{ check.totalScore }}</text>
          <text class="ring-label">综合评分</text>
        </view>
      </view>
      <view class="result-summary anim-fade-up anim-delay-1">
        <view class="risk-tag" :class="'risk-tag--' + check.riskLevel">{{ riskText }}</view>
        <text class="summary-text">{{ check.summary }}</text>
      </view>
    </view>

    <!-- 五维评分卡 -->
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">五维评分</view>
      <view class="dim-grid">
        <view class="dim-card" v-for="d in dimensions" :key="d.dimensionType"
              @tap="goDetail(d.dimensionType)">
          <text class="dim-icon">{{ d.icon }}</text>
          <text class="dim-score" :style="{ color: getColor(d.score) }">{{ d.score }}</text>
          <text class="dim-label">{{ d.label }}</text>
          <view class="dim-bar">
            <view class="dim-fill" :style="{ width: d.score + '%', background: getColor(d.score) }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 问题清单 -->
    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">风险问题清单（{{ issues.length }} 项）</view>
      <view class="issue-item" v-for="issue in issues" :key="issue.id">
        <view class="issue-priority">
          <view class="priority-dot" :class="'dot--' + issue.riskLevel"></view>
        </view>
        <view class="issue-body">
          <view class="issue-header">
            <text class="issue-title">{{ issue.title }}</text>
            <view class="risk-tag mini" :class="'risk-tag--' + issue.riskLevel">
              {{ { high: '高危', medium: '中危', low: '低危' }[issue.riskLevel] }}
            </view>
          </view>
          <text class="issue-desc">{{ issue.description }}</text>
          <view class="issue-suggestion">
            <text class="suggestion-label">💡 建议：</text>
            <text class="suggestion-text">{{ issue.suggestion }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions anim-fade-up anim-delay-4">
      <button class="btn-primary" @tap="recheck">重新体检</button>
      <button class="btn-outline" style="margin-top: 16rpx;" @tap="goHistory">查看历史</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoCheckResult } from '@/mock/demo.js'

const check = ref({ totalScore: 0, riskLevel: 'safe', summary: '系统计算中...' })
const dimensions = ref([])
const issues = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  fetchResult()
})

const applyPayload = (payload) => {
  if (!payload) return
  check.value = payload.check
  dimensions.value = payload.dimensions || []
  issues.value = payload.issues || []
}

const applyDemoResult = () => {
  applyPayload(getDemoCheckResult())
}

const fetchResult = () => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/check/result',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        applyPayload(res.data.data)
      } else {
        applyDemoResult()
      }
    },
    fail: () => {
      applyDemoResult()
    }
  })
}

const riskText = computed(() => ({ safe: '安全', low: '低风险', medium: '中风险', high: '高风险' }[check.value.riskLevel]))

const ringStyle = computed(() => {
  const deg = (check.value.totalScore / 100) * 270
  const c = getColor(check.value.totalScore)
  return { background: `conic-gradient(${c} ${deg}deg, transparent ${deg}deg)` }
})

const getColor = (s) => s >= 80 ? '#059669' : s >= 60 ? '#F59E0B' : s >= 40 ? '#F97316' : '#EF4444'

const goDetail = (type) => uni.navigateTo({ url: `/pages/risk/${type}` })
const recheck = () => uni.navigateTo({ url: '/pages/check/start' })
const goHistory = () => uni.navigateTo({ url: '/pages/check/history' })
</script>

<style lang="scss" scoped>
.result-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }

.result-header {
  background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%);
  padding: 60rpx 32rpx 48rpx; text-align: center;
  border-radius: 0 0 48rpx 48rpx;
}

.result-score-ring {
  width: 240rpx; height: 240rpx; margin: 0 auto 24rpx; position: relative;
}
.ring-track {
  position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(rgba(255,255,255,0.1) 270deg, transparent 270deg);
  mask: radial-gradient(transparent 55%, #000 56%); -webkit-mask: radial-gradient(transparent 55%, #000 56%);
}
.ring-progress {
  position: absolute; inset: 0; border-radius: 50%;
  mask: radial-gradient(transparent 55%, #000 56%); -webkit-mask: radial-gradient(transparent 55%, #000 56%);
  transform: rotate(-135deg);
}
.ring-inner {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.ring-value { font-size: 72rpx; font-weight: 800; color: #FFF; line-height: 1; }
.ring-label { font-size: 22rpx; color: rgba(255,255,255,0.6); margin-top: 4rpx; }

.result-summary { margin-top: 16rpx; }
.summary-text { font-size: 24rpx; color: rgba(255,255,255,0.7); display: block; margin-top: 12rpx; padding: 0 32rpx; }

.dim-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.dim-card {
  width: calc(50% - 8rpx); background: $gray-50; border-radius: $radius-md;
  padding: 20rpx; display: flex; flex-direction: column; align-items: center;
  &:active { opacity: 0.7; }
}
.dim-icon { font-size: 36rpx; margin-bottom: 8rpx; }
.dim-score { font-size: 36rpx; font-weight: 800; }
.dim-label { font-size: 22rpx; color: $text-secondary; margin: 4rpx 0 12rpx; }
.dim-bar { width: 100%; height: 8rpx; background: $gray-200; border-radius: $radius-full; overflow: hidden; }
.dim-fill { height: 100%; border-radius: $radius-full; transition: width 1s ease; }

.issue-item {
  display: flex; padding: 24rpx 0;
  border-bottom: 1rpx solid $gray-100;
  &:last-child { border-bottom: none; }
}
.issue-priority { margin-right: 16rpx; padding-top: 8rpx; }
.priority-dot {
  width: 16rpx; height: 16rpx; border-radius: 50%;
  &.dot--high { background: $danger; }
  &.dot--medium { background: $warning; }
  &.dot--low { background: $primary-light; }
}
.issue-body { flex: 1; }
.issue-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx; }
.issue-title { font-size: 28rpx; font-weight: 600; color: $text-primary; flex: 1; margin-right: 12rpx; }
.mini { font-size: 18rpx !important; padding: 2rpx 10rpx !important; }
.issue-desc { font-size: 24rpx; color: $text-secondary; line-height: 1.5; display: block; }
.issue-suggestion {
  margin-top: 12rpx; background: $primary-bg; border-radius: $radius-sm;
  padding: 12rpx 16rpx;
}
.suggestion-label { font-size: 22rpx; color: $primary; font-weight: 600; }
.suggestion-text { font-size: 22rpx; color: $primary-dark; }

.bottom-actions { padding: 24rpx 32rpx; }
</style>

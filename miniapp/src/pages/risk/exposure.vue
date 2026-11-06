<template>
  <!-- 隐私暴露详情页 -->
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-score" style="color: #059669;">85</text>
      <text class="detail-label">隐私暴露评分</text>
      <view class="risk-tag risk-tag--low">低风险</view>
    </view>
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">暴露分析摘要</view>
      <text class="summary-text">近期未发现明显的隐私信息暴露，但建议定期检查您的截图和社交媒体分享内容。</text>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">常见风险场景</view>
      <view class="scene-item" v-for="(s, i) in scenes" :key="i">
        <text class="scene-icon">{{ s.icon }}</text>
        <view class="scene-info">
          <text class="scene-title">{{ s.title }}</text>
          <text class="scene-desc">{{ s.desc }}</text>
        </view>
      </view>
    </view>
    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">防护建议</view>
      <view class="tip-item" v-for="(t, i) in tips" :key="i">
        <text class="tip-num">{{ i + 1 }}</text>
        <text class="tip-text">{{ t }}</text>
      </view>
    </view>
    <view style="padding: 24rpx 32rpx;">
      <button class="btn-primary" @tap="goDetect">去识别截图风险</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoExposureData } from '@/mock/demo.js'

const scenes = ref([])
const tips = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/risk/detail/exposure',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data.scenes?.length) {
        scenes.value = res.data.data.scenes
        tips.value = res.data.data.tips
      } else {
        const demo = getDemoExposureData()
        scenes.value = demo.scenes
        tips.value = demo.tips
      }
    },
    fail: () => {
      const demo = getDemoExposureData()
      scenes.value = demo.scenes
      tips.value = demo.tips
    }
  })
})

const goDetect = () => uni.navigateTo({ url: '/pages/detect/image' })
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.detail-header { text-align: center; padding: 48rpx 32rpx 40rpx; background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%); border-radius: 0 0 48rpx 48rpx; }
.detail-score { font-size: 72rpx; font-weight: 800; display: block; }
.detail-label { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin: 4rpx 0 12rpx; }
.summary-text { font-size: 26rpx; color: $text-secondary; line-height: 1.6; }

.scene-item { display: flex; padding: 16rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } }
.scene-icon { font-size: 36rpx; margin-right: 16rpx; }
.scene-info { flex: 1; }
.scene-title { font-size: 26rpx; font-weight: 600; color: $text-primary; display: block; }
.scene-desc { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 4rpx; }

.tip-item { display: flex; align-items: flex-start; padding: 12rpx 0; }
.tip-num { width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center; background: $primary-bg; color: $primary; border-radius: 50%; font-size: 22rpx; font-weight: 700; margin-right: 12rpx; flex-shrink: 0; }
.tip-text { font-size: 24rpx; color: $text-secondary; line-height: 1.5; flex: 1; }
</style>

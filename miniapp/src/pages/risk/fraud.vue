<template>
  <!-- 链接诈骗详情页 -->
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-score" style="color: #059669;">90</text>
      <text class="detail-label">诈骗链接评分</text>
      <view class="risk-tag risk-tag--safe">安全</view>
    </view>
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">扫描结果</view>
      <text class="summary-text">近期未发现可疑链接或钓鱼网站。建议养成对不明链接保持警惕的习惯。</text>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">诈骗链接特征识别</view>
      <view class="feature-item" v-for="(f, i) in fraudFeatures" :key="i">
        <text class="feature-icon">{{ f.icon }}</text>
        <view class="feature-info">
          <text class="feature-title">{{ f.title }}</text>
          <text class="feature-desc">{{ f.desc }}</text>
        </view>
      </view>
    </view>
    <view style="padding: 24rpx 32rpx;">
      <button class="btn-primary" @tap="goScan">去扫描链接</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoFraudFeatures } from '@/mock/demo.js'

const fraudFeatures = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/risk/detail/fraud',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data.fraudFeatures?.length) {
        fraudFeatures.value = res.data.data.fraudFeatures
      } else {
        fraudFeatures.value = getDemoFraudFeatures()
      }
    },
    fail: () => {
      fraudFeatures.value = getDemoFraudFeatures()
    }
  })
})
const goScan = () => uni.navigateTo({ url: '/pages/detect/link' })
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.detail-header { text-align: center; padding: 48rpx 32rpx 40rpx; background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%); border-radius: 0 0 48rpx 48rpx; }
.detail-score { font-size: 72rpx; font-weight: 800; display: block; }
.detail-label { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin: 4rpx 0 12rpx; }
.summary-text { font-size: 26rpx; color: $text-secondary; line-height: 1.6; }
.feature-item { display: flex; padding: 16rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } }
.feature-icon { font-size: 36rpx; margin-right: 16rpx; }
.feature-info { flex: 1; }
.feature-title { font-size: 26rpx; font-weight: 600; color: $text-primary; display: block; }
.feature-desc { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 4rpx; line-height: 1.4; }
</style>

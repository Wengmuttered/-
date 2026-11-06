<template>
  <!-- 政策风险详情页 -->
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-score" style="color: #F59E0B;">60</text>
      <text class="detail-label">政策风险评分</text>
      <view class="risk-tag risk-tag--medium">中风险</view>
    </view>
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">政策风险摘要</view>
      <text class="summary-text">检测到 2 个常用应用的隐私政策存在过度采集嫌疑，建议通过隐私解读功能详细了解。</text>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">风险应用列表</view>
      <view class="policy-item" v-for="(p, i) in riskApps" :key="i" @tap="goInterpret(p.name)">
        <view class="policy-left">
          <text class="policy-icon">{{ p.icon }}</text>
          <view class="policy-info">
            <text class="policy-name">{{ p.name }}</text>
            <text class="policy-issue">{{ p.issue }}</text>
          </view>
        </view>
        <view class="risk-tag mini risk-tag--medium">查看解读</view>
      </view>
    </view>
    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">防护建议</view>
      <view class="advice-list">
        <text class="advice-text">📌 定期检查应用权限设置，关闭不必要的数据采集</text>
        <text class="advice-text">📌 在应用设置中关闭"个性化推荐"和"数据共享"</text>
        <text class="advice-text">📌 对重要应用，详细阅读其隐私政策的数据采集和共享条款</text>
        <text class="advice-text">📌 使用隐私解读功能快速了解应用的隐私风险</text>
      </view>
    </view>
    <view style="padding: 24rpx 32rpx;">
      <button class="btn-primary" @tap="goInterpretPage">去解读隐私政策</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createDemoInterpretTask, getDemoPolicyRiskApps } from '@/mock/demo.js'

const riskApps = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/risk/detail/policy',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data.riskApps?.length) {
        riskApps.value = res.data.data.riskApps
      } else {
        riskApps.value = getDemoPolicyRiskApps()
      }
    },
    fail: () => {
      riskApps.value = getDemoPolicyRiskApps()
    }
  })
})
const goInterpret = (name) => {
  const taskId = createDemoInterpretTask(name, 'name')
  uni.navigateTo({ url: '/pages/interpret/result?taskId=' + taskId })
}
const goInterpretPage = () => uni.switchTab({ url: '/pages/interpret/input' })
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.detail-header { text-align: center; padding: 48rpx 32rpx 40rpx; background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%); border-radius: 0 0 48rpx 48rpx; }
.detail-score { font-size: 72rpx; font-weight: 800; display: block; }
.detail-label { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin: 4rpx 0 12rpx; }
.summary-text { font-size: 26rpx; color: $text-secondary; line-height: 1.6; }

.policy-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } &:active { opacity: 0.7; } }
.policy-left { display: flex; align-items: center; flex: 1; }
.policy-icon { font-size: 40rpx; margin-right: 16rpx; }
.policy-info { flex: 1; }
.policy-name { font-size: 28rpx; font-weight: 600; color: $text-primary; display: block; }
.policy-issue { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 4rpx; }
.mini { font-size: 18rpx !important; padding: 2rpx 10rpx !important; }
.advice-list { margin-top: 4rpx; }
.advice-text { font-size: 24rpx; color: $text-secondary; line-height: 1.6; display: block; margin-bottom: 8rpx; }
</style>

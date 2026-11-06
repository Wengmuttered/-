<template>
  <!-- 权限风险详情页 -->
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-score" :style="{ color: getColor(65) }">65</text>
      <text class="detail-label">权限风险评分</text>
      <view class="risk-tag risk-tag--medium">中风险</view>
    </view>

    <view class="card">
      <view class="card-title">权限风险项（{{ permissions.length }} 项）</view>
      <view class="perm-item" v-for="(p, i) in permissions" :key="i">
        <view class="perm-left">
          <text class="perm-app">{{ p.appName }}</text>
          <text class="perm-name">{{ p.permission }}</text>
        </view>
        <view class="perm-right">
          <view class="risk-tag mini" :class="'risk-tag--' + p.riskLevel">
            {{ { safe: '安全', low: '低危', medium: '中危', high: '高危' }[p.riskLevel] }}
          </view>
        </view>
      </view>
    </view>

    <view class="card" v-for="p in permissions" :key="p.appName + p.permission">
      <view class="advice-header">
        <text class="advice-app">{{ p.appName }} · {{ p.permission }}</text>
        <view class="risk-tag mini" :class="'risk-tag--' + p.riskLevel">
          {{ { safe: '安全', low: '低危', medium: '中危', high: '高危' }[p.riskLevel] }}
        </view>
      </view>
      <text class="advice-reason">📌 {{ p.reason }}</text>
      <text class="advice-suggestion">💡 {{ p.suggestion }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoPermissionRisks } from '@/mock/demo.js'

const permissions = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/risk/detail/permission',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data.permissions?.length) {
        permissions.value = res.data.data.permissions
      } else {
        permissions.value = getDemoPermissionRisks()
      }
    },
    fail: () => {
      permissions.value = getDemoPermissionRisks()
    }
  })
})
const getColor = (s) => s >= 80 ? '#059669' : s >= 60 ? '#F59E0B' : '#EF4444'
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.detail-header {
  text-align: center; padding: 48rpx 32rpx 40rpx;
  background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%);
  border-radius: 0 0 48rpx 48rpx;
}
.detail-score { font-size: 72rpx; font-weight: 800; display: block; }
.detail-label { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin: 4rpx 0 12rpx; }

.perm-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20rpx 0; border-bottom: 1rpx solid $gray-100;
  &:last-child { border-bottom: none; }
}
.perm-left { display: flex; align-items: center; }
.perm-app { font-size: 26rpx; font-weight: 600; color: $text-primary; margin-right: 12rpx; }
.perm-name { font-size: 24rpx; color: $text-secondary; }
.mini { font-size: 18rpx !important; padding: 2rpx 10rpx !important; }

.advice-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12rpx; }
.advice-app { font-size: 26rpx; font-weight: 600; color: $text-primary; }
.advice-reason { font-size: 24rpx; color: $text-secondary; display: block; margin-bottom: 8rpx; line-height: 1.5; }
.advice-suggestion { font-size: 24rpx; color: $primary; display: block; line-height: 1.5; background: $primary-bg; padding: 12rpx 16rpx; border-radius: $radius-sm; }
</style>

<template>
  <!-- 操作记录页 -->
  <view class="records-page">
    <view class="timeline">
      <view class="timeline-item anim-fade-up" :class="'anim-delay-' + (index + 1)"
            v-for="(r, index) in records" :key="index">
        <view class="timeline-dot"></view>
        <view class="timeline-line" v-if="index < records.length - 1"></view>
        <view class="timeline-card">
          <view class="record-header">
            <text class="record-icon">{{ r.icon }}</text>
            <text class="record-title">{{ r.title }}</text>
            <text class="record-time">{{ formatTime(r.time) }}</text>
          </view>
          <text class="record-detail">{{ r.detail }}</text>
        </view>
      </view>
    </view>

    <view v-if="records.length === 0" class="empty-state">
      <text class="empty-state__icon">📋</text>
      <text class="empty-state__text">暂无操作记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoOperationRecords } from '@/mock/demo.js'

const records = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/records/list',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        records.value = res.data.data
      } else {
        records.value = getDemoOperationRecords()
      }
    },
    fail: () => {
      records.value = getDemoOperationRecords()
    }
  })
})

const formatTime = (t) => {
  if (!t) return ''
  return t.slice(5)
}
</script>

<style lang="scss" scoped>
.records-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }

.timeline { padding: 24rpx 24rpx 24rpx 48rpx; }

.timeline-item {
  position: relative; padding-left: 32rpx; padding-bottom: 24rpx;
}

.timeline-dot {
  position: absolute; left: -12rpx; top: 24rpx;
  width: 20rpx; height: 20rpx; border-radius: 50%;
  background: $primary; border: 4rpx solid $primary-bg;
  z-index: 1;
}

.timeline-line {
  position: absolute; left: -4rpx; top: 48rpx; bottom: 0;
  width: 4rpx; background: $gray-200;
}

.timeline-card {
  background: $bg-card; border-radius: $radius-lg;
  padding: 24rpx; box-shadow: $shadow-sm;
}

.record-header {
  display: flex; align-items: center; margin-bottom: 8rpx;
}
.record-icon { font-size: 28rpx; margin-right: 8rpx; }
.record-title { font-size: 26rpx; font-weight: 600; color: $text-primary; flex: 1; }
.record-time { font-size: 22rpx; color: $text-placeholder; }
.record-detail { font-size: 24rpx; color: $text-secondary; }
</style>

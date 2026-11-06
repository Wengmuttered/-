<template>
  <!-- 体检历史页 -->
  <view class="history-page">
    <view class="history-list">
      <view class="history-item anim-fade-up" :class="'anim-delay-' + (index + 1)"
            v-for="(item, index) in history" :key="item.id" @tap="goResult(item.id)">
        <view class="history-left">
          <view class="history-score-ring" :style="{ borderColor: getColor(item.totalScore) }">
            <text class="history-score" :style="{ color: getColor(item.totalScore) }">{{ item.totalScore }}</text>
          </view>
        </view>
        <view class="history-body">
          <view class="history-header">
            <view class="risk-tag" :class="'risk-tag--' + item.riskLevel">{{ riskText(item.riskLevel) }}</view>
            <text class="history-time">{{ formatTime(item.createdAt) }}</text>
          </view>
          <text class="history-detail">{{ item.summary || '隐私体检完成' }}</text>
        </view>
        <text class="history-arrow">查看</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="loaded && history.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无体检记录</text>
    </view>

    <!-- 底部 -->
    <view class="history-bottom">
      <button class="btn-primary" @tap="goCheck">立即体检</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDemoCheckHistory } from '@/mock/demo.js'

const history = ref([])
const loaded = ref(false)

/** 从后端获取体检历史记录 */
onMounted(() => {
  uni.request({
    url: __API_BASE__ + '/check/history',
    method: 'GET',
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data?.length) {
        history.value = res.data.data || []
      } else {
        history.value = getDemoCheckHistory()
      }
      loaded.value = true
    },
    fail: () => {
      history.value = getDemoCheckHistory()
      loaded.value = true
    }
  })
})

const riskText = (level) => ({ safe: '安全', low: '低风险', medium: '中风险', high: '高风险' }[level] || '未知')
const getColor = (s) => s >= 80 ? '#059669' : s >= 60 ? '#F59E0B' : s >= 40 ? '#F97316' : '#EF4444'
const formatTime = (t) => t ? t.substring(0, 16).replace('T', ' ') : ''

const goResult = (id) => uni.navigateTo({ url: '/pages/check/result?id=' + id })
const goCheck = () => uni.navigateTo({ url: '/pages/check/start' })
</script>

<style lang="scss" scoped>
.history-page { min-height: 100vh; background: $bg-page; padding-bottom: 140rpx; }
.history-list { padding: 16rpx 0; }
.history-item {
  display: flex; align-items: center;
  margin: 12rpx 24rpx; padding: 28rpx 24rpx;
  background: $bg-card; border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  &:active { opacity: 0.8; }
}
.history-left { margin-right: 24rpx; }
.history-score-ring {
  width: 96rpx; height: 96rpx;
  border: 6rpx solid; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.history-score { font-size: 32rpx; font-weight: 800; }
.history-body { flex: 1; }
.history-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8rpx;
}
.history-time { font-size: 22rpx; color: $text-placeholder; }
.history-detail { font-size: 24rpx; color: $text-secondary; }
.history-arrow { font-size: 40rpx; color: $gray-300; margin-left: 8rpx; }
.history-bottom {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 24rpx 48rpx; padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: $bg-card; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.04);
}
.empty-state { text-align: center; padding: 120rpx 0; }
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.empty-text { font-size: 28rpx; color: $text-placeholder; }
</style>

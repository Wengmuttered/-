<template>
  <!-- 消息列表页（TabBar） -->
  <view class="message-page">
    <view class="safe-area-top"></view>
    <view class="page-header">
      <text class="page-title">消息中心</text>
      <text class="page-subtitle">{{ unreadCount }} 条未读消息</text>
    </view>

    <view class="msg-list">
      <view class="msg-item anim-fade-up" :class="['anim-delay-' + (index + 1), { unread: m.status === 0 }]"
            v-for="(m, index) in messages" :key="m.id" @tap="goDetail(m)">
        <view class="msg-icon-wrap" :class="'type--' + m.msgType">
          <text class="msg-icon">{{ typeIcon[m.msgType] || '📩' }}</text>
        </view>
        <view class="msg-body">
          <view class="msg-header">
            <text class="msg-title">{{ m.title }}</text>
            <text class="msg-time">{{ formatTime(m.sendTime) }}</text>
          </view>
          <text class="msg-content ellipsis-2">{{ m.content }}</text>
        </view>
        <view v-if="m.status === 0" class="unread-dot"></view>
      </view>
    </view>

    <view v-if="messages.length === 0" class="empty-state">
      <text class="empty-state__icon">📭</text>
      <text class="empty-state__text">暂无消息</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoMessages, markDemoMessageRead } from '@/mock/demo.js'

const messages = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/messages/list',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        messages.value = res.data.data
      } else {
        messages.value = getDemoMessages()
      }
    },
    fail: () => {
      messages.value = getDemoMessages()
    }
  })
})
const unreadCount = computed(() => messages.value.filter(m => m.status === 0).length)

const typeIcon = { check: '🔍', reminder: '🔔', share: '👨‍👩‍👧', feedback: '💬', system: '⚙️' }

const formatTime = (t) => {
  if (!t) return ''
  const d = t.split(' ')[0]
  const today = new Date().toISOString().split('T')[0]
  return d === today ? t.split(' ')[1] : d.slice(5)
}

const goDetail = (m) => {
  m.status = 1
  markDemoMessageRead(m.id)
  uni.navigateTo({ url: '/pages/message/detail?id=' + m.id })
}
</script>

<style lang="scss" scoped>
.message-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }

.msg-list { padding: 8rpx 0; }

.msg-item {
  display: flex; align-items: flex-start;
  margin: 0 24rpx 12rpx; padding: 24rpx;
  background: $bg-card; border-radius: $radius-lg;
  box-shadow: $shadow-sm; position: relative;
  &.unread { border-left: 6rpx solid $primary; }
  &:active { opacity: 0.8; }
}

.msg-icon-wrap {
  width: 72rpx; height: 72rpx; border-radius: $radius-md;
  display: flex; align-items: center; justify-content: center;
  margin-right: 20rpx; flex-shrink: 0;
  &.type--check { background: #EFF6FF; }
  &.type--reminder { background: #FEF3C7; }
  &.type--share { background: #FDF2F8; }
  &.type--feedback { background: #F0FDF4; }
  &.type--system { background: #F1F5F9; }
}
.msg-icon { font-size: 36rpx; }

.msg-body { flex: 1; overflow: hidden; }
.msg-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx; }
.msg-title { font-size: 28rpx; font-weight: 600; color: $text-primary; }
.msg-time { font-size: 22rpx; color: $text-placeholder; }
.msg-content { font-size: 24rpx; color: $text-secondary; line-height: 1.4; }

.unread-dot {
  position: absolute; top: 20rpx; right: 20rpx;
  width: 16rpx; height: 16rpx; border-radius: 50%; background: $danger;
}
</style>

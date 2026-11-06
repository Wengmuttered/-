<template>
  <!-- 消息详情页 -->
  <view class="detail-page">
    <view v-if="message" class="card anim-fade-up anim-delay-1">
      <view class="msg-header">
        <text class="msg-title">{{ message.title }}</text>
        <text class="msg-time">{{ formatTime(message.createdAt) }}</text>
      </view>
      <view class="msg-body">
        <text class="msg-content">{{ message.content }}</text>
      </view>
      <view class="msg-status">
        <text class="status-badge" :class="message.isRead ? 'read' : 'unread'">
          {{ message.isRead ? '已读' : '未读' }}
        </text>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="!message && !loadError" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <view class="actions">
      <button class="btn-primary" @tap="goBack">返回消息列表</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoMessageDetail } from '@/mock/demo.js'

const messageId = ref(null)
const message = ref(null)
const loadError = ref(false)
const REQUEST_TIMEOUT = 2500

onLoad && onLoad((query) => {
  if (query && query.id) messageId.value = query.id
})

/** 从后端获取消息详情，同时标记为已读 */
onMounted(() => {
  if (!messageId.value) {
    try {
      const params = new URLSearchParams(window?.location?.search || '')
      messageId.value = params.get('id')
    } catch(e) {}
  }

  if (messageId.value) {
    uni.request({
      url: __API_BASE__ + '/messages/detail/' + messageId.value,
      method: 'GET',
      timeout: REQUEST_TIMEOUT,
      success: (res) => {
        if (res.data && res.data.code === 200) {
          message.value = res.data.data
          // 标记为已读
          if (message.value && !message.value.isRead) {
            uni.request({
              url: __API_BASE__ + '/messages/read/' + messageId.value,
              method: 'POST'
            })
          }
        } else {
          message.value = getDemoMessageDetail(messageId.value)
        }
      },
      fail: () => {
        message.value = getDemoMessageDetail(messageId.value)
      }
    })
  }
})

const formatTime = (t) => t ? t.substring(0, 16).replace('T', ' ') : ''
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.msg-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid $gray-100;
}
.msg-title { font-size: 32rpx; font-weight: 700; color: $text-primary; flex: 1; margin-right: 16rpx; }
.msg-time { font-size: 22rpx; color: $text-placeholder; white-space: nowrap; }
.msg-body { margin-bottom: 24rpx; }
.msg-content { font-size: 28rpx; color: $text-secondary; line-height: 1.8; }
.msg-status { }
.status-badge {
  display: inline-block; font-size: 22rpx; padding: 6rpx 20rpx; border-radius: $radius-full;
  &.read { color: $text-placeholder; background: $gray-100; }
  &.unread { color: $primary; background: $primary-bg; font-weight: 600; }
}
.loading-state { text-align: center; padding: 120rpx 0; }
.loading-text { font-size: 28rpx; color: $text-placeholder; }
.actions { padding: 24rpx 32rpx; }
</style>

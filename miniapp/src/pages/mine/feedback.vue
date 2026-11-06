<template>
  <!-- 反馈提交页 -->
  <view class="feedback-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">反馈类型</view>
      <view class="type-grid">
        <view class="type-item" :class="{ active: feedbackType === t.value }"
              v-for="t in feedbackTypes" :key="t.value" @tap="feedbackType = t.value">
          <text class="type-label">{{ t.label }}</text>
        </view>
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">反馈内容</view>
      <textarea class="feedback-textarea" v-model="content"
                placeholder="请详细描述您遇到的问题或建议..."
                :maxlength="2000" />
      <text class="char-count">{{ content.length }} / 2000</text>
    </view>

    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">附件（可选）</view>
      <view class="attach-area" @tap="chooseAttachment">
        <text class="attach-icon">📎</text>
        <text class="attach-text">{{ attachment ? '已选择文件' : '添加截图或文件' }}</text>
      </view>
    </view>

    <view class="action-section anim-fade-up anim-delay-4">
      <button class="btn-primary" @tap="submitFeedback">提交反馈</button>
      <text class="note">我们将在 1-3 个工作日内回复您的反馈</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { mockFeedbackTypes } from '@/mock/modules.js'

const feedbackType = ref('problem')
const content = ref('')
const attachment = ref('')
const feedbackTypes = ref(mockFeedbackTypes)

const chooseAttachment = () => {
  uni.chooseImage({ count: 1, success: (res) => { attachment.value = res.tempFilePaths[0] } })
}

const submitFeedback = () => {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '提交风控引擎...' })
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || '';

  uni.request({
    url: __API_BASE__ + '/feedback/submit',
    method: 'POST',
    header: { 'Authorization': 'Bearer ' + token },
    data: { 
      issueType: feedbackType.value,
      content: content.value
    },
    success: (res) => {
      uni.hideLoading()
      if (res.data && res.data.code === 200) {
        uni.showToast({ title: '上报成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1500)
      } else {
        uni.showToast({ title: '提交遇阻', icon: 'none' })
      }
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '通讯中断', icon: 'none' })
    }
  })
}
</script>

<style lang="scss" scoped>
.feedback-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }

.type-grid { display: flex; gap: 12rpx; flex-wrap: wrap; }
.type-item {
  padding: 16rpx 28rpx; background: $gray-50;
  border-radius: $radius-full; border: 2rpx solid $gray-200;
  &.active { background: $primary-bg; border-color: $primary; }
  &:active { opacity: 0.8; }
}
.type-label { font-size: 26rpx; color: $text-primary; }
.type-item.active .type-label { color: $primary; font-weight: 600; }

.feedback-textarea {
  width: 100%; height: 300rpx; padding: 20rpx;
  background: $gray-50; border-radius: $radius-md; border: 2rpx solid $gray-200;
  font-size: 28rpx; box-sizing: border-box; line-height: 1.6;
}
.char-count { font-size: 22rpx; color: $text-placeholder; text-align: right; display: block; margin-top: 8rpx; }

.attach-area {
  display: flex; align-items: center; justify-content: center;
  padding: 32rpx; background: $gray-50; border-radius: $radius-md;
  border: 2rpx dashed $gray-300;
  &:active { border-color: $primary; }
}
.attach-icon { font-size: 36rpx; margin-right: 12rpx; }
.attach-text { font-size: 26rpx; color: $text-placeholder; }

.action-section { padding: 24rpx 32rpx; }
.note { font-size: 22rpx; color: $text-placeholder; text-align: center; display: block; margin-top: 16rpx; }
</style>

<template>
  <!-- 图片/截图上传页 -->
  <view class="detect-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">上传图片/截图</view>
      <text class="desc">上传含有个人信息的截图，系统将识别其中的敏感信息并给出风险提示。</text>
      <view class="upload-area" @tap="chooseImage">
        <image v-if="imagePath" :src="imagePath" mode="aspectFit" class="preview-img" />
        <view v-else class="upload-placeholder">
          <text class="upload-icon">🖼️</text>
          <text class="upload-text">点击选择图片或拍照</text>
          <text class="upload-hint">支持常见图片格式，大小不超过 10 兆</text>
        </view>
      </view>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">可识别的敏感信息</view>
      <view class="tag-list">
        <view class="info-tag" v-for="t in sensitiveTypes" :key="t">{{ t }}</view>
      </view>
    </view>
    <view class="action-section anim-fade-up anim-delay-3">
      <button class="btn-primary" :disabled="!imagePath || submitting" @tap="submitImage">
        {{ submitting ? '识别中...' : '开始识别' }}
      </button>
      <text class="privacy-note">⚠️ 图片仅用于分析，分析后立即删除，不会保留原图</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { createDemoDetectResult } from '@/mock/demo.js'

const imagePath = ref('')
const submitting = ref(false)
const sensitiveTypes = ref(['身份证号', '手机号', '银行卡号', '家庭住址', '真实姓名', '验证码', '密码', '邮箱'])
const DETECT_TIMEOUT = 2500

const chooseImage = () => {
  uni.chooseImage({ count: 1, success: (res) => { imagePath.value = res.tempFilePaths[0] } })
}

const submitImage = () => {
  if (!imagePath.value) {
    uni.showToast({ title: '请先选择图片', icon: 'none' })
    return
  }

  submitting.value = true
  uni.showLoading({ title: '识别中...' })

  let settled = false
  const finishWithRecord = (record) => {
    if (settled) return
    settled = true
    submitting.value = false
    uni.hideLoading()
    uni.navigateTo({ url: '/pages/detect/result?type=image&id=' + record.id })
  }

  const fallbackToDemo = () => {
    const record = createDemoDetectResult('image', imagePath.value.split('/').pop() || '本地图像')
    finishWithRecord(record)
  }

  const forceFallback = setTimeout(() => {
    fallbackToDemo()
  }, DETECT_TIMEOUT + 300)

  uni.uploadFile({
    url: __API_BASE__ + '/detect/image',
    filePath: imagePath.value,
    name: 'file',
    timeout: DETECT_TIMEOUT,
    success: (uploadRes) => {
      clearTimeout(forceFallback)
      let payload = null
      try {
        payload = typeof uploadRes.data === 'string' ? JSON.parse(uploadRes.data) : uploadRes.data
      } catch (error) {
        payload = null
      }

      if (payload && payload.code === 200 && payload.data?.id) {
        finishWithRecord(payload.data)
      } else {
        fallbackToDemo()
      }
    },
    fail: () => {
      clearTimeout(forceFallback)
      fallbackToDemo()
    }
  })
}
</script>

<style lang="scss" scoped>
.detect-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.desc { font-size: 24rpx; color: $text-secondary; line-height: 1.5; margin-bottom: 24rpx; }
.upload-area {
  width: 100%; min-height: 320rpx; background: $gray-50; border-radius: $radius-md;
  border: 3rpx dashed $gray-300; display: flex; align-items: center; justify-content: center;
  overflow: hidden; &:active { border-color: $primary; }
}
.upload-placeholder { display: flex; flex-direction: column; align-items: center; }
.upload-icon { font-size: 72rpx; margin-bottom: 16rpx; }
.upload-text { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.upload-hint { font-size: 22rpx; color: $text-placeholder; margin-top: 8rpx; }
.preview-img { width: 100%; height: 320rpx; }
.tag-list { display: flex; flex-wrap: wrap; gap: 12rpx; }
.info-tag { font-size: 22rpx; color: $primary; background: $primary-bg; padding: 8rpx 20rpx; border-radius: $radius-full; }
.action-section { padding: 24rpx 32rpx; }
.privacy-note { font-size: 22rpx; color: $text-placeholder; text-align: center; display: block; margin-top: 16rpx; }
</style>

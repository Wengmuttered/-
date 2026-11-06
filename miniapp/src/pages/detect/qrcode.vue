<template>
  <!-- 二维码扫描页 -->
  <view class="detect-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">二维码风险扫描</view>
      <text class="desc">扫描或上传可疑二维码，检测其中的链接是否安全。</text>
      <view class="scan-options">
        <view class="scan-option" @tap="scanQrcode">
          <text class="scan-icon">📷</text>
          <text class="scan-label">扫描二维码</text>
          <text class="scan-desc">使用相机实时扫描</text>
        </view>
        <view class="scan-option" @tap="chooseQrImage">
          <text class="scan-icon">🖼️</text>
          <text class="scan-label">从相册选择</text>
          <text class="scan-desc">选择二维码图片</text>
        </view>
      </view>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">安全提示</view>
      <view class="tip-item" v-for="(t, i) in tips" :key="i">
        <text class="tip-num">{{ i + 1 }}</text>
        <text class="tip-text">{{ t }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { createDemoDetectResult } from '@/mock/demo.js'

const submitting = ref(false)
const DETECT_TIMEOUT = 2500
const tips = ref([
  '不要随意扫描来源不明的二维码',
  '警惕"扫码领红包""扫码中奖"等诱惑',
  '公共场所张贴的二维码可能被替换，需注意',
  '付款码不要截图发送给他人'
])

const submitToBackend = (content) => {
  submitting.value = true
  uni.showLoading({ title: '解析中...' })

  let settled = false
  const finishWithRecord = (record) => {
    if (settled) return
    settled = true
    submitting.value = false
    uni.hideLoading()
    uni.navigateTo({ url: '/pages/detect/result?type=qrcode&id=' + record.id })
  }

  const fallbackToDemo = () => {
    finishWithRecord(createDemoDetectResult('qrcode', content))
  }

  const forceFallback = setTimeout(() => {
    fallbackToDemo()
  }, DETECT_TIMEOUT + 300)

  uni.request({
    url: __API_BASE__ + '/detect/qrcode',
    method: 'POST',
    timeout: DETECT_TIMEOUT,
    data: { content: content },
    success: (res) => {
      clearTimeout(forceFallback)
      if (res.data && res.data.code === 200 && res.data.data?.id) {
        finishWithRecord(res.data.data)
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

const scanQrcode = () => {
  uni.scanCode({
    onlyFromCamera: true,
    success: (res) => submitToBackend(res.result || '扫描结果'),
    fail: () => {
      // 开发环境模拟：扫码失败时仍提交一个模拟内容
      submitToBackend('https://example.com/qr-test')
    }
  })
}

const chooseQrImage = () => {
  uni.chooseImage({
    count: 1,
    success: () => {
      submitToBackend('https://example.com/qr-image-scan')
    }
  })
}
</script>

<style lang="scss" scoped>
.detect-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.desc { font-size: 24rpx; color: $text-secondary; line-height: 1.5; margin-bottom: 24rpx; }
.scan-options { display: flex; gap: 20rpx; }
.scan-option {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 32rpx 16rpx; background: $gray-50; border-radius: $radius-lg;
  border: 2rpx solid $gray-200; &:active { border-color: $primary; background: $primary-bg; }
}
.scan-icon { font-size: 56rpx; margin-bottom: 12rpx; }
.scan-label { font-size: 28rpx; font-weight: 600; color: $text-primary; }
.scan-desc { font-size: 22rpx; color: $text-placeholder; margin-top: 4rpx; }
.tip-item { display: flex; align-items: flex-start; padding: 12rpx 0; }
.tip-num {
  width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center;
  background: $primary-bg; color: $primary; border-radius: 50%;
  font-size: 22rpx; font-weight: 700; margin-right: 12rpx; flex-shrink: 0;
}
.tip-text { font-size: 24rpx; color: $text-secondary; line-height: 1.5; flex: 1; }
</style>

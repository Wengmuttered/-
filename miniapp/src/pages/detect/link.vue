<template>
  <!-- 链接扫描页 -->
  <view class="detect-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">链接风险扫描</view>
      <text class="desc">粘贴可疑链接，快速检测是否为钓鱼网站或诈骗链接。</text>
      <view class="input-wrap">
        <input class="link-input" v-model="linkValue" placeholder="请粘贴可疑链接地址" />
        <view class="paste-btn" @tap="pasteLink">粘贴</view>
      </view>
    </view>
    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">常见风险链接特征</view>
      <view class="tip-item" v-for="(t, i) in tipList" :key="i">
        <text class="tip-icon">{{ t.icon }}</text>
        <text class="tip-text">{{ t.text }}</text>
      </view>
    </view>
    <view class="action-section anim-fade-up anim-delay-3">
      <button class="btn-primary" :disabled="!linkValue || submitting" @tap="submitScan">
        {{ submitting ? '扫描中...' : '开始扫描' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { createDemoDetectResult } from '@/mock/demo.js'

const linkValue = ref('')
const submitting = ref(false)
const DETECT_TIMEOUT = 2500
const tipList = ref([
  { icon: '🔴', text: '域名与官方域名不一致（如冒充支付页面的仿冒域名）' },
  { icon: '🔴', text: '要求输入手机号、身份证号等敏感信息' },
  { icon: '🔴', text: '包含"中奖""免费领取"等诱惑性文字' },
  { icon: '🔴', text: '短链接来源不明，无法判断真实跳转地址' }
])
const pasteLink = () => {
  uni.getClipboardData({ success: (res) => { linkValue.value = res.data || '' } })
}

const submitScan = () => {
  submitting.value = true
  uni.showLoading({ title: '扫描中...' })

  let settled = false
  const finishWithRecord = (record) => {
    if (settled) return
    settled = true
    submitting.value = false
    uni.hideLoading()
    uni.navigateTo({ url: '/pages/detect/result?type=link&id=' + record.id })
  }

  const fallbackToDemo = () => {
    finishWithRecord(createDemoDetectResult('link', linkValue.value))
  }

  const forceFallback = setTimeout(() => {
    fallbackToDemo()
  }, DETECT_TIMEOUT + 300)

  uni.request({
    url: __API_BASE__ + '/detect/link',
    method: 'POST',
    timeout: DETECT_TIMEOUT,
    data: { url: linkValue.value },
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
</script>

<style lang="scss" scoped>
.detect-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.desc { font-size: 24rpx; color: $text-secondary; line-height: 1.5; margin-bottom: 24rpx; }
.input-wrap { display: flex; align-items: center; }
.link-input {
  flex: 1; height: 88rpx; padding: 0 24rpx; background: $gray-50;
  border-radius: $radius-md 0 0 $radius-md; border: 2rpx solid $gray-200;
  border-right: none; font-size: 26rpx; box-sizing: border-box;
}
.paste-btn {
  height: 88rpx; line-height: 88rpx; padding: 0 32rpx;
  background: $primary; color: #FFF; font-size: 26rpx; font-weight: 600;
  border-radius: 0 $radius-md $radius-md 0;
}
.tip-item { display: flex; align-items: flex-start; padding: 12rpx 0; }
.tip-icon { margin-right: 12rpx; }
.tip-text { font-size: 24rpx; color: $text-secondary; line-height: 1.5; flex: 1; }
.action-section { padding: 24rpx 32rpx; }
</style>

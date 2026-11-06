<template>
  <!-- 识别结果页（统一展示图片/链接/二维码扫描结果） -->
  <view class="result-page">
    <view v-if="resultData" class="result-header" :class="'header--' + resultData.riskLevel">
      <text class="result-icon">{{ resultData.riskLevel === 'high' ? '🚨' : resultData.riskLevel === 'medium' ? '⚠️' : '✅' }}</text>
      <view class="risk-tag" :class="'risk-tag--' + resultData.riskLevel" style="margin-top:12rpx;">
        {{ { safe: '安全', low: '低风险', medium: '中等风险', high: '高风险' }[resultData.riskLevel] }}
      </view>
    </view>

    <!-- 图片识别结果 -->
    <view v-if="type === 'image' && resultData && resultData.sensitiveTags" class="card anim-fade-up anim-delay-1">
      <view class="card-title">🏷️ 检测到的敏感信息</view>
      <view class="tag-list">
        <view class="sensitive-tag" v-for="t in parseTags(resultData.sensitiveTags)" :key="t">{{ t }}</view>
      </view>
    </view>

    <!-- 链接扫描结果 -->
    <view v-if="(type === 'link' || type === 'qrcode') && resultData" class="card anim-fade-up anim-delay-1">
      <view class="card-title">🔗 链接信息</view>
      <text class="link-text">{{ resultData.inputContent }}</text>
    </view>

    <view v-if="resultData" class="card anim-fade-up anim-delay-2">
      <view class="card-title">📋 分析说明</view>
      <text class="section-text">{{ resultData.explanation || resultData.resultSummary }}</text>
    </view>

    <view v-if="resultData && resultData.riskReason" class="card anim-fade-up anim-delay-3">
      <view class="card-title">⚠️ 风险原因</view>
      <text class="section-text warning-text" style="white-space: pre-wrap;">{{ resultData.riskReason }}</text>
    </view>

    <view v-if="resultData" class="card anim-fade-up anim-delay-4">
      <view class="card-title">💡 处理建议</view>
      <text class="section-text" style="white-space: pre-wrap;">{{ resultData.suggestion }}</text>
    </view>

    <!-- 加载中 -->
    <view v-if="!resultData && !loadError" class="loading-state">
      <text class="loading-text">加载分析结果中...</text>
    </view>

    <view class="actions">
      <button class="btn-primary" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoDetectResult } from '@/mock/demo.js'

const type = ref('image')
const recordId = ref(null)
const resultData = ref(null)
const loadError = ref(false)
const REQUEST_TIMEOUT = 2500

onLoad && onLoad((query) => {
  if (query && query.type) type.value = query.type
  if (query && query.id) recordId.value = query.id
})

const applyDemoResult = () => {
  resultData.value = getDemoDetectResult(type.value, recordId.value)
  loadError.value = false
}

onMounted(() => {
  if (!recordId.value) {
    // 兼容旧的跳转方式：如果没传id则尝试解析URL参数
    try {
      const params = new URLSearchParams(window?.location?.search || '')
      type.value = params.get('type') || 'image'
      recordId.value = params.get('id')
    } catch(e) {}
  }

  if (!recordId.value || String(recordId.value).startsWith('demo-')) {
    applyDemoResult()
    return
  }

  if (recordId.value) {
    uni.request({
      url: __API_BASE__ + '/detect/result/' + recordId.value + '?type=' + type.value,
      method: 'GET',
      timeout: REQUEST_TIMEOUT,
      success: (res) => {
        if (res.data && res.data.code === 200) {
          resultData.value = res.data.data
        } else {
          applyDemoResult()
        }
      },
      fail: () => {
        applyDemoResult()
      }
    })
  }
})

/** 解析JSON格式的敏感标签 */
const parseTags = (tags) => {
  if (!tags) return []
  try { return JSON.parse(tags) } catch(e) { return [tags] }
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.result-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.result-header {
  text-align: center; padding: 56rpx 32rpx 48rpx;
  border-radius: 0 0 48rpx 48rpx;
  &.header--high { background: linear-gradient(165deg, #7F1D1D 0%, #EF4444 100%); }
  &.header--medium { background: linear-gradient(165deg, #78350F 0%, #F59E0B 100%); }
  &.header--low, &.header--safe { background: linear-gradient(165deg, #064E3B 0%, #059669 100%); }
}
.result-icon { font-size: 80rpx; }
.tag-list { display: flex; flex-wrap: wrap; gap: 12rpx; }
.sensitive-tag { font-size: 24rpx; color: $danger; background: $danger-light; padding: 8rpx 20rpx; border-radius: $radius-full; font-weight: 600; }
.link-text { font-size: 24rpx; color: $primary; word-break: break-all; background: $primary-bg; padding: 16rpx; border-radius: $radius-sm; }
.section-text { font-size: 26rpx; color: $text-secondary; line-height: 1.7; }
.warning-text { color: #92400E; background: $warning-light; padding: 16rpx; border-radius: $radius-sm; }
.actions { padding: 24rpx 32rpx; }
.loading-state { text-align: center; padding: 120rpx 0; }
.loading-text { font-size: 28rpx; color: $text-placeholder; }
</style>

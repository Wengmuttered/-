<template>
  <!-- 解读结果页 -->
  <view class="result-page">
    <view class="result-header">
      <text class="result-app">📱 {{ result.inputContent }}</text>
      <text class="result-title">隐私政策解读报告</text>
      <view class="risk-tag risk-tag--medium">中等风险</view>
    </view>

    <view v-if="loading" style="text-align: center; padding: 40px; color: var(--primary-cyber)">
      <text>⏳ 正在建立大模型探针... 并挂起解析进程...</text>
    </view>

    <view v-else>
      <view class="card anim-fade-up anim-delay-1">
        <view class="card-title">📋 风险结论 / 破译详情</view>
        <text class="section-text warning-text">{{ result.resultSummary }}</text>
      </view>

      <view class="card anim-fade-up anim-delay-5">
        <view class="card-title">💡 终端行动指令建议</view>
        <text class="section-text">{{ result.advice || '已进入安全白名单' }}</text>
      </view>
    </view>

    <view class="actions anim-fade-up anim-delay-6">
      <button class="btn-primary" @tap="goBack">继续解读其他应用</button>
      <button class="btn-outline" style="margin-top:16rpx;" @tap="shareResult">分享给家人</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getDemoInterpretResult } from '@/mock/demo.js'

const result = ref({})
const loading = ref(true)
const taskId = ref('')
let timer = null
let fallbackTimer = null

onLoad((options) => {
  taskId.value = options?.taskId || ''
  if (!taskId.value) {
    result.value = getDemoInterpretResult()
    loading.value = false
    return
  }

  if (taskId.value.startsWith('demo-')) {
    setTimeout(() => {
      result.value = getDemoInterpretResult(taskId.value)
      loading.value = false
    }, 900)
  } else {
    pollResult(taskId.value)
  }
})

onUnload(() => {
  if(timer) clearInterval(timer)
  if(fallbackTimer) clearTimeout(fallbackTimer)
})

const showDemoResult = () => {
  if (timer) clearInterval(timer)
  if (fallbackTimer) clearTimeout(fallbackTimer)
  result.value = getDemoInterpretResult(taskId.value)
  loading.value = false
}

const pollResult = (taskId) => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  let attempts = 0
  fallbackTimer = setTimeout(() => {
    showDemoResult()
  }, 3500)

  timer = setInterval(() => {
    attempts += 1
    uni.request({
      url: __API_BASE__ + `/interpret/result/${taskId}`,
      method: 'GET',
      header: { 'Authorization': 'Bearer ' + token },
      success: (res) => {
        if (res.data && res.data.code === 200 && res.data.data.status === 'COMPLETED') {
          clearInterval(timer)
          clearTimeout(fallbackTimer)
          result.value = res.data.data
          loading.value = false
        } else if (attempts >= 3) {
          showDemoResult()
        }
      },
      fail: () => {
        if (attempts >= 2) showDemoResult()
      }
    })
  }, 1000)
}

const goBack = () => uni.navigateBack()
const shareResult = () => uni.showToast({ title: '已分享给家庭成员', icon: 'success' })
</script>

<style lang="scss" scoped>
.result-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.result-header {
  text-align: center; padding: 48rpx 32rpx 40rpx;
  background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%);
  border-radius: 0 0 48rpx 48rpx;
}
.result-app { font-size: 36rpx; font-weight: 700; color: #FFF; display: block; margin-bottom: 8rpx; }
.result-title { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin-bottom: 16rpx; }

.section-text { font-size: 26rpx; color: $text-secondary; line-height: 1.7; white-space: pre-wrap; }
.warning-text { color: #92400E; background: $warning-light; padding: 16rpx; border-radius: $radius-sm; }

.suggestion-list { margin-top: 4rpx; }
.suggestion-item { display: flex; align-items: flex-start; padding: 10rpx 0; }
.suggestion-num {
  width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center;
  background: $primary-bg; color: $primary; border-radius: 50%;
  font-size: 22rpx; font-weight: 700; margin-right: 12rpx; flex-shrink: 0;
}
.suggestion-text { font-size: 24rpx; color: $text-secondary; line-height: 1.5; flex: 1; }

.actions { padding: 24rpx 32rpx; }
</style>

<template>
  <!-- 解读输入页（TabBar） -->
  <view class="interpret-page">
    <view class="safe-area-top"></view>
    <view class="page-header">
      <text class="page-title">隐私解读</text>
      <text class="page-subtitle">智能解析应用隐私政策，一眼看清风险</text>
    </view>

    <!-- 输入方式切换 -->
    <view class="mode-tabs anim-fade-up anim-delay-1">
      <view class="mode-tab" :class="{ active: activeMode === m.value }"
            v-for="m in modes" :key="m.value" @tap="activeMode = m.value">
        <text class="mode-icon">{{ m.icon }}</text>
        <text class="mode-label">{{ m.label }}</text>
      </view>
    </view>

    <!-- 输入区 -->
    <view class="input-section card anim-fade-up anim-delay-2">
      <!-- 名称输入 -->
      <view v-if="activeMode === 'name'" class="input-area">
        <text class="input-label">输入应用名称</text>
        <input class="text-input" v-model="inputValue" placeholder="例如：抖音、微信、支付宝" />
      </view>
      <!-- 链接输入 -->
      <view v-if="activeMode === 'link'" class="input-area">
        <text class="input-label">粘贴隐私政策链接</text>
        <input class="text-input" v-model="inputValue" placeholder="请粘贴隐私政策链接" />
      </view>
      <!-- 文本输入 -->
      <view v-if="activeMode === 'text'" class="input-area">
        <text class="input-label">粘贴隐私政策文本</text>
        <textarea class="text-area" v-model="inputValue" placeholder="将隐私政策条款粘贴到这里..." :maxlength="5000" />
      </view>
      <!-- 截图上传 -->
      <view v-if="activeMode === 'screenshot'" class="input-area">
        <text class="input-label">上传隐私政策截图</text>
        <view class="upload-area" @tap="chooseImage">
          <text class="upload-icon">📷</text>
          <text class="upload-text">{{ imagePath ? '已选择图片' : '点击选择或拍照' }}</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="action-section anim-fade-up anim-delay-3">
      <button class="btn-primary" @tap="submitInterpret">开始解读</button>
      <text class="note">分析可能需要几秒钟，请耐心等待</text>
    </view>

    <!-- 热门App -->
    <view class="card anim-fade-up anim-delay-4">
      <view class="card-title">热门应用快速解读</view>
      <view class="hot-grid">
        <view class="hot-item" v-for="app in hotApps" :key="app.name" @tap="quickInterpret(app.name)">
          <text class="hot-icon">{{ app.icon }}</text>
          <text class="hot-name">{{ app.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { createDemoInterpretTask } from '@/mock/demo.js'

const activeMode = ref('name')
const inputValue = ref('')
const imagePath = ref('')
const REQUEST_TIMEOUT = 2500

const modes = ref([
  { value: 'name', icon: '📱', label: '名称' },
  { value: 'link', icon: '🔗', label: '链接' },
  { value: 'text', icon: '📄', label: '文本' },
  { value: 'screenshot', icon: '📷', label: '截图' }
])

const hotApps = ref([
  { name: '微信', icon: '💬' },
  { name: '抖音', icon: '🎵' },
  { name: '支付宝', icon: '💰' },
  { name: '淘宝', icon: '🛒' },
  { name: '美团', icon: '🍔' },
  { name: '拼多多', icon: '🛍️' },
  { name: '京东', icon: '📦' },
  { name: '微博', icon: '📱' }
])

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => { imagePath.value = res.tempFilePaths[0] }
  })
}

const submitInterpret = () => {
  if (!inputValue.value && activeMode.value !== 'screenshot') {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  if (activeMode.value === 'screenshot' && !imagePath.value) {
    uni.showToast({ title: '请先上传截图', icon: 'none' })
    return
  }
  uni.showLoading({ title: '破译连接中...' })
  
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  const contentValue = activeMode.value === 'screenshot' ? imagePath.value : inputValue.value

  const navigateWithTask = (taskId) => {
    uni.hideLoading()
    uni.navigateTo({ url: `/pages/interpret/result?taskId=${taskId}` })
  }

  const fallbackToDemo = () => {
    const taskId = createDemoInterpretTask(contentValue || '本地截图', activeMode.value)
    navigateWithTask(taskId)
  }
  
  uni.request({
    url: __API_BASE__ + '/interpret/submit',
    method: 'POST',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    data: { 
      taskType: activeMode.value.toUpperCase(),
      content: contentValue
    },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data) {
        navigateWithTask(res.data.data)
      } else {
        fallbackToDemo()
      }
    },
    fail: () => {
      fallbackToDemo()
    }
  })
}

const quickInterpret = (name) => {
  inputValue.value = name
  activeMode.value = 'name'
  submitInterpret()
}
</script>

<style lang="scss" scoped>
.interpret-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }

.mode-tabs {
  display: flex; margin: 16rpx 24rpx; background: #FFFFFF;
  border-radius: $radius-lg; padding: 8rpx; box-shadow: $shadow-sm;
}
.mode-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 16rpx 0; border-radius: $radius-md; transition: all 0.3s;
  &.active { background: $primary; }
}
.mode-icon { font-size: 32rpx; margin-bottom: 4rpx; }
.mode-label { font-size: 22rpx; color: $text-secondary; font-weight: 600; }
.mode-tab.active .mode-label { color: #FFF; }

.input-section { margin-top: 8rpx; }
.input-label { font-size: 26rpx; font-weight: 600; color: $text-primary; display: block; margin-bottom: 16rpx; }

.text-input {
  width: 100%; height: 88rpx; padding: 0 24rpx;
  background: $gray-50; border-radius: $radius-md; border: 2rpx solid $gray-200;
  font-size: 28rpx; box-sizing: border-box;
}

.text-area {
  width: 100%; height: 240rpx; padding: 20rpx 24rpx;
  background: $gray-50; border-radius: $radius-md; border: 2rpx solid $gray-200;
  font-size: 26rpx; box-sizing: border-box;
}

.upload-area {
  width: 100%; height: 240rpx;
  background: $gray-50; border-radius: $radius-md;
  border: 3rpx dashed $gray-300;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  &:active { border-color: $primary; }
}
.upload-icon { font-size: 64rpx; margin-bottom: 12rpx; }
.upload-text { font-size: 26rpx; color: $text-placeholder; }

.action-section { padding: 24rpx 32rpx; }
.note { font-size: 22rpx; color: $text-placeholder; text-align: center; display: block; margin-top: 12rpx; }

.hot-grid { display: flex; flex-wrap: wrap; }
.hot-item {
  width: 25%; display: flex; flex-direction: column; align-items: center;
  padding: 16rpx 0; &:active { opacity: 0.7; }
}
.hot-icon { font-size: 48rpx; margin-bottom: 8rpx; }
.hot-name { font-size: 22rpx; color: $text-secondary; }
</style>

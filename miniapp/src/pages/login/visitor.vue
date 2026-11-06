<template>
  <!-- 游客体验页 -->
  <view class="visitor-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>

    <view class="visitor-content">
      <view class="visitor-header anim-scale-in">
        <view class="status-badge">
          <text class="status-dot pulse-dot"></text>
          <text class="status-text">游客模式</text>
        </view>
        <text class="visitor-title">体验通道已开启</text>
        <text class="visitor-desc">您正以游客身份探索系统，可体验隐私解读功能</text>
      </view>

      <view class="modules anim-fade-up anim-delay-1">
        <view class="glass-card module-item" v-for="(m, i) in modules" :key="i" @tap="goModule(m)">
          <text class="module-icon">{{ m.icon }}</text>
          <view class="module-info">
            <text class="module-name">{{ m.name }}</text>
            <text class="module-desc">{{ m.desc }}</text>
          </view>
          <text class="module-arrow">查看</text>
        </view>
      </view>

      <view class="register-hint anim-fade-up anim-delay-3">
        <text class="hint-text">注册成为正式用户可解锁全部功能</text>
        <button class="register-btn" @tap="goLogin">
          <text>立即注册</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const GUEST_INIT_TIMEOUT = 2000

const guestInfo = ref(null)

const modules = ref([
  { icon: '📋', name: '隐私政策解读', desc: '输入应用名称或链接，快速解读隐私条款', path: '/pages/interpret/input' },
  { icon: '📚', name: '安全知识库', desc: '浏览隐私安全知识和防护建议', path: '' }
])

/** 页面加载时调用后端初始化游客会话 */
onMounted(() => {
  uni.request({
    url: __API_BASE__ + '/auth/guest-init',
    method: 'GET',
    timeout: GUEST_INIT_TIMEOUT,
    success: (res) => {
      if (res.data && res.data.code === 200) {
        guestInfo.value = res.data.data
        uni.setStorageSync('GUEST_ID', res.data.data.guestId)
      }
    },
    fail: (err) => {
      // 网络异常时仍允许页面展示
      console.warn('游客初始化失败，使用离线模式:', err)
    }
  })
})

const goModule = (m) => {
  if (m.path) {
    uni.navigateTo({ url: m.path })
  } else {
    uni.showToast({ title: '该模块暂未开放', icon: 'none' })
  }
}

const goLogin = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.visitor-page { display: flex; flex-direction: column; }
.visitor-content {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 0 48rpx;
}
.visitor-header { text-align: center; margin-bottom: 60rpx; }
.status-badge {
  display: inline-flex; align-items: center;
  background: rgba(0, 244, 163, 0.1); border: 1px solid rgba(0, 244, 163, 0.3);
  border-radius: 100rpx; padding: 8rpx 24rpx; margin-bottom: 32rpx;
}
.status-dot {
  width: 12rpx; height: 12rpx; border-radius: 50%;
  background: $primary; margin-right: 12rpx;
}
.status-text { font-family: 'Fira Code', monospace; font-size: 20rpx; color: $primary; }
.visitor-title { display: block; font-size: 44rpx; font-weight: 800; color: $text-primary; margin-bottom: 16rpx; }
.visitor-desc { display: block; font-size: 24rpx; color: $text-secondary; }

.modules { width: 100%; margin-bottom: 48rpx; }
.module-item {
  display: flex; align-items: center;
  padding: 28rpx 24rpx !important; margin: 0 0 20rpx 0 !important;
  background: rgba(15, 23, 42, 0.6) !important;
  &:active { border-color: $primary; }
}
.module-icon { font-size: 48rpx; margin-right: 20rpx; }
.module-info { flex: 1; }
.module-name { display: block; font-size: 28rpx; font-weight: 700; color: $text-primary; margin-bottom: 4rpx; }
.module-desc { display: block; font-size: 22rpx; color: $text-secondary; }
.module-arrow { font-size: 40rpx; color: $gray-500; }

.register-hint { text-align: center; }
.hint-text { display: block; font-size: 24rpx; color: $text-secondary; margin-bottom: 24rpx; }
.register-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid $primary; color: $primary;
  height: 80rpx; font-size: 28rpx; font-weight: 700;
  border-radius: 8rpx; padding: 0 64rpx;
  &::after { border: none; }
  &:active { background: $primary; color: $black-zero; }
}
</style>

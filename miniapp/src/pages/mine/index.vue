<template>
  <!-- 极客风 - 我的主页（TabBar） -->
  <view class="mine-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>

    <!-- 赛博身份徽章 -->
    <view class="mine-header anim-fade-up">
      <view class="avatar-ring">
        <view class="mine-avatar">{{ user.nickname.charAt(0) }}</view>
        <view class="ring-spinner"></view>
      </view>
      
      <view class="mine-info">
        <text class="mine-name">特遣身份 // {{ user.nickname }}</text>
        <text class="mine-phone">编号：{{ user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</text>
        <view class="auth-tag">实名授权通过</view>
      </view>

      <view class="mine-score">
        <text class="number-cyber giant-score">{{ trustRating }}</text>
        <text class="mine-score-label">天盾信用评估</text>
      </view>
    </view>

    <!-- 终端统计摘要 -->
    <view v-if="stats.length" class="glass-card stat-card anim-fade-up anim-delay-1">
      <view class="stat-item" v-for="s in stats" :key="s.label">
        <text class="number-cyber stat-value">{{ s.value }}</text>
        <text class="stat-label">{{ s.label }}</text>
      </view>
    </view>

    <!-- 系统菜单系统 -->
    <view class="glass-card menu-section anim-fade-up anim-delay-2">
      <view class="menu-item" v-for="m in menuItems" :key="m.page" @tap="goPage(m.page)">
        <view class="menu-left">
          <view class="cyber-icon-box">
            <text class="menu-icon">{{ m.icon }}</text>
          </view>
          <text class="menu-label">{{ m.label }}</text>
        </view>
        <text class="menu-arrow">查看</text>
      </view>
    </view>

    <!-- 系统指令 -->
    <view class="glass-card anim-fade-up anim-delay-3" style="margin-top: 32rpx;">
      <view class="menu-item" @tap="goAbout">
        <view class="menu-left">
           <view class="cyber-icon-box"><text class="menu-icon">档</text></view>
          <text class="menu-label">系统版本 [1.0 版 - 天网基石]</text>
        </view>
        <text class="menu-arrow">查看</text>
      </view>
      <view class="menu-item danger-item" @tap="handleLogout">
        <view class="menu-left">
          <view class="cyber-icon-box danger-box"><text class="menu-icon">退</text></view>
          <text class="menu-label" style="color: #F43F5E; text-shadow: 0 0 10px rgba(244,63,94,0.5);">断开连接</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getDemoProfileData } from '@/mock/demo.js'

const user = ref({ nickname: '游客', phone: '13800000000' })
const trustRating = ref(0)
const stats = ref([])
const REQUEST_TIMEOUT = 2500

onShow(() => {
  if (!uni.getStorageSync('SYS_JWT_TOKEN')) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  fetchProfile()
})

const fetchProfile = () => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  const applyPayload = (payload) => {
    user.value = { nickname: payload.nickname, phone: payload.phone }
    trustRating.value = payload.trustRating
    stats.value = payload.stats || []
  }

  uni.request({
    url: __API_BASE__ + '/user/profile',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        applyPayload(res.data.data)
      } else {
        applyPayload(getDemoProfileData())
      }
    },
    fail: () => {
      applyPayload(getDemoProfileData())
    }
  })
}

const menuItems = ref([
  { icon: '审', label: '操作审计记录', page: '/pages/mine/records' },
  { icon: '设', label: '终端设备绑定', page: '/pages/family/bind' },
  { icon: '报', label: '系统漏洞报告', page: '/pages/mine/feedback' },
  { icon: '档', label: '历史扫描归档', page: '/pages/check/history' }
])

const goPage = (url) => { if(url) uni.navigateTo({ url }).catch(()=>{}); else uni.showToast({ title: '【防区施工】尚未对您的军衔开放', icon: 'none' }) }
const goAbout = () => uni.showToast({ title: '天盾数据隐私卫士 1.0 版', icon: 'none' })
const handleLogout = () => {
  uni.showModal({
    title: '【机密脱离】', content: '是否强制断开与天基监控阵列的神经连接？',
    success: (res) => {
      if (res.confirm) uni.reLaunch({ url: '/pages/login/index' })
    }
  })
}
</script>

<style lang="scss" scoped>
.mine-page { 
  min-height: 100vh; padding-bottom: 40rpx; 
}

.mine-header {
  display: flex; align-items: stretch;
  padding: 60rpx 40rpx 40rpx;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 244, 163, 0.2);
  background: linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(0, 244, 163, 0.05) 100%);
}

// 酷炫的发光头像环
.avatar-ring {
  position: relative;
  width: 120rpx; height: 120rpx;
  margin-right: 32rpx;
  display: flex; align-items: center; justify-content: center;
}

.mine-avatar {
  position: relative; z-index: 2;
  width: 100rpx; height: 100rpx; border-radius: 12rpx;
  background: $bg-glass;
  border: 1px solid $primary;
  color: $primary;
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 48rpx; font-weight: 800;
  box-shadow: 0 0 20rpx $primary-glow inset;
}

.ring-spinner {
  position: absolute; inset: 0;
  border: 1px dashed $primary;
  border-radius: 16rpx;
  animation: spin 8s linear infinite;
  opacity: 0.5;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.mine-info { 
  flex: 1; display: flex; flex-direction: column; justify-content: center;
}
.mine-name { 
  font-family: 'Fira Code', monospace;
  font-size: 28rpx; font-weight: 700; color: $primary; 
  display: block; letter-spacing: 2rpx;
}
.mine-phone { 
  font-family: 'Fira Code', monospace;
  font-size: 20rpx; color: $text-secondary; 
  display: block; margin-top: 8rpx; 
}
.auth-tag {
  display: inline-block;
  margin-top: 12rpx;
  padding: 2rpx 12rpx;
  background: $success-light;
  color: $success;
  font-size: 16rpx;
  font-weight: 800;
  border-radius: 4rpx;
  width: fit-content;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.mine-score { 
  text-align: right; 
  display: flex; flex-direction: column; justify-content: center;
}
.giant-score { 
  font-size: 80rpx; line-height: 1; letter-spacing: -2rpx; 
}
.mine-score-label { 
  font-family: 'Fira Code', monospace;
  font-size: 16rpx; color: $primary; margin-top: 8rpx; 
}

.stat-card {
  display: flex; justify-content: space-around; padding: 32rpx 0;
}
.stat-item { text-align: center; }
.stat-value { font-size: 48rpx; display: block; }
.stat-label { 
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; color: $text-secondary; display: block; margin-top: 8rpx; 
}

/* 列表样式 */
.menu-section { padding: 0 $spacing-lg; }
.menu-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 32rpx 0; border-bottom: 1rpx solid rgba(255,255,255,0.05);
  &:last-child { border-bottom: none; }
  &:active { background: rgba(0, 244, 163, 0.05); }
}

.danger-item:active { background: rgba(244, 63, 94, 0.05) !important; }

.menu-left { display: flex; align-items: center; }
.cyber-icon-box {
  width: 56rpx; height: 40rpx;
  background: rgba(0, 244, 163, 0.1);
  border: 1px solid rgba(0, 244, 163, 0.3);
  border-radius: 4rpx;
  display: flex; align-items: center; justify-content: center;
  margin-right: 24rpx;
  
  .menu-icon {
    font-family: 'Fira Code', monospace;
    font-size: 18rpx; font-weight: 800; color: $primary;
  }
}
.danger-box {
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.5);
  .menu-icon { color: $danger; }
}

.menu-label { font-size: 26rpx; color: $text-primary; letter-spacing: 2rpx; }
.menu-arrow { 
  font-family: 'Fira Code', monospace;
  font-size: 24rpx; color: $primary; opacity: 0.5; 
}
</style>

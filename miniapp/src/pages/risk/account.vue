<template>
  <!-- 账号安全详情页 -->
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-score" :style="{ color: '#F59E0B' }">50</text>
      <text class="detail-label">账号安全评分</text>
      <view class="risk-tag risk-tag--medium">中风险</view>
    </view>

    <view class="stat-row card anim-fade-up anim-delay-1">
      <view class="stat-item">
        <text class="stat-value danger">{{ weakCount }}</text>
        <text class="stat-label">弱密码</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value warning">{{ dupCount }}</text>
        <text class="stat-label">重复密码</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value safe">{{ safeCount }}</text>
        <text class="stat-label">安全账号</text>
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">账号清单</view>
      <view class="account-item" v-for="a in accounts" :key="a.id">
        <view class="account-icon">{{ getAppIcon(a.platformName) }}</view>
        <view class="account-info">
          <text class="account-name">{{ a.platformName }}</text>
          <text class="account-id">{{ a.accountIdentifier }}</text>
        </view>
        <view class="account-tags">
          <view v-if="a.hasWeakPassword" class="risk-tag mini risk-tag--high">弱密码</view>
          <view v-if="a.hasDuplicatePassword" class="risk-tag mini risk-tag--medium" style="margin-top:4rpx;">重复</view>
          <view v-if="!a.hasWeakPassword && !a.hasDuplicatePassword" class="risk-tag mini risk-tag--safe">安全</view>
        </view>
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">安全建议</view>
      <view class="advice-item" v-for="(tip, i) in tips" :key="i">
        <text class="advice-icon">{{ tip.icon }}</text>
        <text class="advice-text">{{ tip.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDemoAccountAssets } from '@/mock/demo.js'

const accounts = ref([])
const REQUEST_TIMEOUT = 2500

onLoad(() => {
  const token = uni.getStorageSync('SYS_JWT_TOKEN') || ''
  uni.request({
    url: __API_BASE__ + '/asset/list',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + token },
    success: (res) => {
      if (res.data && res.data.code === 200) {
        // 后端传过来的是 platformName, accountName，前端这里也是用到了 platformName，做了一点假数据补齐用于演示，避免白屏
        accounts.value = res.data.data.length ? res.data.data.map(item => ({
          ...item,
          hasWeakPassword: item.riskLevel === 'WEAK',
          hasDuplicatePassword: item.riskLevel === 'REUSED'
        })) : [
          { id: 1, platformName: '淘宝', accountIdentifier: '138****1234', hasWeakPassword: true, hasDuplicatePassword: false },
          { id: 2, platformName: '美团', accountIdentifier: '138****1234', hasWeakPassword: false, hasDuplicatePassword: true },
          { id: 3, platformName: '滴滴', accountIdentifier: '138****1234', hasWeakPassword: false, hasDuplicatePassword: false }
        ]
      } else {
        accounts.value = getDemoAccountAssets()
      }
    },
    fail: () => {
      accounts.value = getDemoAccountAssets()
    }
  })
})

const weakCount = computed(() => accounts.value.filter(a => a.hasWeakPassword).length)
const dupCount = computed(() => accounts.value.filter(a => a.hasDuplicatePassword).length)
const safeCount = computed(() => accounts.value.filter(a => !a.hasWeakPassword && !a.hasDuplicatePassword).length)

const getAppIcon = (name) => {
  const map = { '淘宝': '🛒', '美团': '🍔', '京东': '📦', '微博': '📱', '支付宝': '💰' }
  return map[name] || '📱'
}

const tips = ref([
  { icon: '🔑', text: '为每个平台设置不同的强密码，避免撞库攻击' },
  { icon: '📱', text: '建议使用密码管理器统一管理账号密码' },
  { icon: '🔐', text: '强密码应包含大小写字母 + 数字 + 特殊字符，长度 12 位以上' },
  { icon: '⏰', text: '建议每 3-6 个月更换一次重要平台的密码' }
])
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.detail-header {
  text-align: center; padding: 48rpx 32rpx 40rpx;
  background: linear-gradient(165deg, #0F172A 0%, #1A56DB 100%);
  border-radius: 0 0 48rpx 48rpx;
}
.detail-score { font-size: 72rpx; font-weight: 800; display: block; }
.detail-label { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin: 4rpx 0 12rpx; }

.stat-row { display: flex; align-items: center; justify-content: space-around; padding: 28rpx 16rpx; }
.stat-item { text-align: center; flex: 1; }
.stat-value { font-size: 40rpx; font-weight: 800; display: block; }
.stat-value.danger { color: $danger; }
.stat-value.warning { color: $warning; }
.stat-value.safe { color: $success; }
.stat-label { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 4rpx; }
.stat-divider { width: 1rpx; height: 48rpx; background: $gray-200; }

.account-item {
  display: flex; align-items: center; padding: 20rpx 0;
  border-bottom: 1rpx solid $gray-100;
  &:last-child { border-bottom: none; }
}
.account-icon { font-size: 40rpx; margin-right: 16rpx; }
.account-info { flex: 1; }
.account-name { font-size: 28rpx; font-weight: 600; color: $text-primary; display: block; }
.account-id { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 2rpx; }
.account-tags { display: flex; flex-direction: column; align-items: flex-end; }
.mini { font-size: 18rpx !important; padding: 2rpx 10rpx !important; }

.advice-item { display: flex; align-items: flex-start; padding: 12rpx 0; }
.advice-icon { font-size: 28rpx; margin-right: 12rpx; }
.advice-text { font-size: 24rpx; color: $text-secondary; line-height: 1.5; flex: 1; }
</style>

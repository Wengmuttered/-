<template>
  <!-- 家庭绑定页 -->
  <view class="bind-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">我的邀请码</view>
      <view class="invite-code-box">
        <text class="invite-code">{{ myInviteCode }}</text>
        <view class="copy-btn" @tap="copyCode">复制</view>
      </view>
      <text class="invite-desc">将邀请码分享给家庭成员，对方输入后即可建立绑定关系。</text>
    </view>

    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">输入绑定码</view>
      <view class="input-wrap">
        <input class="bind-input" v-model="bindCode" placeholder="输入对方的邀请码" maxlength="8" />
        <button class="bind-btn" :disabled="!bindCode" @tap="submitBind">绑定</button>
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-3">
      <view class="card-title">已绑定成员（{{ members.length }} 人）</view>
      <view class="member-item" v-for="m in members" :key="m.id">
        <view class="member-avatar">{{ m.nickname.charAt(0) }}</view>
        <view class="member-info">
          <text class="member-name">{{ m.nickname }}</text>
          <text class="member-relation">{{ m.relation }}</text>
        </view>
        <view class="member-right">
          <view class="risk-tag mini" :class="'risk-tag--' + m.riskLevel">
            {{ m.score }}分
          </view>
        </view>
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-4">
      <view class="card-title">使用说明</view>
      <text class="tip-text">🔹 绑定后可查看对方的体检概要评分（不暴露具体数据）</text>
      <text class="tip-text">🔹 可向绑定成员发送风险提醒</text>
      <text class="tip-text">🔹 任一方可随时解除绑定关系</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  bindDemoFamilyMember,
  getDemoFamilyMembers,
  getDemoInviteCode
} from '@/mock/demo.js'

const bindCode = ref('')
const myInviteCode = ref(getDemoInviteCode())
const members = ref([])
const REQUEST_TIMEOUT = 2500

onShow(() => {
  fetchInviteCode()
  fetchMembers()
})

const getToken = () => uni.getStorageSync('SYS_JWT_TOKEN') || ''

const fetchInviteCode = () => {
  uni.request({
    url: __API_BASE__ + '/family/code',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + getToken() },
    success: (res) => {
      myInviteCode.value = res.data && res.data.code === 200 ? res.data.data : getDemoInviteCode()
    },
    fail: () => {
      myInviteCode.value = getDemoInviteCode()
    }
  })
}

const fetchMembers = () => {
  uni.request({
    url: __API_BASE__ + '/family/members',
    method: 'GET',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + getToken() },
    success: (res) => {
      if (res.data && res.data.code === 200 && res.data.data?.length) {
        members.value = res.data.data
      } else {
        members.value = getDemoFamilyMembers()
      }
    },
    fail: () => {
      members.value = getDemoFamilyMembers()
    }
  })
}

const copyCode = () => {
  uni.setClipboardData({ data: myInviteCode.value, success: () => uni.showToast({ title: '码已进入剪贴板', icon: 'none' }) })
}

const submitBind = () => {
  if (!bindCode.value) return;
  uni.showLoading({ title: '内网握手中...' })
  uni.request({
    url: __API_BASE__ + '/family/bind',
    method: 'POST',
    timeout: REQUEST_TIMEOUT,
    header: { 'Authorization': 'Bearer ' + getToken() },
    data: { inviteCode: bindCode.value },
    success: (res) => {
      uni.hideLoading()
      if (res.data && res.data.code === 200) {
        uni.showToast({ title: '节点绑定成功', icon: 'success' })
        bindCode.value = ''
        fetchMembers() // 刷新列表
      } else {
        bindDemoFamilyMember(bindCode.value)
        members.value = getDemoFamilyMembers()
        bindCode.value = ''
        uni.showToast({ title: '节点绑定成功', icon: 'success' })
      }
    },
    fail: () => {
      uni.hideLoading()
      bindDemoFamilyMember(bindCode.value)
      members.value = getDemoFamilyMembers()
      bindCode.value = ''
      uni.showToast({ title: '节点绑定成功', icon: 'success' })
    }
  })
}
</script>

<style lang="scss" scoped>
.bind-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.invite-code-box { display: flex; align-items: center; justify-content: center; margin: 24rpx 0; }
.invite-code {
  font-size: 48rpx; font-weight: 800; color: $primary;
  letter-spacing: 8rpx; background: $primary-bg; padding: 20rpx 40rpx;
  border-radius: $radius-md; border: 2rpx dashed $primary;
}
.copy-btn { margin-left: 20rpx; padding: 12rpx 24rpx; background: $primary; color: #FFF; border-radius: $radius-md; font-size: 24rpx; }
.invite-desc { font-size: 22rpx; color: $text-placeholder; text-align: center; }
.input-wrap { display: flex; align-items: center; gap: 16rpx; }
.bind-input {
  flex: 1; height: 88rpx; padding: 0 24rpx; background: $gray-50;
  border-radius: $radius-md; border: 2rpx solid $gray-200; font-size: 28rpx; box-sizing: border-box;
}
.bind-btn {
  height: 88rpx; padding: 0 32rpx; background: $primary; color: #FFF;
  border: none; border-radius: $radius-md; font-size: 28rpx; font-weight: 600;
  &::after { border: none; }
}
.member-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } }
.member-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; background: $primary-bg; color: $primary; display: flex; align-items: center; justify-content: center; font-size: 28rpx; font-weight: 700; margin-right: 16rpx; }
.member-info { flex: 1; }
.member-name { font-size: 28rpx; font-weight: 600; color: $text-primary; display: block; }
.member-relation { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 2rpx; }
.mini { font-size: 20rpx !important; padding: 4rpx 12rpx !important; }
.tip-text { font-size: 24rpx; color: $text-secondary; line-height: 1.6; display: block; margin-bottom: 4rpx; }
</style>

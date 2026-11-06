<template>
  <!-- 家庭共享页 -->
  <view class="share-page">
    <view class="card anim-fade-up anim-delay-1">
      <view class="card-title">共享设置</view>
      <view class="switch-item" v-for="s in shareSettings" :key="s.key">
        <view class="switch-info">
          <text class="switch-icon">{{ s.icon }}</text>
          <view class="switch-text">
            <text class="switch-title">{{ s.title }}</text>
            <text class="switch-desc">{{ s.desc }}</text>
          </view>
        </view>
        <switch :checked="s.enabled" color="#1A56DB" @change="toggleShare(s.key)" />
      </view>
    </view>

    <view class="card anim-fade-up anim-delay-2">
      <view class="card-title">共享记录</view>
      <view v-if="records.length === 0" class="empty-hint">
        <text class="empty-text">暂无共享记录</text>
      </view>
      <view class="record-item" v-for="r in records" :key="r.id">
        <view class="record-left">
          <text class="record-icon">{{ r.status === 2 ? '🔴' : '🟢' }}</text>
          <view class="record-info">
            <text class="record-title">{{ r.shareType === 'reminder' ? '风险提醒' : '记录共享' }}</text>
            <text class="record-target">共享至家庭成员 #{{ r.targetId }}</text>
          </view>
        </view>
        <view class="record-right">
          <text class="record-time">{{ formatTime(r.createdAt) }}</text>
          <view v-if="r.status === 1" class="revoke-btn" @tap="revokeShare(r.id)">撤回</view>
          <text v-if="r.status === 2" class="revoked-text">已撤回</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shareSettings = ref([
  { key: 'reminder', icon: '🔔', title: '风险提醒共享', desc: '接收家庭成员的风险提醒', enabled: true },
  { key: 'record', icon: '📊', title: '体检评分共享', desc: '允许家庭成员查看您的体检概要', enabled: true },
  { key: 'scan', icon: '🔗', title: '扫描结果共享', desc: '共享链接/二维码扫描结果', enabled: false }
])

const records = ref([])

/** 从后端获取共享记录 */
onMounted(() => {
  uni.request({
    url: __API_BASE__ + '/family/shares',
    method: 'GET',
    success: (res) => {
      if (res.data && res.data.code === 200) {
        records.value = res.data.data || []
      }
    }
  })
})

const formatTime = (t) => t ? t.substring(0, 16).replace('T', ' ') : ''

const toggleShare = (key) => {
  const item = shareSettings.value.find(s => s.key === key)
  if (item) item.enabled = !item.enabled
}

/** 调用后端真实API撤回共享 */
const revokeShare = (id) => {
  uni.showModal({
    title: '提示', content: '确定撤回该共享记录？',
    success: (res) => {
      if (res.confirm) {
        uni.request({
          url: __API_BASE__ + '/family/share/revoke/' + id,
          method: 'POST',
          success: (apiRes) => {
            if (apiRes.data && apiRes.data.code === 200) {
              const r = records.value.find(x => x.id === id)
              if (r) r.status = 2
              uni.showToast({ title: '已撤回', icon: 'success' })
            }
          }
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.share-page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.switch-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } }
.switch-info { display: flex; align-items: center; flex: 1; }
.switch-icon { font-size: 36rpx; margin-right: 16rpx; }
.switch-text { flex: 1; }
.switch-title { font-size: 28rpx; font-weight: 600; color: $text-primary; display: block; }
.switch-desc { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 2rpx; }
.empty-hint { text-align: center; padding: 40rpx 0; }
.empty-text { font-size: 24rpx; color: $text-placeholder; }
.record-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $gray-100; &:last-child { border-bottom: none; } }
.record-left { display: flex; align-items: center; }
.record-icon { font-size: 24rpx; margin-right: 12rpx; }
.record-info { }
.record-title { font-size: 26rpx; font-weight: 600; color: $text-primary; display: block; }
.record-target { font-size: 22rpx; color: $text-secondary; display: block; }
.record-right { text-align: right; }
.record-time { font-size: 22rpx; color: $text-placeholder; display: block; }
.revoke-btn { font-size: 22rpx; color: $danger; margin-top: 4rpx; &:active { opacity: 0.7; } }
.revoked-text { font-size: 22rpx; color: $text-placeholder; margin-top: 4rpx; }
</style>

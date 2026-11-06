<template>
  <!-- 入口屏：赛博通行控制台 -->
  <view class="login-page matrix-bg page-container relative-content">
    <view class="safe-area-top"></view>

    <!-- 登录主控面板 -->
    <view class="login-content">
      
      <!-- 极光控制台 Logo -->
      <view class="logo-section anim-scale-in">
        <view class="cyber-shield">
          <view class="glitch-line"></view>
          <text class="shield-text">天盾</text>
        </view>
        <text class="logo-title">隐私数据安全管家</text>
        <text class="logo-desc">// 隐私数据安全守护 //</text>
      </view>

      <!-- 系统负载特征模块 -->
      <view class="features anim-fade-up anim-delay-1">
        <view class="glass-card feature-item" v-for="(item, index) in features" :key="index">
          <view class="feature-icon-box">
            <text class="feature-icon">{{ item.icon }}</text>
          </view>
          <view class="feature-info">
            <text class="feature-title">{{ item.title }}</text>
            <text class="feature-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 授权登入操作区 -->
      <view class="login-actions anim-fade-up anim-delay-3">
        <!-- 注意：为了符合极客设定，改用高对比亮色代表通行 -->
        <button class="wx-login-btn" @tap="handleWxLogin">
          <text class="wx-icon">[微信]</text>
          <text>安全信道一键接入</text>
        </button>

        <!-- 手机号绑定按钮：使用微信原生 getPhoneNumber 能力 -->
        <button class="phone-bind-btn" open-type="getPhoneNumber" @getphonenumber="handlePhoneBind">
          <text class="wx-icon">[手机]</text>
          <text>通讯加密频道绑定</text>
        </button>
        
        <view class="visitor-entry" @tap="goVisitor">
          <text class="glitch-visitor">>>> 初始化游客探测模式</text>
        </view>
      </view>

      <!-- 协议署名 -->
      <view class="agreement anim-fade-in anim-delay-5">
        <text class="agreement-text">登录系统即已签署并确认</text>
        <text class="agreement-link">《系统使用守则》</text>
        <text class="agreement-text">&</text>
        <text class="agreement-link">《私有数据保护协议》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const HOME_TAB_URL = '/pages/index/index'
const WX_LOGIN_TIMEOUT = 2000
const BACKEND_LOGIN_TIMEOUT = 3000
const GUEST_INIT_TIMEOUT = 2000
const PHONE_BIND_TIMEOUT = 5000
const REDIRECT_DELAY = 800

const features = ref([
  { icon: '体检', title: '全维渗透体检', desc: '探测并封锁 5 层深度暴露点' },
  { icon: '智析', title: '智能协议解析', desc: '反制商业应用隐藏霸王条款' },
  { icon: '联防', title: '安全节点同步', desc: '构建家族设备联合防护网段' }
])

const goHome = () => {
  setTimeout(() => {
    uni.switchTab({ url: HOME_TAB_URL })
  }, REDIRECT_DELAY)
}

const hideLoadingSafely = () => {
  try {
    uni.hideLoading()
  } catch (error) {
    console.warn('隐藏加载框失败，忽略本次异常:', error)
  }
}

/** 微信登录 — 同时兼容真机与模拟器 / 带安全超时兜底 */
const handleWxLogin = () => {
  uni.showLoading({ title: '【建立神经阵列中】...', mask: true })

  // 【核心安全屏障】防止新版基础库中超时错误未通过回调触发、导致界面 Loading 永久死锁
  let isResolved = false
  const forceUnlock = setTimeout(() => {
    if (!isResolved) {
      isResolved = true
      hideLoadingSafely()
      console.warn('启动 2.5 秒全局强制兜底降级')
      fallbackLogin()
    }
  }, WX_LOGIN_TIMEOUT + 500)

  try {
    // 先尝试真实微信登录
    uni.login({
      provider: 'weixin',
      timeout: WX_LOGIN_TIMEOUT,
      success: (loginRes) => {
        if (isResolved) return
        isResolved = true
        clearTimeout(forceUnlock)
        if (loginRes.code) {
          // 拿到真实 code，请求后端换 token
          callBackendLogin(loginRes.code)
        } else {
          // code 为空，降级处理
          fallbackLogin()
        }
      },
      fail: (err) => {
        if (isResolved) return
        isResolved = true
        clearTimeout(forceUnlock)
        console.warn('uni.login 失败，启用降级登录:', err)
        // 模拟器中 uni.login 会超时或失败，降级为开发模式登录
        fallbackLogin()
      }
    })
  } catch (e) {
    if (isResolved) return
    isResolved = true
    clearTimeout(forceUnlock)
    console.warn('uni.login 遭遇全局异常，立即降级', e)
    fallbackLogin()
  }
}

/** 用真实 code 调用后端微信登录接口 */
const callBackendLogin = (code) => {
  uni.request({
    url: __API_BASE__ + '/auth/wechat-login',
    method: 'POST',
    timeout: BACKEND_LOGIN_TIMEOUT,
    data: { code },
    success: (res) => {
      hideLoadingSafely()
      if (res.data && res.data.code === 200) {
        const { token, userId, isNewUser } = res.data.data
        uni.setStorageSync('SYS_JWT_TOKEN', token)
        uni.setStorageSync('SYS_USER_ID', userId)
        uni.showToast({ title: isNewUser ? '特遣新兵身份已登记' : '身份确认，欢迎归队', icon: 'none' })
        goHome()
      } else {
        // 后端也失败了（比如 appid/secret 不对），继续降级
        console.warn('后端微信登录返回异常，降级处理:', res.data)
        fallbackLogin()
      }
    },
    fail: (err) => {
      console.warn('后端请求失败，降级处理:', err)
      // 网络不通等情况，降级
      fallbackLogin()
    }
  })
}

/**
 * 降级登录 — 在模拟器或网络异常时，直接调用游客初始化接口获取身份
 * 保证演示/开发时不会卡在登录页
 */
const fallbackLogin = () => {
  uni.request({
    url: __API_BASE__ + '/auth/guest-init',
    method: 'GET',
    timeout: GUEST_INIT_TIMEOUT,
    success: (res) => {
      hideLoadingSafely()
      if (res.data && res.data.code === 200) {
        const guestId = res.data.data.guestId
        uni.setStorageSync('SYS_JWT_TOKEN', 'DEV-TOKEN-' + Date.now())
        uni.setStorageSync('SYS_USER_ID', guestId)
        uni.showToast({ title: '开发模式：已自动接入', icon: 'none' })
        goHome()
      } else {
        directEntry()
      }
    },
    fail: (err) => {
      console.warn('游客初始化失败，进入离线模式:', err)
      // 连 guest-init 也不通，直接跳转（纯离线演示模式）
      directEntry()
    }
  })
}

/** 兜底直接进入首页（纯离线） */
const directEntry = () => {
  hideLoadingSafely()
  uni.setStorageSync('SYS_JWT_TOKEN', 'OFFLINE-TOKEN-' + Date.now())
  uni.setStorageSync('SYS_USER_ID', 'OFFLINE-1')
  uni.showToast({ title: '离线模式：已进入系统', icon: 'none' })
  goHome()
}

/**
 * 手机号绑定 — 使用微信原生 getPhoneNumber 能力
 * 微信 2023 年起要求使用 button open-type="getPhoneNumber" 获取手机号
 * 该能力对已认证小程序免费开放
 */
const handlePhoneBind = (e) => {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '指挥官取消了频道绑定', icon: 'none' })
    return
  }
  
  const phoneCode = e.detail.code
  const userId = uni.getStorageSync('SYS_USER_ID')
  
  if (!userId) {
    uni.showToast({ title: '请先完成安全信道接入', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '【绑定加密频道中】...' })
  uni.request({
    url: __API_BASE__ + '/auth/phone-bind',
    method: 'POST',
    timeout: PHONE_BIND_TIMEOUT,
    data: { code: phoneCode, userId: String(userId) },
    header: { 'Authorization': 'Bearer ' + uni.getStorageSync('SYS_JWT_TOKEN') },
    success: (res) => {
      hideLoadingSafely()
      if (res.data && res.data.code === 200) {
        uni.showToast({ title: '通讯频道绑定成功', icon: 'success' })
      } else {
        uni.showToast({ title: res.data?.msg || '绑定失败', icon: 'none' })
      }
    },
    fail: (err) => {
      hideLoadingSafely()
      console.warn('手机号绑定请求失败:', err)
      uni.showToast({ title: '【通讯黑洞】绑定请求失联', icon: 'none' })
    }
  })
}

/** 去游客体验 */
const goVisitor = () => {
  uni.navigateTo({ url: '/pages/login/visitor' })
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex; flex-direction: column;
}

.login-content {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 0 48rpx;
  margin-top: -60rpx; // 向上偏移整体重心
}

// ========== 赛博标志区 ==========
.logo-section {
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 60rpx;
}

.cyber-shield {
  width: 160rpx; height: 160rpx;
  background: radial-gradient(circle, rgba(0, 244, 163, 0.15) 0%, transparent 70%);
  border: 1px solid rgba(0, 244, 163, 0.5);
  box-shadow: 0 0 40rpx rgba(0, 244, 163, 0.3);
  transform: rotate(45deg); // 变形成棱形
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; margin-bottom: 48rpx;
  
  .glitch-line {
    position: absolute; top: 0; left: -100%; right: 100%; height: 2px;
    background: #FFF; box-shadow: 0 0 20rpx #FFF;
    animation: hackScan 2s infinite linear;
  }
}
@keyframes hackScan { 100% { left: 100%; right: -100%; top: 100%; } }

.shield-text {
  transform: rotate(-45deg); // 文字摆正
  font-family: 'Fira Code', monospace;
  font-size: 32rpx; font-weight: 900; color: $primary;
}

.logo-title {
  font-family: 'SF Pro Display', sans-serif;
  font-size: 48rpx; font-weight: 800; color: $text-primary;
  letter-spacing: 6rpx;
}

.logo-desc {
  font-family: 'Fira Code', monospace;
  font-size: 20rpx; color: rgba(0, 244, 163, 0.6);
  margin-top: 16rpx; text-shadow: 0 0 10rpx rgba(0, 244, 163, 0.3);
}

// ========== 玻璃拟态特性区 ==========
.features { width: 100%; margin-bottom: 80rpx; }

.feature-item {
  display: flex; align-items: center;
  padding: 24rpx !important; margin: 0 0 24rpx 0 !important;
  background: rgba(15, 23, 42, 0.6) !important;
}

.feature-icon-box {
  width: 64rpx; height: 64rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  display: flex; align-items: center; justify-content: center;
  margin-right: 24rpx; border-radius: 8rpx;
}
.feature-icon {
  font-family: 'Fira Code', monospace;
  font-size: 18rpx; font-weight: 800; color: #FFF;
}

.feature-info { flex: 1; }
.feature-title { font-size: 28rpx; font-weight: 700; color: #FFF; display: block; margin-bottom: 4rpx; }
.feature-desc { font-size: 20rpx; color: $text-secondary; display: block; }

// ========== 登入按钮 ==========
.login-actions { width: 100%; margin-bottom: 48rpx; }

.wx-login-btn {
  display: flex; align-items: center; justify-content: center;
  background: $primary; color: $black-zero;
  border: 2px solid $primary; border-radius: 8rpx;
  height: 96rpx; font-size: 32rpx; font-weight: 800;
  box-shadow: 0 0 40rpx $primary-glow;
  transition: all 0.2s;
  &::after { border: none; }
  &:active { background: transparent; color: $primary; box-shadow: inset 0 0 20rpx $primary; }
}

.wx-icon { 
  font-family: 'Fira Code', monospace; 
  font-size: 24rpx; margin-right: 16rpx; font-weight: 900;
}

.visitor-entry { text-align: center; margin-top: 32rpx; padding: 20rpx; }
.glitch-visitor {
  font-family: 'Fira Code', monospace;
  font-size: 20rpx; color: rgba(255, 255, 255, 0.4);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2); padding-bottom: 4rpx;
  &:active { color: $primary; border-color: $primary; }
}

// ========== 签名协议 ==========
.agreement {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
  padding-bottom: 60rpx;
}
.agreement-text { font-size: 20rpx; color: rgba(255, 255, 255, 0.3); }
.agreement-link { 
  font-size: 20rpx; color: rgba(255, 255, 255, 0.6); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); 
  margin: 0 4rpx;
}
</style>

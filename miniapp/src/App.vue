<script>
export default {
  onLaunch() {
    console.log('隐私管家启动 - CYBER_MODE: ON')
  },
  onShow() {},
  onHide() {}
}
</script>

<style lang="scss">
@import '@/styles/common.scss';

/* 全局滚动隐藏 */
::-webkit-scrollbar { display: none; }

/* 定义核心极客基因 */
page {
  /* 强行暗环境 */
  background-color: #020617;
  color: #F8FAFC;
  /* 更精巧和锋利的西欧排版字体串 */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
</style>

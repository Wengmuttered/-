// ============================================================
// Mock 数据 — 解读、识别、消息、反馈等
// ============================================================

/** 隐私政策解读结果示例 */
export const mockInterpretResult = {
  id: 1,
  inputType: 'name',
  inputContent: '抖音',
  collectScope: '设备信息（IMEI、MAC地址、Android ID）、精确位置、通讯录、相册、剪贴板内容、浏览记录、搜索记录、关注和互动行为',
  usagePurpose: '个性化推荐、广告投放、用户画像构建、安全风控、数据分析与统计',
  shareRisk: '与字节跳动关联公司共享数据；与广告合作方共享设备标识和行为数据；部分数据存储在海外服务器',
  riskConclusion: '该App隐私政策存在中等风险，采集范围超出基础功能必要性，特别是剪贴板和精确位置的持续采集。广告相关数据共享缺乏用户主动控制。',
  suggestion: '1. 关闭不必要权限（通讯录、精确位置）\n2. 在App设置中关闭"个性化推荐"\n3. 定期清除App缓存数据\n4. 关注隐私政策更新通知',
  status: 3,
  createdAt: '2026-04-13 21:00:00'
}

/** 图片识别结果示例 */
export const mockImageAnalysis = {
  id: 1,
  sensitiveTags: ['身份证号', '手机号', '银行卡号'],
  riskLevel: 'high',
  explanation: '检测到截图中包含身份证号码、手机号码和部分银行卡号信息。这些敏感信息如果被分享或泄露，可能被用于身份盗用、诈骗或非法金融操作。',
  suggestion: '1. 立即删除该截图，避免存储在云相册中\n2. 检查是否已将该截图通过社交软件发送给他人\n3. 如已外传，建议修改相关银行卡密码\n4. 今后避免对含有敏感信息的页面截图',
  status: 3
}

/** 链接扫描结果示例 */
export const mockLinkScanResult = {
  id: 1,
  scanType: 'link',
  inputContent: 'http://wx-prize.top/claim?id=88888',
  resultSummary: '该链接为高风险钓鱼网站，伪装为微信活动页面诱导用户输入个人信息。',
  riskLevel: 'high',
  riskReason: '1. 域名与微信官方域名不符（非 weixin.qq.com）\n2. 页面要求输入手机号、验证码等敏感信息\n3. 该域名注册时间不足 7 天\n4. SSL 证书异常',
  suggestion: '1. 不要点击该链接或在页面输入任何信息\n2. 如已输入手机号，注意防范诈骗电话\n3. 可举报该链接至微信安全中心\n4. 类似"领奖""中奖"链接需警惕',
  status: 3
}

/** 消息列表 */
export const mockMessages = [
  { id: 1, msgType: 'check', title: '体检完成通知', content: '您的隐私体检已完成，综合评分 72 分，发现 3 个高危问题需要处理。', status: 0, jumpType: 'check_result', jumpTarget: '1', sendTime: '2026-04-13 20:30' },
  { id: 2, msgType: 'reminder', title: '权限变更提醒', content: '检测到"抖音"新增了麦克风权限请求，建议关注。', status: 0, jumpType: 'risk_detail', jumpTarget: 'permission', sendTime: '2026-04-13 18:00' },
  { id: 3, msgType: 'share', title: '家庭共享通知', content: '妈妈向您共享了一条风险提醒，请查看。', status: 1, jumpType: 'share_record', jumpTarget: '2', sendTime: '2026-04-12 18:20' },
  { id: 4, msgType: 'feedback', title: '反馈回复', content: '您提交的反馈已处理完毕，感谢您的支持！', status: 1, jumpType: 'feedback_detail', jumpTarget: '1', sendTime: '2026-04-11 10:00' },
  { id: 5, msgType: 'system', title: '系统升级通知', content: '隐私管家 V1.1 版本已发布，新增二维码风险扫描功能。', status: 1, jumpType: '', jumpTarget: '', sendTime: '2026-04-10 09:00' },
  { id: 6, msgType: 'check', title: '定期体检提醒', content: '距离上次体检已超过 7 天，建议重新进行隐私体检。', status: 0, jumpType: 'check_start', jumpTarget: '', sendTime: '2026-04-09 08:00' }
]

/** 操作记录 */
export const mockOperationRecords = [
  { type: 'check', title: '隐私体检', detail: '综合评分 72 分', time: '2026-04-13 20:30', icon: '🔍' },
  { type: 'image', title: '图片识别', detail: '检测到 3 项敏感信息', time: '2026-04-13 15:00', icon: '🖼️' },
  { type: 'link', title: '链接扫描', detail: '高风险钓鱼链接', time: '2026-04-12 20:00', icon: '🔗' },
  { type: 'share', title: '共享提醒', detail: '向妈妈共享了体检报告', time: '2026-04-12 18:20', icon: '👨‍👩‍👧' },
  { type: 'interpret', title: '政策解读', detail: '解读了抖音隐私政策', time: '2026-04-11 16:00', icon: '📋' },
  { type: 'check', title: '隐私体检', detail: '综合评分 65 分', time: '2026-04-06 15:20', icon: '🔍' },
  { type: 'qrcode', title: '二维码扫描', detail: '安全链接', time: '2026-04-05 10:00', icon: '📱' }
]

/** 反馈类型 */
export const mockFeedbackTypes = [
  { value: 'problem', label: '问题反馈' },
  { value: 'misreport', label: '误报反馈' },
  { value: 'suggestion', label: '功能建议' },
  { value: 'appeal', label: '申诉' }
]

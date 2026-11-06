// ============================================================
// Mock 数据 — 风险体检相关
// ============================================================

/** 最新一次体检结果 */
export const mockLatestCheck = {
  id: 1,
  userId: 1,
  totalScore: 72,
  riskLevel: 'medium',
  summary: '您的隐私安全状况为中等风险，发现 3 个高危问题需要优先处理。',
  createdAt: '2026-04-13 20:30:00'
}

/** 五维评分 */
export const mockDimensionScores = [
  { dimensionType: 'permission', label: '权限风险', score: 65, riskLevel: 'medium', icon: '🔐', detail: '发现 3 个App获取了不必要的敏感权限' },
  { dimensionType: 'account', label: '账号安全', score: 50, riskLevel: 'medium', icon: '🔑', detail: '存在 2 个弱密码和 1 组重复密码' },
  { dimensionType: 'exposure', label: '隐私暴露', score: 85, riskLevel: 'low', icon: '👁️', detail: '近期未发现明显的隐私信息暴露' },
  { dimensionType: 'fraud', label: '诈骗链接', score: 90, riskLevel: 'safe', icon: '🔗', detail: '未发现可疑链接或钓鱼网站' },
  { dimensionType: 'policy', label: '政策风险', score: 60, riskLevel: 'medium', icon: '📋', detail: '2 个App的隐私政策存在过度采集嫌疑' }
]

/** 风险问题清单 */
export const mockIssueItems = [
  { id: 1, issueType: 'permission', riskLevel: 'high', title: '微信读取通讯录权限', description: '微信获取了通讯录权限，可能导致联系人信息被上传同步。', suggestion: '进入手机设置 → 应用权限 → 微信 → 关闭通讯录权限', priority: 9 },
  { id: 2, issueType: 'account', riskLevel: 'high', title: '淘宝使用弱密码', description: '您的淘宝账号密码强度过低，仅包含纯数字，容易被暴力破解。', suggestion: '立即修改淘宝密码，使用大小写字母+数字+特殊字符组合', priority: 8 },
  { id: 3, issueType: 'policy', riskLevel: 'high', title: '拼多多过度采集位置信息', description: '拼多多隐私政策声明持续采集精确位置信息，超出购物必要范围。', suggestion: '将拼多多的位置权限改为"仅使用时允许"或关闭', priority: 7 },
  { id: 4, issueType: 'permission', riskLevel: 'medium', title: '抖音相册读取权限', description: '抖音获取了相册完整读取权限，可扫描您的全部照片。', suggestion: '将抖音相册权限改为"选择照片"而非"所有照片"', priority: 5 },
  { id: 5, issueType: 'account', riskLevel: 'medium', title: '美团与淘宝使用相同密码', description: '检测到美团和淘宝使用了相同密码，一旦泄露将影响多个平台。', suggestion: '为不同平台设置不同密码，建议使用密码管理器', priority: 5 },
  { id: 6, issueType: 'permission', riskLevel: 'low', title: '高德地图后台定位', description: '高德地图在后台持续获取位置信息，消耗电量和隐私风险较低。', suggestion: '如非必要，可关闭高德地图的后台定位权限', priority: 3 }
]

/** 体检历史记录 */
export const mockCheckHistory = [
  { id: 1, totalScore: 72, riskLevel: 'medium', issueCount: 6, createdAt: '2026-04-13 20:30' },
  { id: 2, totalScore: 65, riskLevel: 'medium', issueCount: 8, createdAt: '2026-04-06 15:20' },
  { id: 3, totalScore: 82, riskLevel: 'low', issueCount: 3, createdAt: '2026-03-28 10:00' },
  { id: 4, totalScore: 58, riskLevel: 'medium', issueCount: 10, createdAt: '2026-03-15 14:30' }
]

/** 权限风险详情 */
export const mockPermissionRisks = [
  { appName: '微信', permission: '通讯录', riskLevel: 'high', reason: '可能上传您的联系人信息', suggestion: '关闭通讯录权限' },
  { appName: '抖音', permission: '相册(全部)', riskLevel: 'medium', reason: '可扫描您的全部照片', suggestion: '改为"选择照片"模式' },
  { appName: '拼多多', permission: '精确位置(始终)', riskLevel: 'medium', reason: '持续采集位置信息', suggestion: '改为"仅使用时允许"' },
  { appName: '高德地图', permission: '后台定位', riskLevel: 'low', reason: '后台持续获取位置', suggestion: '关闭后台定位权限' },
  { appName: '支付宝', permission: '相机', riskLevel: 'safe', reason: '用于人脸识别和扫码', suggestion: '建议保留' },
  { appName: '微博', permission: '麦克风', riskLevel: 'low', reason: '可能在后台录音', suggestion: '仅使用时允许' }
]

/** 账号安全详情 */
export const mockAccountAssets = [
  { id: 1, platformName: '淘宝', accountIdentifier: 'wx****88', hasWeakPassword: true, hasDuplicatePassword: true, riskTips: '弱密码 + 与美团密码相同' },
  { id: 2, platformName: '美团', accountIdentifier: '138****8888', hasWeakPassword: false, hasDuplicatePassword: true, riskTips: '与淘宝密码相同' },
  { id: 3, platformName: '京东', accountIdentifier: 'jd****66', hasWeakPassword: false, hasDuplicatePassword: false, riskTips: '密码安全' },
  { id: 4, platformName: '微博', accountIdentifier: 'wb****99', hasWeakPassword: true, hasDuplicatePassword: false, riskTips: '密码过于简单' },
  { id: 5, platformName: '支付宝', accountIdentifier: '138****8888', hasWeakPassword: false, hasDuplicatePassword: false, riskTips: '密码安全' }
]

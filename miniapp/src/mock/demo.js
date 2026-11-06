import {
  mockInterpretResult,
  mockImageAnalysis,
  mockLinkScanResult,
  mockMessages,
  mockOperationRecords
} from '@/mock/modules.js'
import {
  mockLatestCheck,
  mockDimensionScores,
  mockIssueItems,
  mockCheckHistory,
  mockPermissionRisks,
  mockAccountAssets
} from '@/mock/risk.js'
import { mockUser, mockFamilyMembers } from '@/mock/user.js'

const STORAGE_KEYS = {
  checkResult: 'SYS_DEMO_CHECK_RESULT',
  checkHistory: 'SYS_DEMO_CHECK_HISTORY',
  detectResults: 'SYS_DEMO_DETECT_RESULTS',
  interpretResults: 'SYS_DEMO_INTERPRET_RESULTS',
  messages: 'SYS_DEMO_MESSAGES',
  records: 'SYS_DEMO_RECORDS',
  familyMembers: 'SYS_DEMO_FAMILY_MEMBERS',
  familyInviteCode: 'SYS_DEMO_FAMILY_INVITE_CODE'
}

const clone = (value) => {
  if (value === undefined || value === null) return value
  return JSON.parse(JSON.stringify(value))
}

const readJSON = (key, fallback = null) => {
  try {
    const raw = uni.getStorageSync(key)
    if (!raw) return clone(fallback)
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (error) {
    return clone(fallback)
  }
}

const writeJSON = (key, value) => {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (error) {
    uni.setStorageSync(key, value)
  }
}

const pad = (value) => String(value).padStart(2, '0')

export const formatNow = () => {
  const now = new Date()
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('-') + ' ' + [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':')
}

const buildId = (prefix) => `demo-${prefix}-${Date.now()}`

const upsertById = (list, item) => {
  const next = clone(list) || []
  const filtered = next.filter((current) => String(current.id) !== String(item.id))
  filtered.unshift(item)
  return filtered
}

const getStoredMessages = () => readJSON(STORAGE_KEYS.messages, clone(mockMessages))
const saveMessages = (messages) => writeJSON(STORAGE_KEYS.messages, messages)

const getStoredRecords = () => readJSON(STORAGE_KEYS.records, clone(mockOperationRecords))
const saveRecords = (records) => writeJSON(STORAGE_KEYS.records, records)

const appendRecord = (record) => {
  const records = getStoredRecords()
  saveRecords([{ ...record }, ...records])
}

const appendMessage = (message) => {
  const messages = getStoredMessages()
  saveMessages([{ ...message }, ...messages])
}

export const getDemoCheckResult = () => {
  const stored = readJSON(STORAGE_KEYS.checkResult)
  if (stored) return stored

  const check = {
    ...clone(mockLatestCheck),
    id: buildId('check'),
    createdAt: formatNow()
  }

  const payload = {
    check,
    dimensions: clone(mockDimensionScores),
    issues: clone(mockIssueItems).slice(0, 5)
  }

  writeJSON(STORAGE_KEYS.checkResult, payload)
  return payload
}

export const saveDemoCheckResult = () => {
  const payload = getDemoCheckResult()
  payload.check = {
    ...payload.check,
    id: buildId('check'),
    createdAt: formatNow()
  }
  payload.check.summary = '本次演示体检已完成，系统自动生成离线分析结果，便于展示完整交互链路。'
  writeJSON(STORAGE_KEYS.checkResult, payload)

  const historyEntry = {
    id: payload.check.id,
    totalScore: payload.check.totalScore,
    riskLevel: payload.check.riskLevel,
    summary: payload.check.summary,
    issueCount: payload.issues.length,
    createdAt: payload.check.createdAt
  }
  const history = getDemoCheckHistory()
  writeJSON(STORAGE_KEYS.checkHistory, upsertById(history, historyEntry))

  appendRecord({
    type: 'check',
    title: '隐私体检',
    detail: `综合评分 ${payload.check.totalScore} 分，发现 ${payload.issues.length} 项风险`,
    time: payload.check.createdAt,
    icon: '🔍'
  })

  appendMessage({
    id: buildId('msg-check'),
    msgType: 'check',
    title: '体检完成通知',
    content: `本次体检已完成，综合评分 ${payload.check.totalScore} 分，请查看风险问题清单。`,
    status: 0,
    jumpType: 'check_result',
    jumpTarget: String(payload.check.id),
    sendTime: payload.check.createdAt
  })

  return payload
}

export const getDemoCheckHistory = () => {
  const stored = readJSON(STORAGE_KEYS.checkHistory)
  if (stored?.length) return stored

  const latest = getDemoCheckResult().check
  return [
    {
      id: latest.id,
      totalScore: latest.totalScore,
      riskLevel: latest.riskLevel,
      summary: latest.summary,
      issueCount: mockIssueItems.length,
      createdAt: latest.createdAt
    },
    ...clone(mockCheckHistory)
  ]
}

export const getDemoDashboardData = () => {
  const payload = getDemoCheckResult()
  const messages = getDemoMessages()
  return {
    user: clone(mockUser),
    latestCheck: payload.check,
    dimensions: payload.dimensions,
    topIssues: payload.issues.slice(0, 3),
    unreadCount: messages.filter((item) => item.status === 0).length
  }
}

export const getDemoProfileData = () => {
  const payload = getDemoCheckResult()
  const familyMembers = getDemoFamilyMembers()
  return {
    nickname: mockUser.nickname,
    phone: mockUser.phone,
    trustRating: payload.check.totalScore,
    stats: [
      { label: '体检次数', value: getDemoCheckHistory().length },
      { label: '高危问题', value: payload.issues.filter((item) => item.riskLevel === 'high').length },
      { label: '家庭成员', value: familyMembers.length }
    ]
  }
}

export const createDemoInterpretTask = (content, inputType = 'name') => {
  const taskId = buildId('interpret')
  const result = {
    ...clone(mockInterpretResult),
    id: taskId,
    status: 'COMPLETED',
    inputType,
    inputContent: content || mockInterpretResult.inputContent,
    resultSummary: `${content || '该应用'}的隐私政策存在中等风险，存在过度收集设备信息、位置和行为数据的情况，建议关闭非必要授权并定期复核设置。`,
    advice: '1. 关闭不必要的定位、通讯录、剪贴板授权\n2. 在应用设置中关闭个性化推荐和数据共享\n3. 定期清理缓存并复查隐私政策更新\n4. 对高敏感应用优先使用最小权限模式',
    createdAt: formatNow()
  }

  const results = readJSON(STORAGE_KEYS.interpretResults, {})
  results[taskId] = result
  writeJSON(STORAGE_KEYS.interpretResults, results)

  appendRecord({
    type: 'interpret',
    title: '政策解读',
    detail: `已完成 ${result.inputContent} 的隐私政策解读`,
    time: result.createdAt,
    icon: '📋'
  })

  return taskId
}

export const getDemoInterpretResult = (taskId) => {
  const results = readJSON(STORAGE_KEYS.interpretResults, {})
  if (taskId && results[taskId]) return results[taskId]
  return {
    ...clone(mockInterpretResult),
    status: 'COMPLETED'
  }
}

const buildImageDetectResult = (inputContent) => ({
  ...clone(mockImageAnalysis),
  id: buildId('image'),
  inputContent: inputContent || '本地图像',
  sensitiveTags: JSON.stringify(mockImageAnalysis.sensitiveTags),
  createdAt: formatNow()
})

const buildLinkDetectResult = (type, inputContent) => {
  const safeQr = type === 'qrcode' && String(inputContent || '').includes('example.com')
  return {
    ...clone(mockLinkScanResult),
    id: buildId(type),
    scanType: type,
    inputContent: inputContent || mockLinkScanResult.inputContent,
    riskLevel: safeQr ? 'low' : mockLinkScanResult.riskLevel,
    resultSummary: safeQr
      ? '该二维码指向常规测试页面，未发现明显诈骗风险，但仍建议核实来源。'
      : mockLinkScanResult.resultSummary,
    riskReason: safeQr
      ? '1. 链接指向测试站点\n2. 未发现明显伪装或敏感信息诱导\n3. 建议继续核实二维码来源'
      : mockLinkScanResult.riskReason,
    suggestion: safeQr
      ? '1. 可继续访问，但请确认发布方身份\n2. 不要在页面填写支付密码或验证码\n3. 遇到要求转账的页面应立即退出'
      : mockLinkScanResult.suggestion,
    createdAt: formatNow()
  }
}

export const createDemoDetectResult = (type, inputContent = '') => {
  const result = type === 'image'
    ? buildImageDetectResult(inputContent)
    : buildLinkDetectResult(type, inputContent)

  const results = readJSON(STORAGE_KEYS.detectResults, {})
  results[`${type}:${result.id}`] = result
  results[`latest:${type}`] = result
  writeJSON(STORAGE_KEYS.detectResults, results)

  appendRecord({
    type,
    title: type === 'image' ? '图片识别' : type === 'qrcode' ? '二维码扫描' : '链接扫描',
    detail: type === 'image'
      ? `检测到 ${JSON.parse(result.sensitiveTags).length} 项敏感信息`
      : result.riskLevel === 'high'
        ? '发现高风险可疑链接'
        : '已完成链接风险分析',
    time: result.createdAt,
    icon: type === 'image' ? '🖼️' : '🔗'
  })

  return result
}

export const getDemoDetectResult = (type, id) => {
  const results = readJSON(STORAGE_KEYS.detectResults, {})
  if (id && results[`${type}:${id}`]) return results[`${type}:${id}`]
  if (results[`latest:${type}`]) return results[`latest:${type}`]
  return type === 'image' ? buildImageDetectResult('本地图像') : buildLinkDetectResult(type, '')
}

export const getDemoMessages = () => getStoredMessages()

export const markDemoMessageRead = (messageId) => {
  const messages = getStoredMessages().map((item) => (
    String(item.id) === String(messageId) ? { ...item, status: 1 } : item
  ))
  saveMessages(messages)
  return messages.find((item) => String(item.id) === String(messageId))
}

export const getDemoMessageDetail = (messageId) => {
  const target = markDemoMessageRead(messageId)
  if (!target) return null
  return {
    ...target,
    createdAt: target.sendTime,
    isRead: target.status === 1
  }
}

export const getDemoOperationRecords = () => getStoredRecords()

export const getDemoInviteCode = () => {
  const stored = uni.getStorageSync(STORAGE_KEYS.familyInviteCode)
  return stored || '521886'
}

export const getDemoFamilyMembers = () => {
  const stored = readJSON(STORAGE_KEYS.familyMembers)
  if (stored?.length) return stored
  return clone(mockFamilyMembers)
}

export const bindDemoFamilyMember = (inviteCode) => {
  const members = getDemoFamilyMembers()
  const newMember = {
    id: buildId('family'),
    nickname: inviteCode === getDemoInviteCode() ? '家人设备' : '守护成员',
    relation: inviteCode === getDemoInviteCode() ? '家庭成员' : '已绑定成员',
    riskLevel: 'low',
    score: 88
  }
  const nextMembers = [...members, newMember]
  writeJSON(STORAGE_KEYS.familyMembers, nextMembers)
  appendRecord({
    type: 'family',
    title: '终端绑定',
    detail: `已完成与${newMember.nickname}的设备绑定`,
    time: formatNow(),
    icon: '👨‍👩‍👧'
  })
  return newMember
}

export const getDemoRiskCategories = () => clone(mockDimensionScores)
export const getDemoPermissionRisks = () => clone(mockPermissionRisks)
export const getDemoAccountAssets = () => clone(mockAccountAssets)

export const getDemoExposureData = () => ({
  scenes: [
    { icon: '🖼️', title: '聊天截图外传', desc: '截图中可能包含姓名、手机号、订单号等敏感信息。' },
    { icon: '📍', title: '朋友圈定位暴露', desc: '频繁公开定位会泄露居住地和行动轨迹。' },
    { icon: '💳', title: '支付页面截屏', desc: '收款码、银行卡尾号和账单信息不宜公开分享。' }
  ],
  tips: [
    '发布截图前先打码处理姓名、手机号、地址和订单号。',
    '关闭社交平台自动附带的定位、设备信息和时间水印。',
    '支付、证件、验证码相关页面不要截图保存或转发。'
  ]
})

export const getDemoFraudFeatures = () => ([
  { icon: '🌐', title: '仿冒官方域名', desc: '常通过相近字母或短横线伪装成支付、快递、银行页面。' },
  { icon: '🧾', title: '索取敏感信息', desc: '诱导填写验证码、银行卡号、身份证号或支付密码。' },
  { icon: '⏰', title: '制造时间压力', desc: '以“限时领取”“立即验证”“账号冻结”为由催促操作。' }
])

export const getDemoPolicyRiskApps = () => ([
  { icon: '🛍️', name: '拼多多', issue: '持续申请位置与设备标识权限，广告共享说明较宽泛。' },
  { icon: '🎵', name: '抖音', issue: '行为画像与个性化推荐相关描述较多，关闭入口不够明显。' }
])

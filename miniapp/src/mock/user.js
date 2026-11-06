// ============================================================
// Mock 数据 — 用户相关
// ============================================================

/** 当前登录用户 */
export const mockUser = {
  id: 1,
  openid: 'oX5Ht5xxxxx',
  nickname: '翁僖',
  avatarUrl: '',
  phone: '138****8888',
  gender: 1,
  status: 1,
  source: 'wechat',
  lastLoginAt: '2026-04-13 22:00:00'
}

/** 家庭绑定成员 */
export const mockFamilyMembers = [
  { id: 1, nickname: '翁僖', relation: '本人', avatarUrl: '', status: 1, riskLevel: 'medium', score: 72 },
  { id: 2, nickname: '妈妈', relation: '母亲', avatarUrl: '', status: 1, riskLevel: 'high', score: 45 },
  { id: 3, nickname: '爸爸', relation: '父亲', avatarUrl: '', status: 1, riskLevel: 'low', score: 85 }
]

/** 家庭绑定关系 */
export const mockFamilyBindings = [
  { id: 1, initiatorId: 1, acceptorId: 2, inviteCode: 'FAM-X8K2', status: 1, relationType: 'family', createdAt: '2026-04-01' },
  { id: 2, initiatorId: 1, acceptorId: 3, inviteCode: 'FAM-P3Y9', status: 1, relationType: 'family', createdAt: '2026-04-05' }
]

/** 共享记录 */
export const mockShareRecords = [
  { id: 1, sharerId: 1, targetId: 2, shareType: 'reminder', refType: 'risk_check_record', refId: 1, status: 1, createdAt: '2026-04-13 10:00' },
  { id: 2, sharerId: 2, targetId: 1, shareType: 'record', refType: 'link_scan_record', refId: 3, status: 1, createdAt: '2026-04-12 18:20' },
  { id: 3, sharerId: 1, targetId: 3, shareType: 'reminder', refType: 'risk_check_record', refId: 2, status: 2, revokeTime: '2026-04-11 10:00', createdAt: '2026-04-10 09:00' }
]

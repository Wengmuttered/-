package com.privacyguard.modules.family.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.family.dto.FamilyDtoGroup;
import com.privacyguard.modules.family.entity.ShareRecord;
import com.privacyguard.modules.family.repository.ShareRecordRepository;
import com.privacyguard.modules.family.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 家庭协同控制器
 * 提供家庭绑定、成员查询和共享管理功能
 */
@RestController
@RequestMapping("/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;
    private final ShareRecordRepository shareRecordRepository;

    // TODO: 从鉴权上下文获取用户ID
    private final Long CURRENT_USER_ID = 1L;

    /** 获取我的邀请码 */
    @GetMapping("/code")
    public R<String> getMyInviteCode() {
        return R.ok(familyService.generateInviteCode(CURRENT_USER_ID));
    }

    /** 绑定家庭成员 */
    @PostMapping("/bind")
    public R<Void> bindMember(@RequestBody FamilyDtoGroup.BindRequest request) {
        familyService.bindFamily(CURRENT_USER_ID, request.getInviteCode());
        return R.ok(null);
    }

    /** 获取家庭成员列表 */
    @GetMapping("/members")
    public R<List<FamilyDtoGroup.FamilyMemberResponse>> getMembers() {
        return R.ok(familyService.getFamilyMembers(CURRENT_USER_ID));
    }

    /** 获取共享记录列表 */
    @GetMapping("/shares")
    public R<List<ShareRecord>> getShareRecords() {
        return R.ok(shareRecordRepository.findBySharerIdOrderByCreatedAtDesc(CURRENT_USER_ID));
    }

    /** 发起共享提醒 */
    @PostMapping("/share/reminder")
    public R<ShareRecord> shareReminder(@RequestBody java.util.Map<String, Long> body) {
        Long targetId = body.get("targetId");
        ShareRecord record = new ShareRecord();
        record.setSharerId(CURRENT_USER_ID);
        record.setTargetId(targetId);
        record.setShareType("reminder");
        record.setStatus((short) 1);
        shareRecordRepository.save(record);
        return R.ok(record);
    }

    /** 共享指定记录 */
    @PostMapping("/share/record")
    public R<ShareRecord> shareRecord(@RequestBody java.util.Map<String, Object> body) {
        Long targetId = Long.valueOf(body.get("targetId").toString());
        String refType = body.getOrDefault("refType", "risk_check").toString();
        Long refId = Long.valueOf(body.getOrDefault("refId", 0).toString());

        ShareRecord record = new ShareRecord();
        record.setSharerId(CURRENT_USER_ID);
        record.setTargetId(targetId);
        record.setShareType("record");
        record.setRefType(refType);
        record.setRefId(refId);
        record.setStatus((short) 1);
        shareRecordRepository.save(record);
        return R.ok(record);
    }

    /** 撤回共享 */
    @PostMapping("/share/revoke/{id}")
    public R<Void> revokeShare(@PathVariable Long id) {
        ShareRecord record = shareRecordRepository.findById(id).orElse(null);
        if (record != null) {
            record.setStatus((short) 2);
            record.setRevokeTime(LocalDateTime.now());
            shareRecordRepository.save(record);
        }
        return R.ok(null);
    }
}

package com.privacyguard.modules.admin.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.user.entity.UserAccount;
import com.privacyguard.modules.user.repository.UserAccountRepository;
import com.privacyguard.modules.risk.entity.RiskCheckRecord;
import com.privacyguard.modules.risk.repository.RiskCheckRecordRepository;
import com.privacyguard.modules.family.repository.FamilyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Data;

/**
 * 后台用户管理控制器
 * 提供用户列表查询和用户详情查询
 */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserAccountRepository userAccountRepository;
    private final RiskCheckRecordRepository riskCheckRecordRepository;
    private final FamilyMemberRepository familyMemberRepository;

    @Data
    @Builder
    public static class AdminUserResponse {
        private Long id;
        private String name;
        private String phone;
        private String source;
        private Integer trustScore;
        private String riskLevel;
        private String status;
        private String joinDate;
    }

    /** 获取用户列表 */
    @GetMapping
    public R<List<AdminUserResponse>> listUsers() {
        List<UserAccount> accounts = userAccountRepository.findAll();

        List<AdminUserResponse> responses = accounts.stream().map(a -> {
            // 查询该用户最近一次体检记录来计算信誉分和风险等级
            List<RiskCheckRecord> records = riskCheckRecordRepository.findByUserIdOrderByCreatedAtDesc(a.getId());
            int score = records.isEmpty() ? 80 : (records.get(0).getTotalScore() != null ? records.get(0).getTotalScore() : 80);
            String level = score >= 80 ? "SAFE" : (score >= 60 ? "MEDIUM" : "HIGH");

            return AdminUserResponse.builder()
                    .id(a.getId())
                    .name(a.getNickname() != null ? a.getNickname() : "匿名用户")
                    .phone(a.getPhone())
                    .source(a.getSource())
                    .trustScore(score)
                    .riskLevel(level)
                    .status(a.getStatus() == 1 ? "ACTIVE" : "DISABLED")
                    .joinDate(a.getCreatedAt() != null ? a.getCreatedAt().toString().substring(0, 10) : "—")
                    .build();
        }).collect(Collectors.toList());

        return R.ok(responses);
    }

    /** 获取用户详情 */
    @GetMapping("/{id}")
    public R<Map<String, Object>> getUserDetail(@PathVariable Long id) {
        UserAccount account = userAccountRepository.findById(id).orElse(null);
        if (account == null) {
            return R.fail("用户不存在");
        }

        List<RiskCheckRecord> checkRecords = riskCheckRecordRepository.findByUserIdOrderByCreatedAtDesc(id);

        Map<String, Object> detail = new HashMap<>();
        detail.put("id", account.getId());
        detail.put("nickname", account.getNickname());
        detail.put("phone", account.getPhone());
        detail.put("source", account.getSource());
        detail.put("status", account.getStatus());
        detail.put("createdAt", account.getCreatedAt());
        detail.put("lastLoginAt", account.getLastLoginAt());
        detail.put("checkCount", checkRecords.size());
        detail.put("latestScore", checkRecords.isEmpty() ? null : checkRecords.get(0).getTotalScore());
        detail.put("latestRiskLevel", checkRecords.isEmpty() ? null : checkRecords.get(0).getRiskLevel());
        detail.put("checkHistory", checkRecords);

        return R.ok(detail);
    }

    /**
     * 查询指定用户的家庭绑定关系
     * 对应接口清单：家庭绑定关系查询
     */
    @GetMapping("/{id}/family")
    public R<Map<String, Object>> getUserFamilyRelations(@PathVariable Long id) {
        UserAccount account = userAccountRepository.findById(id).orElse(null);
        if (account == null) {
            return R.fail("用户不存在");
        }

        // 查询该用户的所有家庭成员绑定关系
        var members = familyMemberRepository.findAllByUserId(id);

        // 为每个家庭成员补充用户名信息
        List<Map<String, Object>> memberList = members.stream().map(m -> {
            Map<String, Object> memberMap = new HashMap<>();
            memberMap.put("id", m.getId());
            memberMap.put("targetUserId", m.getTargetUserId());
            memberMap.put("relation", m.getRelation());
            memberMap.put("status", "ACTIVE");
            memberMap.put("createdAt", m.getCreatedAt());
            // 查询目标用户的昵称
            UserAccount target = userAccountRepository.findById(m.getTargetUserId()).orElse(null);
            memberMap.put("targetNickname", target != null ? target.getNickname() : "未知用户");
            return memberMap;
        }).collect(Collectors.toList());

        return R.ok(Map.of(
            "userId", id,
            "nickname", account.getNickname() != null ? account.getNickname() : "匿名用户",
            "familyMemberCount", memberList.size(),
            "familyMembers", memberList
        ));
    }
}


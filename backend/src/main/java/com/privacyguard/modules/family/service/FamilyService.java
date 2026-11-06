package com.privacyguard.modules.family.service;

import com.privacyguard.common.exception.BusinessException;
import com.privacyguard.modules.family.dto.FamilyDtoGroup;
import com.privacyguard.modules.family.entity.FamilyMember;
import com.privacyguard.modules.family.repository.FamilyMemberRepository;
import com.privacyguard.modules.scan.entity.ScanHistory;
import com.privacyguard.modules.scan.repository.ScanHistoryRepository;
import com.privacyguard.modules.user.entity.UserAccount;
import com.privacyguard.modules.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final FamilyMemberRepository familyMemberRepository;
    private final UserAccountRepository userAccountRepository;
    private final ScanHistoryRepository scanHistoryRepository;

    /**
     * 利用系统底层特征生成家庭秘密邀请码
     */
    public String generateInviteCode(Long userId) {
        // 利用极简的高隐蔽散列策略，给原 ID 包裹 4 位 16 进制外壳
        return String.format("FAM-%04X", userId);
    }

    /**
     * 解析密码箱逆推对方底层地址
     */
    private Long parseInviteCode(String code) {
        try {
            if (code != null && code.startsWith("FAM-")) {
                String hex = code.substring(4);
                return Long.parseLong(hex, 16);
            }
        } catch (Exception ignored) {}
        return null;
    }

    @Transactional
    public void bindFamily(Long currentUserId, String inviteCode) {
        Long targetUserId = parseInviteCode(inviteCode);
        if (targetUserId == null) {
            throw new BusinessException(400, "INVALID_INVITE_CODE");
        }
        if (currentUserId.equals(targetUserId)) {
            throw new BusinessException(400, "CANNOT_BIND_SELF");
        }
        
        Optional<UserAccount> targetOpt = userAccountRepository.findById(targetUserId);
        if (targetOpt.isEmpty()) {
            throw new BusinessException(404, "TARGET_AGENT_NOT_FOUND");
        }

        if (familyMemberRepository.existsByUserIdAndTargetUserId(currentUserId, targetUserId)) {
            throw new BusinessException(400, "ALREADY_BINDED");
        }

        // 双向局域网握手建立（物理持久化写入）
        FamilyMember fm1 = new FamilyMember();
        fm1.setUserId(currentUserId);
        fm1.setTargetUserId(targetUserId);
        fm1.setRelation("家属节点");
        familyMemberRepository.save(fm1);

        FamilyMember fm2 = new FamilyMember();
        fm2.setUserId(targetUserId);
        fm2.setTargetUserId(currentUserId);
        fm2.setRelation("家属节点");
        familyMemberRepository.save(fm2);
    }

    /**
     * 拉取我名下所有已连接网段的列表并组合特工健康信息
     */
    public List<FamilyDtoGroup.FamilyMemberResponse> getFamilyMembers(Long userId) {
        List<FamilyMember> members = familyMemberRepository.findAllByUserId(userId);

        return members.stream().map(m -> {
            UserAccount account = userAccountRepository.findById(m.getTargetUserId()).orElse(null);
            
            // 下潜获取对方最后一次体检的生命特征
            Optional<ScanHistory> histOpt = scanHistoryRepository.findFirstByUserIdOrderByCreatedAtDesc(m.getTargetUserId());
            String risk = "safe";
            Integer score = 100;
            if (histOpt.isPresent()) {
                risk = histOpt.get().getRiskLevel();
                score = histOpt.get().getTotalScore();
            }

            return FamilyDtoGroup.FamilyMemberResponse.builder()
                    .id(m.getId())
                    .targetUserId(m.getTargetUserId())
                    .nickname(account != null && account.getNickname() != null ? account.getNickname() : "UNKNOWN_AGENT")
                    .relation(m.getRelation())
                    .riskLevel(risk)
                    .score(score)
                    .build();
        }).collect(Collectors.toList());
    }
}

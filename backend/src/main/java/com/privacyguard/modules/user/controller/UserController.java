package com.privacyguard.modules.user.controller;

import com.privacyguard.common.exception.BusinessException;
import com.privacyguard.common.result.R;
import com.privacyguard.modules.user.dto.UserProfileResponse;
import com.privacyguard.modules.user.entity.UserAccount;
import com.privacyguard.modules.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Optional;

/**
 * 身份特权认证及信息控制枢纽
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserAccountRepository userAccountRepository;

    @GetMapping("/profile")
    public R<UserProfileResponse> getUserProfile() {
        // [特工说明] 以 ID = 1L 替代当前会话获取逻辑，因为系统尚处在前线突围开发模式
        Long currentUserId = 1L;
        Optional<UserAccount> accountOpt = userAccountRepository.findById(currentUserId);
        
        if (accountOpt.isEmpty()) {
            throw new BusinessException(404, "AGENT_NOT_FOUND");
        }
        
        UserAccount account = accountOpt.get();
        
        // 提取物理身份中的部分信息并混合动态安全分级，投送给小程序的极光 UI 容器
        UserProfileResponse response = UserProfileResponse.builder()
                .nickname(account.getNickname() != null ? account.getNickname() : "GUEST-" + account.getId())
                .phone(account.getPhone() != null ? account.getPhone() : "13800000000") // TODO 后续更换为真实解析的号码脱敏
                .trustRating(89) 
                .stats(Arrays.asList(
                        UserProfileResponse.StatItem.builder().value(12).label("SCAN_LOGS").build(),
                        UserProfileResponse.StatItem.builder().value(2).label("RISK_FOUND").build(),
                        UserProfileResponse.StatItem.builder().value(1).label("CONNECTS").build(),
                        UserProfileResponse.StatItem.builder().value(99).label("OPERATIONS").build()
                ))
                .build();
                
        return R.ok(response);
    }
}

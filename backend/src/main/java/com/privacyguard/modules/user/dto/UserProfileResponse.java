package com.privacyguard.modules.user.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 【特工司令部身份面板返回实体】
 */
@Data
@Builder
public class UserProfileResponse {

    private String nickname;
    private String phone;
    private Integer trustRating; // 信用分数 (例如 72)
    
    private List<StatItem> stats;

    @Data
    @Builder
    public static class StatItem {
        private int value;
        private String label;
    }
}

package com.privacyguard.modules.family.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

public class FamilyDtoGroup {

    @Data
    public static class BindRequest {
        private String inviteCode;
    }

    @Data
    @Builder
    public static class FamilyMemberResponse {
        private Long id;
        private Long targetUserId;
        private String nickname;
        private String relation;
        private String riskLevel; // 取值: safe, low, medium, high
        private Integer score;
    }
}

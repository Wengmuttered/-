package com.privacyguard.modules.risk.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * 【首页全息雷达投影舱指令包】
 */
@Data
@Builder
public class HomeOverviewResponse {
    
    private UserBrief user;
    private LatestCheck latestCheck;
    private List<DimensionScore> dimensions;
    private List<IssueItem> topIssues;
    private int unreadCount;

    @Data
    @Builder
    public static class UserBrief {
        private String nickname;
    }

    @Data
    @Builder
    public static class LatestCheck {
        private int totalScore;
        private String riskLevel; // safe, low, medium, high
        private String createdAt;
    }

    @Data
    @Builder
    public static class DimensionScore {
        private String dimensionType;
        private String label;
        private int score;
    }

    @Data
    @Builder
    public static class IssueItem {
        private Long id;
        private String riskLevel;
        private String title;
        private String description;
    }
}

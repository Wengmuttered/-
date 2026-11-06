package com.privacyguard.modules.scan.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 【体检扫描战果输出报表】
 */
@Data
@Builder
public class ScanResultResponse {
    
    private CheckInfo check;
    private List<DimensionInfo> dimensions;
    private List<IssueInfo> issues;

    @Data
    @Builder
    public static class CheckInfo {
        private int totalScore;
        private String riskLevel;
        private String summary;
    }

    @Data
    @Builder
    public static class DimensionInfo {
        private String dimensionType;
        private String icon;
        private int score;
        private String label;
    }

    @Data
    @Builder
    public static class IssueInfo {
        private Long id;
        private String riskLevel;
        private String title;
        private String description;
        private String suggestion;
    }
}

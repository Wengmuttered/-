package com.privacyguard.modules.risk.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * 【5大数据雷达模块聚合报告】
 */
@Data
@Builder
public class RiskListResponse {
    private List<RiskCategory> categories;

    @Data
    @Builder
    public static class RiskCategory {
        private String dimensionType;
        private String label;
        private String detail;
        private int score;
        private String riskLevel; // safe, low, medium, high
        private String icon;
    }
}

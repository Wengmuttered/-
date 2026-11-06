package com.privacyguard.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 【最高管理枢纽大屏幕投射实体】
 */
@Data
@Builder
public class DashboardStatsResponse {

    private List<StatCube> systemStats;
    private List<SynergyFeed> liveFeeds;

    @Data
    @Builder
    public static class StatCube {
        private String label;
        private String value;
        private String status; // STABLE, WARNING, PEAKING, OPTIMAL
    }

    @Data
    @Builder
    public static class SynergyFeed {
        private String time;
        private String event;
        private boolean alert; // 是否为高警示级别
    }
}

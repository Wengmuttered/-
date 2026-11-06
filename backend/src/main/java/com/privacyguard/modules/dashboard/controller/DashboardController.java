package com.privacyguard.modules.dashboard.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.dashboard.dto.DashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * Web Admin 最高指挥链路：控制台监控管理探针
 */
@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    // 获取当前时间戳供滚动事件使用
    private String getNowTimeSub(int minusMinutes) {
        return LocalTime.now().minusMinutes(minusMinutes).format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    @GetMapping("/stats")
    public R<DashboardStatsResponse> getStats() {
        
        // TODO: 深度开发时将对接 user_account.count() 或者是 scan_history 的状态汇总，此处为了快速拉通网络协议用封装方法组装
        DashboardStatsResponse response = DashboardStatsResponse.builder()
                .systemStats(Arrays.asList(
                        DashboardStatsResponse.StatCube.builder().label("REGISTERED_ENTITIES").value("12,045").status("STABLE").build(),
                        DashboardStatsResponse.StatCube.builder().label("ACTIVE_CONNECTIONS").value("4,512").status("PEAKING").build(),
                        DashboardStatsResponse.StatCube.builder().label("DETECTED_THREATS").value("889").status("WARNING").build(),
                        DashboardStatsResponse.StatCube.builder().label("NETWORK_SYNERGY").value("92%").status("OPTIMAL").build()
                ))
                .liveFeeds(Arrays.asList(
                        DashboardStatsResponse.SynergyFeed.builder().time(getNowTimeSub(2)).event("家庭网段 [USER:AX99] 绑定请求验证通过").alert(false).build(),
                        DashboardStatsResponse.SynergyFeed.builder().time(getNowTimeSub(15)).event("安全工单 [FDK:9110] 异常APP举报被驳回").alert(true).build(),
                        DashboardStatsResponse.SynergyFeed.builder().time(getNowTimeSub(45)).event("管理员 [ROOT] 接入了全局网络态势").alert(false).build(),
                        DashboardStatsResponse.SynergyFeed.builder().time(getNowTimeSub(72)).event("节点组 [FAMILY:9A01] 发起了大规模深度探测").alert(false).build()
                ))
                .build();
                
        return R.ok(response);
    }
}

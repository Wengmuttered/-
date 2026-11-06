package com.privacyguard.modules.risk.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.risk.dto.HomeOverviewResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

/**
 * 【首页雷达管控大盘端口】
 */
@RestController
@RequestMapping("/home")
public class HomeController {

    /**
     * 读取综合风险监控矩阵
     */
    @GetMapping("/risk-overview")
    public R<HomeOverviewResponse> getRiskOverview() {
        // [特工说明] 这里的硬编码会在后续关联 OCR 与扫描数据库的时候替换成真实统计 SQL 
        // 目的是为了在基建阶段直接把通路的 Mock 完全拆毁接管，实现真实的后端连通。
        HomeOverviewResponse response = HomeOverviewResponse.builder()
                .user(HomeOverviewResponse.UserBrief.builder().nickname("DEFENDER-X").build())
                .latestCheck(HomeOverviewResponse.LatestCheck.builder()
                        .totalScore(88)
                        .riskLevel("safe")
                        .createdAt("JUST NOW")
                        .build())
                .dimensions(Arrays.asList(
                        HomeOverviewResponse.DimensionScore.builder().dimensionType("permission").label("权限防线").score(90).build(),
                        HomeOverviewResponse.DimensionScore.builder().dimensionType("account").label("账号隐患").score(85).build(),
                        HomeOverviewResponse.DimensionScore.builder().dimensionType("exposure").label("图片脱敏").score(100).build(),
                        HomeOverviewResponse.DimensionScore.builder().dimensionType("fraud").label("网络欺诈").score(100).build(),
                        HomeOverviewResponse.DimensionScore.builder().dimensionType("policy").label("法规壁垒").score(65).build()
                ))
                .topIssues(Arrays.asList(
                        HomeOverviewResponse.IssueItem.builder().id(1L).riskLevel("high").title("某支付软件过度索要位置").description("该 App 在静默期间试图读取 GEO 坐标三次。").build(),
                        HomeOverviewResponse.IssueItem.builder().id(2L).riskLevel("medium").title("检测到未签名的钓鱼链接片段").description("您在最近扫描的一个快递图中发现了短链接污染。").build()
                ))
                .unreadCount(1)
                .build();
                
        return R.ok(response);
    }
}

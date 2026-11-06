package com.privacyguard.modules.risk.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.risk.dto.RiskListResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

/**
 * 风险情报分类管理总端口
 */
@RestController
@RequestMapping("/risk")
public class RiskController {

    @GetMapping("/list")
    public R<RiskListResponse> getRiskList() {
        // [特工说明] 以此类推，将此处的数据在后期联调时替换为真实的表统计
        RiskListResponse response = RiskListResponse.builder()
                .categories(Arrays.asList(
                        RiskListResponse.RiskCategory.builder().dimensionType("permission").label("权限收纳站").detail("包含静默录音、后台定位等高危权限").score(79).riskLevel("medium").icon("SHIELD").build(),
                        RiskListResponse.RiskCategory.builder().dimensionType("account").label("账号密码防线").detail("密码强度与异地拦截审计").score(100).riskLevel("safe").icon("KEY").build(),
                        RiskListResponse.RiskCategory.builder().dimensionType("exposure").label("敏感图像侦测").detail("被其他软件在相册发现的越权痕迹").score(95).riskLevel("low").icon("EYE").build(),
                        RiskListResponse.RiskCategory.builder().dimensionType("fraud").label("深度黑产链接").detail("聊天应用中接收的恶毒附件探针").score(42).riskLevel("high").icon("ALERT").build(),
                        RiskListResponse.RiskCategory.builder().dimensionType("policy").label("无感霸王条款").detail("包含超范围索权的用户协定").score(80).riskLevel("low").icon("DOC").build()
                ))
                .build();

        return R.ok(response);
    }

    @GetMapping("/detail/{type}")
    public R<Object> getRiskDetail(@org.springframework.web.bind.annotation.PathVariable String type) {
        // [完成架构补洞] 下发给前线五座侦测雷达页的聚合分派！包含原始模型。
        if ("fraud".equals(type)) {
            return R.ok(java.util.Map.of("fraudFeatures", Arrays.asList(
                java.util.Map.of("icon", "🌐", "title", "域名伪造(后端拉取)", "desc", "使用与知名网站相似的域名，如 weixin-pay.top 等"),
                java.util.Map.of("icon", "🎁", "title", "利益诱惑(后端检测)", "desc", "\"中奖\"\"领红包\"\"免费领取\"等关键词常出现在钓鱼链接中")
            )));
        } else if ("exposure".equals(type)) {
            return R.ok(java.util.Map.of(
                "scenes", Arrays.asList(
                    java.util.Map.of("icon", "📸", "title", "云端截图泄露", "desc", "被云服务捕获的包含敏感数据的贴图。"),
                    java.util.Map.of("icon", "🏷️", "title", "照片地理位置", "desc", "被检测到在社区发过的包含了 EXIF 坐标的原图。")
                ),
                "tips", Arrays.asList("发送前勾选抹除地理信息功能", "使用隐私管家的擦除插件")
            ));
        } else if ("policy".equals(type)) {
            return R.ok(java.util.Map.of("riskApps", Arrays.asList(
                java.util.Map.of("name", "拼多多", "icon", "🛍️", "issue", "[后端策略雷达]：检测出持续采信精准位置协议"),
                java.util.Map.of("name", "某短视频", "icon", "🎵", "issue", "跨界提取剪贴板和录音权限去进行推送匹配")
            )));
        } else if ("permission".equals(type)) {
            return R.ok(java.util.Map.of("permissions", Arrays.asList(
                java.util.Map.of("appName", "微信", "permission", "后台录音", "riskLevel", "medium", "reason", "超出一般社交必要，存在偷听风险", "suggestion", "建议关闭其后台录音特权"),
                java.util.Map.of("appName", "某地图", "permission", "后台常驻定位", "riskLevel", "high", "reason", "过度追踪形成轨迹跟踪，非导航时不必要", "suggestion", "改为[仅使用时允许]")
            )));
        }
        return R.ok(java.util.Map.of());
    }
}

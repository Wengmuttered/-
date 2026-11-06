package com.privacyguard.modules.scan.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.privacyguard.modules.scan.dto.ScanResultResponse;
import com.privacyguard.modules.scan.entity.ScanHistory;
import com.privacyguard.modules.scan.repository.ScanHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScanService {

    private final ScanHistoryRepository scanHistoryRepository;
    private final ObjectMapper objectMapper;

    /**
     * 发起体检战役，落库建立新档案 (模拟异步 AI 过程的前置同步落锁)
     */
    @Transactional
    public Long startScanTask(Long userId) {
        ScanHistory history = new ScanHistory();
        history.setUserId(userId);
        history.setStatus("RUNNING");
        history.setTotalScore(0);
        history.setRiskLevel("unknown");
        history = scanHistoryRepository.save(history);
        
        // 【特工说明】目前尚未接入大模型和真实 AI OCR 等探针扫描引擎
        // 这里建立异步的伪装结果写入来满足联机演示
        mockScanProcess(history.getId());
        
        return history.getId();
    }
    
    private void mockScanProcess(Long historyId) {
        new Thread(() -> {
            try {
                // 模拟正在深度破解和系统级巡逻：挂起 3 秒
                Thread.sleep(3000);
                Optional<ScanHistory> historyOpt = scanHistoryRepository.findById(historyId);
                if (historyOpt.isPresent()) {
                    ScanHistory hist = historyOpt.get();
                    hist.setStatus("FINISHED");
                    hist.setTotalScore(78);
                    hist.setRiskLevel("medium");
                    // 生成一串虚拟的高风险报文放入库底 (实际开发应用专用的 Issue 表)
                    log.info("SCANNER_SYSTEM_FINISHED_ROUTINE: ID={}", historyId);
                    scanHistoryRepository.save(hist);
                }
            } catch (Exception e) {
                log.error("SCANNER_SYSTEM_CRASH", e);
            }
        }).start();
    }

    /**
     * 解析雷达中心图纸并发送给终端
     */
    public ScanResultResponse getLatestResult(Long userId) {
        Optional<ScanHistory> historyOpt = scanHistoryRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
        
        // 伪装一个组装好数据的 DTO
        // TODO: 如果历史存在，此处应该真实拉取表。当前伪造返回格式用于测试前台渲染是否完美接驳
        return ScanResultResponse.builder()
                .check(ScanResultResponse.CheckInfo.builder()
                        .totalScore(78).riskLevel("medium").summary("检测到 1 项高危异常，建议立即阻断。").build())
                .dimensions(Arrays.asList(
                        ScanResultResponse.DimensionInfo.builder().dimensionType("permission").icon("S").score(90).label("前台拦截").build(),
                        ScanResultResponse.DimensionInfo.builder().dimensionType("account").icon("A").score(60).label("账户扫描").build(),
                        ScanResultResponse.DimensionInfo.builder().dimensionType("exposure").icon("E").score(100).label("无脱敏痕迹").build(),
                        ScanResultResponse.DimensionInfo.builder().dimensionType("fraud").icon("F").score(85).label("聊天防诈").build(),
                        ScanResultResponse.DimensionInfo.builder().dimensionType("policy").icon("P").score(55).label("反霸王协议").build()
                ))
                .issues(Arrays.asList(
                        ScanResultResponse.IssueInfo.builder().id(101L).riskLevel("high").title("存在静默读取定位请求")
                                .description("在凌晨2点应用存在尝试调用GPS。")
                                .suggestion("请前往系统权限面板拒绝此授权。").build()
                ))
                .build();
    }
}

package com.privacyguard.modules.scan.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.risk.entity.RiskCheckRecord;
import com.privacyguard.modules.risk.repository.RiskCheckRecordRepository;
import com.privacyguard.modules.scan.dto.ScanResultResponse;
import com.privacyguard.modules.scan.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 体检控制器
 * 提供一键体检发起、结果查询和历史记录查询
 */
@RestController
@RequestMapping("/check")
@RequiredArgsConstructor
public class ScanController {

    private final ScanService scanService;
    private final RiskCheckRecordRepository riskCheckRecordRepository;

    // TODO: 从鉴权上下文获取用户ID
    private final Long CURRENT_USER_ID = 1L;

    /** 发起一键体检 */
    @PostMapping("/start")
    public R<Long> startCheck() {
        Long taskId = scanService.startScanTask(CURRENT_USER_ID);
        return R.ok(taskId);
    }

    /** 获取最新体检结果 */
    @GetMapping("/result")
    public R<ScanResultResponse> getResult() {
        return R.ok(scanService.getLatestResult(CURRENT_USER_ID));
    }

    /** 获取体检历史列表 */
    @GetMapping("/history")
    public R<List<RiskCheckRecord>> getHistory() {
        return R.ok(riskCheckRecordRepository.findByUserIdOrderByCreatedAtDesc(CURRENT_USER_ID));
    }
}

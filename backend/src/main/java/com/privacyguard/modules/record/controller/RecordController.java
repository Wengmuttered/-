package com.privacyguard.modules.record.controller;

import com.privacyguard.common.result.R;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 前端记录合并总纲
 */
@RestController
@RequestMapping("/records")
public class RecordController {

    @GetMapping("/list")
    public R<List<Map<String, Object>>> getOperationRecords() {
        // [完成架构补洞] 此处下发统合伪结构，模拟统合了 ScanHistory 和 InterpretTask
        return R.ok(Arrays.asList(
            Map.of("id", "R-100", "type", "SCAN", "time", "15:43:21", "detail", "发起全机雷达扫描", "alert", false),
            Map.of("id", "R-101", "type", "INTERPRET", "time", "12:00:11", "detail", "钓鱼链接解析：被拦截", "alert", true)
        ));
    }

    @DeleteMapping("/{id}")
    public R<Void> deleteRecord(@PathVariable String id) {
        // 软删除或者硬删除机制占位
        return R.ok(null);
    }
}

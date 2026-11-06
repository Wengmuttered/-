package com.privacyguard.modules.interpret.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.interpret.dto.InterpretDtoGroup;
import com.privacyguard.modules.interpret.service.InterpretService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 破译侦听引擎网关（兼含多端复合请求的统一总线）
 */
@RestController
@RequestMapping("/interpret")
@RequiredArgsConstructor
public class InterpretController {

    private final InterpretService interpretService;

    // TODO: 目前演示环境下直接从鉴权过滤器里传递 user_id 会更严密，这里暂用 Request Header 或拦截器的上下文代替
    private final Long CURRENT_USER = 1L;

    /**
     * 合并的探测入口池
     */
    @PostMapping("/submit")
    public R<Long> submitRequest(@RequestBody InterpretDtoGroup.SubmitRequest req) {
        Long taskId = interpretService.submitTask(CURRENT_USER, req);
        return R.ok(taskId);
    }

    /**
     * 实时查询战果
     */
    @GetMapping("/result/{taskId}")
    public R<InterpretDtoGroup.ResultResponse> fetchResult(@PathVariable Long taskId) {
        InterpretDtoGroup.ResultResponse res = interpretService.getResult(taskId);
        if (res == null) return R.fail(404, "TASK_NOT_FOUND");
        return R.ok(res);
    }
}

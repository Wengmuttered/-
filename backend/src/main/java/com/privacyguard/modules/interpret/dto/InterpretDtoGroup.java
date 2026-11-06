package com.privacyguard.modules.interpret.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 传输载体群：破译请求与报告单
 */
public class InterpretDtoGroup {

    @Data
    public static class SubmitRequest {
        private String taskType; // TEXT, LINK, IMAGE, APP
        private String content;  // 本体或者地址
    }

    @Data
    @Builder
    public static class ResultResponse {
        private Long taskId;
        private String status;
        private String taskType;
        private String riskLevel;
        private String resultSummary;
        private String advice;
    }
}

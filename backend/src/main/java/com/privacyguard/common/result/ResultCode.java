package com.privacyguard.common.result;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 统一状态码枚举
 * 定义业务中使用的所有响应状态码
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    // ==================== 通用状态码 ====================
    SUCCESS(200, "操作成功"),
    FAIL(500, "操作失败"),

    // ==================== 认证与授权 (1xxx) ====================
    UNAUTHORIZED(1001, "未登录或登录已过期"),
    FORBIDDEN(1002, "无访问权限"),
    TOKEN_EXPIRED(1003, "Token 已过期"),
    TOKEN_INVALID(1004, "Token 无效"),
    LOGIN_FAILED(1005, "登录失败"),
    ACCOUNT_DISABLED(1006, "账号已被禁用"),

    // ==================== 参数校验 (2xxx) ====================
    PARAM_ERROR(2001, "参数校验失败"),
    PARAM_MISSING(2002, "必填参数缺失"),
    PARAM_TYPE_ERROR(2003, "参数类型错误"),

    // ==================== 业务异常 (3xxx) ====================
    USER_NOT_FOUND(3001, "用户不存在"),
    RESOURCE_NOT_FOUND(3002, "资源不存在"),
    DATA_ALREADY_EXISTS(3003, "数据已存在"),
    OPERATION_FAILED(3004, "操作执行失败"),
    FAMILY_BINDDING_EXISTS(3005, "家庭绑定关系已存在"),
    INVITE_CODE_INVALID(3006, "邀请码无效或已过期"),

    // ==================== 文件处理 (4xxx) ====================
    FILE_UPLOAD_FAILED(4001, "文件上传失败"),
    FILE_TOO_LARGE(4002, "文件大小超出限制"),
    FILE_TYPE_NOT_ALLOWED(4003, "文件类型不允许"),

    // ==================== 任务处理 (5xxx) ====================
    TASK_SUBMIT_FAILED(5001, "任务提交失败"),
    TASK_PROCESSING(5002, "任务处理中，请稍后查询"),
    TASK_FAILED(5003, "任务执行失败");

    /** 状态码 */
    private final int code;

    /** 状态消息 */
    private final String message;
}

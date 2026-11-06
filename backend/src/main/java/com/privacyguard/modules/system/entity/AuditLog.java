package com.privacyguard.modules.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 审计日志实体
 * 记录登录、操作、配置变更、文件处理、消息发送等关键行为
 */
@Getter
@Setter
@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 日志类型：login/operation/config/file/message/share */
    @Column(name = "log_type", nullable = false, length = 30)
    private String logType;

    /** 操作人ID */
    @Column(name = "operator_id")
    private Long operatorId;

    /** 操作人类型：user/admin */
    @Column(name = "operator_type", length = 20)
    private String operatorType = "user";

    /** 操作人名称 */
    @Column(name = "operator_name", length = 64)
    private String operatorName;

    /** 动作描述 */
    @Column(name = "action", nullable = false, length = 100)
    private String action;

    /** 目标实体类型 */
    @Column(name = "target_type", length = 50)
    private String targetType;

    /** 目标实体ID */
    @Column(name = "target_id")
    private Long targetId;

    /** 详情 */
    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;

    /** 结果：success/fail */
    @Column(name = "result", length = 20)
    private String result = "success";

    /** IP 地址 */
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    /** 用户代理 */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.privacyguard.modules.family.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 家庭共享记录实体
 * 记录用户之间共享的提醒和结果摘要
 */
@Getter
@Setter
@Entity
@Table(name = "share_record")
public class ShareRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 共享人ID */
    @Column(name = "sharer_id", nullable = false)
    private Long sharerId;

    /** 接收人ID */
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    /** 共享类型：reminder-提醒共享 / record-记录共享 */
    @Column(name = "share_type", nullable = false, length = 20)
    private String shareType;

    /** 关联实体类型（如 risk_check_record / image_analysis_record） */
    @Column(name = "ref_type", length = 50)
    private String refType;

    /** 关联实体ID */
    @Column(name = "ref_id")
    private Long refId;

    /** 状态：1-已共享 2-已撤回 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 撤回时间 */
    @Column(name = "revoke_time")
    private LocalDateTime revokeTime;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

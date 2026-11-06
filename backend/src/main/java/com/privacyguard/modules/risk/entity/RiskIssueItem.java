package com.privacyguard.modules.risk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 风险问题明细实体
 * 体检后生成的具体风险问题项，包含建议和优先级
 */
@Getter
@Setter
@Entity
@Table(name = "risk_issue_item")
public class RiskIssueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 关联体检记录ID */
    @Column(name = "check_record_id", nullable = false)
    private Long checkRecordId;

    /** 问题类型 */
    @Column(name = "issue_type", nullable = false, length = 50)
    private String issueType;

    /** 风险等级 */
    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel;

    /** 问题标题 */
    @Column(name = "title", length = 200)
    private String title;

    /** 问题说明 */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** 处理建议 */
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private String suggestion;

    /** 优先级（数值越大越优先） */
    @Column(name = "priority")
    private Integer priority = 0;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

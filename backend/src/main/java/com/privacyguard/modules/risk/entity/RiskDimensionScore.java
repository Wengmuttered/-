package com.privacyguard.modules.risk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 五维评分明细实体
 * 每次体检对应五个维度的评分明细
 * 维度：权限风险(permission)、账号安全(account)、隐私暴露(exposure)、诈骗链接(fraud)、政策授权(policy)
 */
@Getter
@Setter
@Entity
@Table(name = "risk_dimension_score")
public class RiskDimensionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 关联体检记录ID */
    @Column(name = "check_record_id", nullable = false)
    private Long checkRecordId;

    /** 维度类型：permission/account/exposure/fraud/policy */
    @Column(name = "dimension_type", nullable = false, length = 50)
    private String dimensionType;

    /** 维度得分 */
    @Column(name = "score")
    private Integer score = 0;

    /** 风险等级 */
    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    /** 明细说明 */
    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

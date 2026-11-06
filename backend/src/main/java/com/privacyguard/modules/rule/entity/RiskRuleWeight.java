package com.privacyguard.modules.rule.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * 规则权重和阈值配置实体
 * 控制各风险维度的评分权重和高/中/低风险阈值
 */
@Getter
@Setter
@Entity
@Table(name = "risk_rule_weight")
public class RiskRuleWeight extends BaseEntity {

    /** 关联规则ID（可为空表示维度级配置） */
    @Column(name = "rule_id")
    private Long ruleId;

    /** 维度类型 */
    @Column(name = "dimension_type", nullable = false, length = 50)
    private String dimensionType;

    /** 权重 */
    @Column(name = "weight", precision = 5, scale = 2)
    private BigDecimal weight = new BigDecimal("1.00");

    /** 高风险阈值 */
    @Column(name = "threshold_high")
    private Integer thresholdHigh = 80;

    /** 中风险阈值 */
    @Column(name = "threshold_medium")
    private Integer thresholdMedium = 50;

    /** 低风险阈值 */
    @Column(name = "threshold_low")
    private Integer thresholdLow = 20;
}

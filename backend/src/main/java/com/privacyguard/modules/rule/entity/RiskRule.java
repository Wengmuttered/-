package com.privacyguard.modules.rule.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 风险规则实体
 * 由后台管理员配置，规则引擎加载并执行
 */
@Getter
@Setter
@Entity
@Table(name = "risk_rule")
public class RiskRule extends BaseEntity {

    /** 规则名称 */
    @Column(name = "rule_name", nullable = false, length = 100)
    private String ruleName;

    /** 规则编码（唯一） */
    @Column(name = "rule_code", unique = true, length = 64)
    private String ruleCode;

    /** 规则类型：permission/image/link/policy/account */
    @Column(name = "rule_type", nullable = false, length = 50)
    private String ruleType;

    /** 对应风险维度 */
    @Column(name = "dimension_type", length = 50)
    private String dimensionType;

    /** 条件表达式/规则描述 */
    @Column(name = "condition_expr", columnDefinition = "TEXT")
    private String conditionExpr;

    /** 规则说明 */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** 默认风险等级 */
    @Column(name = "risk_level", length = 20)
    private String riskLevel = "medium";

    /** 状态：0-停用 1-启用 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 排序 */
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}

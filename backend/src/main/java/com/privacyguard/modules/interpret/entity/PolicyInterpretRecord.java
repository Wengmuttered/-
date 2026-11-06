package com.privacyguard.modules.interpret.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 隐私政策解读记录实体
 * 支持四种输入方式：App名称(name)、链接(link)、文本(text)、截图(screenshot)
 */
@Getter
@Setter
@Entity
@Table(name = "policy_interpret_record")
public class PolicyInterpretRecord extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 输入类型：name/link/text/screenshot */
    @Column(name = "input_type", nullable = false, length = 20)
    private String inputType;

    /** 输入内容（名称、链接或文本摘要） */
    @Column(name = "input_content", columnDefinition = "TEXT")
    private String inputContent;

    /** 采集范围 */
    @Column(name = "collect_scope", columnDefinition = "TEXT")
    private String collectScope;

    /** 使用目的 */
    @Column(name = "usage_purpose", columnDefinition = "TEXT")
    private String usagePurpose;

    /** 共享风险 */
    @Column(name = "share_risk", columnDefinition = "TEXT")
    private String shareRisk;

    /** 风险结论 */
    @Column(name = "risk_conclusion", columnDefinition = "TEXT")
    private String riskConclusion;

    /** 建议 */
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private String suggestion;

    /** 任务状态：0-待提交 1-已提交 2-分析中 3-已完成 4-失败 */
    @Column(name = "status", nullable = false)
    private Short status = 0;
}

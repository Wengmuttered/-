package com.privacyguard.modules.risk.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 一键体检记录实体
 * 每次用户发起隐私体检会生成一条主记录
 */
@Getter
@Setter
@Entity
@Table(name = "risk_check_record")
public class RiskCheckRecord extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 总分 */
    @Column(name = "total_score")
    private Integer totalScore = 0;

    /** 风险等级：high/medium/low/safe */
    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    /** 体检摘要 */
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
}

package com.privacyguard.modules.ocr.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 图片识别结果摘要实体
 * 仅保留识别结果摘要，原图分析后立即删除
 */
@Getter
@Setter
@Entity
@Table(name = "image_analysis_record")
public class ImageAnalysisRecord extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 敏感信息标签（JSON数组） */
    @Column(name = "sensitive_tags", length = 500)
    private String sensitiveTags;

    /** 风险等级 */
    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    /** 解释文本 */
    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    /** 建议 */
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private String suggestion;

    /** 任务状态：0-待提交 1-已提交 2-分析中 3-已完成 4-失败 */
    @Column(name = "status", nullable = false)
    private Short status = 0;
}

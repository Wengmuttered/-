package com.privacyguard.modules.interpret.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 【AI 破译引擎追踪任务表】
 */
@Getter
@Setter
@Entity
@Table(name = "interpret_task")
public class InterpretTask extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 任务类型：TEXT, LINK, IMAGE, APP */
    @Column(name = "task_type", length = 32, nullable = false)
    private String taskType;

    /** 源内容（或者图片系统的内部OSS路径） */
    @Column(name = "content", columnDefinition = "text")
    private String content;

    /** PROCESSING, COMPLETED, FAILED */
    @Column(name = "status", length = 32, nullable = false)
    private String status;

    /** 返回的风险标签（如：high, safe, unknown） */
    @Column(name = "risk_level", length = 32)
    private String riskLevel;

    /** AI总结或者规则匹配出的人择解读结论 */
    @Column(name = "result_summary", columnDefinition = "text")
    private String resultSummary;
    
    /** 针对用户执行此命令的具体避险建议 */
    @Column(name = "advice", columnDefinition = "text")
    private String advice;
}

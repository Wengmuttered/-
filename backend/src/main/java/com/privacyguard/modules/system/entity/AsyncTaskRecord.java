package com.privacyguard.modules.system.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 异步任务记录实体
 * 统一管理 OCR、解读、扫描等异步任务的状态和结果
 */
@Getter
@Setter
@Entity
@Table(name = "async_task_record")
public class AsyncTaskRecord extends BaseEntity {

    /** 任务类型：ocr/interpret/scan */
    @Column(name = "task_type", nullable = false, length = 30)
    private String taskType;

    /** 关联实体类型 */
    @Column(name = "ref_type", length = 50)
    private String refType;

    /** 关联实体ID */
    @Column(name = "ref_id")
    private Long refId;

    /** 状态：0-待提交 1-已提交 2-分析中 3-已完成 4-失败 */
    @Column(name = "status", nullable = false)
    private Short status = 0;

    /** 耗时（毫秒） */
    @Column(name = "duration_ms")
    private Integer durationMs;

    /** 失败原因 */
    @Column(name = "fail_reason", columnDefinition = "TEXT")
    private String failReason;

    /** 重试次数 */
    @Column(name = "retry_count")
    private Integer retryCount = 0;

    /** 最大重试次数 */
    @Column(name = "max_retry")
    private Integer maxRetry = 3;
}

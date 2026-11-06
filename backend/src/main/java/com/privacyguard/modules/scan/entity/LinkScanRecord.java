package com.privacyguard.modules.scan.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 链接/二维码扫描结果实体
 * 存储用户主动提交的链接或二维码的风险扫描结果
 */
@Getter
@Setter
@Entity
@Table(name = "link_scan_record")
public class LinkScanRecord extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 扫描类型：link/qrcode */
    @Column(name = "scan_type", nullable = false, length = 20)
    private String scanType;

    /** 输入内容（链接或二维码内容摘要） */
    @Column(name = "input_content", columnDefinition = "TEXT")
    private String inputContent;

    /** 扫描结果摘要 */
    @Column(name = "result_summary", columnDefinition = "TEXT")
    private String resultSummary;

    /** 风险等级 */
    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    /** 风险原因 */
    @Column(name = "risk_reason", columnDefinition = "TEXT")
    private String riskReason;

    /** 建议 */
    @Column(name = "suggestion", columnDefinition = "TEXT")
    private String suggestion;

    /** 任务状态 */
    @Column(name = "status", nullable = false)
    private Short status = 0;
}

package com.privacyguard.modules.scan.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 【特工探针记录表】
 * 用来存档全维度安全矩阵每次对设备的深度扫描战果。
 */
@Getter
@Setter
@Entity
@Table(name = "scan_history")
public class ScanHistory extends BaseEntity {

    /** 归属于哪位安全设备账号 */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 雷达综合得分 (0-100) */
    @Column(name = "total_score")
    private Integer totalScore;

    /** 危机等级定性：safe, low, medium, high */
    @Column(name = "risk_level", length = 32)
    private String riskLevel;

    /** 任务状态：INITIALIZING, RUNNING, FINISHED, ERROR */
    @Column(name = "status", length = 32, nullable = false)
    private String status;
    
    /** 为了避免在初期联调引发过多碎表，先把结果和检测 JSON 面板打进报告本体内直接呈现 */
    @Column(name = "issue_payload", columnDefinition = "text")
    private String issuePayload;
}

package com.privacyguard.modules.admin.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 接收一线特工上传的错误反馈与修复建议的工单
 */
@Getter
@Setter
@Entity
@Table(name = "feedback_ticket")
public class FeedbackTicket extends BaseEntity {

    @Column(name = "reporter_id", length = 32)
    private String reporterId;

    @Column(name = "issue_type", length = 64)
    private String issueType; // BUG, FALSE_ALARM, SUGGESTION

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "status", length = 32)
    private String status; // PENDING, RESOLVED, REJECTED
}

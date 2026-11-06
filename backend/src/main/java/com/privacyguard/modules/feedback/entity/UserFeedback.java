package com.privacyguard.modules.feedback.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 用户反馈实体
 * 支持问题反馈(problem)、误报反馈(misreport)、建议(suggestion)、申诉(appeal)四种类型
 */
@Getter
@Setter
@Entity
@Table(name = "user_feedback")
public class UserFeedback extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 反馈类型：problem/misreport/suggestion/appeal */
    @Column(name = "feedback_type", nullable = false, length = 20)
    private String feedbackType;

    /** 反馈内容 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 附件地址（可选） */
    @Column(name = "attachment_url", length = 512)
    private String attachmentUrl;

    /** 关联实体类型 */
    @Column(name = "ref_type", length = 50)
    private String refType;

    /** 关联实体ID */
    @Column(name = "ref_id")
    private Long refId;

    /** 状态：0-待处理 1-处理中 2-已回复 3-已关闭 */
    @Column(name = "status", nullable = false)
    private Short status = 0;

    /** 处理人ID（后台管理员） */
    @Column(name = "handler_id")
    private Long handlerId;

    /** 处理备注 */
    @Column(name = "handler_note", columnDefinition = "TEXT")
    private String handlerNote;

    /** 回复内容 */
    @Column(name = "reply_content", columnDefinition = "TEXT")
    private String replyContent;
}

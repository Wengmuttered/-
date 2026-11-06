package com.privacyguard.modules.message.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 站内消息记录实体
 * 支持体检、提醒、共享、反馈、系统等多种消息类型
 */
@Getter
@Setter
@Entity
@Table(name = "message_record")
public class MessageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 接收用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 消息类型：check/reminder/share/feedback/system */
    @Column(name = "msg_type", nullable = false, length = 30)
    private String msgType;

    /** 消息标题 */
    @Column(name = "title", length = 200)
    private String title;

    /** 消息内容 */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /** 跳转类型 */
    @Column(name = "jump_type", length = 50)
    private String jumpType;

    /** 跳转目标 */
    @Column(name = "jump_target", length = 200)
    private String jumpTarget;

    /** 状态：0-未读 1-已读 */
    @Column(name = "status", nullable = false)
    private Short status = 0;

    /** 发送时间 */
    @Column(name = "send_time")
    private LocalDateTime sendTime = LocalDateTime.now();

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

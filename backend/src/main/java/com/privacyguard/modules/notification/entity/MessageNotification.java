package com.privacyguard.modules.notification.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 特工专属：中央站内信与告警池
 */
@Getter
@Setter
@Entity
@Table(name = "message_notification")
public class MessageNotification extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", length = 128)
    private String title;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "is_read")
    private Boolean isRead;
}

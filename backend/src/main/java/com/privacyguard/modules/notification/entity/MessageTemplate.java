package com.privacyguard.modules.notification.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 消息模板实体
 * 后台维护的站内消息和订阅消息模板
 */
@Getter
@Setter
@Entity
@Table(name = "message_template")
public class MessageTemplate extends BaseEntity {

    /** 模板名称 */
    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    /** 模板类型：in_app-站内消息 / subscribe-订阅消息 */
    @Column(name = "template_type", length = 30)
    private String templateType = "in_app";

    /** 模板内容 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 变量定义（JSON） */
    @Column(name = "variables", columnDefinition = "TEXT")
    private String variables;

    /** 状态：0-停用 1-启用 */
    @Column(name = "status", nullable = false)
    private Short status = 1;
}

package com.privacyguard.modules.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 游客体验会话实体
 * 游客可体验部分静态功能，会话过期后失效
 */
@Getter
@Setter
@Entity
@Table(name = "visitor_session")
public class VisitorSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 会话标识 */
    @Column(name = "session_token", nullable = false, unique = true, length = 128)
    private String sessionToken;

    /** 来源 */
    @Column(name = "source", length = 20)
    private String source = "miniapp";

    /** 失效时间 */
    @Column(name = "expire_at", nullable = false)
    private LocalDateTime expireAt;

    /** 转正式用户后的用户ID */
    @Column(name = "converted_user_id")
    private Long convertedUserId;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

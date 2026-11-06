package com.privacyguard.modules.notification.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 系统公告实体
 * 后台运营发布的系统级通知公告
 */
@Getter
@Setter
@Entity
@Table(name = "system_announcement")
public class SystemAnnouncement extends BaseEntity {

    /** 公告内容 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 推送范围：ALL-全部用户 / TAGGED-指定标签 */
    @Column(name = "scope", length = 30)
    private String scope = "ALL";

    /** 状态：DRAFT-草稿 / BROADCASTING-发布中 / CLOSED-已关闭 */
    @Column(name = "status", length = 30, nullable = false)
    private String status = "DRAFT";
}

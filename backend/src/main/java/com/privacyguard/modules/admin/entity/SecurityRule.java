package com.privacyguard.modules.admin.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 拦截规则与告警触发基建标本
 */
@Getter
@Setter
@Entity
@Table(name = "security_rule")
public class SecurityRule extends BaseEntity {

    @Column(name = "target_module", length = 64)
    private String targetModule;

    @Column(name = "evaluation_condition", length = 255)
    private String condition;

    @Column(name = "exec_action", length = 64)
    private String action;

    @Column(name = "status", length = 32)
    private String status; // ACTIVE, STANDBY
}

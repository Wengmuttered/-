package com.privacyguard.modules.system.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 后台管理员账号实体
 * Web 后台登录使用，存储密码哈希
 */
@Getter
@Setter
@Entity
@Table(name = "admin_account")
public class AdminAccount extends BaseEntity {

    /** 登录名 */
    @Column(name = "login_name", nullable = false, unique = true, length = 64)
    private String loginName;

    /** 密码哈希（BCrypt） */
    @Column(name = "password_hash", nullable = false, length = 128)
    private String passwordHash;

    /** 真实姓名 */
    @Column(name = "real_name", length = 64)
    private String realName;

    /** 手机号 */
    @Column(name = "phone", length = 20)
    private String phone;

    /** 邮箱 */
    @Column(name = "email", length = 100)
    private String email;

    /** 角色ID */
    @Column(name = "role_id")
    private Long roleId;

    /** 状态：0-禁用 1-正常 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 最近登录时间 */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}

package com.privacyguard.modules.user.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 用户账号实体
 * 对应小程序端的正式注册用户
 */
@Getter
@Setter
@Entity
@Table(name = "user_account")
public class UserAccount extends BaseEntity {

    /** 微信 openid，唯一标识 */
    @Column(name = "openid", length = 64, unique = true)
    private String openid;

    /** 微信 unionid */
    @Column(name = "unionid", length = 64)
    private String unionid;

    /** 手机号（脱敏存储） */
    @Column(name = "phone", length = 20)
    private String phone;

    /** 昵称 */
    @Column(name = "nickname", length = 64)
    private String nickname;

    /** 头像地址 */
    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    /** 性别：0-未知 1-男 2-女 */
    @Column(name = "gender")
    private Short gender = 0;

    /** 状态：0-禁用 1-正常 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 来源：wechat/phone */
    @Column(name = "source", length = 20)
    private String source = "wechat";

    /** 最近登录时间 */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}

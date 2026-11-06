package com.privacyguard.modules.account.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 账号资产摘要实体
 * 存储用户手动录入的账号清单，不保存密码
 */
@Getter
@Setter
@Entity
@Table(name = "account_asset_record")
public class AccountAssetRecord extends BaseEntity {

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 平台名称 */
    @Column(name = "platform_name", nullable = false, length = 100)
    private String platformName;

    /** 账号标识摘要（脱敏） */
    @Column(name = "account_identifier", length = 200)
    private String accountIdentifier;

    /** 风险提示 */
    @Column(name = "risk_tips", columnDefinition = "TEXT")
    private String riskTips;

    /** 弱密码标记 */
    @Column(name = "has_weak_password")
    private Boolean hasWeakPassword = false;

    /** 重复密码标记 */
    @Column(name = "has_duplicate_password")
    private Boolean hasDuplicatePassword = false;
}

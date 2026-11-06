package com.privacyguard.modules.asset.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 特工外部账号资产（用于密码强度与泄露风控）
 */
@Getter
@Setter
@Entity
@Table(name = "asset_account")
public class AssetAccount extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "platform_name", length = 32)
    private String platformName; // 如 QQ, 微博, 银行等

    @Column(name = "account_name", length = 64)
    private String accountName;

    // TODO 在正式防线中此项必须使用哈希脱敏密文落库。此处用来分析。
    @Column(name = "pwd_hash", length = 128)
    private String pwdHash; 

    @Column(name = "risk_level", length = 32)
    private String riskLevel; // SAFE, WEAK, REUSED, LEAKED
}

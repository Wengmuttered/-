package com.privacyguard.modules.system.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 组织扩展表实体
 * 多租户预留，一期单租户实现
 */
@Getter
@Setter
@Entity
@Table(name = "tenant_org_extension")
public class TenantOrgExtension extends BaseEntity {

    /** 租户ID（覆盖父类设置为唯一） */
    @Column(name = "tenant_id", nullable = false, unique = true, length = 64)
    private String tenantId = "default";

    /** 组织ID */
    @Column(name = "org_id", length = 64)
    private String orgId;

    /** 组织名称 */
    @Column(name = "org_name", length = 200)
    private String orgName;

    /** 联系人 */
    @Column(name = "contact_name", length = 64)
    private String contactName;

    /** 联系电话 */
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    /** 状态：0-禁用 1-正常 */
    @Column(name = "status", nullable = false)
    private Short status = 1;
}

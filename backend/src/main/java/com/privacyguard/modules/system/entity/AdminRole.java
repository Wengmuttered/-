package com.privacyguard.modules.system.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 后台角色实体
 * RBAC 权限模型中的角色定义
 */
@Getter
@Setter
@Entity
@Table(name = "admin_role")
public class AdminRole extends BaseEntity {

    /** 角色名称 */
    @Column(name = "role_name", nullable = false, length = 64)
    private String roleName;

    /** 角色编码（唯一） */
    @Column(name = "role_code", nullable = false, unique = true, length = 64)
    private String roleCode;

    /** 权限集（JSON） */
    @Column(name = "permissions", columnDefinition = "TEXT")
    private String permissions;

    /** 菜单权限（JSON） */
    @Column(name = "menu_permissions", columnDefinition = "TEXT")
    private String menuPermissions;

    /** 角色描述 */
    @Column(name = "description", length = 200)
    private String description;

    /** 状态：0-禁用 1-正常 */
    @Column(name = "status", nullable = false)
    private Short status = 1;
}

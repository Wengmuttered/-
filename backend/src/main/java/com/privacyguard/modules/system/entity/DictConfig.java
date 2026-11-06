package com.privacyguard.modules.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 基础字典配置实体
 * 存储系统中的分类、标签、状态等基础配置数据
 */
@Getter
@Setter
@Entity
@Table(name = "dict_config")
public class DictConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 字典类型 */
    @Column(name = "dict_type", nullable = false, length = 50)
    private String dictType;

    /** 字典键 */
    @Column(name = "dict_key", nullable = false, length = 100)
    private String dictKey;

    /** 字典值 */
    @Column(name = "dict_value", length = 500)
    private String dictValue;

    /** 显示标签 */
    @Column(name = "dict_label", length = 200)
    private String dictLabel;

    /** 排序 */
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    /** 状态：0-禁用 1-正常 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 备注 */
    @Column(name = "remark", length = 200)
    private String remark;

    /** 租户ID */
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId = "default";

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

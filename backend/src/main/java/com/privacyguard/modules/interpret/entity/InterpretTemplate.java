package com.privacyguard.modules.interpret.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 解读模板实体
 * 由后台管理员维护，用于隐私政策解读时的模板匹配
 */
@Getter
@Setter
@Entity
@Table(name = "interpret_template")
public class InterpretTemplate extends BaseEntity {

    /** 模板名称 */
    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    /** 模板编码（唯一） */
    @Column(name = "template_code", unique = true, length = 64)
    private String templateCode;

    /** 模板分类 */
    @Column(name = "category", length = 50)
    private String category;

    /** 模板正文 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 变量定义（JSON） */
    @Column(name = "variables", columnDefinition = "TEXT")
    private String variables;

    /** 适用场景 */
    @Column(name = "applicable_scene", length = 200)
    private String applicableScene;

    /** 状态：0-停用 1-启用 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 版本号 */
    @Column(name = "version")
    private Integer version = 1;
}

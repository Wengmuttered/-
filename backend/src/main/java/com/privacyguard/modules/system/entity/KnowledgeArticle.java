package com.privacyguard.modules.system.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 知识库内容实体
 * 后台维护的场景提醒知识，用于风险解释和建议输出
 */
@Getter
@Setter
@Entity
@Table(name = "knowledge_article")
public class KnowledgeArticle extends BaseEntity {

    /** 标题 */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /** 正文 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 场景标签（JSON数组） */
    @Column(name = "scene_tags", length = 500)
    private String sceneTags;

    /** 建议话术 */
    @Column(name = "suggestion_text", columnDefinition = "TEXT")
    private String suggestionText;

    /** 分类 */
    @Column(name = "category", length = 50)
    private String category;

    /** 状态：0-下线 1-上线 */
    @Column(name = "status", nullable = false)
    private Short status = 1;

    /** 命中次数 */
    @Column(name = "hit_count")
    private Integer hitCount = 0;
}

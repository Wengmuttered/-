package com.privacyguard.modules.system.repository;

import com.privacyguard.modules.system.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 知识库文章数据访问层
 */
@Repository
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
}

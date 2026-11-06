package com.privacyguard.modules.interpret.repository;

import com.privacyguard.modules.interpret.entity.InterpretTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 解读模板数据访问层
 */
@Repository
public interface InterpretTemplateRepository extends JpaRepository<InterpretTemplate, Long> {
}

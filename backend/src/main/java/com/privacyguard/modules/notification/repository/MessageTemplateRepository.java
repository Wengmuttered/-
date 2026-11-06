package com.privacyguard.modules.notification.repository;

import com.privacyguard.modules.notification.entity.MessageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 消息模板数据访问层
 */
@Repository
public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long> {
}

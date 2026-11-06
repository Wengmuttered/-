package com.privacyguard.modules.notification.repository;

import com.privacyguard.modules.notification.entity.MessageNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 消息通知数据访问层
 */
@Repository
public interface MessageNotificationRepository extends JpaRepository<MessageNotification, Long> {

    /** 按用户ID查询消息列表 */
    List<MessageNotification> findByUserIdOrderByCreatedAtDesc(Long userId);
}

package com.privacyguard.modules.notification.repository;

import com.privacyguard.modules.notification.entity.SystemAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 系统公告数据访问层
 */
@Repository
public interface SystemAnnouncementRepository extends JpaRepository<SystemAnnouncement, Long> {
}

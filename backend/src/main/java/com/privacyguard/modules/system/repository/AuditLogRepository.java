package com.privacyguard.modules.system.repository;

import com.privacyguard.modules.system.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 审计日志数据访问层
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /** 按时间倒序查询最近的日志 */
    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
}

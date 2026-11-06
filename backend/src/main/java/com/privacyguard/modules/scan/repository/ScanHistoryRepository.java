package com.privacyguard.modules.scan.repository;

import com.privacyguard.modules.scan.entity.ScanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 【扫描战前中心仓储管理连线】
 */
@Repository
public interface ScanHistoryRepository extends JpaRepository<ScanHistory, Long> {
    
    // 获取这位特工在数据库里的最近一次安全扫描报表数据
    Optional<ScanHistory> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 获取某个主人的所有探测清单
    List<ScanHistory> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}

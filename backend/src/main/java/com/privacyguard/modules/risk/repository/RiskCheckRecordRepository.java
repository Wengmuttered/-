package com.privacyguard.modules.risk.repository;

import com.privacyguard.modules.risk.entity.RiskCheckRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 体检记录数据访问层
 */
@Repository
public interface RiskCheckRecordRepository extends JpaRepository<RiskCheckRecord, Long> {

    /** 按用户ID查询体检历史，按创建时间倒序 */
    List<RiskCheckRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
}

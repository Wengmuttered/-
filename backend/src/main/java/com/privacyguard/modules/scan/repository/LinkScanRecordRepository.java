package com.privacyguard.modules.scan.repository;

import com.privacyguard.modules.scan.entity.LinkScanRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 链接/二维码扫描记录数据访问层
 */
@Repository
public interface LinkScanRecordRepository extends JpaRepository<LinkScanRecord, Long> {

    /** 按用户ID查询扫描记录 */
    List<LinkScanRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
}

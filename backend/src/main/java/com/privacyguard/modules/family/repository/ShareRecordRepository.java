package com.privacyguard.modules.family.repository;

import com.privacyguard.modules.family.entity.ShareRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 家庭共享记录数据访问层
 */
@Repository
public interface ShareRecordRepository extends JpaRepository<ShareRecord, Long> {

    /** 按共享人ID查询共享记录 */
    List<ShareRecord> findBySharerIdOrderByCreatedAtDesc(Long sharerId);

    /** 按接收人ID查询被共享的记录 */
    List<ShareRecord> findByTargetIdOrderByCreatedAtDesc(Long targetId);
}

package com.privacyguard.modules.system.repository;

import com.privacyguard.modules.system.entity.AsyncTaskRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 异步任务记录数据访问层
 */
@Repository
public interface AsyncTaskRecordRepository extends JpaRepository<AsyncTaskRecord, Long> {

    /** 按任务类型查询 */
    List<AsyncTaskRecord> findByTaskTypeOrderByCreatedAtDesc(String taskType);
}
